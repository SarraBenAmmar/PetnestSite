import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import localStorageService from '../../services/localStorageService';
import { fetchAllUsers } from '../../services/userService';
import PetService from '../../services/PetService'; // Importez le service pour les animaux
import Sidebar from './Sidebar'; // Importez le nouveau composant

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPets, setTotalPets] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorageService.getToken();
        const userInfo = localStorageService.getUserInfo();
        console.log('token', token);
        if (!token || !userInfo || userInfo.roleEnum !== 'Admin') {
            alert('Unauthorized access. Please log in as an admin.');
            navigate('/login');
        } else {
            fetchAllUsers(token)
                .then(fetchedUsers => {
                    const activeUsers = fetchedUsers.filter(user => !user.desactivated);
                    setUsers(activeUsers);
                    setTotalUsers(activeUsers.length); // Mettez à jour le total des utilisateurs
                })
                .catch(error => console.error('Error fetching users:', error));

            // Récupérez le total des animaux
            PetService.getPets()
                .then(response => {
                    setTotalPets(response.data.length); // Mettez à jour le total des animaux
                })
                .catch(error => console.error('Error fetching pets:', error));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorageService.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar onLogout={handleLogout} />

            <main className="flex-1 p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to the Dashboard</h2>
                <p>Select a section from the sidebar to view details.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {/* Carte Total Utilisateurs */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">Total Users</h3>
                        <p className="text-2xl font-bold">{totalUsers}</p>
                    </div>

                    {/* Carte Total Animaux */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">Total Pets</h3>
                        <p className="text-2xl font-bold">{totalPets}</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
