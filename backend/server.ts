import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDatabase from "./src/db/connect";
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

// Middleware
app.use(cors({
  origin: 'https://db-assistant-a3jh.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

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
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  await connectDatabase.connectDb();

});