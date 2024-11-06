import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3001/api',
    withCredentials: true // Permitir el envío de cookies
});

export default instance;
