import React from 'react';
import localStorageService from './services/localStorageService';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home'; // Ensure the file name matches exactly
import Register from './components/Register'; // Import your Register component
import Login from './components/Login'; // Ensure you import Login as well
import Dogs from './components/Pets/Dogs';
import Cats from './components/Pets/Cats'; 
import Other from './components/Pets/Other'; 
import Profile from './components/Profile/Profile';
import PetDetails from './components/PetDetails/PetDetails';
import GoogleMap from './components/PetDetails/ViewMap'; 
import Dashboard from './components/Admin Dashboard/Dashboard';
import UserDetails from './components/Admin Dashboard/UserDetails';
import EditUser from './components/Admin Dashboard/EditUser';
import Users from './components/Admin Dashboard/Users';
import AddUser from './components/Admin Dashboard/AddUser';
import Pets from './components/Admin Dashboard/pets';
import EditPet from './components/Admin Dashboard/EditPet';
import AddPet from './components/Admin Dashboard/AddPet';
import CatAPI from './components/Home/CatAPI'; 
import CatRandom from './components/Home/CatRandom'; 
import PetFilter from './components/Pets/PetFilter'; 
import FavoritePets from './components/Profile/FavoritePets';
import AccountSettings from './components/Profile/AccountSettings';
import PetRequests from './components/Profile/PetRequests';
import DogAPI from './components/Home/DogAPI'; 
import AddPetUser from './components/Home/AddPetUser';
import UserPets from './components/Profile/UserPets';
const App = () => {
    const currentUser = localStorageService.getUserInfo(); // Retrieve user info from localStorage
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dogs" element={<Dogs />} />
                <Route path="/cats" element={<Cats />} />
                <Route path="/other" element={<Other />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/pet-details/:petId" element={<PetDetails />} />
                <Route path="/admin-dashboard" element={<Dashboard />} /> 
                <Route path="/user-details/:id" element={<UserDetails />} />
                <Route path="/edit-user/:userId" element={<EditUser />} />
                <Route path="/add-user" element={<AddUser />} />
                <Route path="/users" element={<Users />} />
                <Route path="/pets" element={<Pets />} />
                <Route path="/edit-pet/:petId" element={<EditPet />} />
                <Route path="/add-pet" element={<AddPet />} />
                <Route path="/cat-api" element={<CatAPI />} />
                <Route path="/dog-api" element={<DogAPI />} />
                <Route path="/cat-random" element={<CatRandom />} />
                <Route path="/filter-pets" element={<PetFilter />} />
                <Route path="/profile/:id/favorites" element={<FavoritePets />} />
                <Route path="/profile/:id/pet-requests" element={<PetRequests />} />
                <Route path="/profile/:id/account-settings" element={<AccountSettings />} />
                <Route path="/map/:location" element={<GoogleMap />} />
                <Route path="/add-userpet" element={<AddPetUser currentUser={currentUser} />} />
                <Route path="/profile/:id/user-pets" element={<UserPets />} />


               
            </Routes>
        </Router>
    );
};

export default App;
