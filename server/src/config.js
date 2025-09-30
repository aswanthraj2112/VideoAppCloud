// Basic configuration for the video app server
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  // Server configuration
  PORT: process.env.PORT || 4000,
  HOST: process.env.HOST || '127.0.0.1',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // CORS configuration
  CLIENT_ORIGINS: process.env.CLIENT_ORIGINS ? 
    process.env.CLIENT_ORIGINS.split(',') : 
    ['http://localhost:3000', 'http://localhost:5173'],
  
  // File upload configuration
  LIMIT_FILE_SIZE_MB: parseInt(process.env.LIMIT_FILE_SIZE_MB) || 100,
  
  // Storage configuration
  USE_LOCAL_STORAGE: process.env.USE_LOCAL_STORAGE === undefined ? true : process.env.USE_LOCAL_STORAGE === 'true',
  PUBLIC_VIDEOS_DIR: process.env.PUBLIC_VIDEOS_DIR || path.join(__dirname, '../uploads/videos'),
  PUBLIC_THUMBS_DIR: process.env.PUBLIC_THUMBS_DIR || path.join(__dirname, '../uploads/thumbs'),
  
  // AWS configuration
  AWS_REGION: process.env.AWS_REGION || 'ap-southeast-2',
  S3_BUCKET: process.env.S3_BUCKET,
  DYNAMO_TABLE: process.env.DYNAMO_TABLE,
  
  // Cognito configuration (optional)
  COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-key',
  
  // Domain configuration
  DOMAIN_NAME: process.env.DOMAIN_NAME,
  
  // Initialize method for async configuration loading
  async initialize() {
    console.log('📋 Configuration initialized');
    console.log(`🌍 Environment: ${this.NODE_ENV}`);
    console.log(`🔧 Port: ${this.PORT}`);
    console.log(`💾 Local Storage: ${this.USE_LOCAL_STORAGE}`);
    console.log(`☁️  S3 Bucket: ${this.S3_BUCKET || 'Not configured'}`);
    console.log(`🗄️  DynamoDB Table: ${this.DYNAMO_TABLE || 'Not configured'}`);
    return Promise.resolve();
  }
};

export default config;