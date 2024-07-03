from aws_cdk import (
    Duration,
    RemovalPolicy,
    Stack,
    aws_ec2 as ec2,
    aws_ecr as ecr,
    aws_ecs as ecs,
    aws_elasticloadbalancingv2 as alb,
    aws_logs as logs,
    aws_rds as rds,
    aws_s3 as s3,
    aws_secretsmanager as secrets,
    aws_ses as ses,
    aws_sns as sns,
)
from constructs import Construct
from cdk_nag import NagSuppressions, NagPackSuppression
from cdk_monitoring_constructs import (
    AlarmFactoryDefaults,
    HighConnectionCountThreshold,
    MinUsageCountThreshold,
    MonitoringFacade,
    SnsAlarmActionStrategy,
    UnhealthyTaskCountThreshold,
    UsageThreshold,
)
from pepperize_cdk_ses_smtp_credentials import SesSmtpCredentials

import json

BASTION_SECURITY_GROUP_ID = "sg-072fa653d753959a1"

LISTEN_PORT = 3000
ALB_LISTENER_PORT = 443
ALB_LISTENER_SCHEMA = "https"

ECR_REPOSITORY_NAME = "universae360/api"

ENVVARS_OBJECT_KEY = "api/.env"

DB_NAME = "universae360"
DB_USERNAME = "universae360"

SES_IDENTITY_NAME = "universae.com"
SES_SMTP_HOST = "email-smtp.eu-west-3.amazonaws.com"

CLOUDFLARE_SECRET_HEADER = "X-Universae-CloudFlare-Auth"

class APIStack(Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        environment: str,
        app_url: str,
        alb_host: str,
        alb_priority: int = 100,
        image_tag: str = "latest",
        cpu: int = 256,
        memory: int = 512,
        min_tasks: int = 1,
        max_tasks: int = 1,
        spot_capacity_percent: int = 100,
        cron_enable: bool = False,
        cron_cpu: int = 256,
        cron_memory: int = 512,
        db_instance_type: str = "t4g.micro",
        db_engine_full_version: str = "16.3",
        db_max_allocated_storage: int = 100,
        db_enable_performance_insights: bool = False,
        db_multi_az: bool = False,
        db_preferred_maintenance_window: str = None,
        db_cloudwatch_logs_exports: list[str] = ["postgresql"],
        enable_monitoring: bool = False,
        sns_topic_arn: str = None,
        enable_cloudflare_auth_header: bool = False,
        **kwargs,
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        ###########
        # Lookups #
        ###########
        _desired_count = 0 if min_tasks == 0 and max_tasks == 0 else None

        self.vpc = ec2.Vpc.from_lookup(self, "VPC", is_default=False)

        self.alb = alb.ApplicationLoadBalancer.from_lookup(
            self,
            "LoadBalancer",
            load_balancer_tags={"environment": environment, "purpose": "public"},
        )

        self.alb_listener = alb.ApplicationListener.from_lookup(
            self,
            "Listener",
            load_balancer_arn=self.alb.load_balancer_arn,
            listener_port=ALB_LISTENER_PORT,
        )

        self.ecs_cluster = ecs.Cluster.from_cluster_attributes(
            self, "ECSCluster", cluster_name=environment, vpc=self.vpc
        )

        self.ses_identity = ses.EmailIdentity.from_email_identity_name(
            self, "SesEmailIdentity", email_identity_name=SES_IDENTITY_NAME
        )

        self.envvars_bucket = s3.Bucket.from_bucket_name(
            self,
            "EnvVarsBucket",
            bucket_name=f"envvars-{environment}-{self.region}-{self.account}",
        )

        bastion_security_group = ec2.SecurityGroup.from_security_group_id(
            self,
            "BastionSecurityGroup",
            security_group_id=BASTION_SECURITY_GROUP_ID,
        )

        #######
        # RDS #
        #######

        db_engine = rds.DatabaseInstanceEngine.postgres(
            version=rds.PostgresEngineVersion.of(
                postgres_full_version=db_engine_full_version,
                postgres_major_version=".".join(
                    db_engine_full_version.split(".", 1)[:-1]
                ),
            )
        )

        self.db_parameter_group = rds.ParameterGroup(
            self,
            "DatabaseParameterGroup",
            engine=db_engine,
            parameters={"rds.force_ssl": "0"},
        )

        self.secret_db = secrets.Secret(
            self,
            "DatabaseSecret",
            secret_name=f"{Stack.of(self).stack_name}-database",
            generate_secret_string=secrets.SecretStringGenerator(
                secret_string_template=json.dumps({"username": DB_USERNAME}),
                generate_string_key="password",
                exclude_characters=" !@#$%^&*}{[]()'\"/\/",
                password_length=32,
            ),
        )

        self.database_instance = rds.DatabaseInstance(
            self,
            "Database",
            database_name=DB_NAME,
            credentials=rds.Credentials.from_secret(self.secret_db),
            engine=db_engine,
            instance_type=ec2.InstanceType(db_instance_type),
            multi_az=db_multi_az,
            vpc=self.vpc,
            vpc_subnets=ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS
            ),
            publicly_accessible=False,
            storage_encrypted=True,
            storage_type=rds.StorageType.GP3,
            allocated_storage=db_max_allocated_storage,
            allow_major_version_upgrade=True,
            auto_minor_version_upgrade=False,
            parameter_group=self.db_parameter_group,
            preferred_maintenance_window=db_preferred_maintenance_window,
            backup_retention=Duration.days(15),
            copy_tags_to_snapshot=True,
            enable_performance_insights=db_enable_performance_insights,
            cloudwatch_logs_exports=db_cloudwatch_logs_exports,
            cloudwatch_logs_retention=logs.RetentionDays.ONE_MONTH,
            deletion_protection=True,
            removal_policy=RemovalPolicy.SNAPSHOT,
            ca_certificate=rds.CaCertificate.RDS_CA_RDS2048_G1,
        )

        self.database_instance.connections.allow_default_port_from(
            bastion_security_group, "Bastion access to RDS"
        )

        ######
        # S3 #
        ######
        self.media_bucket = s3.Bucket(
            self,
            "MediaBucket",
            bucket_name=f"media-api-{environment}-{self.region}-{self.account}",
            access_control=s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
            # block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            encryption=s3.BucketEncryption.S3_MANAGED,
            enforce_ssl=True,
            versioned=True,
            lifecycle_rules=[
                s3.LifecycleRule(
                    enabled=True,
                    noncurrent_version_expiration=Duration.days(30),
                    noncurrent_versions_to_retain=3,
                )
            ],
            auto_delete_objects=True,
            removal_policy=RemovalPolicy.DESTROY,
        )

        ########
        # SMTP #
        ########
        self.secret_smtp = secrets.Secret(
            self,
            "SecretSMTP",
            secret_name=f"{Stack.of(self).stack_name}-smtp",
        )
        self.smtp_credentiales = SesSmtpCredentials(
            self,
            "SesSmtpCredentials",
            secret=self.secret_smtp,
            user_name=f"{Stack.of(self).stack_name}-smtp",
        )

        ###########################
        # Environment and Secrets #
        ###########################
        self.secret_jwt = secrets.Secret(
            self,
            "SecretJWT",
            secret_name=f"{Stack.of(self).stack_name}-jwt",
            generate_secret_string=secrets.SecretStringGenerator(
                password_length=128,
                exclude_punctuation=True,
                exclude_uppercase=True,
            ),
        )

        self.secret_cloudflare = secrets.Secret(
            self,
            "SecretCloudflare",
            secret_name=f"{Stack.of(self).stack_name}-cloudflare",
            generate_secret_string=secrets.SecretStringGenerator(
                password_length=128,
                exclude_punctuation=True,
            ),
        )

        ecs_secrets = {
            "JWT_SECRET": ecs.Secret.from_secrets_manager(self.secret_jwt),
            "DATABASE_USER": ecs.Secret.from_secrets_manager(
                self.secret_db, "username"
            ),
            "DATABASE_PASSWORD": ecs.Secret.from_secrets_manager(
                self.secret_db, "password"
            ),
            "SMTP_USERNAME": ecs.Secret.from_secrets_manager(
                self.secret_smtp, "username"
            ),
            "SMTP_PASSWORD": ecs.Secret.from_secrets_manager(
                self.secret_smtp, "password"
            ),
        }
        ecs_environment = {
            "APP_URL": app_url,
            "DATABASE_HOST": self.database_instance.db_instance_endpoint_address,
            "DATABASE_NAME": DB_NAME,
            "DATABASE_PORT": self.database_instance.db_instance_endpoint_port,
            "AWS_BUCKET_NAME": self.media_bucket.bucket_name,
            "NO_COLOR": "1",
            "SMTP_HOST": SES_SMTP_HOST,
            "SMTP_PORT": "587",
        }

        ########
        # Logs #
        ########
        self.api_log_group = logs.LogGroup(
            self,
            "APILogGroup",
            log_group_name=f"/aws/ecs/{Stack.of(self).stack_name.replace('-', '/')}/api",
            removal_policy=RemovalPolicy.DESTROY,
            retention=logs.RetentionDays.ONE_MONTH,
        )
        self.cron_log_group = logs.LogGroup(
            self,
            "CronLogGroup",
            log_group_name=f"/aws/ecs/{Stack.of(self).stack_name.replace('-', '/')}/cron",
            removal_policy=RemovalPolicy.DESTROY,
            retention=logs.RetentionDays.ONE_MONTH,
        )

        #######
        # ECS #
        #######
        self.api_task_definition = ecs.FargateTaskDefinition(
            self,
            "APITaskDefinition",
            family="api",
            cpu=cpu,
            memory_limit_mib=memory,
        )
        self.cron_task_definition = ecs.FargateTaskDefinition(
            self,
            "CronTaskDefinition",
            family="api",
            cpu=cron_cpu,
            memory_limit_mib=cron_memory,
        )

        self.ecr_repository = ecr.Repository.from_repository_name(
            self, "ECRRepo", repository_name=ECR_REPOSITORY_NAME
        )

        self.api_image = ecs.ContainerImage.from_ecr_repository(
            repository=self.ecr_repository, tag=f"{image_tag}-api"
        )
        self.cron_image = ecs.ContainerImage.from_ecr_repository(
            repository=self.ecr_repository, tag=f"{image_tag}-cron"
        )

        self.api_task_definition.add_container(
            "APIContainer",
            container_name="api",
            image=self.api_image,
            environment=ecs_environment,
            environment_files=[
                ecs.EnvironmentFile.from_bucket(
                    bucket=self.envvars_bucket, key=ENVVARS_OBJECT_KEY
                )
            ],
            secrets=ecs_secrets,
            essential=True,
            port_mappings=[
                ecs.PortMapping(
                    host_port=LISTEN_PORT,
                    container_port=LISTEN_PORT,
                    protocol=ecs.Protocol.TCP,
                )
            ],
            logging=ecs.AwsLogDriver(
                stream_prefix="fargate", log_group=self.api_log_group
            ),
        )

        self.cron_task_definition.add_container(
            "CronContainer",
            container_name="cron",
            image=self.cron_image,
            environment=ecs_environment,
            environment_files=[
                ecs.EnvironmentFile.from_bucket(
                    bucket=self.envvars_bucket, key=ENVVARS_OBJECT_KEY
                )
            ],
            secrets=ecs_secrets,
            essential=True,
            logging=ecs.AwsLogDriver(
                stream_prefix="fargate", log_group=self.cron_log_group
            ),
        )

        self.api_service = ecs.FargateService(
            self,
            "APIService",
            task_definition=self.api_task_definition,
            cluster=self.ecs_cluster,
            desired_count=_desired_count,
            min_healthy_percent=100,
            max_healthy_percent=200,
            health_check_grace_period=Duration.seconds(60),
            assign_public_ip=False,
            vpc_subnets=ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS
            ),
            platform_version=ecs.FargatePlatformVersion.LATEST,
            circuit_breaker=ecs.DeploymentCircuitBreaker(rollback=True),
            capacity_provider_strategies=[
                ecs.CapacityProviderStrategy(
                    capacity_provider="FARGATE", weight=100 - spot_capacity_percent
                ),
                ecs.CapacityProviderStrategy(
                    capacity_provider="FARGATE_SPOT", weight=spot_capacity_percent
                ),
            ],
            enable_execute_command=True,
        )

        self.cron_service = ecs.FargateService(
            self,
            "CronService",
            task_definition=self.cron_task_definition,
            cluster=self.ecs_cluster,
            desired_count=1 if cron_enable else 0,
            assign_public_ip=False,
            vpc_subnets=ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS
            ),
            platform_version=ecs.FargatePlatformVersion.LATEST,
            circuit_breaker=ecs.DeploymentCircuitBreaker(rollback=True),
            capacity_provider_strategies=[
                ecs.CapacityProviderStrategy(
                    capacity_provider="FARGATE", weight=100 - spot_capacity_percent
                ),
                ecs.CapacityProviderStrategy(
                    capacity_provider="FARGATE_SPOT", weight=spot_capacity_percent
                ),
            ],
            enable_execute_command=True,
        )

        self.envvars_bucket.grant_read(
            identity=self.api_task_definition.execution_role,
            objects_key_pattern=ENVVARS_OBJECT_KEY,
        )
        self.envvars_bucket.grant_read(
            identity=self.cron_task_definition.execution_role,
            objects_key_pattern=ENVVARS_OBJECT_KEY,
        )

        self.database_instance.connections.allow_default_port_from(
            self.api_service.connections, "Allow API to access RDS"
        )
        self.database_instance.connections.allow_default_port_from(
            self.cron_service.connections, "Allow Cron to access RDS"
        )

        self.media_bucket.grant_read_write(self.api_task_definition.task_role)
        self.media_bucket.grant_read_write(self.cron_task_definition.task_role)
        self.media_bucket.grant_put_acl(self.api_task_definition.task_role)
        self.media_bucket.grant_put_acl(self.cron_task_definition.task_role)

        ##################
        # Load Balancing #
        ##################
        self.target_group = alb.ApplicationTargetGroup(
            self,
            "TargetGroup",
            port=LISTEN_PORT,
            protocol=alb.ApplicationProtocol.HTTP,
            deregistration_delay=Duration.seconds(60),
            health_check=alb.HealthCheck(
                enabled=True,
                path="/health",
                healthy_http_codes="200",
                healthy_threshold_count=4,
                unhealthy_threshold_count=2,
                interval=Duration.seconds(15),
                timeout=Duration.seconds(5),
            ),
            vpc=self.vpc,
            target_type=alb.TargetType.IP,
        )

        target_group_conditions = [
            alb.ListenerCondition.host_headers(values=[alb_host])
        ]

        if enable_cloudflare_auth_header:
            target_group_conditions.append(
                alb.ListenerCondition.http_header(
                    name=CLOUDFLARE_SECRET_HEADER,
                    values=[self.secret_cloudflare.secret_value.to_string()],
                ),
            )

        self.alb_listener.add_target_groups(
            Stack.of(self).stack_name,
            target_groups=[self.target_group],
            conditions=target_group_conditions,
            priority=alb_priority,
        )

        self.api_service.attach_to_application_target_group(self.target_group)

        ###############
        # Autoscaling #
        ###############
        self.scalable_task_count = self.api_service.auto_scale_task_count(
            min_capacity=min_tasks, max_capacity=max_tasks
        )
        self.scalable_task_count.scale_on_cpu_utilization(
            "CPUScaling", target_utilization_percent=60
        )

        ##############
        # Monitoring #
        ##############
        if sns_topic_arn:
            _sns_topic = sns.Topic.from_topic_arn(self, "SNSTopic", sns_topic_arn)

            action_strategy_default = SnsAlarmActionStrategy(
                on_alarm_topic=_sns_topic,
                on_ok_topic=_sns_topic,
                on_insufficient_data_topic=_sns_topic,
            )

            alarm_factory_defaults = (
                AlarmFactoryDefaults(
                    actions_enabled=True,
                    alarm_name_prefix=self.stack_name,
                    action=action_strategy_default,
                ),
            )
        else:
            alarm_factory_defaults = None

        if enable_monitoring:
            self.monitoring = MonitoringFacade(
                self, self.stack_name, alarm_factory_defaults=alarm_factory_defaults
            )

            self.monitoring.monitor_fargate_application_load_balancer(
                fargate_service=self.api_service,
                min_auto_scaling_task_count=min_tasks,
                max_auto_scaling_task_count=max_tasks,
                application_load_balancer=self.alb,
                application_target_group=self.target_group,
                add_cpu_usage_alarm={"85": UsageThreshold(max_usage_percent=85)},
                add_memory_usage_alarm={"85": UsageThreshold(max_usage_percent=85)},
                add_unhealthy_task_count_alarm={
                    "0": UnhealthyTaskCountThreshold(max_unhealthy_tasks=0),
                },
            )
            self.monitoring.monitor_simple_fargate_service(
                fargate_service=self.cron_service,
                add_cpu_usage_alarm={"85": UsageThreshold(max_usage_percent=85)},
                add_memory_usage_alarm={"85": UsageThreshold(max_usage_percent=85)},
            )
            self.monitoring.monitor_rds_instance(
                instance=self.database_instance,
                add_cpu_usage_alarm={"75": UsageThreshold(max_usage_percent=75)},
                add_free_storage_space_alarm={
                    "5G": MinUsageCountThreshold(min_count=5 * 1000 * 1000 * 1000)
                },
                add_max_connection_count_alarm={
                    "100": HighConnectionCountThreshold(max_connection_count=100)
                },
            )
            self.monitoring.monitor_s3_bucket(bucket=self.media_bucket)

        #######################
        # CDK NAG Supressions #
        #######################
        NagSuppressions.add_stack_suppressions(
            self,
            suppressions=[
                NagPackSuppression(
                    id="AwsSolutions-IAM4",
                    reason="CDK managed policies",
                ),
                NagPackSuppression(
                    id="AwsSolutions-IAM5",
                    reason="CDK managed roles",
                ),
                NagPackSuppression(
                    id="AwsSolutions-RDS11",
                    reason="Not aligned with security posture",
                ),
                NagPackSuppression(
                    id="AwsSolutions-L1",
                    reason="Runtime managed at the module level",
                ),
            ],
        )
        NagSuppressions.add_resource_suppressions(
            construct=self.api_task_definition,
            suppressions=[
                NagPackSuppression(
                    id="AwsSolutions-ECS2",
                    reason="Injected environment variables are calculated and non sensitive",
                ),
            ],
        )
        NagSuppressions.add_resource_suppressions(
            construct=self.cron_task_definition,
            suppressions=[
                NagPackSuppression(
                    id="AwsSolutions-ECS2",
                    reason="Injected environment variables are calculated and non sensitive",
                ),
            ],
        )
        NagSuppressions.add_resource_suppressions(
            construct=self.media_bucket,
            suppressions=[
                NagPackSuppression(
                    id="AwsSolutions-S1",
                    reason="Not yet implemented",
                ),
            ],
        )
        NagSuppressions.add_resource_suppressions(
            construct=self.secret_jwt,
            suppressions=[
                NagPackSuppression(
                    id="AwsSolutions-SMG4",
                    reason="Next Auth secret does not need rotation",
                ),
            ],
        )
        NagSuppressions.add_resource_suppressions(
            construct=self.secret_db,
            suppressions=[
                NagPackSuppression(
                    id="AwsSolutions-SMG4",
                    reason="RDS master secret does not need rotation (for now)",
                ),
            ],
        )
        NagSuppressions.add_resource_suppressions(
            construct=self.secret_smtp,
            suppressions=[
                NagPackSuppression(
                    id="AwsSolutions-SMG4",
                    reason="SMTP secret does not need rotation (for now)",
                ),
            ],
        )
        NagSuppressions.add_resource_suppressions(
            construct=self.secret_cloudflare,
            suppressions=[
                NagPackSuppression(
                    id="AwsSolutions-SMG4",
                    reason="Cloudflare secret does not need rotation",
                ),
            ],
        )
        NagSuppressions.add_resource_suppressions(
            construct=self.database_instance,
            suppressions=[
                NagPackSuppression(
                    id="AwsSolutions-RDS3",
                    reason="Not aligned with security posture",
                ),
            ],
        )
