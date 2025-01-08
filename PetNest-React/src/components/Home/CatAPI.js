// src/components/CatComponent.js
import React, { useEffect, useState } from 'react';
import { fetchBreeds, fetchCatByBreed, fetchRandomCatImage } from '../../services/CatService';
import { Link } from 'react-router-dom';

const CatAPI = () => {
    const [breeds, setBreeds] = useState([]);
    const [selectedBreed, setSelectedBreed] = useState('');
    const [catImage, setCatImage] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch breeds on component mount
    useEffect(() => {
        const loadBreeds = async () => {
            try {
                const data = await fetchBreeds();
                setBreeds(data);
            } catch (error) {
                console.error("Error fetching breeds:", error);
            } finally {
                setLoading(false);
            }
        };
        loadBreeds();
    }, []);

    // Handle breed selection and fetch corresponding cat image
    const handleBreedSelect = async (event) => {
        const breedId = event.target.value;
        setSelectedBreed(breedId);
        if (breedId) {
            try {
                const catData = await fetchCatByBreed(breedId);
                setCatImage(catData[0]); // Assuming catData is an array
            } catch (error) {
                console.error("Error fetching breed data:", error);
            }
        } else {
            setCatImage(null); // Reset image if no breed is selected
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Cat Breeds</h1>
            <select
                value={selectedBreed}
                onChange={handleBreedSelect}
                className="border p-2 rounded mb-4 w-full"
            >
                <option value="">Select a breed...</option>
                {breeds.map(breed => (
                    <option key={breed.id} value={breed.id}>
                        {breed.name}
                    </option>
                ))}
            </select>

            {catImage && (
                <div className="flex items-start mt-4 border p-4 rounded shadow-md">
                    <img
                        src={catImage.url}
                        alt={`Cat of breed ${catImage.breeds[0]?.name}`}
                        className="w-70 h-80 rounded mr-4"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">{catImage.breeds[0]?.name}</h2>
                        <p><strong>Description:</strong> {catImage.breeds[0]?.description}</p>
                        <p><strong>Origin:</strong> {catImage.breeds[0]?.origin}</p>
                        <p><strong>Temperament:</strong> {catImage.breeds[0]?.temperament}</p>
                        <p><strong>Life Span:</strong> {catImage.breeds[0]?.life_span}</p>
                        <p><strong>Weight:</strong> {catImage.breeds[0]?.weight?.imperial} lbs</p>
                        <a
                            href={catImage.breeds[0]?.wikipedia_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline mt-2 block"
                        >
                            Learn more
                        </a>
                    </div>
                </div>
            )}

            <Link to="/cat-random">
                <button className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Go to Random Cat Image
                </button>
            </Link>
        </div>
    );
};

export default CatAPI;
