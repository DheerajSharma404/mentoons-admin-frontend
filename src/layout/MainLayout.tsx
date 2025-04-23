import { useState, useEffect } from "react";
import FAQChatbot from "../components/chatBot/FAQChatbot";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth <= 768);
    };

    handleResize();
  }, []);

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <Sidebar onToggle={handleSidebarToggle} />
      </div>

      <div className="flex flex-col flex-grow">
        <Header />
        <main className="flex-grow overflow-y-auto p-4 relative">
          {children}
          <div
            className={`fixed ${
              isSidebarCollapsed ? "right-8" : "right-12"
            } bottom-20 z-[999] transition-all duration-300`}
          >
            {isChatbotOpen ? (
              <FAQChatbot setIsChatbotOpen={setIsChatbotOpen} />
            ) : (
              <img
                src="/assets/chatbot.png"
                alt="chatbot"
                className="w-10 h-10 cursor-pointer hover:scale-110 transition-transform"
                onClick={() => setIsChatbotOpen(true)}
              />
            )}
          </div>
        </main>
        <div className="fixed bottom-0 right-0 left-[15rem]">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
