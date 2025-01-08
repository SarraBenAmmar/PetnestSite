import React from 'react';
import { Link } from 'react-router-dom';
import localStorageService from '../../services/localStorageService';

const Sidebar = ({ onLogout }) => {
    const userInfo = localStorageService.getUserInfo(); // Récupérer les informations de l'utilisateur

    return (
        <aside className="bg-indigo-600 text-white w-64 h-screen p-4">
            <h2 className="text-lg font-bold">Admin Dashboard</h2>
            <div className="flex items-center mt-4">
                <img 
                    src={userInfo.image ? `data:image/jpeg;base64,${userInfo.image}` : "https://cdn-icons-png.flaticon.com/256/15133/15133071.png"} 
                    alt="Admin" 
                    className="w-12 h-12 rounded-full mr-2"
                />
                <div>
                    <p className="font-semibold">{userInfo.firstName} {userInfo.lastName}</p>
                    <p className="text-sm">{userInfo.email}</p>
                </div>
            </div>
            <ul className="mt-4">
            <li>
                    <Link to="/admin-dashboard" className="block p-2 hover:bg-indigo-700">
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/users" className="block p-2 hover:bg-indigo-700">
                        Users
                    </Link>
                </li>
                <li>
                    <Link to="/pets" className="block p-2 hover:bg-indigo-700">
                        Pets
                    </Link>
                </li>
            </ul>
            <button
                className="bg-red-500 px-4 py-2 rounded text-white mt-4"
                onClick={onLogout}
            >
                Logout
            </button>
        </aside>
    );
};

export default Sidebar;
