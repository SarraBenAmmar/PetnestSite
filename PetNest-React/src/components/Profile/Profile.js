import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import the Sidebar component
import localStorageService from '../../services/localStorageService'; // Import localStorageService

const Profile = () => {
    const { id: userId } = useParams(); // Use useParams to get the ID
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/getUserById/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Get logged-in user info from local storage
    const loggedInUserInfo = localStorageService.getUserInfo(); 
    const isOwner = loggedInUserInfo && loggedInUserInfo.id.toString() === userId; // Ensure both are strings for comparison

    return (
        <div className="flex">
            <Sidebar isOwner={isOwner} /> {/* Render Sidebar only for the owner */}
            <div className="flex-grow max-w-2xl mx-auto mt-10 bg-white shadow-xl rounded-lg p-6">
                <div className="flex justify-center mb-6">
                    <img 
                        src={userInfo.image ? `data:image/jpeg;base64,${userInfo.image}` : "https://cdn-icons-png.flaticon.com/256/15133/15133071.png"} 
                        alt="User" 
                        className="h-32 w-32 rounded-full border-4 border-white shadow-md"
                    />
                </div>
                <h2 className="text-center text-2xl font-semibold">
                    {userInfo?.firstName} {userInfo?.lastName}
                </h2>
                <p className="text-center text-gray-500">{userInfo?.email}</p>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    <p>
                        <strong>Phone:</strong> {userInfo?.phoneNumber || 'N/A'}
                    </p>
                    <p>
                        <strong>Address:</strong> {userInfo?.address || 'N/A'}
                    </p>
                    <p>
                        <strong>City:</strong> {userInfo?.city || 'N/A'}
                    </p>
                    <p>
                        <strong>Country:</strong> {userInfo?.country || 'N/A'}
                    </p>
                </div>
           
            </div>
        </div>
    );
};

export default Profile;
