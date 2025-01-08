import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PetService from '../../services/PetService';

const AddPetUser = ({ currentUser }) => {
    const [pet, setPet] = useState({
        name: '',
        petCategory: 'CAT',
        description: '',
        age: '',
        breed: '',
        height: '',
        weight: '',
        gender: 'Male',
        goodWith: '',
        image: '',
        location: '',
        health: '',
        aggressionLevel: '',
        color: '',
        ownerPhoneNumber: '',
    });

    const navigate = useNavigate();

    if (!currentUser) {
        alert('You must be logged in to add a pet.');
        navigate('/login'); // Redirect to login page if no user is logged in
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPet({ ...pet, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const maxSize = 500;

                    const ratio = Math.min(maxSize / img.width, maxSize / img.height);
                    canvas.width = img.width * ratio;
                    canvas.height = img.height * ratio;

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const resizedImage = canvas.toDataURL(file.type);
                    setPet({ ...pet, image: resizedImage.split(',')[1] });
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const petData = { ...pet, ownerId: currentUser.id }; // Automatically set ownerId
            await PetService.addPet(petData);
            alert('Pet added successfully!');
            navigate('/'); // Redirect to /home after successful pet addition
        } catch (error) {
            console.error('Error adding pet:', error);
            alert('Failed to add pet, unsupported image type');
        }
    };

    return (
        <div 
            style={{
                backgroundImage: 'url(https://static.vecteezy.com/system/resources/previews/024/402/635/non_2x/cute-pink-paw-footprints-background-hand-drawn-animal-pet-cat-paw-silhouette-pattern-kitten-puppy-walking-footsteps-illustration-design-for-fabric-decorative-sticker-wallpaper-kids-vector.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh', // Ensure it covers the full height of the viewport
                padding: '20px' // Optional padding for aesthetics
            }}
        >
            <form 
                onSubmit={handleSubmit} 
                className="max-w-lg mx-auto p-4 bg-white rounded shadow-md"
            >
                <h2 className="text-xl font-bold mb-4">Add a New Pet</h2>
                <input type="text" name="name" placeholder="Name" value={pet.name} onChange={handleChange} required className="w-full p-2 border rounded mb-2" />
                <select name="petCategory" value={pet.petCategory} onChange={handleChange} className="w-full p-2 border rounded mb-2" required>
                    <option value="CAT">Cat</option>
                    <option value="DOG">Dog</option>
                    <option value="OTHER">Other</option>
                </select>
                <textarea name="description" placeholder="Description" value={pet.description} onChange={handleChange} required className="w-full p-2 border rounded mb-2" />
                <input type="number" name="age" placeholder="Age" value={pet.age} onChange={handleChange} required className="w-full p-2 border rounded mb-2" />
                <input type="text" name="breed" placeholder="Breed" value={pet.breed} onChange={handleChange} required className="w-full p-2 border rounded mb-2" />
                <input type="number" name="height" placeholder="Height" value={pet.height} onChange={handleChange} required className="w-full p-2 border rounded mb-2" />
                <input type="number" name="weight" placeholder="Weight" value={pet.weight} onChange={handleChange} required className="w-full p-2 border rounded mb-2" />
                <select name="gender" value={pet.gender} onChange={handleChange} className="w-full p-2 border rounded mb-2">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <input type="file" accept="image/*" onChange={handleImageChange} required className="mb-2" />
                <input type="text" name="location" placeholder="Location" value={pet.location} onChange={handleChange} required className="w-full p-2 border rounded mb-2" />
                <input type="text" name="health" placeholder="Health" value={pet.health} onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <input type="text" name="aggressionLevel" placeholder="Aggression Level" value={pet.aggressionLevel} onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <input type="text" name="color" placeholder="Color" value={pet.color} onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                <input type="text" name="ownerPhoneNumber" placeholder="Owner Phone Number" value={pet.ownerPhoneNumber} onChange={handleChange} required className="w-full p-2 border rounded mb-2" />
                <button type="submit" className="w-full bg-pink-400 text-white p-2 rounded hover:bg-pink-500">Add Pet</button>
            </form>
        </div>
    );
};

export default AddPetUser;
