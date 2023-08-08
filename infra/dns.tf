resource "aws_route53_zone" "primary" {
  name = "droid-corp.com"
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "www.droid-corp.com"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.droid_corp_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.droid_corp_distribution.hosted_zone_id
    evaluate_target_health = false
  }
  depends_on = [aws_cloudfront_distribution.droid_corp_distribution]
}

resource "aws_route53_record" "naked" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "droid-corp.com"
  type    = "A"

  alias {
    name                   = aws_s3_bucket_website_configuration.redirect_bucket_config.website_domain
    zone_id                = aws_s3_bucket.naked_domain_redirect_bucket.hosted_zone_id
    evaluate_target_health = false
  }

  depends_on = [aws_s3_bucket.naked_domain_redirect_bucket, aws_s3_bucket_website_configuration.redirect_bucket_config]
}

resource "aws_acm_certificate" "cert" {
  domain_name       = "*.droid-corp.com"
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
  depends_on = [ aws_acm_certificate.cert, aws_route53_zone.primary ]
}

resource "aws_acm_certificate_validation" "cert_validation" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.domain_validations : record.fqdn]
}
