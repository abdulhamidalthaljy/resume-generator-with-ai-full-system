# Resume Builder Backend

A Node.js/Express backend service that handles data management for the Resume Builder application.

## Features

- RESTful API endpoints for resume CRUD operations
- CORS enabled for frontend communication
- Error handling middleware
- Support for large file uploads
- Structured project architecture

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd resume-builder-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file in the root directory and add your environment variables:

```env
PORT=3000
NODE_ENV=development
```

4. Start the server:

```bash
npm start
```

The server will start on http://localhost:3000

## API Endpoints

### Resumes

- `GET /api/resumes` - Get all resumes
- `GET /api/resumes/:id` - Get a specific resume
- `POST /api/resumes` - Create a new resume
- `PUT /api/resumes/:id` - Update a resume
- `DELETE /api/resumes/:id` - Delete a resume

## Project Structure

- `src/routes/` - API route definitions
- `src/controllers/` - Request handlers
- `src/models/` - Data models
- `src/services/` - Business logic
- `src/middleware/` - Custom middleware

## Development

To start the server in development mode with hot reload:

```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
