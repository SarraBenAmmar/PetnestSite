import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PetService from '../../services/PetService';
import PetFilterBar from '../../components/Pets/PetFilter';
import FavService from '../../services/FavService'; // Import favorite pet service
import PetRequestService from '../../services/PetRequestService'; // Import PetRequestService for requesting a pet
import localStorageService from '../../services/localStorageService'; // Import the localStorageService to access token
import { Link } from 'react-router-dom';
const Other = () => {
    const [otherPets, setOtherPets] = useState([]); // All pets fetched from the API
    const [filteredOtherPets, setFilteredOtherPets] = useState([]); // Filtered pets to display
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track if user is authenticated
    const [showRequestForm, setShowRequestForm] = useState(false); // State to toggle the adoption request form
    const [selectedPet, setSelectedPet] = useState(null); // Selected pet for adoption
    const [message, setMessage] = useState(''); // Message for the adoption request
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated based on token in localStorage
        const token = localStorageService.getToken();
        if (token) {
            localStorage.setItem('authToken', token);  // Where 'token' is the JWT or authorization token
            setIsAuthenticated(true);
        }
        fetchOtherPets();
    }, []);

    const fetchOtherPets = async () => {
        try {
            const response = await PetService.getPetsByCategory('OTHER');
            // Filter pets that are active
            const activeOtherPets = response.data.filter(pet => !pet.desactivated); // or pet.desactivated === 0
            const petsWithBase64Images = activeOtherPets.map(pet => ({
                ...pet,
                image: pet.image ? `data:image/jpeg;base64,${pet.image}` : 'https://via.placeholder.com/150'
            }));
            setOtherPets(petsWithBase64Images);
            setFilteredOtherPets(petsWithBase64Images); // Initially show all pets
        } catch (error) {
            console.error('Error fetching other pets:', error);
        }
    };

    const handleViewDetails = (id) => {
        navigate(`/pet-details/${id}`); // Navigate to PetDetails with the pet ID
    };

    // Add pet to favorites
    const handleAddToFavorites = async (petId) => {
        const token = localStorageService.getToken();
        if (!token) {
            alert("You need to be logged in to add pets to favorites.");
            navigate('/login'); // Navigate to login page if token is missing
            return;
        }

        const confirmAdd = window.confirm("Are you sure you want to add this pet to your favorites?");
        if (confirmAdd) {
            try {
                await FavService.addPetToFav(petId); // Call API to add pet to favorites
                alert("Pet added to your favorites successfully!");
            } catch (error) {
                alert("Failed to add pet to favorites. Please try again.");
                console.error("Error adding pet to favorites:", error);
            }
        }
    };

    // Handle the form to request a pet
    const handleAdoptNow = (pet) => {
        if (!isAuthenticated) {
            alert("You need to be logged in to request adoption.");
            navigate('/login');
            return;
        }

        setSelectedPet(pet); // Set the selected pet for adoption
        setShowRequestForm(true); // Show the request form
    };

    // Submit the adoption request
    const handleSubmitRequest = async () => {
        const token = localStorageService.getToken();
        if (!token) {
            alert("You need to be logged in to request a pet.");
            navigate('/login'); // Navigate to login page if token is missing
            return;
        }

        const requestPetDTO = {
            petId: selectedPet.id,
            message: message,
        };

        try {
            await PetRequestService.requestPet(requestPetDTO); // Call API to request pet
            alert("Your pet adoption request has been sent successfully!");
            setShowRequestForm(false); // Hide the form after successful submission
            setMessage(''); // Clear the message
        } catch (error) {
            alert("Failed to send the adoption request. Please try again.");
            console.error("Error requesting pet:", error);
        }
    };

    // Handle filter changes
    const handleFilterChange = (filters) => {
        const { location, breed, gender, color } = filters;

        const filtered = otherPets.filter((pet) => {
            return (
                (location ? pet.location.toLowerCase().includes(location.toLowerCase()) : true) &&
                (breed ? pet.breed.toLowerCase().includes(breed.toLowerCase()) : true) &&
                (gender ? pet.gender.toLowerCase() === gender.toLowerCase() : true) &&
                (color ? pet.color.toLowerCase().includes(color.toLowerCase()) : true)
            );
        });

        setFilteredOtherPets(filtered);
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
                                    src="https://icons.iconarchive.com/icons/iconarchive/cute-animal/512/Cute-Rabbit-icon.png" // Replace with your logo path
                                    alt="Logo"
                                    className="h-12 w-12 mr-2"
                                />
                                <h1 className="text-lg font-bold">Others</h1>
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
<br/>

            {/* Filter Bar */}
            <PetFilterBar onFilterChange={handleFilterChange} />

            {/* Filtered Pets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {filteredOtherPets.map((pet) => (
                    <div key={pet.id} className="max-w-xs w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
                        <div className="relative">
                            <img 
                                src={pet.image} 
                                alt={pet.name} 
                                className="w-full h-48 object-cover rounded-t-lg" 
                            />
                        </div>
                        <div className="p-3 space-y-2">
                            <h3 className="text-lg font-semibold">{pet.name}</h3>
                            <p className="text-gray-600">{pet.description}</p>

                            {/* Heart Button for Adding to Favorites */}
                            {isAuthenticated && (
                                <div className="flex justify-between items-center mt-2">
                                    <button 
                                        onClick={() => handleAddToFavorites(pet.id)} 
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ❤️
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-between mt-2">
                                <button 
                                    onClick={() => handleViewDetails(pet.id)} 
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1 rounded-lg transition-colors mr-1 text-sm"
                                >
                                    View Details
                                </button>
                                <button 
                                    onClick={() => handleAdoptNow(pet)} 
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-1 rounded-lg transition-colors text-sm"
                                >
                                    Adopt Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Adoption Request Form - Modal Style */}
            {showRequestForm && selectedPet && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4 text-center">Request to Adopt {selectedPet.name}</h3>
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

export default Other;
