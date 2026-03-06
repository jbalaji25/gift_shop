import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import serverless from 'serverless-http';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
const router = express.Router();
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to Wudden Interior Gift Shop API' });
});

router.get('/health', (req, res) => {
    res.json({ status: 'OK', uptime: process.uptime() });
});

// Use router with prefix
app.use('/.netlify/functions/api', router);

// Locally start the server if called directly
if (process.env.NODE_ENV !== 'production' && !process.env.NETLIFY) {
    const port = process.env.PORT || 5001;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

// Export the serverless handler
export const handler = serverless(app);
