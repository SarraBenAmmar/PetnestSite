import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import localStorageService from '../../services/localStorageService';
import { editUser, fetchUserById } from '../../services/userService';

const AccountSettings = () => {
    const { id: userId } = useParams(); // Ensure userId is correctly obtained from URL
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false); // State to manage editing mode

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await fetchUserById(userId);
                setUserInfo(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserInfo();
        }
    }, [userId]);

    const handleSuccess = (message) => {
        setSuccessMessage(message);
        setIsEditing(false); // Close editing mode after success
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const loggedInUserInfo = localStorageService.getUserInfo();
    const isOwner = loggedInUserInfo && loggedInUserInfo.id.toString() === userId;

    return (
        <div className="flex">
            <Sidebar isOwner={isOwner} />
            <div className="flex-grow max-w-2xl mx-auto mt-10 bg-white shadow-xl rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
                {isOwner ? (
                    <>
                        {successMessage && (
                            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
                                {successMessage}
                            </div>
                        )}
                        <section className="bg-white shadow rounded p-4">
                            <h3 className="text-lg font-semibold mb-2">Manage Public Info</h3>
                            <p className="text-gray-600">Edit your public profile information.</p>
                            <button
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Public Info
                            </button>
                        </section>

                        {isEditing && (
                            <PersonalInfoForm userInfo={userInfo} onSuccess={handleSuccess} />
                        )}
                    </>
                ) : (
                    <div className="text-gray-500">You do not have permission to view this page.</div>
                )}
            </div>
        </div>
    );
};

const PersonalInfoForm = ({ userInfo, onSuccess }) => {
    const [user, setUser] = useState({
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || '',
        email: userInfo.email || '',
        phoneNumber: userInfo.phoneNumber || '',
        country: userInfo.country || '',
        address: userInfo.address || '',
        city: userInfo.city || '',
        image: userInfo.image || '', // Base64 image string
        password: '', // New password field
    });
    const [showPassword, setShowPassword] = useState(false); // For toggling password visibility

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
        try {
            const token = localStorageService.getToken();
            await editUser(userInfo.id, { ...user, roleEnum: 'User' }, token);
            onSuccess('Public information updated successfully.');
        } catch (error) {
            console.error('Error updating public info:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <h3 className="text-lg font-semibold mb-4">Edit Public Info</h3>
            <label className="block mb-2">First Name</label>
            <input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
                required
            />
            <label className="block mb-2">Last Name</label>
            <input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
                required
            />
            <label className="block mb-2">Email</label>
            <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
                required
            />
            <label className="block mb-2">Phone Number</label>
            <input
                type="text"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
            />
            <label className="block mb-2">Country</label>
            <input
                type="text"
                name="country"
                value={user.country}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
            />
            <label className="block mb-2">Address</label>
            <input
                type="text"
                name="address"
                value={user.address}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
            />
            <label className="block mb-2">City</label>
            <input
                type="text"
                name="city"
                value={user.city}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
            />
            <label className="block mb-2">Password</label>
            <div className="relative mb-4">
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
                    {showPassword ? 'Hide' : 'Show'}
                </span>
            </div>
            <label className="block mb-2">Image</label>
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
            <button
                type="submit"
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Save Changes
            </button>
        </form>
    );
};

export default AccountSettings;

