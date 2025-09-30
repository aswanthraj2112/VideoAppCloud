# Setup Guide

This guide will help you set up the Video App for local development and production deployment.

## Prerequisites

### System Requirements
- **Node.js**: >= 22.20.0
- **npm**: >= 10.0.0
- **Git**: Latest version
- **Docker**: Latest version (optional, for containerized deployment)

### AWS Account Setup
1. Create an AWS account if you don't have one
2. Configure AWS CLI with appropriate credentials
3. Ensure you have permissions for:
   - S3 bucket creation and management
   - DynamoDB table creation and management
   - Cognito user pool creation
   - Parameter Store access

## Local Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/aswanthraj2112/webapp.v1.git
cd video-app

# Install all dependencies
npm run install:all
```

### 2. Environment Configuration

#### Client Environment (.env for client)
Create `client/.env`:
```env
VITE_API_URL=http://localhost:8080
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=your_user_pool_id
VITE_COGNITO_USER_POOL_CLIENT_ID=your_client_id
```

#### Server Environment (.env for server)
Create `server/.env`:
```env
NODE_ENV=development
PORT=8080
JWT_SECRET=your_jwt_secret

# AWS Configuration
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-video-bucket
DYNAMODB_TABLE_NAME=video-metadata

# Cognito Configuration
COGNITO_USER_POOL_ID=your_user_pool_id
COGNITO_CLIENT_ID=your_client_id

# Database (for local development)
DATABASE_TYPE=sqlite
SQLITE_PATH=./data.sqlite
```

### 3. AWS Services Setup

#### DynamoDB Table
```bash
# Create DynamoDB table
cd infra/scripts
node create-dynamodb-table.js
```

#### S3 Bucket
```bash
# Create S3 bucket (via AWS CLI)
aws s3 mb s3://your-video-bucket --region us-east-1

# Set bucket policy for public read access to videos
aws s3api put-bucket-policy --bucket your-video-bucket --policy file://bucket-policy.json
```

#### Cognito User Pool
1. Go to AWS Console → Cognito
2. Create a new User Pool
3. Configure authentication settings
4. Note down User Pool ID and Client ID
5. Update environment variables

### 4. Database Initialization

```bash
# Initialize local database
npm run setup
```

### 5. Start Development

```bash
# Start both client and server
npm run dev

# Or start individually
npm --prefix client run dev    # Client on http://localhost:5173
npm --prefix server run dev    # Server on http://localhost:8080
```

## Production Deployment

### Docker Deployment

#### 1. Build Images
```bash
# Build client image
cd client
docker build -t video-app-client .

# Build server image
cd ../server
docker build -t video-app-server .
```

#### 2. Docker Compose
```bash
# Start with docker-compose
docker-compose up -d
```

### AWS Deployment

#### 1. Elastic Container Service (ECS)
- Create ECS cluster
- Define task definitions for client and server
- Set up load balancer
- Configure auto-scaling

#### 2. Lambda + API Gateway (Alternative)
- Deploy server as Lambda functions
- Use API Gateway for routing
- Serve client from S3 + CloudFront

## Configuration Management

### Environment Variables

#### Development
- Use `.env` files (not committed to git)
- Local SQLite database
- Local file storage for testing

#### Production
- Use AWS Parameter Store
- DynamoDB for production data
- S3 for file storage

### Security Configuration

#### CORS Setup
Update server CORS configuration for your domain:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'],
  credentials: true
}));
```

#### JWT Configuration
- Use strong, random JWT secrets
- Set appropriate expiration times
- Implement refresh token mechanism

## Testing

### Unit Tests
```bash
# Run client tests
npm --prefix client run test

# Run server tests
npm --prefix server run test
```

### Integration Tests
```bash
# Run smoke tests
cd infra/scripts
node smoke-test-dynamo.js
```

### End-to-End Tests
```bash
# Run e2e tests (if configured)
npm run test:e2e
```

## Monitoring Setup

### Application Logs
- Configure structured logging
- Set up log rotation
- Integrate with CloudWatch (production)

### Health Checks
```bash
# Check application health
npm run health
```

### Performance Monitoring
- Set up APM tools (New Relic, DataDog)
- Configure AWS X-Ray for distributed tracing
- Monitor key metrics (response time, error rate)

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process on port
lsof -ti:8080 | xargs kill -9
```

#### 2. Database Connection Issues
- Verify AWS credentials
- Check DynamoDB table exists
- Validate region configuration

#### 3. File Upload Issues
- Check S3 bucket permissions
- Verify CORS configuration
- Check file size limits

#### 4. Authentication Issues
- Verify Cognito configuration
- Check JWT secret configuration
- Validate token expiration

### Debug Mode
```bash
# Start server in debug mode
DEBUG=* npm --prefix server run dev

# Enable verbose logging
NODE_ENV=development LOG_LEVEL=debug npm start
```

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and rotate secrets quarterly
- Monitor AWS costs
- Backup critical data

### Database Maintenance
- Monitor DynamoDB capacity
- Review and optimize queries
- Clean up old video metadata

### Security Updates
- Keep Node.js updated
- Update npm dependencies
- Review AWS IAM policies
- Monitor security advisories

## Getting Help

### Documentation
- [AWS Documentation](https://docs.aws.amazon.com/)
- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)

### Support
- Check GitHub Issues
- AWS Support (if you have a support plan)
- Community forums and Stack Overflow