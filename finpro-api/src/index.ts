import dotenv from 'dotenv';
dotenv.config();

import App from './app';

const app = new App();

// For Vercel serverless
export default app.getApp();

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.start();
}
