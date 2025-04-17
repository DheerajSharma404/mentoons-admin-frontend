import React, { useState } from "react";
import EditProfile from "../components/Users/EditProfile";
import Modal from "../components/common/Modal";

const UserProfile = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    position: "Front-end Developer",
    location: "New York, USA",
    bio: "Passionate about creating beautiful and functional web interfaces.",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Updated user details:", userDetails);
    setShowEditModal(false);
  };

  return (
    <div className="flex flex-col h-screen p-6 w-full">
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <EditProfile
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          userDetails={userDetails}
          setShowEditModal={setShowEditModal}
        />
      </Modal>
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <div className="flex space-x-6">
        <div className="max-w-sm overflow-hidden bg-white rounded-lg shadow-lg hover:shadow-blue-400">
          <div className="relative">
            <img
              className="w-full h-48 object-cover"
              src="/assets/profile.jpg"
              alt="Profile Image"
            />
          </div>
          <div className="px-6 py-4">
            <div className="text-xl font-semibold text-gray-800">
              {userDetails.name}
            </div>
            <p className="text-gray-600">{userDetails.position}</p>
          </div>
          <div className="px-6 py-4">
            <span className="inline-block px-2 py-1 font-semibold text-teal-900 bg-teal-200 rounded-full">
              Web
            </span>
            <span className="inline-block px-2 py-1 font-semibold text-indigo-900 bg-indigo-200 rounded-full">
              UI/UX
            </span>
            <span className="inline-block px-2 py-1 font-semibold text-purple-900 bg-purple-200 rounded-full">
              Design
            </span>
          </div>
          <div className="px-6 py-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-500 hover:underline"
            >
              {showDetails ? "Hide Profile" : "View Profile"}
            </button>
          </div>
        </div>
        {showDetails && (
          <div className="flex-1 overflow-hidden bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">User Details</h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Name: </span> {userDetails.name}
              </p>
              <p>
                <span className="font-semibold">Email: </span>{" "}
                {userDetails.email}
              </p>
              <p>
                <span className="font-semibold">Position: </span>{" "}
                {userDetails.position}
              </p>
              <p>
                <span className="font-semibold">Location: </span>{" "}
                {userDetails.location}
              </p>
              <p>
                <span className="font-semibold">Bio: </span> {userDetails.bio}
              </p>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 inline-block"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
