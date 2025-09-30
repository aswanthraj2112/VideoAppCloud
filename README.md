# Video App

A full-stack video management application with React frontend and Express backend, featuring AWS cloud integration for authentication, storage, and database services.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm run install:all
   ```

2. **Setup environment**
   ```bash
   npm run setup
   ```

3. **Start development**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
video-app/
├── client/                 # React frontend
│   ├── public/             # Static assets
│   └── src/
│       ├── api/            # API helpers
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page-level screens
│       ├── styles/         # CSS/Tailwind
│       ├── App.jsx
│       └── main.jsx
├── server/                 # Node/Express backend
│   ├── src/
│   │   ├── auth/           # Authentication logic
│   │   ├── videos/         # Video features
│   │   ├── utils/          # Shared helpers
│   │   ├── config/         # Cloud configs
│   │   └── index.js        # Server entry
│   └── tests/              # Integration tests
├── infra/                  # Deployment & AWS setup
│   └── scripts/            # CLI helpers
├── docs/                   # Documentation
└── package.json            # Root scripts
```

## 🛠️ Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build client for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run setup` - Initial setup including database
- `npm run clean` - Clean node_modules and build artifacts

## 🔧 Technology Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **AWS Amplify** - Cognito authentication

### Backend
- **Node.js/Express** - Server framework
- **AWS SDK** - Cloud services integration
- **JWT** - Token authentication

### Cloud Services
- **AWS Cognito** - User authentication
- **AWS S3** - Video storage
- **AWS DynamoDB** - Database
- **AWS Parameter Store** - Configuration management

## 📖 Documentation

See the `docs/` folder for detailed documentation:
- [Architecture](docs/ARCHITECTURE.md)
- [Setup Guide](docs/SETUP.md)

## 🚀 Deployment

The application is containerized and can be deployed using Docker or AWS services.

## 📝 License

MIT License - see LICENSE file for details.