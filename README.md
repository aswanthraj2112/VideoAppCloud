# VideoAppCloud

A modern, cloud-native video upload and streaming application built with React and Express.js, featuring AWS integration for scalable video storage and processing.

## 🚀 Features

- **Video Upload & Management**: Upload videos with drag-and-drop interface
- **Cloud Storage**: AWS S3 integration for reliable video storage
- **Thumbnail Generation**: Automatic thumbnail creation using FFmpeg
- **User Authentication**: JWT-based auth with AWS Cognito integration
- **Real-time Streaming**: Video playback with responsive controls
- **Responsive Design**: Mobile-first UI that works across all devices
- **Progress Tracking**: Real-time upload progress with status updates

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React Client  │◄──►│  Express API    │◄──►│  AWS Services   │
│   (Port 5173)   │    │   (Port 4000)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
   ┌────▼────┐              ┌────▼────┐              ┌────▼────┐
   │ Vite    │              │ Node.js │              │ Cognito │
   │ React   │              │ Express │              │ S3      │
   │ Router  │              │ Multer  │              │ DynamoDB│
   └─────────┘              │ JWT     │              │ Secrets │
                           └─────────┘              │ Manager │
                                                    └─────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **Vite 7.1.7** - Build tool and dev server
- **JavaScript (ES6+)** - Programming language
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.19.2** - Web framework
- **Multer** - File upload middleware
- **FFmpeg** - Video processing
- **JWT** - Authentication tokens

### Cloud Services (AWS)
- **S3** - Video and thumbnail storage
- **Cognito** - User authentication
- **Secrets Manager** - Secure credential storage
- **Parameter Store** - Configuration management
- **DynamoDB** - Metadata storage (optional)

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Git**
- **AWS Account** with appropriate permissions
- **FFmpeg** (for video processing)

### AWS Services Setup
Ensure you have access to:
- S3 bucket creation and management
- AWS Cognito user pools
- AWS Secrets Manager
- AWS Systems Manager Parameter Store
- DynamoDB (optional)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/aswanthraj2112/VideoAppCloud.git
cd VideoAppCloud
```

### 2. Install Dependencies
```bash
# Install all dependencies for both client and server
npm run install:all
```

### 3. Environment Configuration

#### Server Configuration
Create `server/.env`:
```env
NODE_ENV=development
PORT=4000
HOST=127.0.0.1

# AWS Configuration
AWS_REGION=us-east-1
USE_LOCAL_STORAGE=true

# Client Origins for CORS
CLIENT_ORIGINS=http://localhost:5173,http://localhost:3000

# File Upload Limits
LIMIT_FILE_SIZE_MB=100
```

#### Client Configuration (Optional)
Create `client/.env`:
```env
VITE_API_URL=http://localhost:4000
```

### 4. AWS Setup (Production)
```bash
# Run the server setup script to configure AWS resources
npm run setup
```

### 5. Start Development Servers
```bash
# Start both client and server concurrently
npm run dev

# Or start them separately:
npm run dev:server  # Backend on http://localhost:4000
npm run dev:client  # Frontend on http://localhost:5173
```

### 6. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000

## 📁 Project Structure

```
VideoAppCloud/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── NavBar.jsx
│   │   │   ├── Uploader.jsx
│   │   │   ├── VideoList.jsx
│   │   │   └── VideoPlayer.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   └── Login.jsx
│   │   ├── api/           # API client functions
│   │   │   ├── auth.js
│   │   │   └── videos.js
│   │   ├── styles/        # CSS styles
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js     # Vite configuration
├── server/                # Express backend application
│   ├── src/
│   │   ├── auth/          # Authentication modules
│   │   ├── config/        # AWS service configurations
│   │   ├── utils/         # Utility functions
│   │   ├── videos/        # Video management modules
│   │   ├── config.js      # App configuration
│   │   └── index.js       # Server entry point
│   ├── scripts/           # Setup and utility scripts
│   ├── tests/             # Test files
│   ├── uploads/           # Local file storage (dev only)
│   └── package.json
├── infra/                 # Infrastructure as code
│   ├── cloudformation.yml # AWS CloudFormation template
│   └── scripts/           # Infrastructure scripts
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md
│   ├── SETUP.md
│   └── RESTRUCTURING_SUMMARY.md
├── package.json           # Workspace configuration
└── README.md
```

## 🔧 Available Scripts

### Root Level
```bash
npm run install:all    # Install dependencies for all workspaces
npm run dev            # Start both client and server
npm run dev:server     # Start only the backend server
npm run dev:client     # Start only the frontend client
npm run setup          # Configure AWS resources
npm run build          # Build the client for production
npm run start          # Start production server
npm run test           # Run tests in all workspaces
npm run clean          # Clean all node_modules and dist folders
```

### Client Scripts
```bash
cd client
npm run dev            # Start Vite dev server
npm run build          # Build for production
npm run preview        # Preview production build
```

### Server Scripts
```bash
cd server
npm run dev            # Start development server
npm run start          # Start production server
npm run setup          # Run AWS setup script
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Videos
- `GET /api/videos` - List all videos
- `GET /api/videos/:id` - Get specific video
- `POST /api/videos/upload` - Upload new video
- `DELETE /api/videos/:id` - Delete video
- `GET /api/videos/:id/stream` - Stream video content

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **AWS Cognito Integration**: Enterprise-grade user management
- **CORS Protection**: Configurable cross-origin resource sharing
- **File Validation**: MIME type and size validation for uploads
- **Secrets Management**: AWS Secrets Manager for sensitive data
- **Environment Isolation**: Separate configurations for dev/prod

## 🚀 Deployment

### Production Setup
1. **Configure AWS Resources**: Ensure all AWS services are properly configured
2. **Environment Variables**: Set production environment variables
3. **Build the Client**: `npm run build`
4. **Start the Server**: `npm run start`

### Environment Variables for Production
```env
NODE_ENV=production
PORT=4000
AWS_REGION=us-east-1
USE_LOCAL_STORAGE=false
CLIENT_ORIGINS=https://yourdomain.com
```

## 🔍 Monitoring & Logging

- **Morgan**: HTTP request logging in development
- **Console Logging**: Structured server logs
- **Error Handling**: Centralized error management
- **AWS CloudWatch**: Production monitoring (when deployed)

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests for specific workspace
npm run test --workspace server
npm run test --workspace client
```

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill processes on specific ports
npx kill-port 4000  # Backend
npx kill-port 5173  # Frontend
```

**AWS Configuration Issues**
- Ensure AWS credentials are properly configured
- Check AWS service permissions
- Verify AWS region settings

**File Upload Issues**
- Check file size limits (default: 100MB)
- Verify MIME type support
- Ensure storage directories exist

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aswanth Raj**
- GitHub: [@aswanthraj2112](https://github.com/aswanthraj2112)

## 🙏 Acknowledgments

- React community for the amazing framework
- AWS for providing robust cloud services
- Express.js for the lightweight server framework
- Vite for the blazing fast build tool

---

For more detailed information, check out the [documentation](./docs/) folder.