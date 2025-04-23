import { useState, useEffect, useRef } from "react";
import {
  FaBox,
  FaBriefcase,
  FaChalkboardTeacher,
  FaUsers,
  FaChevronRight,
} from "react-icons/fa";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Tooltip } from "react-tooltip";

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

const Sidebar = ({ onToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const shouldCollapse = window.innerWidth <= 768;
      setIsCollapsed(shouldCollapse);

      if (onToggle) {
        onToggle(shouldCollapse);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [onToggle]);

  useEffect(() => {
    setExpandedSection(null);
  }, [location.pathname]);

  const toggleSection = (title: string) => {
    if (expandedSection === title) {
      setExpandedSection(null);
    } else {
      setExpandedSection(title);
    }
  };

  return (
    <aside
      className={`bg-gray-100 shadow-xl rounded-r-3xl transition-all duration-300 ease-in-out h-screen relative flex flex-col
      ${isCollapsed ? "w-16" : "w-full"} 
      [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100`}
    >
      <div className={`flex justify-center ${isCollapsed ? "py-2" : "py-4"}`}>
        <img
          src="/assets/logo.png"
          alt="logo"
          className={`cursor-pointer transition-all duration-300 object-contain ${
            isCollapsed ? "h-10 w-10" : "h-16 w-auto"
          }`}
          onClick={() => navigate("/dashboard")}
          data-tooltip-id="logo-tooltip"
          data-tooltip-content="Go to Dashboard"
        />
        <Tooltip id="logo-tooltip" place="right" />
      </div>

      {!isCollapsed && (
        <div className="mb-4 px-4">
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
      )}

      <nav className="flex-grow overflow-y-auto px-2">
        <SidebarSection
          icon={<FaUsers size={isCollapsed ? 20 : 16} />}
          title="Users"
          items={[
            { href: "/users", label: "All Users" },
            { href: "/allotted-calls", label: "Allotted Calls" },
          ]}
          isCollapsed={isCollapsed}
          isExpanded={expandedSection === "Users"}
          toggleSection={() => toggleSection("Users")}
          closeSection={() => setExpandedSection(null)}
        />
        <SidebarSection
          icon={<FaBox size={isCollapsed ? 20 : 16} />}
          title="Products"
          items={[
            { href: "/product-table", label: "All Products" },
            { href: "/add-products", label: "Add Product" },
            { href: "/add-sku", label: "Add SKU" },
            { href: "/all-sku", label: "All SKU" },
          ]}
          isCollapsed={isCollapsed}
          isExpanded={expandedSection === "Products"}
          toggleSection={() => toggleSection("Products")}
          closeSection={() => setExpandedSection(null)}
        />
        <SidebarSection
          icon={<FaChalkboardTeacher size={isCollapsed ? 20 : 16} />}
          title="Workshops"
          items={[
            { href: "/active-workshops", label: "Active Workshops" },
            { href: "/workshop-enquiries", label: "Enquiries" },
            { href: "/assesment-form", label: "Assessment Form" },
            { href: "/call-request", label: "Call Requests" },
            { href: "/assesment-reports", label: "Assessment Reports" },
          ]}
          isCollapsed={isCollapsed}
          isExpanded={expandedSection === "Workshops"}
          toggleSection={() => toggleSection("Workshops")}
          closeSection={() => setExpandedSection(null)}
        />
        <SidebarSection
          icon={<FaBriefcase size={isCollapsed ? 20 : 16} />}
          title="Career Corner"
          items={[
            { href: "/all-jobs", label: "All Jobs" },
            { href: "/hiring-form", label: "Add Job" },
            { href: "/view-applications", label: "View Applications" },
          ]}
          isCollapsed={isCollapsed}
          isExpanded={expandedSection === "Career Corner"}
          toggleSection={() => toggleSection("Career Corner")}
          closeSection={() => setExpandedSection(null)}
        />
      </nav>

      <Tooltip id="section-tooltip" place="right" />
    </aside>
  );
};

interface SidebarSectionProps {
  icon: React.ReactNode;
  title: string;
  items: { href: string; label: string }[];
  isCollapsed: boolean;
  isExpanded: boolean;
  toggleSection: () => void;
  closeSection: () => void;
}

const SidebarSection = ({
  icon,
  title,
  items,
  isCollapsed,
  isExpanded,
  toggleSection,
  closeSection,
}: SidebarSectionProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isExpanded &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        closeSection();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, closeSection]);

  const sectionContent = (
    <div
      className={`
        py-3 px-2 
        ${
          isCollapsed
            ? "flex justify-center"
            : "flex items-center justify-between"
        }
        cursor-pointer rounded-lg hover:bg-gray-200 transition-all duration-200
      `}
      onClick={(e) => {
        e.stopPropagation();
        toggleSection();
      }}
      data-tooltip-id="section-tooltip"
      data-tooltip-content={isCollapsed ? title : ""}
    >
      <div className={`flex items-center ${isCollapsed ? "" : "space-x-3"}`}>
        <span className={`text-gray-600 ${isCollapsed ? "" : "mr-2"}`}>
          {icon}
        </span>
        {!isCollapsed && (
          <h2 className="text-base font-medium text-gray-800">{title}</h2>
        )}
      </div>
      {!isCollapsed && (
        <FaChevronRight
          className={`transition-transform duration-300 ${
            isExpanded ? "transform rotate-90" : ""
          }`}
        />
      )}
    </div>
  );

  return (
    <div
      ref={menuRef}
      className={`mb-1 overflow-hidden ${
        isCollapsed ? "mx-auto text-center" : ""
      }`}
    >
      {sectionContent}

      <div
        className={`
          transition-all duration-300 ease-in-out overflow-hidden
          ${isExpanded ? "max-h-96" : "max-h-0"}
          ${
            isCollapsed && isExpanded
              ? "absolute left-16 top-auto bg-white shadow-lg rounded-lg p-2 min-w-48 z-10"
              : ""
          }
        `}
      >
        {isExpanded && (
          <ul className={`space-y-1 ${isCollapsed ? "py-2" : "pl-8 py-2"}`}>
            {items.map((item, index) => (
              <li key={index} className="py-1">
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `text-gray-600 hover:text-blue-600 transition-colors duration-200 block px-3 py-2 rounded-md ${
                      isActive ? "text-blue-600 font-medium bg-blue-50" : ""
                    }`
                  }
                  onClick={closeSection}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
