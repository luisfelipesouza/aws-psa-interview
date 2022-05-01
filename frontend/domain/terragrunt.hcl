include {
  path = find_in_parent_folders()
}

locals {
  tf-module-version = "1.0"
}
terraform {
  source  = "git::git@github.com:luisfelipesouza/tf-module-domain.git"
}

inputs = {
  domain        = "faq.luisfelipesouza.digital"
}