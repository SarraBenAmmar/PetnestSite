import React from 'react';
import { Link } from 'react-router-dom';
import localStorageService from '../../services/localStorageService';

const Sidebar = ({ isOwner }) => {
    if (!isOwner) return null; // Don't render the Sidebar if the user is not the owner

    const userInfo = localStorageService.getUserInfo();
    const handleLogout = () => {
        localStorageService.clear();
        window.location.href = '/login'; // Redirect to login
    };

    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white shadow-lg flex flex-col justify-between">
            <div>
            <h2 className="ml-10 pb-3 text-2xl font-semibold mt-4">Profile Menu</h2>
                <div className="p-4 text-center border-b border-gray-700">
                    {userInfo && (
                        <div className="flex flex-col items-center">
                             <img 
                                              src={userInfo.image ? `data:image/jpeg;base64,${userInfo.image}` : "https://cdn-icons-png.flaticon.com/256/15133/15133071.png"} 
                                              alt="User" 
                                              className="h-29 w-20 rounded-full  shadow-md"
                                          />
                            <p className="mt-2 text-lg font-semibold">{userInfo.email}</p>
                        </div>
                    )}
                   
                </div>
                <nav className="mt-4">
                    <ul className="space-y-4 px-4">
                        <li>
                            <Link to="/" className="hover:text-gray-300">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to={`/profile/${userInfo?.id}`} className="hover:text-gray-300">
                                Profile
                            </Link>
                        </li>
                        <li>
    <Link to={`/profile/${userInfo?.id}/user-pets`} className="hover:text-gray-300">
        My Pets
    </Link>
</li>
                        <li>
                            <Link to={`/profile/${userInfo?.id}/favorites`} className="hover:text-gray-300">
                                Favorite Pets
                            </Link>
                        </li>
                        <li>
                            <Link to={`/profile/${userInfo?.id}/pet-requests`} className="hover:text-gray-300">
                                Pet Requests
                            </Link>
                        </li>
                        
                        <li>
                            <Link to={`/profile/${userInfo?.id}/account-settings`} className="hover:text-gray-300">
                                Account Settings
                            </Link>
                        </li>
                       
                    </ul>
                </nav>
            </div>
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;