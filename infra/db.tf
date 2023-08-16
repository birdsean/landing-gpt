resource "aws_dynamodb_table" "messages_table" {
  name         = "ChatMessages"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "MessageId"
  range_key    = "SessionId"

  point_in_time_recovery {
    enabled = true
  }

  attribute {
    name        = "MessageId"
    type        = "S"
  }

  attribute {
    name = "SessionId"
    type = "S"
  }
}
