import React, { useState } from 'react';
import authService from '../services/authService';
import localStorageService from '../services/localStorageService';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await authService.authenticate({ email, password });
            console.log('Login successful:', response);

            if (response.token && response.user) {
                localStorageService.setToken(response.token);
                localStorageService.setUserInfo(response.user);

                // Show the Snackbar
                setShowSnackbar(true);

                // Hide the Snackbar after 3 seconds
                setTimeout(() => {
                    setShowSnackbar(false);
                }, 3000);

                // Check if the logged-in user is an admin
                if (response.user.role === 'admin') {
                    navigate('/admin-dashboard'); // Redirect to admin dashboard
                } else {
                    navigate('/'); // Redirect to home page for non-admin users
                }
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error(err);
        }
    };

    return (
        <section className="bg-cover bg-center" style={{ backgroundImage: 'url(https://cdn.theanimegallery.com/theanimegallery/adb6f0c5-5a41-4f1f-9c9b-e3802259b321-cute-cat-wallpaper-cartoon.webp)' }}>
            <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
                <div className="w-full sm:max-w-md bg-white rounded-lg shadow-md p-8 space-y-6">
                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
                        Sign in to your account
                    </h1>

                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                placeholder="name@company.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                placeholder="••••••••" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-start">
                                <input 
                                    id="remember" 
                                    aria-describedby="remember" 
                                    type="checkbox" 
                                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600" 
                                />
                                <label htmlFor="remember" className="ml-3 text-sm text-gray-500 dark:text-gray-300">Remember me</label>
                            </div>
                            <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                        </div>
                        <button 
                            type="submit" 
                            className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                        >
                            Sign in
                        </button>
                    </form>

                    {error && <p className="mt-2 text-red-600 text-center">{error}</p>}

                    <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                        Don’t have an account yet? <Link to="/register" className="font-medium text-indigo-600 hover:underline dark:text-indigo-500">Sign up</Link>
                    </p>
                </div>
            </div>

            {/* Stylish Tailwind Snackbar with Smooth Transition */}
            {showSnackbar && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-50 text-green-800 p-4 mb-4 text-sm border border-green-300 rounded-lg shadow-lg opacity-100 transition-all duration-500">
                    <div className="flex items-center">
                        <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <div>
                            <span className="font-medium">Login successful!</span> You have logged in successfully.
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Login;
