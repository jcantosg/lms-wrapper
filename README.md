<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## Environment Variables

### AWS SDK credentials

In AWS environments, AWS SDK credentials are automatically managed via the AWS metadata service. Therefore, you do not need to set any environment variables for AWS credentials manually.

For local deployments, environment variables must be set according to the [AWS SDK specification](https://docs.aws.amazon.com/sdkref/latest/guide/environment-variables.html). This enables the SDK to authenticate and interact with AWS services correctly.

### Managed at Deployment Time

The following environment variables are automatically generated or derived from infrastructure resource endpoints during the deployment process:

- `DATABASE_HOST`: The hostname of your database server.
- `DATABASE_NAME`: The name of your application database.
- `DATABASE_PASSWORD`: The password for your database user.
- `DATABASE_PORT`: The port on which your database server is listening.
- `DATABASE_USER`: The username for accessing your database.
- `JWT_SECRET`: The secret key used for JWT authentication.

### Additional environment variables

AWS containers (e.g., running in ECS) source additional environment variables from a specific `.env` file stored in an S3 bucket. Developers can upload new revisions of this `.env` file to extend or update configurations.

Each AWS environment has a dedicated S3 bucket named `envvars-[environment]-eu-west-3-603941717969` that contains the environment files within a project-specific folder. 

For example, the environment file for the API development environment can be found at:

`s3://envvars-dev-eu-west-3-603941717969/api/.env`

**Note:** After updating the `.env` file in S3, an ECS deployment is required for the new values to take effect.

## CI/CD Pipeline

This project utilizes a Continuous Integration and Continuous Deployment (CI/CD) pipeline implemented using AWS CodePipeline. The pipeline is configured with separate instances for each branch/environment, enabling automated delivery of code changes to the respective environments. The following table outlines the mapping between Git branches and AWS environments:

| Git Branch | AWS Environment | Pipeline Link |
|------------|-----------------|----------------|
| `dev`      | `dev`           | [View Pipeline](https://eu-west-3.console.aws.amazon.com/codesuite/codepipeline/pipelines/api-dev/view?region=eu-west-3) |
| `release`  | `pre`           | [View Pipeline](https://eu-west-3.console.aws.amazon.com/codesuite/codepipeline/pipelines/api-pre/view?region=eu-west-3) |
| `main`     | `pro`           | [View Pipeline](https://eu-west-3.console.aws.amazon.com/codesuite/codepipeline/pipelines/api-pro/view?region=eu-west-3) |

The CI/CD pipeline automates the build, test, and deployment processes, ensuring that code changes are thoroughly validated before being promoted to the next environment. This approach helps to maintain code quality, reduce manual effort, and streamline the software delivery process.

Manual releases can be used to override the deployment commit and deploy a specific branch or tag. Refer to the [documentation](https://docs.aws.amazon.com/codepipeline/latest/userguide/pipelines-trigger-source-overrides.html#pipelines-trigger-source-overrides-console) for more information.

### Pipeline Stages

The CI/CD pipeline consists of the following stages:

1. **Source**: This stage pulls the code from the project's GitHub repository. It ensures that the latest code changes are available for further processing.

2. **Deploy**: In this stage, the build tasks specified in the `codebuild/buildspec.yaml` file are executed.

### Builds

During the build stage, several tasks are performed to prepare the code for deployment:

- **AWS CDK Synthesis**: The AWS Cloud Development Kit (CDK) synthesizes the infrastructure-as-code definition and generates the necessary CloudFormation templates.

- **AWS CDK Diff**: The CDK diff command compares the synthesized CloudFormation templates with the deployed infrastructure to identify the changes that will be applied during the deployment.

- **Container Image Build and Push**: The build process also includes building the container image and pushing it to the Elastic Container Registry (ECR). Additionally, code linting runs to ensure code quality.

- **Infrastructure-as-Code Security Policy Checks**: The build stage performs security policy checks using [CheckOV](https://www.checkov.io). These checks help enforce best practices and identify any potential security vulnerabilities in the infrastructure definition.
  - The results can be browsed in the corresponding [AWS Codebuild report group](https://eu-west-3.console.aws.amazon.com/codesuite/codebuild/testReports/reportGroups?region=eu-west-3).
  - For now, security findings do NOT trigger a build error.

- **Container image vulnerability assessment**: The build stage performs a vulnerability assessment using [Trivy](https://trivy.dev). These checks help enforce best practices and identify any potential security vulnerabilities in the business application containers.
  - The results can be browsed in the corresponding [AWS Codebuild report group](https://eu-west-3.console.aws.amazon.com/codesuite/codebuild/testReports/reportGroups?region=eu-west-3).
  - For now, security findings do NOT trigger a build error.

- **AWS CDK Deploy**: The changes identified in the CDK Diff during the build stage are applied to the target environment. This includes both the container image and infrastructure changes.

#### Automatic Rollbacks

To ensure a smooth and error-free deployment process, automatic rollbacks have been implemented. These rollbacks are triggered if any errors occur during the deployment.

Rollbacks will occur in two specific scenarios:

1. **Errors in Infrastructure Changes**: If there are any errors related to the application of infrastructure changes using CloudFormation, the deployment will automatically rollback. This helps maintain the integrity of the environment by reverting any faulty changes.

2. **Container Startup Issues**: In case there are issues during the startup of containers using ECS Circuit Breaker, the deployment will also trigger a rollback. This ensures that the target environment remains stable and free from any disruptions caused by faulty container deployments.

3. **Container Healthcheck Issues**: In case the containers do start but fail the load balancer healthcheck, an ECS Circuit Breaker event will occur, just like in the previous scenario.

By having automatic rollbacks in place, the system can quickly recover from any unexpected errors or issues that may arise during the deployment process.

These measures play a crucial role in minimizing potential disruptions and maintaining the stability and reliability of the deployed system.

## Local Stacks using Docker Compose

This project provides a ```Dockerfile``` and a ```docker-compose.aws.yml`` Docker Compose recipe to deploy a local stack that replicates the runtime and architecture of the AWS environments.

```bash
# Build application image
docker compose -f docker-compose.aws.yml build

# Run in foregrond using the most recent image available
docker compose -f docker-compose.aws.yml up

# Build and run in backgroun
docker compose -f docker-compose.aws.yml up -d --build

# Remove the Docker stack
docker compose -f docker-compose.aws.yml down
```

Applications should be available at the following endpoints:

| Component          | Endpoint                 |
| ------------------ | ------------------------ |
| PostgreSQL         | 127.0.0.1:5432           |
| API                | <http://127.0.0.1:3000/> |

### Load balancer and SSL termination

The stack provides a `load-balancer` container that listens on both standard HTTP/S ports, creates a self-signed certificate and provdes appropiate balancing rules for the following hostnames:

| Component          | Endpoint                           |
| ------------------ | ---------------------------------- |
| API                | <https://api.local.universae.com/> |

The following command creates a hosts entry to fix the DNS resolution requirements for web browsers.

```bash
echo "127.0.0.1 api.local.universae.com | sudo tee -a /etc/hosts
```

### Database initialization

The `backend` container runs the `typeorm:migrations:up` task on startup, which should update the database schema. If you need to seed or force sync the database you may attach an interactive shell into the backend container to run NPM commands:

```bash
# 1. Launch interactive shell inside backend container
docker compose exec cron /bin/sh

# 2. DB reload
make database-reload
```

## AWS deployments using Docker and AWS CDK

### Requirements

- [AWS CLI](https://aws.amazon.com/es/cli/) with administrator level credentials for the Universae AWS account.
- [AWS CDK toolkit](https://docs.aws.amazon.com/cdk/v2/guide/cli.html)
- [Python 3.9+](https://www.python.org).
- [Docker](https://www.docker.com)

Prepare python virtual environment for CDK builds

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r cdk/requirements.txt
```

### Build and push container image

```bash
export AWS_DEFAULT_REGION=eu-west-3
AWS_ACCOUNT_ID=$(aws sts get-caller-identity | jq -r .Account)

ECR_BASE_URL=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com
ECR_REPOSITORY=universae360/api
ECR_REPO_URL=${ECR_BASE_URL}/${ECR_REPOSITORY}
IMAGE_TAG=$(git rev-parse --short HEAD)

# Login to Elastic Container Registry
aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${ECR_BASE_URL}

# Execute Docker builds
docker build -t ${ECR_REPO_URL}:${IMAGE_TAG}-cron --target cron .
docker build -t ${ECR_REPO_URL}:${IMAGE_TAG}-api --target api .

# Push the Docker image to ECR
docker push ${ECR_REPO_URL}:${IMAGE_TAG}-cron
docker push ${ECR_REPO_URL}:${IMAGE_TAG}-api
```

### AWS CDK deployment

Once the target container image is uploaded to the application's ECR repository, you can proceed with AWS CDK deployment using the following steps:

```bash
ENVIRONMENT=dev
IMAGE_TAG=my-image-tag
CDK_OPTIONS="-c config_file=cdk/config/${ENVIRONMENT}.json -c image_tag=${IMAGE_TAG}"

# Synthesize the Cloudformation template
cdk synth ${CDK_OPTIONS}

# Diff against the current AWS environment
cdk diff ${CDK_OPTIONS}

# Deploy changes
cdk deploy ${CDK_OPTIONS}
```

Please replace the placeholders `${ENVIRONMENT}` and `${IMAGE_TAG}` with the appropriate values according to your deployment requirements.

By following these steps, you will be able to effectively deploy your code repository to AWS using Docker and the AWS CDK toolkit.

## AWS ECS Exec

This project provides a script `ecs_exec.sh` under the `scripts` folder to enable AWS administrators to start interactive shells inside running containers in a given environment. This is useful to trigger tasks from the `cron` container wich already includes common use command line tools like AWS CLI, PostgreSQL and Make.

This utility requires the [AWS CLI](https://aws.amazon.com/es/cli/) with credentials for the target account, the [AWS CLI Session Manager PLugin](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html) and [jq](https://jqlang.github.io/jq/) for API response parsing.

```bash
cd scripts
./ecs_exec.sh -e <environment> -s <service>

# Usage: ./ecs_exec.sh -e <environment> -s <service>
#  <environment>: dev|pre|pro
#  <service>: api|cron
```

## AWS ECS Force Deployment

This project provides a script `ecs_force_deployment.sh` under the `scripts` folder to enable AWS administrators to force rotation of existing containers without crossing the pipeline workflow or using the AWS Console.

This utility requires the [AWS CLI](https://aws.amazon.com/es/cli/) with credentials for the target account, the [AWS CLI Session Manager PLugin](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html) and [jq](https://jqlang.github.io/jq/) for API response parsing.

```bash
cd scripts
./ecs_force_deployment.sh -e <environment>

# Usage: ./ecs_force_deployment.sh -e <environment>
#  <environment>: dev|pre|pro
```

## License

Nest is [MIT licensed](LICENSE).
