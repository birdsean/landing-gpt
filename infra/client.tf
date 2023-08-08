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

resource "aws_acm_certificate" "cert" {
  domain_name       = "droid-corp.com"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "domain_validations" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.primary.zone_id
}

resource "aws_s3_bucket_public_access_block" "public_read" {
  bucket = aws_s3_bucket.client_code.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
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
  depends_on = [aws_s3_bucket.client_code]
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

  depends_on = [aws_s3_bucket.client_code]
}

resource "aws_s3_bucket" "cloudfront_logging_bucket" {
  bucket = "landing-gpt-logs"
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

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.s3_access_id.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  logging_config {
    bucket = aws_s3_bucket.cloudfront_logging_bucket.bucket_domain_name
  }

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
