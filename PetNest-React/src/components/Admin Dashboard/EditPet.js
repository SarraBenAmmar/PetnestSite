import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PetService from '../../services/PetService';

const EditPet = () => {
    const { petId } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState({
        name: '',
        petCategory: '',
        description: '',
        age: '',
        breed: '',
        height: '',
        weight: '',
        gender: '',
        goodWith: '',
        image: '', // Base64 image string
        location: '',
        health: '',
        aggressionLevel: '',
        color: '',
        ownerPhoneNumber: '',
        ownerId: '',
    });

    useEffect(() => {
        // Fetch pet details by ID
        const fetchPet = async (id) => {
            try {
                const response = await PetService.getPetById(id);
                if (response.data) {
                    setPet(response.data);
                }
            } catch (error) {
                console.error('Error fetching pet:', error);
                alert('Failed to load pet details.');
            }
        };

        fetchPet(petId);
    }, [petId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPet((prevPet) => ({ ...prevPet, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPet((prevPet) => ({ ...prevPet, image: reader.result.split(',')[1] })); // Store Base64 without prefix
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await PetService.editPet(petId, pet);
            alert('Pet updated successfully!');
            navigate('/pets');
        } catch (error) {
            console.error('Error updating pet:', error);
            alert('Failed to update pet details.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Edit Pet</h2>

                {Object.keys(pet).map((key) => {
                    if (key === 'gender') {
                        return (
                            <div className="mb-4" key={key}>
                                <label className="block text-gray-700 capitalize">Gender:</label>
                                <select
                                    name={key}
                                    value={pet[key]}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        );
                    }

                    if (key === 'health') {
                        return (
                            <div className="mb-4" key={key}>
                                <label className="block text-gray-700 capitalize">Health Status:</label>
                                <select
                                    name={key}
                                    value={pet[key]}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Select Health Status</option>
                                    <option value="Good">Good</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Bad">Bad</option>
                                </select>
                            </div>
                        );
                    }

                    if (key === 'petCategory') {
                        return (
                            <div className="mb-4" key={key}>
                                <label className="block text-gray-700 capitalize">Category:</label>
                                <select
                                    name={key}
                                    value={pet[key]}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Select Category</option>
                                    <option value="CAT">CAT</option>
                                    <option value="DOG">DOG</option>
                                    <option value="OTHER">OTHER</option>
                                </select>
                            </div>
                        );
                    }

                    if (key === 'aggressionLevel') {
                        return (
                            <div className="mb-4" key={key}>
                                <label className="block text-gray-700 capitalize">Aggression Level:</label>
                                <select
                                    name={key}
                                    value={pet[key]}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Select Aggression Level</option>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                </select>
                            </div>
                        );
                    }

                    return key !== 'image' ? (
                        <div className="mb-4" key={key}>
                            <label className="block text-gray-700 capitalize">{key}:</label>
                            <input
                                type="text"
                                name={key}
                                value={pet[key]}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    ) : (
                        <div className="mb-4" key="image">
                            <label className="block text-gray-700">Image:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {pet.image && <p className="text-green-500 mt-2">Image selected.</p>}
                        </div>
                    );
                })}

                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg w-full hover:bg-green-600 transition duration-200"
                >
                    Update Pet
                </button>
            </form>
        </div>
    );
};

export default EditPet;
