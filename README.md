# aws-psa-interview (frontend)
## Requirements
* [Terragrunt](https://terragrunt.gruntwork.io/docs/getting-started/install/)
## provisioning
```bash
./frontend/$ terragrunt run-all plan
```
```bash
./frontend/$ terragrunt run-all apply
```
## get outputs
```bash
./frontend/$ terragrunt run-all output > .outputs
```
## create .config.yaml file with the follwing attributes
```bash
region: {region}
environment: {prod/dev}
backend_bucket: {terraform backend bucket}
backend_dynamo: {terraform backend table}
content_path: {index.html location}
```

# aws-psa-interview (backend)
## Requirements
* [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* [AWS CLI](https://aws.amazon.com/pt/cli/)

## Deployment
```bash
./backend/$ sam build
```
```bash
./backend/$ sam deploy
```

## Cognito Admin user
```bash
aws cognito-idp sign-up --{region} \
--client-id {client-id} \
--username {user-email} \
--password {password}
```
```bash
aws cognito-idp admin-confirm-sign-up \
--region {region} \
--user-pool-id {user-pool-id} \
--username {user-email}
```

## SES Email Identitify
```bash
aws ses verify-email-identity \
--email-address psainterviewfrom@gmail.com
```
```bash
aws ses verify-email-identity \
--email-address psainterviewto@gmail.com
```