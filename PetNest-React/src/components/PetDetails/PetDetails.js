import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import PetService from '../../services/PetService';
import localStorageService from '../../services/localStorageService';

const PetDetails = () => {
    const { petId } = useParams();  
    const [pet, setPet] = useState(null);
    const [ownerInfo, setOwnerInfo] = useState(null);

    const fetchPetDetails = useCallback(async () => {
        if (!petId) {
            console.error("Pet ID is undefined");
            return;
        }

        try {
            const response = await PetService.getPetById(petId);
            setPet(response.data);

            if (response.data.ownerId) {
                console.log("Fetching owner info for ID:", response.data.ownerId);
                fetchOwnerInfo(response.data.ownerId);
            } else {
                console.error('Owner ID not found in pet data!');
            }
        } catch (error) {
            console.error('Error fetching pet details:', error);
        }
    }, [petId]);

    const fetchOwnerInfo = (ownerId) => {
        const ownerData = localStorageService.getUserInfo(ownerId); 
        if (ownerData) {
            setOwnerInfo(ownerData);
        } else {
            console.error('Owner data not found for owner ID:', ownerId);
        }
    };

    useEffect(() => {
        fetchPetDetails();
    }, [fetchPetDetails]);

    if (!pet) return <div className="text-center py-4">Loading...</div>;

    const imageSrc = pet.image ? `data:image/jpeg;base64,${pet.image}` : '/default-pet-image.jpg'; 

    return (
        <div className="container mx-auto p-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            {/* Pet Image Section */}
            <div className="md:w-1/3 flex justify-center items-center">
                <img src={imageSrc} alt={pet.name} className="w-full h-full object-cover rounded-lg shadow-lg" />
            </div>

            {/* Pet Details Section */}
            <div className="md:w-2/3 bg-white shadow-lg rounded-lg p-6 flex flex-col">
                <h2 className="text-3xl font-semibold mb-4">{pet.name}</h2>
                <p className="text-gray-600 mb-6">{pet.description || "No description available."}</p>

                <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-6 mb-6">
                    {/* Left Section for Pet Details */}
                    <div className="space-y-4 text-gray-700 md:w-1/2">
                        <h3 className="text-2xl font-semibold mb-4">Details</h3>
                        <ul className="space-y-2">
                            <li><strong>Age:</strong> {pet.age}</li>
                            <li><strong>Breed:</strong> {pet.breed}</li>
                            <li><strong>Color:</strong> {pet.color}</li>
                            <li><strong>Gender:</strong> {pet.gender}</li>
                            <li><strong>Weight:</strong> {pet.weight} kg</li>
                            <li><strong>Category:</strong> {pet.petCategory}</li>
                        </ul>
                    </div>

                    {/* Right Section for Additional Pet Details */}
                    <div className="space-y-4 text-gray-700 md:w-1/2">
                        <h3 className="text-2xl font-semibold mb-4">More Details</h3>
                        <ul className="space-y-2">
                            <li><strong>Height:</strong> {pet.height} cm</li>
                            <li><strong>Health:</strong> {pet.health}</li>
                            <li>
                                <strong>Location:</strong> {pet.location}{" "}
                                <Link
                                    to={`/map/${encodeURIComponent(pet.location)}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    View on Map
                                </Link>
                            </li>
                            <li><strong>Aggression Level:</strong> {pet.aggressionLevel}</li>
                            
                        </ul>
                    </div>
                </div>

                {ownerInfo ? (
                    <>
                        <h3 className="text-2xl font-semibold mt-6 mb-4">Owner Information</h3>
                        <div className="space-y-2">
                            
                            <p><strong>Phone Number:</strong> {pet.ownerPhoneNumber}</p>
                            <Link to={`/profile/${pet.ownerId}`} className="text-blue-500 hover:underline">View Owner's Profile</Link>
                        </div>
                    </>
                ) : (
                    <p>Loading owner information...</p>
                )}
            </div>
        </div>
    );
};

export default PetDetails;
