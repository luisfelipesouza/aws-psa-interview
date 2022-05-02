include {
  path = find_in_parent_folders()
}

terraform {
  source  = "git::git@github.com://luisfelipesouza/tf-module-static-site.git"
}

inputs = {
  bucket_name = "psa.luisfelipesouza.digital"
}