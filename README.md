# Resume Generator with AI - Full System

A comprehensive full-stack resume builder application with AI-powered content generation, featuring an Angular frontend and Node.js backend. The application allows users to create professional resumes using multiple templates, generate content with AI assistance, and export to PDF format.

## 🌐 Live Demo

- **Frontend**: [https://resume-generator-with-ai-full-syste.vercel.app](https://resume-generator-with-ai-full-syste.vercel.app)
- **Backend API**: [https://resume-generator-with-ai-full-system-production.up.railway.app](https://resume-generator-with-ai-full-system-production.up.railway.app)

## ✨ Features

### Core Functionality

- **User Authentication**: Google OAuth integration with JWT-based session management
- **Resume Builder**: Interactive form-based resume creation with real-time preview
- **AI Integration**: Content generation and enhancement using Google Gemini AI
- **Multiple Templates**: Choose from Modern, Classic, Executive, and Minimal designs
- **PDF Export**: Generate and save resumes as PDF documents
- **Cloud Storage**: Automatic resume saving and retrieval
- **Real-time Updates**: Live preview updates as you type

### Advanced Features

- **Responsive Design**: Optimized for desktop and mobile devices
- **Activity Feed**: Track resume building progress and actions
- **Language Support**: Multi-language resume sections
- **Workshop/Certification Tracking**: Additional sections for professional development
- **Template Preview**: Visual template selection with preview images

## 🏗️ Architecture

### Frontend (Angular 20.0.0)

- **Framework**: Angular with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Angular services with RxJS
- **Authentication**: JWT token-based authentication
- **Real-time Communication**: Socket.io client integration

### Backend (Node.js/Express)

- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: Google OAuth 2.0 + JWT tokens
- **PDF Generation**: Puppeteer for server-side PDF creation
- **AI Integration**: Google Gemini API for content generation
- **Real-time Features**: Socket.io for live updates

### Deployment

- **Frontend**: Deployed on Vercel with automatic deployments
- **Backend**: Deployed on Railway with continuous integration
- **Database**: MongoDB Atlas cloud database
- **Storage**: Cloud-based file storage and retrieval

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Angular CLI** (`npm install -g @angular/cli`)
- **MongoDB Atlas** account
- **Google Cloud Console** project with OAuth credentials
- **Google AI Studio** API key for Gemini integration

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd resume-generator-with-ai-full-system
```

### 2. Backend Setup

```bash
cd resume-builder-backend
npm install
```

Create a `.env` file in the backend root:

```env
# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# AI Integration
GEMINI_API_KEY=your_gemini_api_key

# Application URLs
CLIENT_URL=http://localhost:4200
SERVER_URL=http://localhost:5000

# Session Secret (fallback)
SESSION_SECRET=your_session_secret
```

### 3. Frontend Setup

```bash
cd ../resume-builder-angular
npm install
```

Update environment configuration in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:5000",
  googleClientId: "your_google_client_id",
};
```

### 4. Run the Application

#### Start Backend Server

```bash
cd resume-builder-backend
npm start
# Server runs on http://localhost:5000
```

#### Start Frontend Development Server

```bash
cd resume-builder-angular
ng serve
# Application runs on http://localhost:4200
```

## �️ Development

### Available Scripts

#### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

#### Frontend

- `ng serve` - Start development server
- `ng build` - Build for production
- `ng test` - Run unit tests
- `ng e2e` - Run end-to-end tests

### Project Structure

```
resume-generator-with-ai-full-system/
├── resume-builder-backend/          # Node.js/Express API
│   ├── src/
│   │   ├── app.js                   # Express app configuration
│   │   ├── server.js                # Server entry point
│   │   ├── config/
│   │   │   └── passport.js          # Google OAuth configuration
│   │   ├── controllers/
│   │   │   └── resumeController.js  # Resume CRUD operations
│   │   ├── middleware/
│   │   │   └── ensureAuth.js        # Authentication middleware
│   │   ├── models/
│   │   │   └── User.js              # User/Resume data models
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication routes
│   │   │   └── resumeRoutes.js      # Resume API routes
│   │   └── utils/
│   │       └── jwt.js               # JWT utilities
│   └── package.json
│
├── resume-builder-angular/          # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/          # UI Components
│   │   │   │   ├── resume-builder/  # Main builder interface
│   │   │   │   ├── resume-preview/  # Live preview
│   │   │   │   ├── template-selector/ # Template selection
│   │   │   │   └── ...              # Other components
│   │   │   ├── services/            # Angular Services
│   │   │   │   ├── auth.service.ts  # Authentication
│   │   │   │   ├── resume.service.ts # Resume operations
│   │   │   │   ├── ai.service.ts    # AI integration
│   │   │   │   └── ...              # Other services
│   │   │   ├── models/              # TypeScript interfaces
│   │   │   └── guards/              # Route guards
│   │   └── assets/                  # Static assets
│   └── package.json
│
└── README.md                        # This file
```

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - **Build Command**: `ng build`
   - **Output Directory**: `dist/resume-builder-angular`
3. Set environment variables:
   - `NG_APP_API_URL`: Your backend URL
   - `NG_APP_GOOGLE_CLIENT_ID`: Google OAuth client ID

### Backend Deployment (Railway)

1. Connect your GitHub repository to Railway
2. Configure environment variables in Railway dashboard:
   - All variables from your local `.env` file
   - Update `CLIENT_URL` to your Vercel deployment URL
3. Railway will automatically deploy on git pushes

### Environment Variables

#### Production Environment Variables

```env
# Backend (Railway)
MONGODB_URI=mongodb+srv://...
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
JWT_SECRET=your_production_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=https://your-vercel-app.vercel.app
SERVER_URL=https://your-railway-app.railway.app

# Frontend (Vercel)
NG_APP_API_URL=https://your-railway-app.railway.app
NG_APP_GOOGLE_CLIENT_ID=your_production_client_id
```

## 🔧 Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins:
   - `http://localhost:4200` (development)
   - `https://your-vercel-app.vercel.app` (production)
6. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback` (development)
   - `https://your-railway-app.railway.app/auth/google/callback` (production)

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist IP addresses (0.0.0.0/0 for production)
5. Get connection string and add to environment variables

### Google AI (Gemini) Setup

1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Create an API key
3. Add the API key to your environment variables

## 📱 Usage

1. **Sign In**: Use Google OAuth to authenticate
2. **Create Resume**: Fill out the resume form with your information
3. **Use AI Assistant**: Click AI buttons to generate content suggestions
4. **Choose Template**: Select from available professional templates
5. **Preview**: See real-time updates as you build your resume
6. **Save**: Your resume is automatically saved to the cloud
7. **Export PDF**: Generate and download your resume as a PDF

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **OAuth Integration**: Google OAuth for secure sign-in
- **Environment Variables**: Sensitive data stored securely
- **CORS Configuration**: Cross-origin requests properly configured
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error handling and logging

## 🛡️ API Endpoints

### Authentication

- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/logout` - User logout

### Resume Management

- `GET /api/resume` - Get user's resume
- `POST /api/resume` - Save/update resume
- `POST /api/resume/generate-pdf` - Generate PDF

### AI Features

- `POST /api/ai/generate-content` - Generate AI content

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## � Acknowledgments

- **Angular Team** for the amazing framework
- **Google** for OAuth and AI services
- **MongoDB** for cloud database services
- **Vercel** and **Railway** for hosting platforms
- **Tailwind CSS** for styling framework

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using Angular, Node.js, and AI**
