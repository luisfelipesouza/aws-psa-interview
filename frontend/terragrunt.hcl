locals {
  config          = yamldecode(file(".config.yaml"))
  content_path    = local.config.content_path
}

remote_state {
  backend = "s3"
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite"
  }
  config = {
    bucket          = local.config.backend_bucket
    key             = "statefiles/psa/${path_relative_to_include()}.tfstate"
    region          = local.config.region
    dynamodb_table  = local.config.backend_dynamo
    encrypt         = true
  }
}

generate "provider"{
  path = "version.tf"
  if_exists = "overwrite_terragrunt"
  contents = <<EOF
terraform {
    required_version = "~> 1.0"
    required_providers {
    aws = {
      source  = "hashicorp/aws"
    }
  }
}
provider "aws" {
  region  = "${local.config.region}"
}
EOF
}

inputs = merge (
  {
    application     = "psa-faq-serverless"
    cost-center     = "customer-service"
    deployed-by     = "terragrunt"
  }, 
  local.config
)