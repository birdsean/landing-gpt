terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.10"
    }
  }

  backend "s3" {
    bucket = "droid-terraform-state"
    key    = "api-landing-gpt.tfstate"
    region = "us-east-1"
  }

  required_version = ">= 1.5.4"
}

provider "aws" {
  region = "us-east-1"
}
