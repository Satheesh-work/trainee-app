const apiService = require('../services/apiService');
const redisClient = require('../config/redis');

exports.getTodos = async (req, res) => {
    try {
        const cacheKey = 'todos';

        // Try to fetch from Redis first
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            console.log('Fetching from Redis Cache');
            return res.status(200).json({
                source: 'cache',
                data: JSON.parse(cachedData)
            });
        }

        // If not in cache, fetch from API
        console.log('Fetching from External API');
        const todos = await apiService.get('/todos');

        // Store in Redis for 1 hour (3600 seconds)
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(todos));

        res.status(200).json({
            source: 'api',
            data: todos
        });
    } catch (error) {
        console.error('Error in getTodos:', error);
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
};
