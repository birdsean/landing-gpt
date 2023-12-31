# Variables

variable "OPENAI_API_KEY" {
  type = string
}

# Server Code S3 Repository
resource "aws_s3_bucket" "server_code" {
  bucket = "api-landing-gpt-releases"
}

resource "aws_s3_bucket_versioning" "release_versioning" {
  bucket = aws_s3_bucket.server_code.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Upload Code to S3
resource "aws_s3_object" "server_code_release" {
  bucket = aws_s3_bucket.server_code.id
  key    = "${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}_api-landing-gpt.zip"
  source = "../server/build.zip"
}

# Lambda Role Policy

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

# Lambda Logging Policy

data "aws_iam_policy_document" "lambda_logging" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["arn:aws:logs:*:*:*"]
  }
}

resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_logging"
  path        = "/"
  description = "IAM policy for logging from a lambda"
  policy      = data.aws_iam_policy_document.lambda_logging.json
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

data "aws_iam_policy_document" "dynamo_messages_write" {
  statement {
    effect = "Allow"

    actions = [
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
    ]

    resources = [aws_dynamodb_table.messages_table.arn]
  }

  depends_on = [aws_dynamodb_table.messages_table]
}

resource "aws_iam_policy" "dynamo_messages_write" {
  name        = "dynamo_messages_write"
  description = "IAM policy for writing to messages table"
  policy      = data.aws_iam_policy_document.dynamo_messages_write.json
}

resource "aws_iam_role_policy_attachment" "dynamo_messages_write" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.dynamo_messages_write.arn
}

# Lambda

resource "aws_lambda_function" "api_landing_gpt_function" {
  function_name = "api-landing-gpt"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "build/src.handler"
  timeout       = 10

  s3_bucket = aws_s3_bucket.server_code.id
  s3_key    = aws_s3_object.server_code_release.key

  runtime = "nodejs18.x"

  environment {
    variables = {
      OPENAI_API_KEY = var.OPENAI_API_KEY
    }
  }
}

resource "aws_lambda_function_url" "api_url" {
  function_name      = aws_lambda_function.api_landing_gpt_function.function_name
  authorization_type = "NONE"
  invoke_mode        = "RESPONSE_STREAM"

  cors {
    allow_origins  = ["*"]
    allow_methods  = ["*"]
    allow_headers  = ["*"]
    expose_headers = ["*"]
    max_age        = 0
  }
}
