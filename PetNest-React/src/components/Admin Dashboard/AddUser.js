import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import localStorageService from '../../services/localStorageService';
import { addUser } from '../../services/userService'; // Assurez-vous d'avoir cette fonction

const AddUser = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        city: '',
        country: '',
        password: '',
        image: '',  // Image will be stored as Base64 string
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData({ ...userData, image: reader.result.split(',')[1] }); // Extract Base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorageService.getToken();

        // Ensure all required fields are filled
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            await addUser(userData, token);
            alert('User added successfully');
            navigate('/users'); // Redirect to the user list
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Add User</h2>
                <form onSubmit={handleSubmit}>
                    {Object.keys(userData).map((key) => {
                        if (key !== 'image') {  // Skip the image field from the default loop
                            return (
                                <div className="mb-4" key={key}>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={key}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </label>
                                    <input
                                        type={key === 'password' ? 'password' : 'text'}
                                        name={key}
                                        value={userData[key]}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>
                            );
                        }
                        return null;
                    })}
                    
                    {/* Image Upload Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                            Image
                        </label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                        Add User
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
