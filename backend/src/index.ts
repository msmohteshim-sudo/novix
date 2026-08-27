import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import authRoutes from './routes/auth.routes';
import healthRoutes from './routes/health.routes';
import attendanceRoutes from './routes/attendance.routes';
import apiRoutes from './routes/api.routes';
import farmRoutes from './routes/farm.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/farm', farmRoutes);   // Farm/Poultry industry endpoints
app.use('/api', healthRoutes);
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`NOVAX Backend running on http://localhost:${config.port}`);
});
