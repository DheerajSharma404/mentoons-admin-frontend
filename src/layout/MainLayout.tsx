import { useState } from "react";
import FAQChatbot from "../components/chatBot/FAQChatbot";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  return (
    <div className="flex h-screen">
      <div className="w-[15rem] fixed top-0 left-0 h-screen bg-white shadow-lg z-10 ">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-grow ml-[15rem] ">
        <div className="fixed top-0 right-0 left-[15rem] z-10  ">
          <Header />
        </div>
        <main className="relative flex-grow p-4 mt-16 mb-16 overflow-y-scroll zoom-in-11 ">
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
        <div className="fixed bottom-0 right-0 left-[15rem]">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
