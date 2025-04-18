import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import { useState } from "react";
// import { FaChevronDown, FaSignOutAlt, FaUser } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

const Header = () => {
  // const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user } = useUser();

  return (
    <header className="flex items-center w-full h-16 px-4 bg-white shadow-md ">
      <div className="flex items-center justify-between w-full">
        <div className="text-2xl font-bold tracking-tight text-gray-800 ">
          {(() => {
            const pathSegments = window.location.pathname
              .split("/")
              .filter(Boolean);
            const lastSegment = pathSegments.pop() || "";

            // Check if last segment is a MongoDB ObjectId (24 hex chars)
            if (
              /^[0-9a-f]{24}$/i.test(lastSegment) &&
              pathSegments.length > 0
            ) {
              // Use the previous segment (e.g., "user" or "product")
              return pathSegments[pathSegments.length - 1]
                .replace(/[_-]/g, " ")
                .replace(/([A-Z])/g, " $1")
                .trim()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            }

            // Original behavior for non-ObjectId endpoints
            return (
              lastSegment
                .replace(/[_-]/g, " ")
                .replace(/([A-Z])/g, " $1")
                .trim()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ") || "Dashboard"
            );
          })()}
        </div>
        <div className="relative">
          <button
            className="flex items-center space-x-3 focus:outline-none"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            {/* <img
                src="/assets/profile.jpg"
                alt="User avatar"
                className="object-cover w-10 h-10 rounded-full"
              /> */}
            <SignedIn>
              <UserButton />
            </SignedIn>
            <span className="font-medium">{user?.fullName || "John Doe"}</span>
            {/* <FaChevronDown
                className={`transition-transform duration-300 ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
              /> */}
          </button>
          {/* {userMenuOpen && (
              <div className="absolute right-0 z-10 w-48 py-1 mt-2 bg-white rounded-md shadow-lg">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm transition duration-150 ease-in-out hover:bg-gray-100"
                  onClick={() => {
                    navigate("/UserProfile");
                    setUserMenuOpen(false);
                  }}
                >
                  <FaUser className="mr-2" />
                  Profile
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm transition duration-150 ease-in-out hover:bg-gray-100">
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            )} */}
        </div>
      </div>
    </header>
  );
};

export default Header;
