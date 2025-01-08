const API_URL = 'http://localhost:8080/api/v1';


export const fetchAllUsers = async (token) => {
    const response = await fetch(`${API_URL}/getAllUsers`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    return await response.json();
};
// Fetch a user by their ID (new function added)
export const fetchUserById = async (id) => {
    const response = await fetch(`${API_URL}/getUserById/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }

    return await response.json();
};
export const addUser = async (userData, token) => {
    const response = await fetch(`${API_URL}/addUser`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    // Vérifiez si la réponse est au format JSON
    const contentType = response.headers.get("content-type");
    if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to add user: ${errorDetails}`);
    }

    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    } else {
        // Gérer le cas où la réponse n'est pas JSON
        throw new Error('Response was not JSON');
    }
};

export const promoteUser = async (email, token) => {
    const response = await fetch(`${API_URL}/promoteUser/${email}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to promote user');
    }

    return await response.json();
};

 // Adjust the base URL as needed
 
 export const editUser = async (id, userData, token) => {
    console.log('Edit User API called with:', id, userData);
    
    const response = await fetch(`${API_URL}/editUser/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Edit user failed:', response.status, errorDetails);
        throw new Error('Failed to edit user');
    }

    return await response.json();
};
            
export const deleteUser = async (id, token) => {
    const response = await fetch(`${API_URL}/deleteUser/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete user');
    }

    return await response.json(); // This could return a success message, if applicable
};
