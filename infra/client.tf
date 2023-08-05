resource "aws_s3_bucket" "client_code" {
  bucket = "landing-gpt-releases"
}

resource "aws_s3_bucket_website_configuration" "client_react_site" {
    bucket = aws_s3_bucket.client_code.id
    index_document {
        suffix = "index.html"
    }
}
