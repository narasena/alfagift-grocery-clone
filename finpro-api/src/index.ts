import dotenv from 'dotenv';
dotenv.config();

import App from './app';

const app = new App();

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.start();
}

// For Vercel serverless - export the Express app
module.exports = app.getApp();
export default app.getApp();
