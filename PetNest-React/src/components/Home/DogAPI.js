// src/components/DogComponent.js
import React, { useEffect, useState } from 'react';
import { fetchDogBreeds, fetchDogByBreed, fetchRandomDogImage } from '../../services/DogService';

const DogAPI = () => {
    const [breeds, setBreeds] = useState([]); // Initial state is an empty array
    const [selectedBreed, setSelectedBreed] = useState('');
    const [dogImages, setDogImages] = useState([]); // Array to hold multiple images
    const [randomDogImage, setRandomDogImage] = useState(null); // State for random dog image
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBreeds = async () => {
            try {
                const data = await fetchDogBreeds();
                console.log(data); // Log the response
                if (data.message) {
                    const breedArray = Object.keys(data.message).map(breed => ({
                        name: breed,
                        subBreeds: data.message[breed], // You can keep track of sub-breeds if needed
                    }));
                    setBreeds(breedArray);
                } else {
                    console.error("Unexpected data format:", data);
                }
            } catch (error) {
                console.error("Error fetching breeds:", error);
            } finally {
                setLoading(false);
            }
        };
        loadBreeds();
    }, []);

    const handleBreedSelect = async (event) => {
        const breedId = event.target.value;
        setSelectedBreed(breedId);
        if (breedId) {
            try {
                const dogData = await fetchDogByBreed(breedId);
                setDogImages(dogData.message.slice(0, 3)); // Get the first three images
                setRandomDogImage(null); // Reset random image when a breed is selected
            } catch (error) {
                console.error("Error fetching breed data:", error);
            }
        } else {
            setDogImages([]); // Reset images if no breed is selected
            setRandomDogImage(null); // Reset random image
        }
    };

    const handleRandomDogImage = async () => {
        try {
            const randomImage = await fetchRandomDogImage();
            setRandomDogImage(randomImage.message); // Set the random image URL
        } catch (error) {
            console.error("Error fetching random dog image:", error);
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dog Breeds</h1>
            <select
                value={selectedBreed}
                onChange={handleBreedSelect}
                className="border p-2 rounded mb-4 w-full"
            >
                <option value="">Select a breed...</option>
                {breeds.map(breed => (
                    <option key={breed.name} value={breed.name}>
                        {breed.name}
                    </option>
                ))}
            </select>

            {dogImages.length > 0 && (
                <div className="flex flex-wrap mt-4 border p-4 rounded shadow-md">
                    {dogImages.map((imageUrl, index) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`Dog of breed ${selectedBreed}`}
                            className="w-70 h-80 rounded mr-4 mb-4"
                        />
                    ))}
                </div>
            )}

            <button 
                onClick={handleRandomDogImage} 
                className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Show Random Dog Image
            </button>

            {randomDogImage && (
                <div className="mt-4 border p-4 rounded shadow-md">
                    <img
                        src={randomDogImage}
                        alt="Random Dog"
                        className="w-70 h-80 rounded"
                    />
                </div>
            )}
        </div>
    );
};

export default DogAPI;
