# AWS CDK infrastructure

## Requirements

- [AWS CLI](https://aws.amazon.com/es/cli/)
- [AWS CDK CLI](https://docs.aws.amazon.com/cdk/v2/guide/cli.html)
- Python 3.9

Prepare python virtual environment for CDK builds

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## General guidelines for CDK usage

CDK stacks require 2 arguments that must be attached to every CDK operation:

- `config_file` : A path to a JSON file containing all of the stack parameters. Usually one per environment
- `image_tag` : The Universae360 container image tag to be deployed into ECS service

## Synthesize Cloudformation stack

```bash
cdk synth -c config_file=config/dev.json
```

## Infrastructure diff report

```bash
cdk diff -c config_file=config/dev.json
```

## Deploy

```bash
cdk deploy -c config_file=config/dev.json
```

## Destroy

```bash
cdk destroy -c config_file=config/dev.json
```
