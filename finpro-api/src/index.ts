import App from './app';

const app = new App();
app.start();

// Export the Express app for Vercel
export default app.getApp();
