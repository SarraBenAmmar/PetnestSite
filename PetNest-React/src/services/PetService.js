import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1'; // Replace with your environment variable if needed

class PetService {
    // Helper to include token if available
    getAuthHeader() {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    addPet(pet) {
        const headers = { ...this.getAuthHeader() };
        return axios.post(`${API_BASE_URL}/addPet`, pet, { headers });
    }
    editPet(id, pet) {
        const headers = { ...this.getAuthHeader() };
        return axios.put(`${API_BASE_URL}/editPet/${id}`, pet, { headers });
    }

    getPets() {
        // Public method - no token required
        return axios.get(`${API_BASE_URL}/getAllPets`);
    }

    getPetsByCategory(category) {
        // Public method - no token required
        return axios.get(`${API_BASE_URL}/getPetsByCategory?category=${category}`);
    }

    getPetsByOwner() {
        const headers = { ...this.getAuthHeader() };
        return axios.get(`${API_BASE_URL}/getPetsByOwner`, { headers });
    }
    getPetsByLocation(location) {
        return axios.get(`${API_BASE_URL}/getPetsByLocation?location=${location}`);
    }

    getPetsByBreed(breed) {
        return axios.get(`${API_BASE_URL}/getPetsByBreed?breed=${breed}`);
    }

    getPetsByGender(gender) {
        return axios.get(`${API_BASE_URL}/getPetsByGender?gender=${gender}`);
    }

    getPetsByColor(color) {
        return axios.get(`${API_BASE_URL}/getPetsByColor?color=${color}`);
    }


    deletePetById(id) {
        const headers = { ...this.getAuthHeader() };
        return axios.delete(`${API_BASE_URL}/deletePet/${id}`, { headers });
    }

    getPetById(id) {
        // Public method - no token required
        return axios.get(`${API_BASE_URL}/getpetById/${id}`);
    }

    getFavoritePets() {
        const headers = { ...this.getAuthHeader() };
        return axios.get(`${API_BASE_URL}/getFavPets`, { headers });
    }

    addPetToFavorites(id) {
        const headers = { ...this.getAuthHeader() };
        return axios.post(`${API_BASE_URL}/addPetToFav/${id}`, null, { headers });
    }
}

export default new PetService();
