import { useState, useEffect, useRef } from "react";
import {
  FaBox,
  FaBriefcase,
  FaUsers,
  FaChevronRight,
  FaChalkboardTeacher,
  FaQuestionCircle,
  FaNewspaper,
} from "react-icons/fa";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { motion, AnimatePresence } from "framer-motion";

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
    const sections = [
      { title: "Users", paths: ["/users", "/allotted-calls"] },
      { title: "Products", paths: ["/product-table", "/add-products"] },
      { title: "Workshops", paths: ["/workshop-enquiries"] },
      {
        title: "Career Corner",
        paths: ["/all-jobs", "/hiring-form", "/view-applications"],
      },
      { title: "General Queries", paths: ["/general-queries"] },
      { title: "Newsletter", paths: ["/newsletter"] },
      {
        title: "Employees",
        paths: ["/employee-table", "/employee/add"],
      },
    ];

    const activeSection = sections.find((section) =>
      section.paths.some((path) => location.pathname === path)
    );

    if (activeSection) {
      setExpandedSection(activeSection.title);
    }
  }, [location.pathname]);

  const toggleSection = (title: string) => {
    if (title === expandedSection) {
      setExpandedSection(null);
    } else {
      setExpandedSection(title);
    }
  };

  return (
    <motion.aside
      initial={{ width: isCollapsed ? 64 : 240 }}
      animate={{ width: isCollapsed ? 64 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`bg-gray-100 shadow-xl rounded-r-3xl transition-all duration-300 ease-in-out h-screen relative flex flex-col
      ${isCollapsed ? "w-16" : "w-full"} 
      [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100`}
    >
      <motion.div
        className={`flex justify-center ${isCollapsed ? "py-2" : "py-4"}`}
        whileHover={{ scale: 1.02 }}
      >
        <motion.img
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
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
      </motion.div>

      {!isCollapsed && (
        <motion.div
          className="mb-4 px-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
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
          </motion.button>
        </motion.div>
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
        />
        <SidebarSection
          icon={<FaBox size={isCollapsed ? 20 : 16} />}
          title="Products"
          items={[
            { href: "/product-table", label: "All Products" },
            { href: "/add-products", label: "Add Product" },
          ]}
          isCollapsed={isCollapsed}
          isExpanded={expandedSection === "Products"}
          toggleSection={() => toggleSection("Products")}
        />
        <SidebarSection
          icon={<FaChalkboardTeacher size={isCollapsed ? 20 : 16} />}
          title="Workshops"
          items={[{ href: "/workshop-enquiries", label: "Enquiries" }]}
          isCollapsed={isCollapsed}
          isExpanded={expandedSection === "Workshops"}
          toggleSection={() => toggleSection("Workshops")}
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
        />
        <SidebarSection
          icon={<FaQuestionCircle size={isCollapsed ? 20 : 16} />}
          title="General Queries"
          items={[{ href: "/general-queries", label: "All Queries" }]}
          isCollapsed={isCollapsed}
          isExpanded={expandedSection === "General Queries"}
          toggleSection={() => toggleSection("General Queries")}
        />
        <SidebarSection
          icon={<FaNewspaper size={isCollapsed ? 20 : 16} />}
          title="Newsletter"
          items={[{ href: "/newsletter", label: "All Newsletter" }]}
          isCollapsed={isCollapsed}
          isExpanded={expandedSection === "Newsletter"}
          toggleSection={() => toggleSection("Newsletter")}
        />
        <SidebarSection
          icon={<FaUsers size={isCollapsed ? 20 : 16} />}
          title="Employees"
          items={[
            { href: "/employee-table", label: "Employees Details" },
            { href: "/employee/add", label: "Add Employees" },
          ]}
          isCollapsed={isCollapsed}
          isExpanded={expandedSection === "Employees"}
          toggleSection={() => toggleSection("Employees")}
        />
      </nav>

      <Tooltip id="section-tooltip" place="right" />
    </motion.aside>
  );
};

interface SidebarSectionProps {
  icon: React.ReactNode;
  title: string;
  items: { href: string; label: string }[];
  isCollapsed: boolean;
  isExpanded: boolean;
  toggleSection: () => void;
}

const SidebarSection = ({
  icon,
  title,
  items,
  isCollapsed,
  isExpanded,
  toggleSection,
}: SidebarSectionProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isActiveSection = items.some((item) => location.pathname === item.href);

  const sectionContent = (
    <motion.div
      whileHover={{ backgroundColor: isExpanded ? "" : "#e5e7eb" }}
      whileTap={{ scale: 0.98 }}
      className={`
        py-3 px-2 
        ${
          isCollapsed
            ? "flex justify-center"
            : "flex items-center justify-between"
        }
        ${isExpanded ? "bg-amber-100" : isActiveSection ? "bg-amber-50" : ""}
        cursor-pointer rounded-lg transition-all duration-200
      `}
      onClick={(e) => {
        e.stopPropagation();
        toggleSection();
      }}
      data-tooltip-id="section-tooltip"
      data-tooltip-content={isCollapsed ? title : ""}
    >
      <div className={`flex items-center ${isCollapsed ? "" : "space-x-3"}`}>
        <motion.span
          animate={{ rotate: isExpanded ? 5 : 0 }}
          className={`${isCollapsed ? "" : "mr-2"} ${
            isExpanded || isActiveSection ? "text-amber-500" : "text-gray-600"
          }`}
        >
          {icon}
        </motion.span>
        {!isCollapsed && (
          <h2
            className={`text-base font-medium ${
              isExpanded || isActiveSection ? "text-amber-600" : "text-gray-800"
            }`}
          >
            {title}
          </h2>
        )}
      </div>
      {!isCollapsed && (
        <motion.div
          animate={{
            rotate: isExpanded ? 90 : 0,
          }}
          transition={{ duration: 0.2 }}
          className={
            isExpanded || isActiveSection ? "text-amber-500" : "text-gray-500"
          }
        >
          <FaChevronRight />
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div
      ref={menuRef}
      className={`mb-1 overflow-hidden ${
        isCollapsed ? "mx-auto text-center" : ""
      }`}
    >
      {sectionContent}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`
              overflow-hidden
              ${
                isCollapsed
                  ? "absolute left-16 top-auto bg-white shadow-lg rounded-lg p-2 min-w-48 z-10"
                  : ""
              }
            `}
          >
            <ul className={`space-y-1 ${isCollapsed ? "py-2" : "pl-8 py-2"}`}>
              {items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="py-1"
                >
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md transition-colors duration-200 ${
                        isActive
                          ? "text-blue-600 font-medium bg-blue-50"
                          : "text-gray-600 hover:text-amber-600 hover:bg-amber-50"
                      }`
                    }
                  >
                    <motion.span whileHover={{ x: 3 }}>
                      {item.label}
                    </motion.span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
