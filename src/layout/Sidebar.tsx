import {
  FaBox,
  FaBriefcase,
  FaChalkboardTeacher,
  FaUsers,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100 shadow-xl rounded-r-3xl p-6 h-screen overflow-y-scroll flex flex-col [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
      <img
        src="/assets/logo.png"
        alt="logo"
        className="h-[10rem] w-[17rem]"
        onClick={() => {
          navigate("/dashboard");
        }}
      />
      <div className="mb-4">
        <button
          onClick={() => navigate("/dashboard-analytics")}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
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
          icon={<FaUsers />}
          title="Users"
          items={[
            { href: "/users", label: "All Users" },
            { href: "/allotted-calls", label: "Allotted Calls" },
          ]}
        />
        <SidebarSection
          icon={<FaBox />}
          title="Products"
          items={[
            { href: "/product-table", label: "All Products" },
            { href: "/add-products", label: "Add Product" },
            { href: "/add-sku", label: "Add SKU" },
            { href: "/all-sku", label: "All SKU" },
          ]}
        />
        <SidebarSection
          icon={<FaChalkboardTeacher />}
          title="Workshops"
          items={[
            { href: "/active-workshops", label: "Active Workshops" },
            { href: "/workshop-enquiries", label: "Enquiries" },
            { href: "/assesment-form", label: "Assessment Form" },
            { href: "/call-request", label: "Call Requests" },
            { href: "/assesment-reports", label: "Assessment Reports" },
          ]}
        />
        <SidebarSection
          icon={<FaBriefcase />}
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
  <div className="p-6">
    <div className="flex items-center mb-3">
      <span className="text-gray-600 mr-2">{icon}</span>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
    <ul className="space-y-2 pl-8">
      {items.map((item, index) => (
        <li key={index}>
          <NavLink
            to={item.href}
            className={({ isActive }) =>
              `text-gray-600 hover:text-blue-600 transition-colors duration-200 ${
                isActive ? "text-blue-600 font-semibold" : ""
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
