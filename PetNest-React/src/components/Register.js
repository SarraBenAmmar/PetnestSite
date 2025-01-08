import React, { useState } from 'react';
import authService from '../services/authService';
import { Link } from 'react-router-dom'; // Import Link component for navigation

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            const response = await authService.register({
                firstName,
                lastName,
                email,
                phoneNumber,
                country,
                address,
                city,
                password
            });
            console.log('Registration successful:', response);
            setSuccess(true);
            alert('Registration successful!');
        } catch (err) {
            setError('Registration failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center font-[sans-serif] bg-green-100 lg:h-screen p-4">
            {/* Home Link at the Top Left */}
            <div className="absolute top-4 left-4">
                <Link to="/" className="text-green-500 text-lg font-semibold hover:underline flex items-center">
                    Home <span className="ml-2 text-xl">→</span>
                </Link>
            </div>

            <div className="grid md:grid-cols-2 items-center gap-y-4 bg-white max-w-5xl w-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md overflow-hidden">
                {/* First Half with Image Background */}
                <div 
                    className="max-md:order-1 flex flex-col justify-center p-4 bg-cover bg-center w-full h-full"
                    style={{ backgroundImage: 'url(https://creator.nightcafe.studio/jobs/nfS1pNgfptO2y3OUid5Z/nfS1pNgfptO2y3OUid5Z--1--avf7n.jpg)', backgroundPosition: 'center', backgroundSize: 'cover' }}
                >
                    {/* No text inside the image anymore */}
                </div>

                {/* Second Half - Registration Form with White Background */}
                <form className="p-4 w-full bg-white" onSubmit={handleRegister}>
                    <div className="mb-6">
                        <h3 className="text-green-400 text-2xl font-extrabold text-center">Register</h3>
                    </div>

                    {/* Link to Login page at the top */}
                    <div className="text-center mb-4">
                        <Link to="/login" className="text-sm text-green-500 hover:underline">
                            Already have an account? Login
                        </Link>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4">
                        <div>
                            <label className="text-gray-800 text-sm mb-1 block">First Name</label>
                            <input 
                                name="firstName" 
                                type="text" 
                                className="bg-gray-100 w-full text-gray-800 text-sm px-2 py-2 rounded-md outline-blue-500" 
                                placeholder="Enter first name" 
                                value={firstName} 
                                onChange={(e) => setFirstName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="text-gray-800 text-sm mb-1 block">Last Name</label>
                            <input 
                                name="lastName" 
                                type="text" 
                                className="bg-gray-100 w-full text-gray-800 text-sm px-2 py-2 rounded-md outline-blue-500" 
                                placeholder="Enter last name" 
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="text-gray-800 text-sm mb-1 block">Email Id</label>
                            <input 
                                name="email" 
                                type="email" 
                                className="bg-gray-100 w-full text-gray-800 text-sm px-2 py-2 rounded-md outline-blue-500" 
                                placeholder="Enter email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="text-gray-800 text-sm mb-1 block">Mobile No.</label>
                            <input 
                                name="phoneNumber" 
                                type="tel" 
                                className="bg-gray-100 w-full text-gray-800 text-sm px-2 py-2 rounded-md outline-blue-500" 
                                placeholder="Enter mobile number" 
                                value={phoneNumber} 
                                onChange={(e) => setPhoneNumber(e.target.value)} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="text-gray-800 text-sm mb-1 block">Country</label>
                            <input 
                                name="country" 
                                type="text" 
                                className="bg-gray-100 w-full text-gray-800 text-sm px-2 py-2 rounded-md outline-blue-500" 
                                placeholder="Enter country" 
                                value={country} 
                                onChange={(e) => setCountry(e.target.value)} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="text-gray-800 text-sm mb-1 block">Address</label>
                            <input 
                                name="address" 
                                type="text" 
                                className="bg-gray-100 w-full text-gray-800 text-sm px-2 py-2 rounded-md outline-blue-500" 
                                placeholder="Enter address" 
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="text-gray-800 text-sm mb-1 block">City</label>
                            <input 
                                name="city" 
                                type="text" 
                                className="bg-gray-100 w-full text-gray-800 text-sm px-2 py-2 rounded-md outline-blue-500" 
                                placeholder="Enter city" 
                                value={city} 
                                onChange={(e) => setCity(e.target.value)} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="text-gray-800 text-sm mb-1 block">Password</label>
                            <input 
                                name="password" 
                                type="password" 
                                className="bg-gray-100 w-full text-gray-800 text-sm px-2 py-2 rounded-md outline-blue-500" 
                                placeholder="Enter password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="flex items-center mt-4">
                        <input 
                            id="remember-me" 
                            name="remember-me" 
                            type="checkbox" 
                            className="h-3 w-3 shrink-0" 
                            required 
                        />
                        <label htmlFor="remember-me" className="ml-2 text-gray-800 text-sm">
                            I agree to the <span className="text-green-500 cursor-pointer">terms and conditions</span>
                        </label>
                    </div>

                    {error && (
                        <div className="mt-4 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mt-4 text-green-500 text-sm text-center">
                            Registration successful! Please check your email for further instructions.
                        </div>
                    )}

                    <div className="mt-6">
                        <button 
                            type="submit" 
                            className="bg-green-400 text-white w-full py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
