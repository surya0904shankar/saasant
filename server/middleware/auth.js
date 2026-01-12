const { auth } = require('express-oauth2-jwt-bearer');

// Auth0 JWT verification middleware
const verifyAuth0Token = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
    tokenSigningAlg: 'RS256',
});

// Middleware to extract user info from validated token
const extractUser = (req, res, next) => {
    console.log('Auth successful for user:', req.auth?.payload?.sub);
    if (req.auth) {
        req.user = {
            userId: req.auth.payload.sub,
            email: req.auth.payload.email || req.auth.payload.sub,
        };
    }
    next();
};

// Debug middleware to log incoming request auth header
const logAuthHeader = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log('Incoming Authorization Header:', authHeader.substring(0, 30) + '...');
        if (token && !token.startsWith('ey')) {
            console.warn('⚠️ WARNING: Token does not look like a JWT (should start with "ey"). This is likely an opaque token due to incorrect audience.');
        }
    } else {
        console.log('No Authorization header found in request');
    }
    next();
};

// Combined middleware
const verifyToken = [
    logAuthHeader,
    (req, res, next) => {
        verifyAuth0Token(req, res, (err) => {
            if (err) {
                console.error('Auth verification failed:', err.message);
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: err.message,
                    hint: 'Check if your VITE_AUTH0_AUDIENCE matches the API Identifier in Auth0'
                });
            }
            next();
        });
    },
    extractUser
];

module.exports = { verifyToken };
