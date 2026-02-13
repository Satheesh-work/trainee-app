const redisClient = require('../config/redis');

const cacheMiddleware = (keyGenerator, duration = 3600) => {
    return async (req, res, next) => {
        try {
            const key = typeof keyGenerator === 'function' ? keyGenerator(req) : keyGenerator;

            const cachedData = await redisClient.get(key);

            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            } else {
                const originalSend = res.json;
                res.json = (body) => {
                    redisClient.setEx(key, duration, JSON.stringify(body));
                    originalSend.call(res, body);
                };
                next();
            }
        } catch (error) {
            console.error('Redis Cache Error:', error);
            next();
        }
    };
};

module.exports = cacheMiddleware;
