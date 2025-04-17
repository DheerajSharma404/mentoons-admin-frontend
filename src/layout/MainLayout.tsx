import { useState } from "react";
import FAQChatbot from "../components/chatBot/FAQChatbot";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  return (
    <div className="flex h-screen">
      <div className="w-[15rem]">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-grow">
        <Header />
        <main className="flex-grow overflow-y-scroll p-4 relative">
          {children}
          <div className="fixed right-12 bottom-20 z-[999]">
            {isChatbotOpen ? (
              <FAQChatbot setIsChatbotOpen={setIsChatbotOpen} />
            ) : (
              <img
                src="/assets/chatbot.png"
                alt="chatbot"
                className="w-10 h-10 cursor-pointer"
                onClick={() => setIsChatbotOpen(true)}
              />
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
