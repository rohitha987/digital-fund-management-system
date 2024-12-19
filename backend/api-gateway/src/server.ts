import express, { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authenticateJWT, authorizeRole } from './middleware/authMiddleware';
import { UserRole } from './models/User';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:3005',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.options('*', cors());

//app.use('/api/auth', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use("/api/auth", createProxyMiddleware({
    target: "http://localhost:3001/api/auth",
    changeOrigin: true
}));

app.use(
    '/api/users',
    authenticateJWT,
    authorizeRole([UserRole.PARTICIPANT, UserRole.ORGANIZER, UserRole.ADMIN]),
    createProxyMiddleware({ target: 'http://localhost:3002/api/users', changeOrigin: true })
);

// app.use(
//     '/api/users/all',
//     authenticateJWT,
//     authorizeRole([UserRole.PARTICIPANT]),
//     createProxyMiddleware({ target: 'http://localhost:3002/api/users/all', changeOrigin: true })
// );
// app.use('/api/groups/all', createProxyMiddleware({
//     target: 'http://localhost:3003/api/groups/all',
//     changeOrigin: true
// }));

app.use(
    '/api/groups',
    (req, res, next) => {
        if (req.path === '/all' || req.path === '/calculateChit') {
            return next(); // Skip security middleware for '/api/groups/all'
        }

        // Apply authentication and authorization for other routes
        authenticateJWT(req, res, () => {
            authorizeRole([UserRole.PARTICIPANT, UserRole.ORGANIZER, UserRole.ADMIN])(req, res, next);
        });
    },
    createProxyMiddleware({ target: 'http://localhost:3003/api/groups', changeOrigin: true })
);

app.use(
    '/api/transactions',
    authenticateJWT,
    authorizeRole([UserRole.PARTICIPANT, UserRole.ORGANIZER, UserRole.ADMIN]),
    createProxyMiddleware({ target: 'http://localhost:3004/api/transactions', changeOrigin: true })
);

// Error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
});

app.listen(port, () => {
    console.log(`API Gateway is running on port ${port}`);
});
