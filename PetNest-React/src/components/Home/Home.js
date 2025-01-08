import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import localStorageService from '../../services/localStorageService';
import PetService from '../../services/PetService';
import FavService from '../../services/FavService';
import PetRequestService from '../../services/PetRequestService';


const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [cats, setCats] = useState([]);
    const [likedCats, setLikedCats] = useState([]);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [selectedCat, setSelectedCat] = useState(null);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorageService.getToken();
        if (token) {
            setIsAuthenticated(true);
            const userInfo = localStorageService.getUserInfo();
            console.log('User Info:', userInfo);
            setUserInfo(userInfo || null);
        }
        fetchCats();
    }, []);

    const fetchCats = async () => {
        try {
            const response = await PetService.getPetsByCategory('CAT');
            const catsWithBase64Images = response.data.map(cat => ({
                ...cat,
                image: cat.image ? `data:image/jpeg;base64,${cat.image}` : 'https://via.placeholder.com/150'
            }));
            setCats(catsWithBase64Images.slice(0, 4));
        } catch (error) {
            console.error('Error fetching cats:', error);
            setErrorMessage('Failed to fetch cats. Please try again later.');
        }
    };
    const handleAddPetClick = () => {
        navigate('/add-userpet'); // Navigate to the Add Pet form for Users
    };

    const handleProfileClick = () => {
        if (userInfo) {
            navigate(`/profile/${userInfo.id}`);
        }
    };

    const handleViewDetails = (id) => {
        navigate(`/pet-details/${id}`);
    };

    const handleAdminDashboard = () => {
        navigate('/admin-dashboard');
    };

    const handleAddToFavorites = async (petId) => {
        const token = localStorageService.getToken();
        if (!token) {
            alert("You need to be logged in to add pets to favorites.");
            navigate('/login');
            return;
        }

        const confirmAdd = window.confirm("Are you sure you want to add this pet to your favorites?");
        if (confirmAdd) {
            try {
                await FavService.addPetToFav(petId);
                alert("Pet added to your favorites successfully!");
                setLikedCats(prevLikedCats => [...prevLikedCats, petId]);
            } catch (error) {
                alert("Failed to add pet to favorites. Please try again.");
                console.error("Error adding pet to favorites:", error);
            }
        }
    };

    const handleAdoptNow = (cat) => {
        const token = localStorageService.getToken();
        if (!token) {
            alert("You need to be logged in to request a pet.");
            navigate('/login');
            return;
        }

        setSelectedCat(cat);
        setShowRequestForm(true);
    };

    const handleSubmitRequest = async () => {
        const token = localStorageService.getToken();
        if (!token) {
            alert("You need to be logged in to request a pet.");
            navigate('/login');
            return;
        }

        if (!message.trim()) {
            setErrorMessage("Please write a message before submitting your request.");
            return;
        }

        const requestPetDTO = {
            petId: selectedCat.id,
            message: message,
        };

        try {
            await PetRequestService.requestPet(requestPetDTO);
            alert("Your pet adoption request has been sent successfully!");
            setShowRequestForm(false);
            setMessage('');
            setErrorMessage('');
        } catch (error) {
            alert("Failed to send the adoption request. Please try again.");
            console.error("Error requesting pet:", error);
            setErrorMessage("Failed to send the request. Please try again later.");
        }
    };
    const handleClick = () => {
        navigate(`/profile/${userInfo.id}/pet-requests`);
    };
 
    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Navbar Section */}
            <nav className="bg-gray-800 shadow m-0 p-0">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
                <img className="h-14 w-auto" src='https://cdn-icons-png.flaticon.com/512/16770/16770270.png' alt="Petnest" />
            </div>
            <div className="hidden sm:block">
                <div className="flex space-x-4">
                    
                    <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                    <Link to="/cats" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Pets</Link>
                    {/* Afficher les liens de connexion et d'inscription uniquement si l'utilisateur n'est pas authentifié */}
                    {!isAuthenticated && (
                        <>
                            <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                            <Link to="/register" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Register</Link>
                        </>
                    )}
                </div>
            </div>
            <div className="flex items-center">
                {isAuthenticated && userInfo && (
                    <>
                        <button 
                            type="button" 
                            className="text-gray-400 hover:text-white focus:outline-none" 
                            onClick={handleClick}
                        >
                            <span className="sr-only">View notifications</span>
                            <svg 
                                className="h-6 w-6" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth="1.5" 
                                stroke="currentColor" 
                                aria-hidden="true"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" 
                                />
                            </svg>
                        </button>

                        <div className="relative ml-3">
                            <button type="button" className="flex rounded-full focus:outline-none" onClick={handleProfileClick}>
                                <img 
                                    src={userInfo.image ? `data:image/jpeg;base64,${userInfo.image}` : "https://cdn-icons-png.flaticon.com/256/15133/15133071.png"} 
                                    alt="User" 
                                    className="h-10 w-10 rounded-full shadow-md"
                                />
                            </button>
                        </div>
                        {userInfo.roleEnum === 'Admin' && (
                            <button onClick={handleAdminDashboard} className="ml-4 px-4 py-2 bg-white-600 text-white rounded-md hover:bg-blue-700 transition duration-200">Admin Dashboard</button>
                        )}
                    </>
                )}
            </div>
        </div>
    </div>
</nav>


            {/* Banner Section */}
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between p-6 bg-white shadow-lg rounded-lg mt-6">
                <div className="text-section md:w-1/2">
                    <h1 className="text-5xl font-bold text-gray-800">Every Pet Deserves a Home</h1>
                    <p className="mt-4 mb-5 text-gray-600 text-lg">Over a thousand rescued pets need a proper home and a second chance.</p>
                    <Link to="/cats" className="mt-10 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition duration-200">Adopt Now</Link>
                </div>
                <div className="image-section md:w-1/2 mt-6 md:mt-0">
                    <img className="rounded-lg shadow-lg w-full h-auto" src="https://static.vecteezy.com/system/resources/thumbnails/049/078/861/small/a-young-woman-hug-and-love-adorable-kitten-cat-in-warmth-when-the-weather-is-cold-warmth-between-people-and-pets-ai-genertaed-free-photo.jpg" alt="Pet with a woman hugging it" />
                </div>
            </div>
           
  <section class="py-12">
    <div class="text-center mb-8">
      <h2 class="text-xl font-semibold">Some Of Our Supporters</h2>
    </div>
    <div class="flex justify-center gap-8">
      <img src="https://purepng.com/public/uploads/large/purepng.com-21st-century-fox-logologobrand-logoiconslogos-251519940210z2ben.png" alt="21st Century Fox" class="h-12" />
      <img src="https://images.squarespace-cdn.com/content/v1/5bdc6b1b4611a0e252df5754/1553690101544-TD8PPB92Y2H20EIJQA2P/AC-Logo-Landscape.png" alt="Adoption" class="h-12" />
      <img src="https://companieslogo.com/img/orig/WW_BIG-1d986e25.png?t=1720244494" alt="Weight Watchers" class="h-12" />
      <img src="https://logos-world.net/wp-content/uploads/2020/09/Oracle-Logo.png" alt="Oracle" class="h-12" />
      <img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Ogilvy_logo.svg/1200px-Ogilvy_logo.svg.png" alt="Ogilvy" class="h-12" />
    </div>
  </section>

            {/* Pets Available Section */}
            <div className="container mx-auto mt-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Find Your Perfect Pet</h2>
                <div className="flex justify-center mb-4">
                    <Link to="/cats" className="bg-indigo-600 text-white px-6 py-2 rounded-md mx-2 hover:bg-indigo-700 transition duration-200">Cats</Link>
                    <Link to="/dogs" className="bg-gray-400 text-white px-6 py-2 rounded-md mx-2 hover:bg-gray-500 transition duration-200">Dogs</Link>
                    <Link to="/other" className="bg-gray-400 text-white px-6 py-2 rounded-md mx-2 hover:bg-gray-500 transition duration-200">Other</Link>
                </div>
            </div>

            {/* Pets List Section */}
            <div className="container mx-auto mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cats.map((cat) => (
                        <div key={cat.id} className="max-w-xs w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
                            <div className="relative">
                                <img src={cat.image || 'https://via.placeholder.com/150'} alt={cat.name} className="w-full h-48 object-cover rounded-t-lg" />
                            </div>

                            <div className="p-3 space-y-2">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{cat.name}</h3>
                                    <p className="text-gray-500 text-sm">Breed: {cat.breed}</p>
                                    <p className="text-gray-500 text-sm">Location: {cat.location}</p>
                                </div>
                                {isAuthenticated && (
                                    <div className="flex justify-between items-center">
                                        <button 
                                            onClick={() => handleAddToFavorites(cat.id)} 
                                            className={`text-red-500 ${likedCats.includes(cat.id) ? 'hover:text-red-700' : ''}`}>
                                            {likedCats.includes(cat.id) ? '❤️' : '🤍'}
                                        </button>
                                    </div>
                                )}
                                <div className="flex justify-between mt-2">
                                    <button onClick={() => handleViewDetails(cat.id)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1 rounded-lg transition-colors mr-1 text-sm">View Details</button>
                                    <button onClick={() => handleAdoptNow(cat)} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-1 rounded-lg transition-colors text-sm">Adopt Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Adoption Request Form - Modal Style */}
            {showRequestForm && selectedCat && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4 text-center">Request to Adopt {selectedCat.name}</h3>
                        {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
                        <textarea
                            className="w-full p-2 border rounded-md mb-4 h-32"
                            placeholder="Write a message to the pet owner"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={handleSubmitRequest}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                            >
                                Submit Request
                            </button>
                            <button
                                onClick={() => setShowRequestForm(false)}
                                className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Carousel Section */}
            <div id="default-carousel" className="relative w-full mt-10" data-carousel="slide">
                <div className="flex justify-between">
                    <div className="relative w-1/2">
                        <div className="duration-700 ease-in-out" data-carousel-item>
                            <img src="https://static.vecteezy.com/system/resources/previews/035/381/164/non_2x/ai-generated-a-tabby-cat-looks-up-into-the-sun-free-photo.jpg" className="w-full h-29 object-cover" alt="Image 1" />
                            <Link to="/cat-api" type="button" className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-pink-700 text-white py-2 px-4 rounded-md ml-20" data-carousel-prev>
                            Search Breed
                            </Link>
                        </div>
                    </div>
                    <div className="relative w-1/2">
                        <div className="duration-700 ease-in-out" data-carousel-item>
                            <img src="https://t3.ftcdn.net/jpg/06/48/19/28/360_F_648192868_oyE6E18hE4ULtxXolCqy0USyCcyL2yUr.jpg" className="w-full h-35 object-cover" alt="Image 2" />
                            <Link to="/dog-api" type="button" className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white py-2 px-4 rounded-md mr-20" data-carousel-next>
                                Search Breed
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

              {/* Pet Adoption Journey Section */}
              <section className="bg-white py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold">Your Pet Adoption Journey With Us</h2>
                </div>
                <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                    {/* Journey Steps */}
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center gap-4">
                            <img src="https://cdn-icons-png.flaticon.com/256/5406/5406436.png" alt="Search Icon" className="h-12" />
                            <div>
                                <h3 className="text-lg font-semibold">Search Pet</h3>
                                <p className="text-gray-600">Find the perfect pet for you! Simply enter your city above to start your search for your new furry friend.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <img src="https://cdn-icons-png.flaticon.com/512/6349/6349397.png" alt="Vet Icon" className="h-12" />
                            <div>
                                <h3 className="text-lg font-semibold">Request Pet</h3>
                                <p className="text-gray-600">Can’t find the pet you’re looking for? Let us know your preferences, and we’ll help match you with the right companion.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <img src="https://cdn-icons-png.flaticon.com/256/10341/10341383.png" alt="AdoptLove Icon" className="h-12" />
                            <div>
                                <h3 className="text-lg font-semibold">Adopt</h3>
                                <p className="text-gray-600">Begin your adoption journey! Once you’re ready, the rescue team or current pet parents will guide you through the adoption process.
</p>
                            </div>
                        </div>
                    </div>
                    {/* Image Section */}
                    <div className="flex-1">
                        <img src="https://img.freepik.com/free-photo/medium-shot-anime-woman-hugging-cat_23-2150970703.jpg"  className="w-30 h-30 rounded-full border-2 border-indigo-500 mr-4"/>
                    </div>
                </div>
            </section>
            <div class="bg-gray-50 py-10">
  

  <div class="text-center mb-10">
    <h2 class="text-2xl font-semibold">Get Our Newsletter</h2>
    <p class="text-gray-500">To join the worldwide community</p>
    <div class="mt-5 flex justify-center">
      <div class="relative">
        <input
          type="email"
          placeholder="Type your Email Address"
          class="w-80 px-4 py-3 text-sm text-gray-700 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
        />
        <button
          class="absolute right-1 top-1 h-10 px-5 text-sm text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg hover:from-pink-600 hover:to-purple-600 shadow-md"
        >
          Send Now
        </button>
      </div>
    </div>
  </div>

  
  <div class="container mx-auto px-5">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center sm:text-left">
     
      <div>
        <h3 class="text-lg font-semibold">Petnest</h3>
        <p class="text-sm text-gray-500">Copyright © 2020. Logolpsum. All rights reserved.</p>
        <div class="mt-3 flex justify-center sm:justify-start space-x-3">
          <a href="#" class="text-gray-500 hover:text-gray-700">
            <i class="fab fa-facebook"></i>
          </a>
          <a href="#" class="text-gray-500 hover:text-gray-700">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="#" class="text-gray-500 hover:text-gray-700">
            <i class="fab fa-instagram"></i>
          </a>
        </div>
      </div>

     
      <div>
        <h3 class="text-lg font-semibold">Services</h3>
        <ul class="mt-3 space-y-2">
          <li><a href="#" class="text-gray-500 hover:text-gray-700">Home</a></li>
          <li><a href="#" class="text-gray-500 hover:text-gray-700">Product</a></li>
          <li><a href="#" class="text-gray-500 hover:text-gray-700">Category</a></li>
          <li><a href="#" class="text-gray-500 hover:text-gray-700">About</a></li>
        </ul>
      </div>

    
      <div>
        <h3 class="text-lg font-semibold">About</h3>
        <ul class="mt-3 space-y-2">
          <li><a href="#" class="text-gray-500 hover:text-gray-700">Our Story</a></li>
          <li><a href="#" class="text-gray-500 hover:text-gray-700">Benefits</a></li>
          <li><a href="#" class="text-gray-500 hover:text-gray-700">Team</a></li>
          <li><a href="#" class="text-gray-500 hover:text-gray-700">Careers</a></li>
        </ul>
      </div>
    </div>
  </div>

  
  <div class="mt-10 text-center">
    <a href="#" class="inline-block w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-md text-white hover:from-pink-600 hover:to-purple-600">
      <i class="fas fa-chevron-up">😺</i>
    </a>
  </div>
</div>

        </div>
        
    );
};

export default Home;
