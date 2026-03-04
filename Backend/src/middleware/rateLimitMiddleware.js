import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    message: "Too many request try again later"
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 100,
    max: 600,
    message: "Too many login attempts ,try again after 15 minutes.",
});