from aws_cdk import (
    CfnOutput,
    Duration,
    RemovalPolicy,
    Stack,
    Tags,
    aws_backup as backup,
    aws_cloudwatch as cloudwatch,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as cloudfront_origins,
    aws_ec2 as ec2,
    aws_ecr as ecr,
    aws_ecs as ecs,
    aws_efs as efs,
    aws_elasticloadbalancingv2 as elbv2,
    aws_events as events,
    aws_logs as logs,
    aws_rds as rds,
    aws_s3 as s3,
    aws_secretsmanager as secrets,
    aws_ses as ses,
    aws_certificatemanager as acm,
    aws_sns as sns,
)
from constructs import Construct
from cdk_nag import NagSuppressions, NagPackSuppression
from cdk_monitoring_constructs import (
    AlarmFactoryDefaults,
    CustomMetricGroup,
    GraphWidgetType,
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
VPN_CIDRS = ["10.90.0.0/21"]  # Users

API_LISTEN_PORT = 3000

SFTP_ADMIN_LISTEN_PORT = 8080
SFTP_LISTEN_PORT = 2022
SFTP_SHUTDOWN_GRACE_TIME = 60

ALB_LISTENER_PORT = 443
ALB_LISTENER_SCHEMA = "https"

ECR_REPOSITORY_NAME = "universae360/api"

ENVVARS_OBJECT_KEY = "api/.env"

DB_NAME = "universae360"
DB_USERNAME = "universae360"

POSIX_USER = "1000"
POSIX_GROUP = "1000"

SES_IDENTITY_NAME = "universae.com"
SES_SMTP_HOST = "email-smtp.eu-west-3.amazonaws.com"

CLOUDFLARE_SECRET_HEADER = "X-Universae-CloudFlare-Auth"

CRM_IMPORTS_PATH_MOUNTDIR = "/var/lib/sftp"

HEALTHCHECK_GRACE_PERIOD = Duration.seconds(60)
HEALTHCHECK_HEALTHY_THR = 4
HEALTHCHECK_INTERVAL = Duration.seconds(15)
HEALTHCHECK_PATH_API = "/health"
HEALTHCHECK_PATH_SFTP = "/web/admin/login"
HEALTHCHECK_TIMEOUT = Duration.seconds(5)
HEALTHCHECK_UNHEALTHY_THR = 2


class APIStack(Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        environment: str,
        app_url: str,
        api_alb_host: str,
        sftp_alb_host: str,
        media_domain_name: str,
        media_certificate_arn: str,
        image_tag: str = "latest",
        api_alb_priority: int = 100,
        api_cpu: int = 256,
        api_memory: int = 512,
        api_min_tasks: int = 1,
        api_max_tasks: int = 1,
        spot_capacity_percent: int = 100,
        cron_enable: bool = False,
        cron_cpu: int = 256,
        cron_memory: int = 512,
        sftp_alb_priority: int = 101,
        sftp_cpu: int = 256,
        sftp_memory: int = 512,
        sftp_min_tasks: int = 1,
        sftp_max_tasks: int = 1,
        sftp_allowed_cidrs: list[str] = ["0.0.0.0/0"],
        db_instance_type: str = "t4g.micro",
        db_engine_full_version: str = "16.3",
        db_allocated_storage: int = 100,
        db_enable_performance_insights: bool = False,
        db_multi_az: bool = False,
        db_preferred_maintenance_window: str = None,
        db_preferred_backup_window: str = None,
        db_cloudwatch_logs_exports: list[str] = ["postgresql"],
        db_read_replicas: int = 0,
        db_read_replicas_instance_type: str = None,
        enable_monitoring: bool = False,
        sns_topic_arn: str = None,
        enable_cloudflare_auth_header: bool = False,
        aws_backup_enable: bool = False,
        aws_backup_use_default_plan: bool = True,
        aws_backup_retention_days: int = 15,
        aws_backup_schedule: str = "cron(30 2 * * ? *)",
        **kwargs,
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        ###########
        # Lookups #
        ###########
        _api_desired_count = 0 if api_min_tasks == 0 and api_max_tasks == 0 else None
        _sftp_desired_count = 0 if sftp_min_tasks == 0 and sftp_max_tasks == 0 else None

        self.vpc = ec2.Vpc.from_lookup(self, "VPC", is_default=False)

        self.alb = elbv2.ApplicationLoadBalancer.from_lookup(
            self,
            "LoadBalancer",
            load_balancer_tags={"environment": environment, "purpose": "public"},
        )

        self.alb_listener = elbv2.ApplicationListener.from_lookup(
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

        media_certificate = acm.Certificate.from_certificate_arn(
            self, "MediaCertificate", certificate_arn=media_certificate_arn
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
            allocated_storage=db_allocated_storage,
            allow_major_version_upgrade=True,
            auto_minor_version_upgrade=False,
            parameter_group=self.db_parameter_group,
            preferred_maintenance_window=db_preferred_maintenance_window,
            backup_retention=(
                Duration.days(0)
                if aws_backup_enable
                else Duration.days(min(35, aws_backup_retention_days))
            ),
            preferred_backup_window=db_preferred_backup_window,
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
        for cidr in VPN_CIDRS:
            self.database_instance.connections.allow_default_port_from(
                ec2.Peer.ipv4(cidr), "VPN access to RDS"
            )

        CfnOutput(self, "DatabaseSecretName", value=self.secret_db.secret_name)

        for i in range(db_read_replicas):
            db_read_replica = rds.DatabaseInstanceReadReplica(
                self,
                f"ReadReplica{i}",
                source_database_instance=self.database_instance,
                instance_type=ec2.InstanceType(db_read_replicas_instance_type),
                vpc=self.vpc,
                vpc_subnets=ec2.SubnetSelection(
                    subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS
                ),
                publicly_accessible=False,
                storage_encrypted=True,
                storage_type=rds.StorageType.GP3,
                auto_minor_version_upgrade=True,
                parameter_group=self.db_parameter_group,
                preferred_maintenance_window=db_preferred_maintenance_window,
                preferred_backup_window=db_preferred_backup_window,
                cloudwatch_logs_exports=db_cloudwatch_logs_exports,
                cloudwatch_logs_retention=logs.RetentionDays.ONE_MONTH,
                deletion_protection=False,
                removal_policy=RemovalPolicy.DESTROY,
                ca_certificate=rds.CaCertificate.RDS_CA_RDS2048_G1,
            )

            db_read_replica.connections.allow_default_port_from(
                bastion_security_group, "Bastion access to RDS"
            )
            for cidr in VPN_CIDRS:
                db_read_replica.connections.allow_default_port_from(
                    ec2.Peer.ipv4(cidr), "VPN access to RDS"
                )

            NagSuppressions.add_resource_suppressions(
                construct=db_read_replica,
                suppressions=[
                    NagPackSuppression(
                        id="AwsSolutions-RDS3",
                        reason="Not necessary for read replicas",
                    ),
                    NagPackSuppression(
                        id="AwsSolutions-RDS10",
                        reason="Not necessary for read replicas",
                    ),
                ],
            )

        #########
        # Media #
        #########
        self.media_bucket = s3.Bucket(
            self,
            "MediaBucket",
            bucket_name=f"media-api-{environment}-{self.region}-{self.account}",
            access_control=s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            encryption=s3.BucketEncryption.S3_MANAGED,
            enforce_ssl=True,
            versioned=True,
            lifecycle_rules=[
                s3.LifecycleRule(
                    enabled=True,
                    noncurrent_version_expiration=Duration.days(
                        aws_backup_retention_days
                    ),
                    noncurrent_versions_to_retain=3,
                )
            ],
            auto_delete_objects=True,
            removal_policy=RemovalPolicy.DESTROY,
        )

        self.media_cloudfront_distribution = cloudfront.Distribution(
            self,
            "MediaCloudfrontDistribution",
            default_behavior=cloudfront.BehaviorOptions(
                origin=cloudfront_origins.S3BucketOrigin.with_origin_access_control(
                    self.media_bucket
                ),
                viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                response_headers_policy=cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT,
            ),
            domain_names=[media_domain_name],
            certificate=media_certificate,
            minimum_protocol_version=cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
            publish_additional_metrics=enable_monitoring,
        )

        CfnOutput(self, "MediaBucketName", value=self.secret_db.secret_name)

        #######
        # EFS #
        #######
        self.efs_filesystem = efs.FileSystem(
            self,
            "FileSystem",
            vpc=self.vpc,
            vpc_subnets=ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS
            ),
            encrypted=True,
            performance_mode=efs.PerformanceMode.GENERAL_PURPOSE,
            throughput_mode=efs.ThroughputMode.BURSTING,
            enable_automatic_backups=False if aws_backup_enable else True,
            removal_policy=RemovalPolicy.DESTROY,
        )

        self.efs_sftp_config = efs.AccessPoint(
            self,
            "SFTPConfigAccessPoint",
            file_system=self.efs_filesystem,
            path="/sftp-config",
            posix_user=efs.PosixUser(uid=POSIX_USER, gid=POSIX_GROUP),
            create_acl=efs.Acl(
                owner_uid=POSIX_USER, owner_gid=POSIX_GROUP, permissions="750"
            ),
        )
        self.efs_sftp_data = efs.AccessPoint(
            self,
            "SFTPDataAccessPoint",
            file_system=self.efs_filesystem,
            path="/sftp-data",
            posix_user=efs.PosixUser(uid=POSIX_USER, gid=POSIX_GROUP),
            create_acl=efs.Acl(
                owner_uid=POSIX_USER, owner_gid=POSIX_GROUP, permissions="750"
            ),
        )

        self.efs_filesystem.connections.allow_default_port_from(
            bastion_security_group, "Bastion access to EFS"
        )

        CfnOutput(self, "FileSystemID", value=self.efs_filesystem.file_system_id)
        CfnOutput(
            self,
            "SFTPConfigEFSAccessPointID",
            value=self.efs_sftp_config.access_point_id,
        )
        CfnOutput(
            self, "SFTPDataEFSAccessPointID", value=self.efs_sftp_data.access_point_id
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

        api_ecs_secrets = {
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
        api_ecs_environment = {
            "APP_URL": app_url,
            "DATABASE_HOST": self.database_instance.db_instance_endpoint_address,
            "DATABASE_NAME": DB_NAME,
            "DATABASE_PORT": self.database_instance.db_instance_endpoint_port,
            "AWS_BUCKET_NAME": self.media_bucket.bucket_name,
            "NO_COLOR": "1",
            "SMTP_HOST": SES_SMTP_HOST,
            "SMTP_PORT": "587",
            "MEDIA_DOMAIN_NAME": media_domain_name,
            "CRM_IMPORTS_PATH": f"{CRM_IMPORTS_PATH_MOUNTDIR}/data/crm",
        }

        sftp_ecs_secrets = {
            "SFTPGO_HTTPD__SIGNING_PASSPHRASE": ecs.Secret.from_secrets_manager(
                self.secret_jwt
            ),
            "SFTPGO_SMTP__USER": ecs.Secret.from_secrets_manager(
                self.secret_smtp, "username"
            ),
            "SFTPGO_SMTP__PASSWORD": ecs.Secret.from_secrets_manager(
                self.secret_smtp, "password"
            ),
        }
        sftp_ecs_environment = {
            "SFTPGO_HTTPD__ENABLE_WEB_ADMIN": "true",
            "SFTPGO_HTTPD__ENABLE_WEB_CLIENT": "false",
            "SFTPGO_HTTPD__ENABLE_REST_API": "false",
            "SFTPGO_HTTPD__BINDINGS__0__ENABLE_HTTPS": "false",
            "SFTPGO_SMTP__HOST": SES_SMTP_HOST,
            "SFTPGO_SMTP__PORT": "587",
            "SFTPGO_SMTP__AUTH_TYPE": "1",  # Login
            "SFTPGO_SMTP__ENCRYPTION": "2",  # STARTTLS
            "SFTPGO_SMTP__FROM": f"SFTP Universae360 ({environment}) <{environment}-sftp360@{SES_IDENTITY_NAME}>",
            "SFTPGO_GRACE_TIME": str(SFTP_SHUTDOWN_GRACE_TIME),
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
        self.sftp_log_group = logs.LogGroup(
            self,
            "SFTPLogGroup",
            log_group_name=f"/aws/ecs/{Stack.of(self).stack_name.replace('-', '/')}/sftp",
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
            cpu=api_cpu,
            memory_limit_mib=api_memory,
        )
        self.cron_task_definition = ecs.FargateTaskDefinition(
            self,
            "CronTaskDefinition",
            family="api",
            cpu=cron_cpu,
            memory_limit_mib=cron_memory,
            volumes=[
                ecs.Volume(
                    name="sftp-data",
                    efs_volume_configuration=ecs.EfsVolumeConfiguration(
                        file_system_id=self.efs_filesystem.file_system_id,
                        transit_encryption="ENABLED",
                        authorization_config=ecs.AuthorizationConfig(
                            access_point_id=self.efs_sftp_data.access_point_id,
                            iam="ENABLED",
                        ),
                    ),
                ),
            ],
        )
        self.sftp_task_definition = ecs.FargateTaskDefinition(
            self,
            "SFTPTaskDefinition",
            family="sftp",
            cpu=sftp_cpu,
            memory_limit_mib=sftp_memory,
            volumes=[
                ecs.Volume(
                    name="sftp-config",
                    efs_volume_configuration=ecs.EfsVolumeConfiguration(
                        file_system_id=self.efs_filesystem.file_system_id,
                        transit_encryption="ENABLED",
                        authorization_config=ecs.AuthorizationConfig(
                            access_point_id=self.efs_sftp_config.access_point_id,
                            iam="ENABLED",
                        ),
                    ),
                ),
                ecs.Volume(
                    name="sftp-data",
                    efs_volume_configuration=ecs.EfsVolumeConfiguration(
                        file_system_id=self.efs_filesystem.file_system_id,
                        transit_encryption="ENABLED",
                        authorization_config=ecs.AuthorizationConfig(
                            access_point_id=self.efs_sftp_data.access_point_id,
                            iam="ENABLED",
                        ),
                    ),
                ),
            ],
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
        self.sftp_image = ecs.ContainerImage.from_registry(
            name="drakkan/sftpgo:v2.6.2-alpine"
        )

        self.api_container = self.api_task_definition.add_container(
            "APIContainer",
            container_name="api",
            image=self.api_image,
            environment=api_ecs_environment,
            environment_files=[
                ecs.EnvironmentFile.from_bucket(
                    bucket=self.envvars_bucket, key=ENVVARS_OBJECT_KEY
                )
            ],
            secrets=api_ecs_secrets,
            essential=True,
            port_mappings=[
                ecs.PortMapping(
                    host_port=API_LISTEN_PORT,
                    container_port=API_LISTEN_PORT,
                    protocol=ecs.Protocol.TCP,
                )
            ],
            health_check=ecs.HealthCheck(
                command=[
                    "CMD-SHELL",
                    f"wget --no-verbose --tries=1 --spider http://localhost:{API_LISTEN_PORT}{HEALTHCHECK_PATH_API} || exit 1",
                ],
                interval=HEALTHCHECK_INTERVAL,
                retries=HEALTHCHECK_UNHEALTHY_THR,
                start_period=HEALTHCHECK_GRACE_PERIOD,
                timeout=HEALTHCHECK_TIMEOUT,
            ),
            logging=ecs.AwsLogDriver(
                stream_prefix="fargate", log_group=self.api_log_group
            ),
        )
        self.cron_container = self.cron_task_definition.add_container(
            "CronContainer",
            container_name="cron",
            image=self.cron_image,
            environment=api_ecs_environment,
            environment_files=[
                ecs.EnvironmentFile.from_bucket(
                    bucket=self.envvars_bucket, key=ENVVARS_OBJECT_KEY
                )
            ],
            secrets=api_ecs_secrets,
            essential=True,
            health_check=ecs.HealthCheck(
                command=[
                    "CMD",
                    "pgrep",
                    "cron",
                ],
                interval=HEALTHCHECK_INTERVAL,
                retries=HEALTHCHECK_UNHEALTHY_THR,
                start_period=HEALTHCHECK_GRACE_PERIOD,
                timeout=HEALTHCHECK_TIMEOUT,
            ),
            logging=ecs.AwsLogDriver(
                stream_prefix="fargate", log_group=self.cron_log_group
            ),
        )
        self.sftp_container = self.sftp_task_definition.add_container(
            "SFTPContainer",
            container_name="sftpgo",
            image=self.sftp_image,
            environment=sftp_ecs_environment,
            secrets=sftp_ecs_secrets,
            essential=True,
            port_mappings=[
                ecs.PortMapping(
                    host_port=SFTP_ADMIN_LISTEN_PORT,
                    container_port=SFTP_ADMIN_LISTEN_PORT,
                    protocol=ecs.Protocol.TCP,
                ),
                ecs.PortMapping(
                    host_port=SFTP_LISTEN_PORT,
                    container_port=SFTP_LISTEN_PORT,
                    protocol=ecs.Protocol.TCP,
                ),
            ],
            health_check=ecs.HealthCheck(
                command=[
                    "CMD-SHELL",
                    f"wget --no-verbose --tries=1 --spider http://localhost:{SFTP_ADMIN_LISTEN_PORT}{HEALTHCHECK_PATH_SFTP} || exit 1",
                ],
                interval=HEALTHCHECK_INTERVAL,
                retries=HEALTHCHECK_UNHEALTHY_THR,
                start_period=HEALTHCHECK_GRACE_PERIOD,
                timeout=HEALTHCHECK_TIMEOUT,
            ),
            logging=ecs.AwsLogDriver(
                stream_prefix="fargate", log_group=self.sftp_log_group
            ),
        )

        self.cron_container.add_mount_points(
            ecs.MountPoint(
                container_path=CRM_IMPORTS_PATH_MOUNTDIR,
                source_volume="sftp-data",
                read_only=False,
            ),
        )
        self.sftp_container.add_mount_points(
            ecs.MountPoint(
                container_path="/var/lib/sftpgo",
                source_volume="sftp-config",
                read_only=False,
            ),
        )
        self.sftp_container.add_mount_points(
            ecs.MountPoint(
                container_path="/srv/sftpgo",
                source_volume="sftp-data",
                read_only=False,
            ),
        )

        self.api_service = ecs.FargateService(
            self,
            "APIService",
            task_definition=self.api_task_definition,
            cluster=self.ecs_cluster,
            desired_count=_api_desired_count,
            min_healthy_percent=100,
            max_healthy_percent=200,
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
            enable_ecs_managed_tags=True,
            propagate_tags=ecs.PropagatedTagSource.SERVICE,
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
            enable_ecs_managed_tags=True,
            propagate_tags=ecs.PropagatedTagSource.SERVICE,
        )
        self.sftp_service = ecs.FargateService(
            self,
            "SFTPService",
            task_definition=self.sftp_task_definition,
            cluster=self.ecs_cluster,
            desired_count=_sftp_desired_count,
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
            enable_ecs_managed_tags=True,
            propagate_tags=ecs.PropagatedTagSource.SERVICE,
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

        self.efs_filesystem.grant_read_write(self.cron_task_definition.task_role)
        self.efs_filesystem.grant_read_write(self.sftp_task_definition.task_role)

        self.efs_filesystem.connections.allow_default_port_from(
            self.cron_service.connections, "Allow Cron to access EFS"
        )
        self.efs_filesystem.connections.allow_default_port_from(
            self.sftp_service.connections, "Allow SFTP to access EFS"
        )

        CfnOutput(self, "APIECSServiceARN", value=self.api_service.service_arn)
        CfnOutput(self, "CronECSServiceARN", value=self.cron_service.service_arn)
        CfnOutput(self, "SFTPECSServiceARN", value=self.sftp_service.service_arn)

        ##################
        # Load Balancing #
        ##################
        self.sftpd_nlb_sg = ec2.SecurityGroup(
            self, "SFTPDLoadBalancerSecurityGroup", vpc=self.vpc
        )

        for cidr in sftp_allowed_cidrs:
            self.sftpd_nlb_sg.add_ingress_rule(
                peer=ec2.Peer.ipv4(cidr_ip=cidr),
                connection=ec2.Port.tcp(SFTP_LISTEN_PORT),
            )

        self.sftp_service.connections.allow_from(
            other=self.sftpd_nlb_sg, port_range=ec2.Port.tcp(SFTP_LISTEN_PORT)
        )

        self.sftpd_nlb = elbv2.NetworkLoadBalancer(
            self,
            "SFTPDLoadBalancer",
            load_balancer_name=f"{environment}-sftpd",
            vpc=self.vpc,
            vpc_subnets=ec2.SubnetSelection(subnet_type=ec2.SubnetType.PUBLIC),
            internet_facing=True,
            deletion_protection=False,
            security_groups=[self.sftpd_nlb_sg],
        )

        self.sftpd_nlb_listener = self.sftpd_nlb.add_listener(
            "SFTPDListener",
            port=SFTP_LISTEN_PORT,
        )

        self.sftpd_target_group = self.sftpd_nlb_listener.add_targets(
            "SFTPDTarget",
            targets=[
                self.sftp_service.load_balancer_target(
                    container_name="sftpgo",
                    container_port=SFTP_LISTEN_PORT,
                    protocol=ecs.Protocol.TCP,
                )
            ],
            port=SFTP_LISTEN_PORT,
            protocol=elbv2.Protocol.TCP,
        )

        self.api_target_group = elbv2.ApplicationTargetGroup(
            self,
            "TargetGroup",
            port=API_LISTEN_PORT,
            protocol=elbv2.ApplicationProtocol.HTTP,
            deregistration_delay=Duration.seconds(60),
            health_check=elbv2.HealthCheck(
                enabled=True,
                path=HEALTHCHECK_PATH_API,
                healthy_http_codes="200",
                healthy_threshold_count=HEALTHCHECK_HEALTHY_THR,
                unhealthy_threshold_count=HEALTHCHECK_UNHEALTHY_THR,
                interval=HEALTHCHECK_INTERVAL,
                timeout=HEALTHCHECK_TIMEOUT,
            ),
            vpc=self.vpc,
            target_type=elbv2.TargetType.IP,
        )
        self.sftp_target_group = elbv2.ApplicationTargetGroup(
            self,
            "SFTPTargetGroup",
            port=SFTP_ADMIN_LISTEN_PORT,
            protocol=elbv2.ApplicationProtocol.HTTP,
            deregistration_delay=Duration.seconds(60),
            health_check=elbv2.HealthCheck(
                enabled=True,
                path=HEALTHCHECK_PATH_SFTP,
                healthy_http_codes="200,302",
                healthy_threshold_count=HEALTHCHECK_HEALTHY_THR,
                unhealthy_threshold_count=HEALTHCHECK_UNHEALTHY_THR,
                interval=HEALTHCHECK_INTERVAL,
                timeout=HEALTHCHECK_TIMEOUT,
            ),
            vpc=self.vpc,
            target_type=elbv2.TargetType.IP,
        )

        api_target_group_conditions = [
            elbv2.ListenerCondition.host_headers(values=[api_alb_host])
        ]
        sftp_target_group_conditions = [
            elbv2.ListenerCondition.host_headers(values=[sftp_alb_host])
        ]

        if enable_cloudflare_auth_header:
            api_target_group_conditions.append(
                elbv2.ListenerCondition.http_header(
                    name=CLOUDFLARE_SECRET_HEADER,
                    values=[self.secret_cloudflare.secret_value.to_string()],
                ),
            )
            sftp_target_group_conditions.append(
                elbv2.ListenerCondition.http_header(
                    name=CLOUDFLARE_SECRET_HEADER,
                    values=[self.secret_cloudflare.secret_value.to_string()],
                ),
            )

        self.alb_listener.add_target_groups(
            Stack.of(self).stack_name,
            target_groups=[self.api_target_group],
            conditions=api_target_group_conditions,
            priority=api_alb_priority,
        )
        self.alb_listener.add_target_groups(
            f"{Stack.of(self).stack_name}-sftp",
            target_groups=[self.sftp_target_group],
            conditions=sftp_target_group_conditions,
            priority=sftp_alb_priority,
        )

        self.api_service.attach_to_application_target_group(self.api_target_group)
        self.sftp_service.attach_to_application_target_group(self.sftp_target_group)

        ###############
        # Autoscaling #
        ###############
        self.api_scalable_task_count = self.api_service.auto_scale_task_count(
            min_capacity=api_min_tasks, max_capacity=api_max_tasks
        )
        self.api_scalable_task_count.scale_on_cpu_utilization(
            "CPUScaling", target_utilization_percent=60
        )

        self.sftp_scalable_task_count = self.sftp_service.auto_scale_task_count(
            min_capacity=sftp_min_tasks, max_capacity=sftp_max_tasks
        )
        self.sftp_scalable_task_count.scale_on_cpu_utilization(
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

            alarm_factory_defaults = AlarmFactoryDefaults(
                actions_enabled=True,
                alarm_name_prefix=self.stack_name,
                action=action_strategy_default,
            )
        else:
            alarm_factory_defaults = None

        if enable_monitoring:
            self.monitoring = MonitoringFacade(
                self, self.stack_name, alarm_factory_defaults=alarm_factory_defaults
            )

            api_alb_services_alarm_factory = self.monitoring.create_alarm_factory(
                alarm_name_prefix="APILoadBalancer",
            )

            api_response_time_alarm = api_alb_services_alarm_factory.add_alarm(
                alarm_description="Response Time",
                alarm_name_suffix="TargetResponseTime",
                metric=self.api_target_group.metrics.target_response_time(),
                comparison_operator=cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                threshold=5,
                treat_missing_data=cloudwatch.TreatMissingData.NOT_BREACHING,
                datapoints_to_alarm=3,
                evaluation_periods=3,
            )
            api_alb_services_alarm_factory.add_alarm(
                alarm_description="HTTP 5xx Errors",
                alarm_name_suffix="HTTP-5xx",
                metric=self.api_target_group.metrics.http_code_target(
                    code=elbv2.HttpCodeTarget.TARGET_5XX_COUNT
                ),
                comparison_operator=cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                threshold=0,
                treat_missing_data=cloudwatch.TreatMissingData.NOT_BREACHING,
                datapoints_to_alarm=3,
                evaluation_periods=3,
            )

            self.monitoring.monitor_custom(
                alarm_friendly_name="API Load Balancer",
                human_readable_name="API Load Balancer",
                metric_groups=[
                    CustomMetricGroup(
                        title="Health",
                        metrics=[
                            self.api_target_group.metrics.healthy_host_count(
                                label="Healthy", color=cloudwatch.Color.BLUE
                            ),
                            self.api_target_group.metrics.unhealthy_host_count(
                                label="Unhealthy", color=cloudwatch.Color.RED
                            ),
                        ],
                        graph_widget_type=GraphWidgetType.STACKED_AREA,
                    ),
                    CustomMetricGroup(
                        title="Latency",
                        metrics=[self.api_target_group.metrics.target_response_time()],
                        graph_widget_axis=cloudwatch.YAxisProps(min=0),
                        horizontal_annotations=[api_response_time_alarm.annotation],
                    ),
                    CustomMetricGroup(
                        title="Target Response Codes",
                        metrics=[
                            self.api_target_group.metrics.http_code_target(
                                code=elbv2.HttpCodeTarget.TARGET_2XX_COUNT,
                                color=cloudwatch.Color.GREEN,
                                label="2xx",
                            ),
                            self.api_target_group.metrics.http_code_target(
                                code=elbv2.HttpCodeTarget.TARGET_3XX_COUNT,
                                color=cloudwatch.Color.BLUE,
                                label="3xx",
                            ),
                            self.api_target_group.metrics.http_code_target(
                                code=elbv2.HttpCodeTarget.TARGET_4XX_COUNT,
                                color=cloudwatch.Color.ORANGE,
                                label="4xx",
                            ),
                            self.api_target_group.metrics.http_code_target(
                                code=elbv2.HttpCodeTarget.TARGET_5XX_COUNT,
                                color=cloudwatch.Color.RED,
                                label="5xx",
                            ),
                        ],
                        graph_widget_type=GraphWidgetType.STACKED_AREA,
                    ),
                ],
            )
            self.monitoring.monitor_fargate_application_load_balancer(
                fargate_service=self.api_service,
                min_auto_scaling_task_count=api_min_tasks,
                max_auto_scaling_task_count=api_max_tasks,
                application_load_balancer=self.alb,
                application_target_group=self.api_target_group,
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
            self.monitoring.monitor_fargate_network_load_balancer(
                fargate_service=self.sftp_service,
                min_auto_scaling_task_count=sftp_min_tasks,
                max_auto_scaling_task_count=sftp_max_tasks,
                network_load_balancer=self.sftpd_nlb,
                network_target_group=self.sftpd_target_group,
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
            self.monitoring.monitor_cloud_front_distribution(
                distribution=self.media_cloudfront_distribution,
                additional_metrics_enabled=True,
                # add_error4xx_rate={
                #     "GreaterThan10Percent": ErrorRateThreshold(max_error_rate=10)
                # },
                # add_fault5xx_rate={
                #     "GreaterThan1Percent": ErrorRateThreshold(max_error_rate=1)
                # },
            )
            self.monitoring.monitor_s3_bucket(bucket=self.media_bucket)

            efs_services_alarm_factory = self.monitoring.create_alarm_factory(
                alarm_name_prefix="EFS",
            )

            efs_burst_credit_balance_alarm = efs_services_alarm_factory.add_alarm(
                alarm_description="Burst Credit Balance",
                alarm_name_suffix="BurstCreditBalance",
                metric=cloudwatch.Metric(
                    metric_name="BurstCreditBalance",
                    namespace="AWS/EFS",
                    dimensions_map={"FileSystemId": self.efs_filesystem.file_system_id},
                    statistic="Average",
                ),
                comparison_operator=cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
                threshold=500000000000,
                datapoints_to_alarm=5,
                evaluation_periods=5,
                period=Duration.seconds(60),
                treat_missing_data=cloudwatch.TreatMissingData.MISSING,
            )
            efs_percent_io_limit_alarm = efs_services_alarm_factory.add_alarm(
                alarm_description="Percent IO Limit",
                alarm_name_suffix="PercentIOLimit",
                metric=cloudwatch.Metric(
                    metric_name="PercentIOLimit",
                    namespace="AWS/EFS",
                    dimensions_map={"FileSystemId": self.efs_filesystem.file_system_id},
                    statistic="Average",
                ),
                comparison_operator=cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                threshold=80,
                datapoints_to_alarm=3,
                evaluation_periods=3,
                period=Duration.seconds(300),
                treat_missing_data=cloudwatch.TreatMissingData.MISSING,
            )
            efs_permitted_throughput_alarm = efs_services_alarm_factory.add_alarm(
                alarm_description="Permitted Throughput",
                alarm_name_suffix="PermittedThroughput",
                metric=cloudwatch.Metric(
                    metric_name="PermittedThroughput",
                    namespace="AWS/EFS",
                    dimensions_map={"FileSystemId": self.efs_filesystem.file_system_id},
                    statistic="Average",
                ),
                comparison_operator=cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
                threshold=25,
                datapoints_to_alarm=3,
                evaluation_periods=3,
                period=Duration.seconds(300),
                treat_missing_data=cloudwatch.TreatMissingData.MISSING,
            )

            self.monitoring.monitor_custom(
                alarm_friendly_name="EFS Filesystem",
                human_readable_name="EFS Filesystem",
                metric_groups=[
                    CustomMetricGroup(
                        title="BurstCreditBalance",
                        metrics=[
                            cloudwatch.Metric(
                                metric_name="BurstCreditBalance",
                                namespace="AWS/EFS",
                                dimensions_map={
                                    "FileSystemId": self.efs_filesystem.file_system_id
                                },
                                statistic="Average",
                            )
                        ],
                        horizontal_annotations=[
                            efs_burst_credit_balance_alarm.annotation
                        ],
                    ),
                    CustomMetricGroup(
                        title="PercentIOLimit",
                        metrics=[
                            cloudwatch.Metric(
                                metric_name="PercentIOLimit",
                                namespace="AWS/EFS",
                                dimensions_map={
                                    "FileSystemId": self.efs_filesystem.file_system_id
                                },
                                statistic="Average",
                            )
                        ],
                        horizontal_annotations=[efs_percent_io_limit_alarm.annotation],
                    ),
                    CustomMetricGroup(
                        title="PermittedThroughput",
                        metrics=[
                            cloudwatch.Metric(
                                metric_name="PermittedThroughput",
                                namespace="AWS/EFS",
                                dimensions_map={
                                    "FileSystemId": self.efs_filesystem.file_system_id
                                },
                                statistic="Average",
                            )
                        ],
                        horizontal_annotations=[
                            efs_permitted_throughput_alarm.annotation
                        ],
                    ),
                ],
            )

        ###########
        # Backups #
        ###########
        if aws_backup_enable:
            NagSuppressions.add_resource_suppressions(
                construct=self.database_instance,
                suppressions=[
                    NagPackSuppression(
                        id="AwsSolutions-RDS13",
                        reason="Managed by AWS Backup",
                    ),
                ],
            )
            if aws_backup_use_default_plan:
                Tags.of(self.database_instance).add("BackupPlan", "Default")
                Tags.of(self.efs_filesystem).add("BackupPlan", "Default")
                Tags.of(self.media_bucket).add("BackupPlan", "Default")
            else:
                self.vault = backup.BackupVault(
                    self,
                    id="BackupVault",
                    backup_vault_name=Stack.of(self).stack_name,
                )
                self.plan = backup.BackupPlan(
                    self,
                    id="BackupPlan",
                    backup_plan_name=Stack.of(self).stack_name,
                    windows_vss=True,
                    backup_vault=self.vault,
                    backup_plan_rules=[
                        backup.BackupPlanRule(
                            rule_name=Stack.of(self).stack_name,
                            backup_vault=self.vault,
                            enable_continuous_backup=aws_backup_retention_days <= 35,
                            start_window=Duration.hours(1),
                            completion_window=Duration.hours(10),
                            schedule_expression=events.Schedule.expression(
                                aws_backup_schedule
                            ),
                            delete_after=Duration.days(aws_backup_retention_days),
                        )
                    ],
                )
                self.selection = backup.BackupSelection(
                    self,
                    id="BackupSelection",
                    backup_plan=self.plan,
                    backup_selection_name=Stack.of(self).stack_name,
                    allow_restores=True,
                    resources=[
                        backup.BackupResource(construct=self.database_instance),
                        backup.BackupResource(construct=self.efs_filesystem),
                        backup.BackupResource(construct=self.media_bucket),
                    ],
                )

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
        NagSuppressions.add_resource_suppressions(
            construct=self.sftpd_nlb,
            suppressions=[
                NagPackSuppression(
                    id="AwsSolutions-ELB2",
                    reason="Not aligned with security posture",
                ),
            ],
        )
        NagSuppressions.add_resource_suppressions(
            construct=self.sftpd_nlb_sg,
            suppressions=[
                NagPackSuppression(
                    id="AwsSolutions-EC23",
                    reason="Required during tests phase",
                ),
            ],
        )
        NagSuppressions.add_resource_suppressions(
            construct=self.media_cloudfront_distribution,
            suppressions=[
                NagPackSuppression(
                    id="AwsSolutions-CFR1",
                    reason="Not aligned with security posture",
                ),
                NagPackSuppression(
                    id="AwsSolutions-CFR2",
                    reason="Not aligned with security posture",
                ),
                NagPackSuppression(
                    id="AwsSolutions-CFR3",
                    reason="Not yet decided if access log required at this level",
                ),
            ],
        )
