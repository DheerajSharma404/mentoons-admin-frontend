import { FaBox, FaBriefcase, FaUsers } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl rounded-r-3xl p-4 h-screen overflow-y-scroll flex flex-col [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#ffb74d] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 transition-transform duration-200 cursor-pointer focus:outline-none hover:scale-105"
      >
        <img
          src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
          alt="Mentoons Dashboard Logo"
          className="object-contain w-full"
        />
      </button>
      <div className="flex items-center justify-between px-4 py-3 mb-6 transition-all duration-200 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl hover:shadow-xl">
        <button
          onClick={() => navigate("/dashboard-analytics")}
          className="flex items-center text-gray-700 hover:text-[#ff9800] transition-colors duration-200 w-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mx-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Dashboard
        </button>
      </div>
      <nav className="flex-grow">
        <SidebarSection
          icon={<FaUsers className="text-[#ff9800]" />}
          title="Users"
          items={[
            { href: "/users", label: "All Users" },
            { href: "/allotted-calls", label: "Allotted Calls" },
          ]}
        />
        <SidebarSection
          icon={<FaBox className="text-[#ff9800]" />}
          title="Products"
          items={[
            { href: "/product-table", label: "All Products" },
            { href: "/add-products", label: "Add Product" },
          ]}
        />
        <SidebarSection
          icon={<FaBriefcase className="text-[#ff9800]" />}
          title="Career Corner"
          items={[
            { href: "/all-jobs", label: "All Jobs" },
            { href: "/hiring-form", label: "Add Job" },
            { href: "/view-applications", label: "View Applications" },
          ]}
        />
      </nav>
    </div>
  );
};

interface SidebarSectionProps {
  icon: React.ReactNode;
  title: string;
  items: { href: string; label: string }[];
}

const SidebarSection = ({ icon, title, items }: SidebarSectionProps) => (
  <div className="mb-6 group">
    <div className="flex items-center px-4 py-3 transition-all duration-200 rounded-xl hover:bg-white/80">
      <span className="mr-3 text-xl transition-transform group-hover:scale-110">
        {icon}
      </span>
      <h2 className="text-lg font-medium text-gray-800">{title}</h2>
    </div>
    <ul className="pl-6 space-y-1">
      {items.map((item, index) => (
        <li key={index}>
          <NavLink
            to={item.href}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-[#fff3e0] text-[#ff9800] font-medium shadow-md"
                  : "text-gray-600 hover:bg-white/80 hover:text-[#ff9800]"
              }`
            }
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  </div>
);

export default Sidebar;
