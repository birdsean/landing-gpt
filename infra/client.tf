resource "aws_s3_bucket" "naked_domain_redirect_bucket" {
  bucket = "droid-corp.com"
}

resource "aws_s3_bucket_website_configuration" "redirect_bucket_config" {
  bucket = aws_s3_bucket.naked_domain_redirect_bucket.id
  redirect_all_requests_to {
    host_name = "www.droid-corp.com"
    protocol  = "https"
  }
}

resource "aws_s3_bucket_ownership_controls" "redirect_bucket_ownership" {
  bucket = aws_s3_bucket.naked_domain_redirect_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "redirect_bucket_public_access" {
  bucket = aws_s3_bucket.naked_domain_redirect_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "redirect_bucket_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.redirect_bucket_ownership,
    aws_s3_bucket_public_access_block.redirect_bucket_public_access,
  ]

  bucket = aws_s3_bucket.naked_domain_redirect_bucket.id
  acl    = "public-read"
}

resource "aws_s3_bucket" "client_code" {
  bucket = "www.droid-corp.com"
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

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_cloudfront_origin_access_identity" "s3_access_id" {
  comment = "Allows CloudFront to reach the S3 bucket"
}

resource "aws_cloudfront_origin_access_control" "default" {
  name                              = "s3_access"
  description                       = "Allows CloudFront to reach the S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "droid_corp_distribution" {
  origin {
    domain_name              = aws_s3_bucket.client_code.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
    origin_id                = aws_s3_bucket.client_code.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = aws_s3_bucket.client_code.id

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 86400

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA", "GB", "DE"]
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.cert.arn
    ssl_support_method  = "sni-only"
  }
}
