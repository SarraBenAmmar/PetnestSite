import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PetService from '../../services/PetService';
import PetFilterBar from '../../components/Pets/PetFilter'; // Import the filter bar component
import FavService from '../../services/FavService'; // Import favorite pet service
import PetRequestService from '../../services/PetRequestService'; // Import PetRequestService for requesting a pet
import localStorageService from '../../services/localStorageService'; // Import the localStorageService to access token

const Cats = () => {
    const [cats, setCats] = useState([]);
    const [filteredCats, setFilteredCats] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [selectedCat, setSelectedCat] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorageService.getToken();
        if (token) {
            setIsAuthenticated(true);
        }
        fetchCats();
    }, []);

    const handleAddPetClick = () => {
        navigate('/add-userpet'); // Navigate to the Add Pet form for Users
    };

    const fetchCats = async () => {
        try {
            const response = await PetService.getPetsByCategory('CAT');
            const activeCats = response.data.filter(cat => !cat.desactivated);
            const catsWithBase64Images = activeCats.map(cat => ({
                ...cat,
                image: cat.image ? `data:image/jpeg;base64,${cat.image}` : 'https://png.pngtree.com/png-clipart/20240603/original/pngtree-cat-logo-design-png-image_15240244.png'
            }));
            setCats(catsWithBase64Images);
            setFilteredCats(catsWithBase64Images);
        } catch (error) {
            console.error('Error fetching cats:', error);
        }
    };

    const handleViewDetails = (id) => {
        navigate(`/pet-details/${id}`);
    };

    const handleAddToFavorites = async (petId) => {
        const token = localStorageService.getToken();
        if (!token) {
            alert("You need to be logged in to add pets to favorites.");
            navigate('/login');
            return;
        }

        const confirmAdd = window.confirm("Are you sure you want to add this pet to your favorites?");
        if (confirmAdd) {
            try {
                await FavService.addPetToFav(petId);
                alert("Pet added to your favorites successfully!");
            } catch (error) {
                alert("Failed to add pet to favorites. Please try again.");
                console.error("Error adding pet to favorites:", error);
            }
        }
    };

    const handleAdoptNow = (cat) => {
        const token = localStorageService.getToken();
        if (!token) {
            alert("You need to be logged in to request a pet.");
            navigate('/login');
            return;
        }

        setSelectedCat(cat);
        setShowRequestForm(true);
    };

    const handleSubmitRequest = async () => {
        const token = localStorageService.getToken();
        if (!token) {
            alert("You need to be logged in to request a pet.");
            navigate('/login');
            return;
        }

        const requestPetDTO = {
            petId: selectedCat.id,
            message: message,
        };

        try {
            await PetRequestService.requestPet(requestPetDTO);
            alert("Your pet adoption request has been sent successfully!");
            setShowRequestForm(false);
            setMessage('');
        } catch (error) {
            alert("Failed to send the adoption request. Please try again.");
            console.error("Error requesting pet:", error);
        }
    };

    const handleFilterChange = (filters) => {
        const { location, breed, gender, color } = filters;

        const filtered = cats.filter((cat) => {
            return (
                (location ? cat.location.toLowerCase().includes(location.toLowerCase()) : true) &&
                (breed ? cat.breed.toLowerCase().includes(breed.toLowerCase()) : true) &&
                (gender ? cat.gender.toLowerCase() === gender.toLowerCase() : true) &&
                (color ? cat.color.toLowerCase().includes(color.toLowerCase()) : true)
            );
        });

        setFilteredCats(filtered);
    };

    return (
        <div>
        {/* Navbar */}
        <div className="bg-indigo-600 text-white flex items-center justify-between px-4 py-2">
            <div className="flex items-center">
                <img
                    src="https://png.pngtree.com/png-vector/20230120/ourmid/pngtree-veterinary-design-vet-clipart-puppy-cute-cat-logo-png-image_6565444.png"
                    alt="Logo"
                    className="h-13 w-12 mr-2"
                />
                <h1 className="text-lg font-bold">Cats</h1>
            </div>
    
            {/* Center Links */}
            <div className="flex space-x-4">
            <Link
                    to="/"
                    className="px-1 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
                >
                    Home
                </Link>
                <Link
                    to="/cats"
                    className="px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
                >
                    Cats
                </Link>
                <Link
                    to="/dogs"
                    className="px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
                >
                    Dogs
                </Link>
                <Link
                    to="/other"
                    className="px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
                >
                    Other
                </Link>
            </div>
    
            {/* Add Pet Button */}
           
{isAuthenticated && (
    <button onClick={handleAddPetClick} className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200">
        Add Pet
    </button>
)}
        </div>

            <div className="p-4">
                <PetFilterBar onFilterChange={handleFilterChange} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-4">
                    {filteredCats.map((cat) => (
                        <div
                            key={cat.id}
                            className="max-w-xs w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-3">
                                <h3 className="text-lg font-bold">{cat.name}</h3>
                                <p className="text-gray-500">Breed: {cat.breed}</p>
                                <p className="text-gray-500">Location: {cat.location}</p>
                                {isAuthenticated && (
                                    <button
                                        onClick={() => handleAddToFavorites(cat.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ❤️
                                    </button>
                                )}
                                <div className="flex justify-between mt-2">
                                    <button
                                        onClick={() => handleViewDetails(cat.id)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleAdoptNow(cat)}
                                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-lg"
                                    >
                                        Adopt Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                 {/* Adoption Request Form - Modal Style */}
            {showRequestForm && selectedCat && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4 text-center">Request to Adopt {selectedCat.name}</h3>
                        <textarea
                            className="w-full p-2 border rounded-md mb-4 h-32"
                            placeholder="Write a message to the pet owner"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={handleSubmitRequest}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                            >
                                Submit Request
                            </button>
                            <button
                                onClick={() => setShowRequestForm(false)}
                                className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default Cats;
