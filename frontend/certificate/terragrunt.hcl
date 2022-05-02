include {
  path = find_in_parent_folders()
}

terraform {
  source  = "git::git@github.com://luisfelipesouza/tf-module-certificate.git"
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
  hosted_zone_id  = dependency.domain.outputs.hosted_zone_id
  domain          = dependency.domain.outputs.domain
}
