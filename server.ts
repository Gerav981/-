import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { trackVisit, addReview, getReviews, getVisitCount, getReviewCount } from './src/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Endpoint for tracking visits
  app.post('/api/track-visit', (req, res) => {
    try {
      // In a real-world scenario, you'd want to handle proxies.
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      if (typeof ip === 'string') {
        trackVisit(ip);
        res.status(200).json({ message: 'Visit tracked' });
      } else {
        res.status(400).json({ message: 'Could not determine IP address' });
      }
    } catch (error) {
      console.error('Error tracking visit:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });



  app.get('/api/reviews', (req, res) => {
    try {
      const reviews = getReviews();
      res.status(200).json(reviews);
    } catch (error) {
      console.error('Error getting reviews:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/reviews', (req, res) => {
    try {
      const { name, email, text } = req.body;
      if (!name || !email || !text) {
        return res.status(400).json({ message: 'Name, email, and text are required' });
      }
      addReview(name, email, text);
      res.status(201).json({ message: 'Review added' });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/stats', (req, res) => {
    try {
      const visitCount = getVisitCount();
      const reviewCount = getReviewCount();
      res.status(200).json({ visitCount, reviewCount });
    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // --- Vite Middleware for Development ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from 'dist'
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
