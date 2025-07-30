import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import MongoRoutes from './src/routes/mongoRoute';
import SqlRoutes from './src/routes/sqlRoutes';
import ProjectRoutes from './src/routes/projectRoutes';
import TemplateRoutes from './src/routes/templateRoutes';
import TeamRoutes from './src/routes/teamRoutes';
import ActivityRoutes from './src/routes/activityRoutes';

dotenv.config();

const app: Application = express();
let PORT = process.env.PORT || 8000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/db-assistant';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Middleware
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));
app.use(bodyParser.json());

// API routes
app.use('/api/mongo', MongoRoutes.router);  
app.use('/api/sql', SqlRoutes.router);
app.use('/api/projects', ProjectRoutes.router);
app.use('/api/templates', TemplateRoutes.router);
app.use('/api/teams', TeamRoutes.router);
app.use('/api/activities', ActivityRoutes.router);

// Root route
app.get('/', (_req, res) => {
  res.send('API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
