// src/services/authService.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth';

const register = async (registerRequest) => {
    const response = await axios.post(`${API_URL}/register`, registerRequest);
    return response.data;
};

const authenticate = async (authRequest) => {
    const response = await axios.post(`${API_URL}/authenticate`, authRequest);
    
    // Ensure that the response contains the expected structure
    if (response.data && response.data.accessToken && response.data.userInfo) {
        return {
            token: response.data.accessToken, // Renamed to match your Login component
            user: response.data.userInfo, // Renamed to match your Login component
        };
    } else {
        throw new Error('Invalid authentication response structure');
    }
};

const checkJwtValidity = async (token) => {
    const response = await axios.get(`${API_URL}/checkJwtValidity/${token}`);
    return response.data;
};

const getUserInformations = async (token) => {
    const response = await axios.get(`${API_URL}/getUserInformations/${token}`);
    return response.data;
};

export default {
    register,
    authenticate,
    checkJwtValidity,
    getUserInformations,
};
