resource "aws_s3_bucket" "client_code" {
  bucket = "landing-gpt-releases"
}

resource "aws_s3_bucket_website_configuration" "client_code_website" {
    bucket = aws_s3_bucket.client_code.id
    index_document {
        suffix = "index.html"
    }
}

data "aws_iam_policy_document" "s3_public_read_access" {
  statement {
    actions = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.client_code.arn}/*"]
    principals {
      type = "AWS"
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
