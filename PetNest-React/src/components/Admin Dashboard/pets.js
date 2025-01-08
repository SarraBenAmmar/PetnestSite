import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Ajout de Link ici
import PetService from '../../services/PetService';
import Sidebar from './Sidebar'; // Assurez-vous que le chemin est correct
import { FaSearch } from 'react-icons/fa'; // Importer l'icône de recherche

const Pets = () => {
    const [pets, setPets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await PetService.getPets();
                // Filtrer les animaux pour exclure ceux qui sont désactivés
                const activePets = response.data.filter(pet => !pet.desactivated); // ou pet.desactivated === 0
                setPets(activePets);
            } catch (error) {
                console.error('Error fetching pets:', error);
            }
        };

        fetchPets();
    }, []);

    const handleDeactivate = async (id) => {
        try {
            await PetService.deletePetById(id);
            setPets(pets.filter(pet => pet.id !== id)); // Met à jour la liste après suppression
        } catch (error) {
            console.error('Error deactivating pet:', error);
        }
    };

    const handleAddPet = () => {
        navigate('/add-pet'); // Remplacez par la route d'ajout d'animal
    };

    const filteredPets = pets.filter(pet => 
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        pet.petCategory.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />

            <div className="container mx-auto px-4 py-6 flex-1">
                <div className="mb-4 flex items-center">
                    <div className="relative w-full">
                        <input 
                            type="text" 
                            placeholder="Rechercher par nom ou type..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="border border-gray-300 rounded-full p-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <FaSearch className="absolute left-3 top-2 text-gray-500" />
                    </div>
                </div>
                <button 
                    className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                    onClick={handleAddPet}
                >
                    Add Pet
                </button>
                <div className="bg-white shadow-md rounded overflow-hidden">
                    <table className="min-w-full border-collapse block md:table">
                        <thead className="block md:table-header-group">
                            <tr className="border border-gray-300 md:table-row">
                                <th className="block md:table-cell p-2 text-left">Image</th> {/* Image en premier */}
                                <th className="block md:table-cell p-2 text-left">ID</th>
                                <th className="block md:table-cell p-2 text-left">Name</th>
                                <th className="block md:table-cell p-2 text-left">Type</th>
                                <th className="block md:table-cell p-2 text-left">Breed</th> {/* Nouvelle colonne pour la race */}
                                <th className="block md:table-cell p-2 text-left">Actions</th> {/* Actions à la fin */}
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group">
                            {filteredPets.map(pet => (
                                <tr key={pet.id} className="border border-gray-300 md:table-row">
                                    <td className="block md:table-cell p-2 pr-15">
                                        {/* Check if image exists and render as Base64 */}
                                        {pet.image ? (
                                            <img 
                                                src={`data:image/jpeg;base64,${pet.image}`}  // Assuming it's JPEG, adjust MIME type if necessary
                                                alt={pet.name} 
                                                className="w-10 h-10 rounded-full"
                                            />
                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </td>
                                    <td className="block md:table-cell p-2 pr-10">{pet.id}</td>
                                    <td className="block md:table-cell p-2 pr-10">{pet.name}</td>
                                    <td className="block md:table-cell p-2 pr-10">{pet.petCategory}</td>
                                    <td className="block md:table-cell p-2 pr-12">{pet.breed}</td> {/* Ajout de marge droite ici */}
                                    <td className="block md:table-cell p-2">
                                        <Link to={`/pet-details/${pet.id}`} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Voir Détails</Link>
                                        <Link to={`/edit-pet/${pet.id}`} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Modifier</Link>
                                        <button 
                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                            onClick={() => handleDeactivate(pet.id)}
                                        >
                                            Désactiver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Pets;
