import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://medicheck.website/auth',
    withCredentials: true // Permitir el envío de cookies
});

export default instance;
