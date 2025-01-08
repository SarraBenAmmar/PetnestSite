// src/services/DogService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/dogs'; // Adjust the base URL as necessary

export const fetchDogBreeds = async () => {
    const response = await axios.get(`${API_URL}/breeds`);
    return response.data; // Adjust based on your API response structure
};

export const fetchDogByBreed = async (breed) => {
    const response = await axios.get(`${API_URL}/breed/${breed}/image`);
    return response.data; // Adjust based on your API response structure
};

export const fetchRandomDogImage = async () => {
    const response = await axios.get(`${API_URL}/random`);
    return response.data; // Adjust based on your API response structure
};
