import dotenv from 'dotenv';
import App from './app';

const app = new App();
app.start();
dotenv.config();

// Export the Express app for Vercel
export default app.getApp();
