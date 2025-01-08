import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import localStorageService from '../../services/localStorageService';
import { fetchAllUsers, deleteUser } from '../../services/userService';
import Sidebar from './Sidebar'; // Assurez-vous que le chemin est correct
import { FaSearch } from 'react-icons/fa'; // Importer l'icône de recherche

const Users = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorageService.getToken();
        const userInfo = localStorageService.getUserInfo();

        if (!token || !userInfo || userInfo.roleEnum !== 'Admin') {
            alert('Unauthorized access. Please log in as an admin.');
            navigate('/login');
        } else {
            fetchAllUsers(token)
                .then(fetchedUsers => {
                    // Filtrer les utilisateurs pour exclure ceux avec roleEnum 'Admin' et ceux désactivés
                    const activeUsers = fetchedUsers.filter(user => !user.desactivated && user.roleEnum !== 'Admin');
                    setUsers(activeUsers);
                })
                .catch(error => console.error('Error fetching users:', error));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorageService.clear();
        navigate('/login');
    };

    const handleEditUser = (user) => {
        navigate(`/edit-user/${user.id}`, { state: { user } });
    };

    const handleDeleteUser = async (id) => {
        const token = localStorageService.getToken();

        // Confirmation avant de désactiver l'utilisateur
        const confirmDelete = window.confirm('Êtes-vous sûr de vouloir désactiver ce compte ?');
        if (!confirmDelete) return; // Sortir si l'utilisateur annule

        try {
            await deleteUser(id, token);
            setUsers(users.filter(user => user.id !== id));
            alert('Utilisateur désactivé avec succès');
        } catch (error) {
            console.error('Error deactivating user:', error);
            alert('Échec de la désactivation de l\'utilisateur');
        }
    };

    const handleViewDetails = (user) => {
        navigate(`/user-details/${user.id}`, { state: { user } });
    };

    const handleAddUser = () => {
        navigate('/add-user');
    };

    // Filtrer les utilisateurs selon le terme de recherche
    const filteredUsers = users.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar onLogout={handleLogout} />

            <div className="container mx-auto px-4 py-6 flex-1">
                <div className="mb-4 flex items-center">
                    <div className="relative w-full">
                        <input 
                            type="text" 
                            placeholder="Search By Name..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="border border-gray-300 rounded-full p-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <FaSearch className="absolute left-3 top-2 text-gray-500" />
                    </div>
                </div>
                <button 
                    className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                    onClick={handleAddUser}
                >
                    Ajouter Utilisateur
                </button>
                <div className="bg-white shadow-md rounded overflow-hidden">
                    <table className="min-w-full border-collapse block md:table">
                        <thead className="block md:table-header-group">
                            <tr className="border border-gray-300 md:table-row">
                                <th className="block md:table-cell p-2 text-left">Image</th>
                                <th className="block md:table-cell p-2 text-left">ID</th>
                                <th className="block md:table-cell p-2 text-left">Nom</th>
                                <th className="block md:table-cell p-2 text-left">Email</th>
                                <th className="block md:table-cell p-2 text-left">Rôle</th>
                                <th className="block md:table-cell p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border border-gray-300 md:table-row">
                                    <td className="block md:table-cell p-2">
                                        <img 
                                            src={user.image ? `data:image/jpeg;base64,${user.image}` :
                                             "https://cdn-icons-png.flaticon.com/256/15133/15133071.png"} 
                                            alt="User" 
                                            className="w-10 h-10 rounded-full"
                                        />
                                    </td>
                                    <td className="block md:table-cell p-2">{user.id}</td>
                                    <td className="block md:table-cell p-2">{user.firstName} {user.lastName}</td>
                                    <td className="block md:table-cell p-2">{user.email}</td>
                                    <td className="block md:table-cell p-2">{user.roleEnum}</td>
                                    <td className="block md:table-cell p-2">
                                        <button 
                                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                            onClick={() => handleViewDetails(user)}
                                        >
                                            View Details
                                        </button>
                                        <button 
                                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                            onClick={() => handleEditUser(user)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            Desactivate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;
