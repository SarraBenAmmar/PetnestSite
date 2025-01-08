import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams hook for URL params
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const GoogleMap = () => {
    const { location } = useParams(); // Get the location parameter from the URL
    const [locationData, setLocationData] = useState(null);
    const [error, setError] = useState(null);
    const mapRef = useRef(null);
    const mapInstance = useRef(null); // Use ref to store the map instance
    const markerRef = useRef(null); // Use ref to store the marker instance

    const fetchLocation = async () => {
        if (!location) {
            setError('Location parameter is missing');
            return;
        }

        try {
            // Call the OSM Nominatim API with location as a query parameter
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=json&addressdetails=1&limit=1`);

            if (!response.ok) {
                throw new Error('Failed to fetch location data');
            }

            const data = await response.json(); // Parse the JSON response directly

            // Check if the location data contains lat and lon
            if (data.length === 0 || !data[0].lat || !data[0].lon) {
                throw new Error('Invalid data received from OSM');
            }

            setLocationData({
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
            });
        } catch (error) {
            console.error('Error fetching location:', error);
            setError(error.message); // Handle error
        }
    };

    useEffect(() => {
        fetchLocation(); // Fetch location data when the component mounts or location changes
    }, [location]);

    useEffect(() => {
        if (locationData && !mapInstance.current) {
            // Initialize the map only if it's not already initialized
            mapInstance.current = L.map(mapRef.current).setView([locationData.lat, locationData.lng], 14);

            // Add OpenStreetMap tiles as the base layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(mapInstance.current);

            // Set the default icon for the marker (this is to avoid issues with missing icons)
            const icon = L.icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
            });

            // Create a marker with the custom icon and store it in the markerRef
            markerRef.current = L.marker([locationData.lat, locationData.lng], { icon }).addTo(mapInstance.current);
        }

        if (locationData && mapInstance.current && markerRef.current) {
            // If map is already initialized, just update the view and marker
            mapInstance.current.setView([locationData.lat, locationData.lng], 14);
            markerRef.current.setLatLng([locationData.lat, locationData.lng]);
        }
    }, [locationData]);

    // Display error message if something went wrong
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Display loading message if location data is not yet available
    if (!locationData) {
        return <div>Loading map...</div>;
    }

    return (
        <div
            ref={mapRef}
            style={{
                width: '100%',
                height: '100vh', // Make the map full screen
                borderRadius: '0px', // Optional: remove rounded corners
                boxShadow: 'none', // Optional: remove box shadow
            }}
        ></div>
    );
};

export default GoogleMap;
