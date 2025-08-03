# Resume Builder - Professional Resume Creation Platform

A modern, full-stack web application for creating professional resumes with AI-powered content generation and multiple professional templates.

🌐 **Live Demo**: [https://resume-generator-with-ai-full-syste.vercel.app](https://resume-generator-with-ai-full-syste.vercel.app)

## 🚀 Features

- **Multi-Template System**: 4 professional resume templates (Classic, Modern, Minimal, Executive)
- **Real-Time Live Preview**: Side-by-side editing with instant visual feedback
- **AI Content Generation**: Google Gemini AI integration for intelligent content creation
- **Real-Time Collaboration**: Socket.io-powered live notifications and activity feed
- **PDF Export**: Browser-based PDF generation with "Save as PDF" functionality
- **Auto-Save Functionality**: Automatic saving with visual indicators
- **Google OAuth Authentication**: Secure login with Google accounts using JWT tokens
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Production Deployment**: Frontend on Vercel, Backend on Railway

## 🏗️ Technology Stack

### Frontend

- **Angular 17** (Standalone Components)
- **TypeScript**
- **Tailwind CSS**
- **Socket.io Client**
- **RxJS Observables**

### Backend

- **Node.js & Express.js**
- **MongoDB with Mongoose**
- **Socket.io Server**
- **Passport.js (Google OAuth2 with JWT)**
- **JWT Authentication** for cross-origin requests
- **Deployed on Railway**

### AI Integration

- **Google Gemini 2.0 Flash API**
- **Intelligent content generation**
- **Context-aware prompts**

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Angular CLI** (v17 or higher)
- **MongoDB Atlas Account** or local MongoDB instance
- **Google Cloud Console Account** (for OAuth and Gemini API)

### Install Angular CLI globally:

```bash
npm install -g @angular/cli
```

## ⚙️ Environment Setup

### 1. Google Cloud Console Setup

#### OAuth2 Configuration:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type as "Web application"
6. Add authorized redirect URIs:
   - For local development: `http://localhost:5050/api/auth/google/callback`
   - For production: `https://resume-generator-with-ai-full-system-production-2a76.up.railway.app/api/auth/google/callback`

#### Gemini AI API:

1. In the same Google Cloud Console project
2. Enable "Generative Language API"
3. Create an API key for Gemini API

### 2. MongoDB Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Whitelist your IP address

### 3. Backend Environment Variables

Create `.env` file in `resume-builder-backend` directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume_builder?retryWrites=true&w=majority&appName=YourAppName

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Session Secret & JWT
SESSION_SECRET=your_random_session_secret_key
JWT_SECRET=your_jwt_secret_key_for_production

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Server Configuration
PORT=5050
NODE_ENV=development

# Production URLs (for Railway deployment)
CLIENT_URL=https://resume-generator-with-ai-full-syste.vercel.app
API_URL=https://resume-generator-with-ai-full-system-production-2a76.up.railway.app
```

### 4. Frontend Environment Variables

Update `resume-builder-angular/src/environments/environment.ts`:

```typescript
// Detect if running in production based on hostname
const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname.includes('vercel.app') || 
   window.location.hostname.includes('netlify.app') ||
   window.location.hostname !== 'localhost');

export const environment = {
  production: isProduction,
  apiUrl: isProduction
    ? 'https://resume-generator-with-ai-full-system-production-2a76.up.railway.app/api'
    : 'http://localhost:5050/api',
};
```

## 🚀 Installation & Running

### Option 1: Use the Live Production App

Visit the live application at: [https://resume-generator-with-ai-full-syste.vercel.app](https://resume-generator-with-ai-full-syste.vercel.app)

- Frontend hosted on **Vercel**
- Backend API hosted on **Railway**
- Database on **MongoDB Atlas**

### Option 2: Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/abdulhamidalthaljy/resume-generator-with-ai-full-system
cd resume-generator-with-ai-full-system
```

### 2. Install Backend Dependencies

```bash
cd resume-builder-backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../resume-builder-angular
npm install
```

### 4. Start the Backend Server

```bash
cd ../resume-builder-backend
npm start
```

The backend server will start on `http://localhost:5050`

### 5. Start the Frontend Development Server

```bash
cd ../resume-builder-angular
ng serve --port 4201
```

The frontend application will be available at `http://localhost:4201`

## 🔧 Quick Start Commands

For convenience, you can use these commands from the project root:

### Start Backend:

```bash
cd resume-builder-backend && npm start
```

### Start Frontend:

```bash
cd resume-builder-angular && ng serve --port 4201
```

### Or use the provided run commands from `run.txt`:

```bash
# Backend
cd "resume-builder-backend" && npm start

# Frontend
cd resume-builder-angular && ng serve --port 4201
```

## 📁 Project Structure

```
my_project/
├── resume-builder-angular/          # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/          # UI Components
│   │   │   │   ├── dashboard/       # Main dashboard
│   │   │   │   ├── resume-builder/  # Form builder
│   │   │   │   ├── resume-preview/  # Live preview
│   │   │   │   ├── templates/       # Resume templates
│   │   │   │   └── notifications/   # Real-time notifications
│   │   │   ├── services/            # Angular services
│   │   │   │   ├── resume.service.ts
│   │   │   │   ├── ai.service.ts
│   │   │   │   ├── socket.service.ts
│   │   │   │   └── template.service.ts
│   │   │   ├── models/              # TypeScript interfaces
│   │   │   └── guards/              # Route guards
│   │   ├── assets/                  # Static assets
│   │   │   └── templates/           # Template preview images
│   │   └── environments/            # Environment configs
│   ├── tailwind.config.js          # Tailwind CSS config
│   └── angular.json                # Angular configuration
├── resume-builder-backend/          # Node.js Backend
│   ├── src/
│   │   ├── controllers/             # API controllers
│   │   │   └── resumeController.js
│   │   ├── models/                  # MongoDB models
│   │   │   ├── Resume.js
│   │   │   └── User.js
│   │   ├── routes/                  # API routes
│   │   │   ├── resumeRoutes.js
│   │   │   └── authRoutes.js
│   │   ├── config/                  # Configuration
│   │   │   └── passport.js
│   │   └── index.js                # Main server file
│   ├── .env                        # Environment variables
│   └── package.json                # Dependencies
├── README.md                       # This file
└── run.txt                         # Quick start commands
```

## 🎯 Using the Application

### 1. Authentication

- Navigate to [https://resume-generator-with-ai-full-syste.vercel.app](https://resume-generator-with-ai-full-syste.vercel.app) or `http://localhost:4201`
- Click "Login with Google"
- Complete Google OAuth flow
- JWT token is automatically stored and managed

### 2. Creating a Resume

- From dashboard, click "Create New Resume"
- Select a professional template
- Fill in your information using the form
- Use AI generation for intelligent content creation
- Preview your resume in real-time
- Save your resume (auto-saved to database)
- Use "Save as PDF" to download

### 3. Real-Time Features

- See live notifications when other users create/edit resumes
- View activity feed on dashboard
- Real-time user count display

## 🌐 Deployment Architecture

### Production Environment:

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Railway
- **Database**: MongoDB Atlas
- **Authentication**: JWT-based for cross-origin compatibility
- **PDF Generation**: Browser-based (window.print)

### Key Production Features:

- Cross-origin authentication with JWT tokens
- Environment-aware API URL configuration
- Auto-scaling on Railway and Vercel
- Global CDN distribution via Vercel

## 📝 API Endpoints

### Base URLs:
- **Local**: `http://localhost:5050/api`
- **Production**: `https://resume-generator-with-ai-full-system-production-2a76.up.railway.app/api`

### Authentication:

- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/status` - Check auth status (JWT)
- `GET /api/auth/logout` - Logout user

### Resumes:

- `GET /api/resumes` - Get all user resumes
- `GET /api/resumes/:id` - Get specific resume
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### Socket.io Events:

- `resume:created` - New resume created
- `resume:updated` - Resume updated
- `resume:deleted` - Resume deleted
- `user:connected` - User connected
- `user:disconnected` - User disconnected

## 🎨 Features Deep Dive

### Real-Time Collaboration

- **Socket.io Integration**: Live notifications across all connected clients
- **Activity Feed**: Real-time dashboard showing user activities
- **Live User Count**: See how many users are currently online
- **Broadcast Events**: CRUD operations notify all users instantly
- **Cross-Platform Compatibility**: Works across different deployment platforms

### AI-Powered Content Generation

- **Google Gemini Integration**: Uses Gemini 2.0 Flash for intelligent content
- **Context-Aware Prompts**: Tailored prompts for each resume section
- **Multiple Generation Types**: Personal details, summaries, work experience, education, languages
- **Structured Output**: Returns properly formatted JSON for seamless integration

### Live Preview System

- **Real-Time Updates**: See changes instantly as you type
- **Template Switching**: Change templates without losing data
- **Responsive Design**: Preview adapts to different screen sizes
- **Print Optimization**: Preview shows exactly how PDF will look

### PDF Export System

- **Browser-Based Generation**: Uses browser's native print-to-PDF functionality
- **No Server Dependencies**: Reduces server load and complexity
- **High-Quality Output**: Professional PDF formatting
- **Instant Download**: No server processing delays

### Professional Templates

- **Classic Template**: Traditional, professional layout
- **Modern Template**: Contemporary design with clean lines
- **Minimal Template**: Simple, elegant formatting
- **Executive Template**: Premium design for senior positions

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

Developed for Web Development Course - JKU Semester 4
by Abdulhamid Althalji
