import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const UserDetails = () => {
    const location = useLocation();
    const { user } = location.state;
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex items-center mb-4">
                <button 
                    onClick={() => navigate('/users')}
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                    <IoArrowBack className="mr-2" size={20} />
                    Go back
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-4">
                <img 
                                            src={user.image ? `data:image/jpeg;base64,${user.image}` :
                                             "https://cdn-icons-png.flaticon.com/256/15133/15133071.png"} 
                                            alt="User" 
                                            className="w-24 h-24 rounded-full border-2 border-indigo-500 mr-4"
                                        />
                    <div>
                        <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-600">{user.roleEnum}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Informations</h2>
                    <p><strong>Adresse:</strong> {user.address}</p>
                    <p><strong>Ville:</strong> {user.city}</p>
                    <p><strong>Pays:</strong> {user.country}</p>
                    <p><strong>Téléphone:</strong> {user.phoneNumber}</p>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
