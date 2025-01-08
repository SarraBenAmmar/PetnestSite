import React, { useState } from 'react';

const PetFilterBar = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        location: '',
        breed: '',
        gender: '',
        color: ''
    });

    // Update filters state and notify parent component
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const updatedFilters = { ...filters, [name]: value };
        setFilters(updatedFilters);
        if (onFilterChange) onFilterChange(updatedFilters); // Notify parent
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
                type="text"
                name="location"
                placeholder="Location"
                value={filters.location}
                onChange={handleFilterChange}
                className="p-2 border rounded"
            />
            <input
                type="text"
                name="breed"
                placeholder="Breed"
                value={filters.breed}
                onChange={handleFilterChange}
                className="p-2 border rounded"
            />
            <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="p-2 border rounded"
            >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            <input
                type="text"
                name="color"
                placeholder="Color"
                value={filters.color}
                onChange={handleFilterChange}
                className="p-2 border rounded"
            />
        </div>
    );
};

export default PetFilterBar;
