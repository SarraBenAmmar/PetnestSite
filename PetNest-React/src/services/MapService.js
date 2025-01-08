import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Base URL for the backend

const MapService = {
    getGeolocation: async (location) => {
        try {
            const response = await axios.get(`${API_URL}/showMap`, {
                params: { location },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching geolocation:', error);
            throw error;
        }
    },
};

export default MapService;
