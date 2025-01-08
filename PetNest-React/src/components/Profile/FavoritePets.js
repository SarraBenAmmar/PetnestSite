import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import FavService from '../../services/FavService';
import Sidebar from './Sidebar';
import localStorageService from '../../services/localStorageService';

const FavoritePets = () => {
    const { id: userId } = useParams(); // Get the userId from URL
    const [favPets, setFavPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [petToRemove, setPetToRemove] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const data = await FavService.getFavPets(userId); // Pass userId to fetch favorites for specific user
                setFavPets(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [userId]);

    const confirmRemove = (petId) => {
        setPetToRemove(petId);
        setShowConfirm(true);
    };

    const handleRemoveFavorite = async () => {
        if (!petToRemove) return;

        try {
            await FavService.removePetFromFav(petToRemove);
            setFavPets((prev) => prev.filter((pet) => pet.id !== petToRemove));
            setShowConfirm(false);
        } catch (err) {
            console.error(err);
        } finally {
            setPetToRemove(null);
        }
    };

    if (loading) return <div>Loading favorite pets...</div>;
    if (error) return <div>Error loading favorite pets: {error.message}</div>;

    // Get logged-in user info from local storage
    const loggedInUserInfo = localStorageService.getUserInfo();
    const isOwner = loggedInUserInfo && loggedInUserInfo.id.toString() === userId;

    return (
        <div className="flex">
            <Sidebar isOwner={isOwner} />
            <main className="flex-grow ml-64 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favPets.length > 0 ? (
                    favPets.map((pet) => (
                        <div
                            key={pet.id}
                            className="bg-white shadow-lg rounded-lg p-4 text-center flex flex-col items-center relative"
                        >
                            <img
                                src={`data:image/jpeg;base64,${pet.image}`}
                                alt={pet.name}
                                className="h-24 w-24 rounded-full"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150';
                                }}
                            />
                            <h3 className="mt-2 text-lg font-semibold">{pet.name}</h3>
                            <button
                                onClick={() => confirmRemove(pet.id)}
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Remove from Favorites
                            </button>
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
                        No favorite pets found.
                    </div>
                )}

                {/* Confirmation Modal */}
                {showConfirm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-xl w-96 p-6">
                            <h2 className="text-lg font-semibold text-gray-700">
                                Are you sure you want to delete this favorite pet?
                            </h2>
                            <div className="mt-4 flex justify-end gap-4">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRemoveFavorite}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FavoritePets;
