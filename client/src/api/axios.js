import axios from 'axios';

// 1. Create the base Axios instance
const api = axios.create({
    baseURL: 'https://ai-job-portal-eexb.onrender.com/api', 
    withCredentials: true 
});

// 2. The Request Interceptor
// This runs automatically before EVERY request and attaches your security token
api.interceptors.request.use(
    (config) => {
        // Look in local storage for the standalone token we saved
        let activeToken = localStorage.getItem('token');

        // Fallback: If it's not a standalone token, check inside the user object
        if (!activeToken) {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                activeToken = user.token; 
            }
        }

        // If we found a token, inject it into the headers
        if (activeToken) {
            config.headers.Authorization = `Bearer ${activeToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;