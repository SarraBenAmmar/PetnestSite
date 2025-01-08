import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

const getAuthToken = () => {
    return localStorage.getItem('token'); // Adjust this based on where you store your token
};

const FavService = {
    // Add pet to favorites
    addPetToFav: (petId) => {
        const token = getAuthToken();

        if (!token) {
            console.error("No token found in localStorage");
            return Promise.reject('No token found');
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };

        return axios.get(`${BASE_URL}/addPetToFav/${petId}`, config)
            .then((response) => {
                console.log('Pet added to favorites successfully:', response.data);
                return response.data;
            })
            .catch((error) => {
                console.error('Error adding pet to favorites:', error.response || error.message);
                return Promise.reject('Failed to add pet to favorites');
            });
    },

    // Get favorite pets
    getFavPets: () => {
        const token = getAuthToken();

        if (!token) {
            console.error("No token found in localStorage");
            return Promise.reject('No token found');
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };

        return axios.get(`${BASE_URL}/getFavPets`, config)
            .then((response) => {
                console.log('Fetched favorite pets successfully:', response.data);
                return response.data;
            })
            .catch((error) => {
                console.error('Error fetching favorite pets:', error.response || error.message);
                return Promise.reject('Failed to fetch favorite pets');
            });
    },

    // Remove pet from favorites
    removePetFromFav: (petId) => {
        const token = getAuthToken();

        if (!token) {
            console.error("No token found in localStorage");
            return Promise.reject('No token found');
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };

        return axios.get(`${BASE_URL}/removePetFromFav/${petId}`, config)
            .then((response) => {
                console.log('Pet removed from favorites successfully:', response.data);
                return response.data;
            })
            .catch((error) => {
                console.error('Error removing pet from favorites:', error.response || error.message);
                return Promise.reject('Failed to remove pet from favorites');
            });
    },
};

export default FavService;
