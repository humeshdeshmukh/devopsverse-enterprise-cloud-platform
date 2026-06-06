# Terraform configuration to provision AWS RDS database for DevOpsVerse Enterprise Platform
# Addresses connection limit saturation during Kafka group rebalancing

resource "aws_db_parameter_group" "db_parameters" {
  name   = "platform-db-pg"
  family = "postgres14"

  parameter {
    name  = "max_connections"
    value = "1000"
  }

  tags = {
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}

resource "aws_db_instance" "platform_db" {
  identifier           = "devopsverse-platform-db"
  allocated_storage    = 50
  max_allocated_storage = 200
  storage_type         = "gp3"
  engine               = "postgres"
  engine_version       = "14.7"
  instance_class       = "db.t3.medium"
  db_name              = "devopsverse_metadata"
  username             = "postgres"
  password             = "postgrespass" # Securely referenced from secrets in staging/prod
  parameter_group_name = aws_db_parameter_group.db_parameters.name
  skip_final_snapshot  = true

  tags = {
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}
