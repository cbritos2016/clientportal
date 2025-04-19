require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') }); // Explicit path to .env
const express = require('express');
const cors = require('cors');
const itemsRouter = require('./routes/items');
const authRouter = require('./routes/auth');

// Log environment variables for debugging
console.log('Environment Variables:', {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_SERVER: process.env.DB_SERVER,
  DB_NAME: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT
});

const app = express();

//app.use(cors());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/api/items', itemsRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});