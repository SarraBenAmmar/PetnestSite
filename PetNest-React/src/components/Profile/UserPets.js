import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PetService from '../../services/PetService';
import Sidebar from './Sidebar';
import localStorageService from '../../services/localStorageService';

const UserPets = () => {
    const [userPets, setUserPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get user info from local storage
    const loggedInUserInfo = localStorageService.getUserInfo();
    const userId = loggedInUserInfo?.id;

    useEffect(() => {
        const fetchUserPets = async () => {
            try {
                const response = await PetService.getPetsByOwner(); // Assuming this fetches pets owned by the logged-in user
                setUserPets(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPets();
    }, [userId]);

    if (loading) return <div>Loading your pets...</div>;
    if (error) return <div>Error loading your pets: {error.message}</div>;

    return (
        <div className="flex">
            <Sidebar isOwner={true} />
            <main className="flex-grow ml-64 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPets.length > 0 ? (
                    userPets.map((pet) => (
                        <div key={pet.id} className="bg-white shadow-lg rounded-lg p-4 text-center flex flex-col items-center relative">
                            <img
                                src={`data:image/jpeg;base64,${pet.image}`}
                                alt={pet.name}
                                className="h-24 w-24 rounded-full"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150';
                                }}
                            />
                            <h3 className="mt-2 text-lg font-semibold">{pet.name}</h3>
                            <Link
                                to={`/pet-details/${pet.id}`}
                                className="absolute top-4 right-4 text-blue-500 hover:text-blue-700"
                                title="View Pet Details"
                            >
                                ➡️
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500">
                        No pets found.
                    </div>
                )}
            </main>
        </div>
    );
};

export default UserPets;
