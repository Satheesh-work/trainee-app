const axios = require('axios');

const apiService = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com', 
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiService.interceptors.request.use(
    (config) => {
        // You can add auth if needed later
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiService.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Handle errors globally
        console.error('API Error:', error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);

module.exports = apiService;
