import { firebaseExchange } from './controllers/firebaseExchangeController.js';
import { verifyFirebaseToken } from './controllers/firebaseController.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration supporting credentials (cookies & Auth headers)
const developmentOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : process.env.NODE_ENV === 'production' ? [] : developmentOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin is not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Firebase-ID-Token']
  })
);

app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'auratune-backend', timestamp: new Date().toISOString() });
});

// Mount Feature 010 Auth Routes
app.use('/api/v1/auth', authRoutes);
// Firebase Authentication -> AuraTune Session
app.post(
  '/api/v1/auth/firebase/exchange',
  firebaseExchange
);
// Temporary Firebase verification endpoint for development only
if (process.env.NODE_ENV !== 'production') {
  app.post(
    '/api/v1/auth/firebase/verify-test',
    verifyFirebaseToken
  );
}
// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'not_found', message: `Route ${req.method} ${req.url} not found` });
});

app.listen(PORT, () => {
  console.log(`🚀 AuraTune Backend Server is running on http://localhost:${PORT}`);
  console.log(`🔐 Auth API base URL: http://localhost:${PORT}/api/v1/auth`);
});
