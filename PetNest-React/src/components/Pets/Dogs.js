import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PetService from '../../services/PetService';
import PetFilterBar from '../../components/Pets/PetFilter';
import FavService from '../../services/FavService'; // Import favorite pet service
import PetRequestService from '../../services/PetRequestService'; // Import PetRequestService for requesting a pet
import localStorageService from '../../services/localStorageService'; // Import the localStorageService to access token
import { Link } from 'react-router-dom';
const Dogs = () => {
    const [dogs, setDogs] = useState([]); // All dogs fetched from the API
    const [filteredDogs, setFilteredDogs] = useState([]); // Filtered dogs to display
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track if user is authenticated
    const [showRequestForm, setShowRequestForm] = useState(false); // State to toggle the adoption request form
    const [selectedDog, setSelectedDog] = useState(null); // Selected dog for adoption
    const [message, setMessage] = useState(''); // Message for the adoption request
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorageService.getToken();
        if (token) {
            localStorage.setItem('authToken', token);
            setIsAuthenticated(true);
        }
        fetchDogs();
    }, []);

    const fetchDogs = async () => {
        try {
            const response = await PetService.getPetsByCategory('DOG');
            const activeDogs = response.data.filter(dog => !dog.desactivated);
            const dogsWithBase64Images = activeDogs.map(dog => ({
                ...dog,
                image: dog.image ? `data:image/jpeg;base64,${dog.image}` : 'https://via.placeholder.com/150'
            }));
            setDogs(dogsWithBase64Images);
            setFilteredDogs(dogsWithBase64Images);
        } catch (error) {
            console.error('Error fetching dogs:', error);
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

    const handleAdoptNow = (dog) => {
        if (!isAuthenticated) {
            alert("You need to be logged in to request adoption.");
            navigate('/login');
            return;
        }

        setSelectedDog(dog);
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
            petId: selectedDog.id,
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

        const filtered = dogs.filter((dog) => {
            return (
                (location ? dog.location.toLowerCase().includes(location.toLowerCase()) : true) &&
                (breed ? dog.breed.toLowerCase().includes(breed.toLowerCase()) : true) &&
                (gender ? dog.gender.toLowerCase() === gender.toLowerCase() : true) &&
                (color ? dog.color.toLowerCase().includes(color.toLowerCase()) : true)
            );
        });

        setFilteredDogs(filtered);
    };
    const handleAddPetClick = () => {
        navigate('/add-userpet'); // Navigate to the Add Pet form for Users
    };

    return (
        <div>
            {/* Navbar */}
            <div className="bg-indigo-600 text-white flex items-center justify-between px-4 py-1">
                <div className="flex items-center">
                    <img
                        src="https://png.pngtree.com/png-vector/20230120/ourmid/pngtree-dog-logo-veterinary-design-clipart-vet-golden-retriever-puppy-clinic-png-image_6565449.png" // Replace with your logo path
                        alt="Logo"
                        className="h-14 w-13 mr-2"
                    />
                    <h1 className="text-lg font-bold">Dogs</h1>
                </div>
                  {/* Center Links */}
                            <div className="flex space-x-4">
                                 <Link
                                                    to="/"
                                                    className="px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
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
                    
                            {isAuthenticated && (
    <button onClick={handleAddPetClick} className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200">
        Add Pet
    </button>
)}
            </div>
            <br />
            {/* Filter Bar */}
            <PetFilterBar onFilterChange={handleFilterChange} />

            {/* Filtered Dogs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-4">
                {filteredDogs.map((dog) => (
                    <div key={dog.id} className="max-w-xs w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
                        <div className="relative">
                            <img
                                src={dog.image}
                                alt={dog.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                        </div>

                        <div className="p-3 space-y-2">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{dog.name}</h3>
                                <p className="text-gray-500 text-sm">{dog.description}</p>
                            </div>

                            {isAuthenticated && (
                                <div className="flex justify-between items-center mt-2">
                                    <button
                                        onClick={() => handleAddToFavorites(dog.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ❤️
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-between mt-2">
                                <button
                                    onClick={() => handleViewDetails(dog.id)}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1 rounded-lg transition-colors mr-1 text-sm"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => handleAdoptNow(dog)}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-1 rounded-lg transition-colors text-sm"
                                >
                                    Adopt Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Adoption Request Form - Modal Style */}
            {showRequestForm && selectedDog && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4 text-center">Request to Adopt {selectedDog.name}</h3>
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
    );
};

export default Dogs;
