import axios from './axios.js';

export const registerRequest = user => axios.post(`/register`, user);

export const loginRequest = user => axios.post(`/login`, user, { withCredentials: true })

export const verifyTokenRequest = user => axios.get(`/verify`, user)

export const logoutRequest = user => axios.post("/logout", user)

// Funciones para manejar la historia clínica
export const upClinicalHRequest = data => axios.post(`/clinical-history`, data);
export const downClinicalHRequest = () => axios.get(`/clinical-history`);
export const updateClinicalHRequest = data => axios.patch(`/clinical-history`, data);