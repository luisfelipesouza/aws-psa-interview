include {
  path = find_in_parent_folders()
}

terraform {
  source  = "git::git@github.com://luisfelipesouza/tf-module-domain.git"
}

inputs = {
  domain  = "psa.luisfelipesouza.digital"
}