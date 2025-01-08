import axios from 'axios';

const API_URL = 'http://localhost:8080/api/pet-requests';

class PetRequestService {

  // Helper function to get the JWT token from localStorage
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Method to request a pet
  requestPet(requestPetDTO) {
    return axios.post(`${API_URL}/request`, requestPetDTO, {
      headers: this.getAuthHeader(),
    });
  }

  // Method to update request status
  updateRequestStatus(requestId, status) {
    return axios.patch(`${API_URL}/update-status/${requestId}`, null, {
      params: { status },
      headers: this.getAuthHeader(),
    });
  }

  // Method to get all pet requests made by the current user
  getRequestsByUser() {
    return axios.get(`${API_URL}/my-requests`, {
      headers: this.getAuthHeader(),
    });
  }

  // Method to get all pet requests for a particular pet owner
  getRequestsByPetOwner() {
    return axios.get(`${API_URL}/owner-requests`, {
      headers: this.getAuthHeader(),
    });
  }
  // Method to delete a pet request by ID
  deletePetRequest(requestId) {
    return axios.delete(`${API_URL}/delete/${requestId}`, {
      headers: this.getAuthHeader(),
    });
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new PetRequestService();
