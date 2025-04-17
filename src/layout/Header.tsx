import { SignedIn, UserButton } from "@clerk/clerk-react";
import { useState } from "react";
// import { FaChevronDown, FaSignOutAlt, FaUser } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

const Header = () => {
  // const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="w-full shadow-md rounded-l-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight">
            Mentoon's, Admin Panel
          </div>
          <div className="relative">
            <button
              className="flex items-center space-x-3 focus:outline-none"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              {/* <img
                src="/assets/profile.jpg"
                alt="User avatar"
                className="w-10 h-10 rounded-full object-cover"
              /> */}
              <SignedIn>
                <UserButton />
              </SignedIn>
              <span className="font-medium">John Doe</span>
              {/* <FaChevronDown
                className={`transition-transform duration-300 ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
              /> */}
            </button>
            {/* {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition duration-150 ease-in-out"
                  onClick={() => {
                    navigate("/UserProfile");
                    setUserMenuOpen(false);
                  }}
                >
                  <FaUser className="mr-2" />
                  Profile
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition duration-150 ease-in-out">
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
