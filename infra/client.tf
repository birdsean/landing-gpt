resource "aws_s3_bucket" "client_code" {
  bucket = "landing-gpt-releases"
}

resource "aws_s3_bucket_website_configuration" "client_code_website" {
  bucket = aws_s3_bucket.client_code.id
  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

data "aws_iam_policy_document" "s3_public_read_access" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.client_code.arn}/*"]
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
  }
}

resource "aws_s3_bucket_policy" "s3_public_read_access" {
  bucket = aws_s3_bucket.client_code.id
  policy = data.aws_iam_policy_document.s3_public_read_access.json

  depends_on = [aws_s3_bucket_public_access_block.public_read]
}

resource "aws_s3_bucket_cors_configuration" "prod_media" {
  bucket = aws_s3_bucket.client_code.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_public_access_block" "public_read" {
  bucket = aws_s3_bucket.client_code.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_route53_zone" "primary" {
  name = "droid-corp.com"
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "www.droid-corp.com"
  type    = "A"

  alias {
    name                   = aws_s3_bucket.client_code.website_domain
    zone_id                = aws_s3_bucket.client_code.hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "naked" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "droid-corp.com"
  type    = "A"

  alias {
    name                   = aws_s3_bucket.client_code.website_domain
    zone_id                = aws_s3_bucket.client_code.hosted_zone_id
    evaluate_target_health = true
  }
}
