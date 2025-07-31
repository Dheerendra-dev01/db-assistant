import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';

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
const PORT = process.env.PORT || 443;

// Load SSL Certificate
const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Middleware
app.use(cors({
  origin: 'https://db-assistant-a3jh.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));
app.use(bodyParser.json());

// Routes
app.use('/api/mongo', MongoRoutes.router);  
app.use('/api/sql', SqlRoutes.router);
app.use('/api/projects', ProjectRoutes.router);
app.use('/api/templates', TemplateRoutes.router);
app.use('/api/teams', TeamRoutes.router);
app.use('/api/activities', ActivityRoutes.router);

app.get('/', (_req, res) => {
  res.send('Secure API is running...');
});

// Start HTTPS server
https.createServer(credentials, app).listen(PORT, async () => {
  console.log(`🔒 Secure server running at https://13.201.104.180:${PORT}`);
  await connectDatabase.connectDb();
});
