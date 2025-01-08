// src/services/CatService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/cats';

export const fetchBreeds = async () => {
    const response = await axios.get(`${API_URL}/breeds`);
    return response.data;
};

export const fetchCatByBreed = async (breedId) => {
    const response = await axios.get(`${API_URL}/breed/${breedId}`);
    return response.data;
};

export const fetchRandomCatImage = async () => {
    const response = await axios.get(`${API_URL}/random`);
    return response.data;
};
