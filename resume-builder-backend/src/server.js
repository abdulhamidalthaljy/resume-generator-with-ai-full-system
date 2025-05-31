// src/server.js
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const app = require('./app'); // Your Express app

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});