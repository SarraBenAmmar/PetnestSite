// src/components/CatRandom.js
import React, { useEffect, useState } from 'react';
import { fetchRandomCatImage } from '../../services/CatService';

const CatRandom = () => {
    const [randomImage, setRandomImage] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleRandomImage = async () => {
        setLoading(true);
        try {
            const randomCatImage = await fetchRandomCatImage();
            setRandomImage(randomCatImage[0]); // Use the first element from the array
        } catch (error) {
            console.error("Error fetching random cat image:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleRandomImage(); // Fetch an image when the component mounts
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Random Cat Image</h1>
            <button
                onClick={handleRandomImage}
                className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Get Another Random Cat Image
            </button>
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                randomImage && (
                    <div className="relative flex justify-center items-center mt-4 border p-4 rounded shadow-md">
                        <img
                            src={randomImage.url}
                            alt="Random Cat"
                            className="w-150 h-100 rounded mr-4"
                        />
                    </div>
                )
            )}






        </div>
    );
};

export default CatRandom;
