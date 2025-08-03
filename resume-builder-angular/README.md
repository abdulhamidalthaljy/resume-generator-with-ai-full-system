# Resume Builder Frontend

A modern web application built with Angular that allows users to create, edit, and manage professional resumes.

## 🚀 Vercel Deployment Settings

### Build Settings

- **Build Command**: `npm run build:prod`
- **Output Directory**: `dist/resume-builder-angular`
- **Install Command**: `npm install`

### Environment Variables (Add in Vercel Dashboard)

```
NODE_ENV=production
```

### Important Notes

- The project uses Angular 20.0.0
- Node.js 18+ is required
- All unnecessary dependencies have been removed for compatibility

### Post-Deployment

1. Get your Vercel URL (e.g., `https://your-app-name.vercel.app`)
2. Update `src/environments/environment.prod.ts` with your Railway backend URL
3. Commit and push to trigger a rebuild

## Features

- Interactive resume form with real-time preview
- Support for multiple sections (Personal Details, Work Experience, Education, etc.)
- Image upload for profile picture
- Dynamic form fields with add/remove functionality
- Automatic data saving and loading
- Modern and responsive UI with Tailwind CSS

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI

## Installation

1. Clone the repository:

```bash
git clone <https://github.com/abdulhamidalthaljy/resume-generator-with-ai-full-system.git>
cd resume-builder-angular
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4201`

## Development

- Run `ng serve` for a dev server
- Run `ng build:prod` to build for production
- Run `ng test` to execute unit tests

## Project Structure

- `src/app/components/` - Contains all Angular components
- `src/app/services/` - Contains services for API communication
- `src/app/models/` - Contains TypeScript interfaces and models
- `src/assets/` - Contains static assets
