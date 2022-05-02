include {
  path = find_in_parent_folders()
}

terraform {
  source  = "git::git@github.com://luisfelipesouza/tf-module-cloudfront-static.git"
}

dependency "bucket" {
  config_path = "..//bucket"
  mock_outputs = {
    bucket_name = "bucket_mock"
    bucket_regional_domain_name = "bucket_regional_domain_name"
  }
  mock_outputs_allowed_terraform_commands = ["init","validate", "plan"]
}

dependency "certificate" {
  config_path = "..//certificate"
  mock_outputs = {
    cert_arn    =  " arn:aws:acm:us-east-2:111222333444:certificate/11122233334-3333-48933e-aa59-111223aasda"
    cert_status =  " ISSUED"
  }
  mock_outputs_allowed_terraform_commands = ["init","validate", "plan"]
}

dependency "domain" {
  config_path = "..//domain"
  mock_outputs = {
    hosted_zone_id = "Z09999999XXZZYYYWWWW9"
    domain  = "fake.fake.com"
  }
  mock_outputs_allowed_terraform_commands = ["init","validate", "plan"]
}

inputs = {
  domain                      = dependency.domain.outputs.domain
  bucket                      = dependency.bucket.outputs.bucket_name
  hosted_zone_id              = dependency.domain.outputs.hosted_zone_id
  bucket_regional_domain_name = dependency.bucket.outputs.bucket_regional_domain_name
  certificate_arn             = dependency.certificate.outputs.cert_arn
  certificate_status          = dependency.certificate.outputs.cert_status
}