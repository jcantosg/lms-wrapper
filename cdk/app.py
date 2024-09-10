#!/usr/bin/env python3
import json

import aws_cdk as cdk

from cdk_nag import AwsSolutionsChecks
from lib.api import APIStack

app = cdk.App()

config_file = open(app.node.try_get_context("config_file"))
config_data = json.load(config_file)
config_file.close()

cdk_environment = cdk.Environment(
    account=config_data["aws_account_id"],
    region=config_data["aws_region"],
)

api_config = config_data["api"]
cron_config = config_data["cron"]
sftp_config = config_data["sftp"]

APIStack(
    app,
    "api-{}".format(config_data["environment"]),
    env=cdk_environment,
    image_tag=app.node.try_get_context("image_tag"),
    environment=config_data["environment"],
    app_url=config_data["app_url"],
    spot_capacity_percent=config_data["spot_capacity_percent"],
    enable_cloudflare_auth_header=config_data["enable_cloudflare_auth_header"],
    api_alb_host=api_config["alb_host"],
    api_alb_priority=api_config["alb_priority"],
    api_cpu=api_config["cpu"],
    api_memory=api_config["memory"],
    api_min_tasks=api_config["min_tasks"],
    api_max_tasks=api_config["max_tasks"],
    cron_enable=cron_config["enable"],
    cron_cpu=cron_config["cpu"],
    cron_memory=cron_config["memory"],
    sftp_alb_host=sftp_config["alb_host"],
    sftp_alb_priority=sftp_config["alb_priority"],
    sftp_cpu=sftp_config["cpu"],
    sftp_memory=sftp_config["memory"],
    sftp_min_tasks=sftp_config["min_tasks"],
    sftp_max_tasks=sftp_config["max_tasks"],
    sftp_allowed_cidrs=sftp_config["allowed_cidrs"],
    db_cloudwatch_logs_exports=config_data["db"]["cloudwatch_logs_exports"],
    db_enable_performance_insights=config_data["db"]["enable_performance_insights"],
    db_engine_full_version=config_data["db"]["engine_full_version"],
    db_instance_type=config_data["db"]["instance_type"],
    db_allocated_storage=config_data["db"]["allocated_storage"],
    db_multi_az=config_data["db"]["multi_az"],
    db_preferred_maintenance_window=config_data["db"]["preferred_maintenance_window"],
    db_preferred_backup_window=config_data["db"]["preferred_backup_window"],
    db_parameters=config_data["db"]["parameters"],
    db_read_replicas=config_data["db"]["read_replicas"],
    db_read_replicas_instance_type=config_data["db"]["read_replicas_instance_type"],
    enable_monitoring=config_data["monitoring"]["enable"],
    sns_topic_arn=config_data["monitoring"]["sns_topic_arn"],
    media_domain_name=config_data["media"]["domain_name"],
    media_certificate_arn=config_data["media"]["certificate_arn"],
    tags={
        "environment": config_data["environment"],
        "app": "universae360",
        "stack": "api",
    },
)

cdk.Aspects.of(app).add(AwsSolutionsChecks())
app.synth()
