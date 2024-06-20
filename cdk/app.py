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

APIStack(
    app,
    "api-{}".format(config_data["environment"]),
    env=cdk_environment,
    environment=config_data["environment"],
    alb_host=config_data["alb_host"],
    alb_priority=config_data["alb_priority"],
    app_url=config_data["app_url"],
    image_tag=app.node.try_get_context("image_tag"),
    cpu=config_data["cpu"],
    memory=config_data["memory"],
    min_tasks=config_data["min_tasks"],
    max_tasks=config_data["max_tasks"],
    spot_capacity_percent=config_data["spot_capacity_percent"],
    cron_enable=config_data["cron"]["enable"],
    cron_cpu=config_data["cron"]["cpu"],
    cron_memory=config_data["cron"]["memory"],
    db_cloudwatch_logs_exports=config_data["db"]["cloudwatch_logs_exports"],
    db_enable_performance_insights=config_data["db"]["enable_performance_insights"],
    db_engine_full_version=config_data["db"]["engine_full_version"],
    db_instance_type=config_data["db"]["instance_type"],
    db_max_allocated_storage=config_data["db"]["max_allocated_storage"],
    db_multi_az=config_data["db"]["multi_az"],
    db_preferred_maintenance_window=config_data["db"]["preferred_maintenance_window"],
    enable_monitoring=config_data["monitoring"]["enable"],
    sns_topic_arn=config_data["monitoring"]["sns_topic_arn"],
    tags={
        "environment": config_data["environment"],
        "app": "universae360",
        "stack": "api",
    },
)

cdk.Aspects.of(app).add(AwsSolutionsChecks())
app.synth()
