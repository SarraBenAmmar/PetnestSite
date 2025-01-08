// src/services/checkJwtValidityService.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'; // Adjust base URL as per your environment

// Check JWT Validity Service
class CheckJwtValidityService {
  async checkJwtValidity(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/checkJwtValidity/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check JWT validity');
      }

      const isValid = await response.json();
      return isValid;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

const checkJwtValidityService = new CheckJwtValidityService();

export default checkJwtValidityService;
