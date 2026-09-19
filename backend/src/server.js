import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import garageRoutes from './routes/garageRoutes.js';
import { supabase } from './config/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MotoMart Backend API',
    supabaseConnected: Boolean(supabase),
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', tradeRoutes);
app.use('/api', chatRoutes);
app.use('/api', garageRoutes);

// Auth sign-in demo endpoint
app.post('/api/auth/signin', (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ success: false, message: 'Email or mobile number required' });
  }
  res.json({
    success: true,
    message: 'Welcome back to MotoMart India!',
    user: {
      identifier,
      name: identifier.includes('@') ? identifier.split('@')[0] : 'Rider',
      token: `mm_token_${Date.now()}`
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 MotoMart API Server running on port ${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👉 Products: http://localhost:${PORT}/api/products`);
});

export default app;
