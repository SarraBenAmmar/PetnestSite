import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editUser } from '../../services/userService';
import localStorageService from '../../services/localStorageService';

const EditUser = () => {
    const { userId } = useParams();
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        roleEnum: '',
        phoneNumber: '',
        country: '',
        address: '',
        city: '',
        image: '', // Base64 image string
        password: '', // New password field
    });
    const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserById = async (id) => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/getUserById/${id}`);
                if (response.ok) {
                    const userData = await response.json();
                    console.log('Fetched User Data:', userData); // Debugging
                    setUser(userData);
                } else {
                    console.error('Failed to fetch user:', await response.text());
                    alert('Failed to fetch user data.');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                alert('An error occurred while fetching user data.');
            }
        };

        fetchUserById(userId);
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUser((prevUser) => ({ ...prevUser, image: reader.result.split(',')[1] })); // Store Base64 without the prefix
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const confirmUpdate = window.confirm('Are you sure you want to update this user?');

        if (!confirmUpdate) {
            return; // If user cancels, do not proceed with the update
        }

        const token = localStorageService.getToken();

        if (!token) {
            alert('Authentication required.');
            return;
        }

        console.log('Submitting User Data:', user); // Debugging

        try {
            await editUser(userId, user, token);
            alert('User edited successfully');
            navigate('/users'); // Redirect to the /users page after successful update
        } catch (error) {
            console.error('Error editing user:', error);
            alert('Failed to edit user. Please check your permissions.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Edit User</h2>
                
                <div className="mb-4">
                    <label className="block text-gray-700">First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Role:</label>
                    <select
                        name="roleEnum"
                        value={user.roleEnum}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">Select Role</option>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Phone Number:</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={user.phoneNumber}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Password:</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zM2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7C4.732 7.943 8.523 5 13 5c.438 0 .872.025 1.3.072m1.364.624c1.207.686 2.255 1.742 3.041 3.104.786 1.362 1.197 2.918 1.197 4.2 0 .282-.017.562-.05.841M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" />
                                </svg>
                            )}
                        </span>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Image:</label>
                    {user.image && (
                        <div className="mb-2">
                            <img
                                src={`data:image/jpeg;base64,${user.image}`} // Adjust MIME type if necessary
                                alt="Current User"
                                className="w-24 h-24 object-cover rounded-full border border-gray-300"
                            />
                            <p className="text-gray-500 text-sm mt-1">Current profile picture</p>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg w-full hover:bg-green-600 transition duration-200"
                >
                    Edit User
                </button>
            </form>
        </div>
    );
};

export default EditUser;
