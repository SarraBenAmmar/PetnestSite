import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate
import PetService from '../../services/PetService';

const AddPet = () => {
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

    const navigate = useNavigate(); // Initialiser useNavigate

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
                    // Resize image (example: 500px max width/height)
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const maxSize = 500; // Maximum size for width/height

                    // Calculate the aspect ratio
                    const ratio = Math.min(maxSize / img.width, maxSize / img.height);
                    canvas.width = img.width * ratio;
                    canvas.height = img.height * ratio;

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Convert to base64 and store
                    const resizedImage = canvas.toDataURL(file.type);
                    setPet({ ...pet, image: resizedImage.split(',')[1] }); // Store base64 without data URL prefix
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await PetService.addPet(pet);
            alert('Pet added successfully!');
            setPet({ // Reset form
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
                ownerId: 0,
            });
            navigate('/pets'); // Rediriger vers /pets après ajout réussi
        } catch (error) {
            console.error('Error adding pet:', error);
            alert('Failed to add pet. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded shadow-md">
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
            <input type="text" name="goodWith" placeholder="Good With" value={pet.goodWith} onChange={handleChange} className="w-full p-2 border rounded mb-2" />
            <input type="file" accept="image/*" onChange={handleImageChange} required className="mb-2" />
            <input type="text" name="location" placeholder="Location" value={pet.location} onChange={handleChange} required className="w-full p-2 border rounded mb-2" />
            <input type="text" name="health" placeholder="Health" value={pet.health} onChange={handleChange} className="w-full p-2 border rounded mb-2" />
            <input type="text" name="aggressionLevel" placeholder="Aggression Level" value={pet.aggressionLevel} onChange={handleChange} className="w-full p-2 border rounded mb-2" />
            <input type="text" name="color" placeholder="Color" value={pet.color} onChange={handleChange} className="w-full p-2 border rounded mb-2" />
            <input type="text" name="ownerPhoneNumber" placeholder="Owner Phone Number" value={pet.ownerPhoneNumber} onChange={handleChange} required className="w-full p-2 border rounded mb-2" />
           
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Pet</button>
        </form>
    );
};

export default AddPet;
