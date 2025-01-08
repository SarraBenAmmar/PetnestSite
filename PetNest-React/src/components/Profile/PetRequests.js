import React, { useEffect, useState } from 'react';
import PetRequestService from '../../services/PetRequestService';
import { fetchUserById } from '../../services/userService';
import Sidebar from './Sidebar';
import PetService from '../../services/PetService'; // Import the PetService
import { FaTrash } from 'react-icons/fa'; // Importing the trash icon from react-icons
import { Link } from 'react-router-dom'; // Import Link for navigation

const PetRequests = () => {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState({});
  const [pets, setPets] = useState({}); // Store pet details
  const [loading, setLoading] = useState(true);
  const isOwner = true;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await PetRequestService.getRequestsByUser();
        console.log('Fetched Requests:', response.data);
        if (Array.isArray(response.data)) {
          setRequests(response.data);
          await fetchUserDetails(response.data);
          await fetchPetDetails(response.data); // Fetch pet details
        } else {
          console.error('Expected an array, but got:', response.data);
          setRequests([]);
        }
      } catch (error) {
        console.error('Error fetching pet requests:', error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserDetails = async (requests) => {
      try {
        const usersMap = {};
        for (const request of requests) {
          const userId = request.senderId;
          if (!usersMap[userId]) {
            const user = await fetchUserById(userId);
            usersMap[userId] = user;
          }
        }
        setUsers(usersMap);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchPetDetails = async (requests) => {
      try {
        const petsMap = {};
        for (const request of requests) {
          const petId = request.petId;
          if (!petsMap[petId]) {
            const pet = await PetService.getPetById(petId);
            petsMap[petId] = pet.data; // Assuming the pet details are in pet.data
          }
        }
        setPets(petsMap);
      } catch (error) {
        console.error('Error fetching pet details:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await PetRequestService.updateRequestStatus(requestId, status);
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId ? { ...request, status } : request
        )
      );
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await PetRequestService.deletePetRequest(requestId);
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!Array.isArray(requests)) return <div>No requests found.</div>;

  return (
    <div className="flex">
      <Sidebar isOwner={isOwner} />
      <div className="flex-1 p-6 ml-64">
        <h2 className="text-2xl font-semibold mb-4">Pet Requests</h2>
        <div className="space-y-6">
          {requests.length === 0 ? (
            <div>No pet requests found.</div>
          ) : (
            requests.map((request) => {
              const user = users[request.senderId];
              const userImage =
                user?.image ||
                'https://cdn-icons-png.flaticon.com/256/15133/15133071.png';

              const pet = pets[request.petId]; // Get pet details for this request
              const petName = pet?.name || 'Unknown Pet'; // Fallback for missing pet name

              return (
                <div key={request.id} className="bg-white shadow rounded p-4 relative">
                  <button
                    onClick={() => handleDeleteRequest(request.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={20} />
                  </button>
                  <div className="flex items-center mb-4">
                    {user && (
                      <>
                        <img
                          src={
                            user.image
                              ? `data:image/jpeg;base64,${user.image}`
                              : userImage
                          }
                          alt="User"
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-semibold">
                            {user.firstName} {user.lastName}
                          </p>
                          <a
                            href={`/profile/${user.id}`}
                            className="text-blue-500"
                          >
                            View Profile
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{request.message}</h3>
                  <p className="text-gray-600 mb-2">
                    Requested on: {new Date(request.createdAt).toLocaleString()}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Pet Requested: <span className="font-semibold">{petName}</span>
                    <Link
                      to={`/pet-details/${request.petId}`}
                      className="ml-2 text-blue-500"
                    >
                      View Pet Details
                    </Link>
                  </p>
                  <p className="text-gray-600 mb-2">
                    Status:{' '}
                    <span
                      className={`px-2 py-1 rounded-full ${
                        request.status === 'APPROVED'
                          ? 'bg-green-500 text-white'
                          : request.status === 'REJECTED'
                          ? 'bg-red-500 text-white'
                          : 'bg-yellow-500 text-white'
                      }`}
                    >
                      {request.status}
                    </span>
                  </p>
                  <div className="space-x-4">
                    {request.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PetRequests;
