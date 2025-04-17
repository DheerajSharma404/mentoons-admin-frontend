import React, { useState, useEffect, useRef } from 'react';
import { FaTimesCircle, FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  keywords: string[];
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    keywords: ['mentoons', 'about', 'services'],
    question: 'What exactly is Mentoons?',
    answer: 'Mentoons is a unique platform that blends mentoring with the art of cartoons. We aim to address issues like social media addiction and enhance skills like self-awareness through interactive workshops and resources. Our programs are designed for children, teenagers, and adults who seek meaningful personal development in a creative and engaging way.',
    category: 'About Us',
  },
  {
    keywords: ['social media', 'addiction', 'help'],
    question: 'How can Mentoons help with social media addiction?',
    answer: 'At Mentoons, we tackle social media addiction by offering specially designed workshops that focus on building real-world connections and healthier habits. Participants engage in creative activities that foster a sense of community and connectivity without relying on digital interactions.',
    category: 'Services',
  },
  {
    keywords: ['workshop', 'program', 'choose', 'right'],
    question: 'How do I choose the right workshop or program?',
    answer: "Visit our website and browse through the various programs offered. Each listing includes details that help you understand the focus of the workshop and whom it's best suited for, whether you're a parent looking to engage your child or a professional seeking self-development.",
    category: 'Workshops',
  },
  {
    keywords: ['sign up', 'register', 'workshop'],
    question: 'How do I sign up for a workshop?',
    answer: "Signing up is easy:\n* Visit our enrollment page.\n* Choose your desired workshop.\n* Click on 'Enroll Now' or fill out the application form.\n* Complete your registration with the necessary details and payment.",
    category: 'Registration',
  },
  {
    keywords: ['    ', 'who', 'mentoons'],
    question: 'Who can benefit most from Mentoons?',
    answer: 'Our programs are ideal for anyone looking to overcome digital addiction issues, enhance personal skills like communication and creativity, and develop meaningful social connections. This includes children, teenagers, families, and professionals.',
    category: 'Who We Help',
  },
  {
    keywords: ['different', 'unique', 'mentoons'],
    question: 'What makes Mentoons different from other personal development programs?',
    answer: 'Unlike traditional methods, Mentoons uses a combination of mentoring and cartoon-based storytelling to make the learning process enjoyable and effective. Our method is evidence-based, focusing on real-world outcomes and improvements in behavior and personal interaction skills.',
    category: 'What We Offer',
  },
  {
    keywords: ['miss', 'session', 'live'],
    question: 'What happens if I miss a live session?',
    answer: "Don't worry! All live sessions are recorded, allowing you to catch up at your convenience. Plus, our instructors are always available for questions during their office hours.",
    category: 'Live Sessions',
  },
  {
    keywords: ['resources', 'additional', 'aside'],
    question: 'Are there resources available aside from the workshops?',
    answer: 'Absolutely! Mentoons provides additional resources such as articles, cartoons, and interactive tools available through our platform to reinforce your learning and development.',
    category: 'Resources',
  },
  {
    keywords: ['updated', 'news', 'stay'],
    question: 'How can I stay updated with new workshops and Mentoons news?',
    answer: 'To stay updated, subscribe to our newsletter, check our website regularly, and follow us on social media. We continually announce upcoming workshops and new content that could benefit you and your family.',
    category: 'News',
  },
];

interface FAQChatbotProps {
  setIsChatbotOpen: (value: boolean) => void;
}

const FAQChatbot: React.FC<FAQChatbotProps> = ({ setIsChatbotOpen }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; suggestions?: string[] }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage = { text: input, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const botResponse = findAnswer(input);
    setMessages((prevMessages) => [...prevMessages, botResponse]);

    setInput('');
  };

  const findAnswer = (query: string): { text: string; isUser: false; suggestions?: string[] } => {
    const lowercaseQuery = query.toLowerCase();
    const matchedItem = faqData.find((item) =>
      item.keywords.some((keyword) => lowercaseQuery.includes(keyword))
    );

    if (matchedItem) {
      const suggestions = getRandomSuggestions(3);
      return { text: matchedItem.answer, isUser: false, suggestions };
    } else {
      const suggestions = getRandomSuggestions(3);
      return {
        text: "I'm sorry, I couldn't find an answer to your question. Here are some topics you might be interested in:",
        isUser: false,
        suggestions,
      };
    }
  };

  const getRandomSuggestions = (count: number): string[] => {
    const categories = Array.from(new Set(faqData.map((item) => item.category)));
    return categories
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
  };

  const handleSuggestionClick = (suggestion: string) => {
    const relatedQuestion = faqData.find((item) => item.category === suggestion)?.question;
    if (relatedQuestion) {
      setInput(relatedQuestion);
      handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed right-12 bottom-4 w-full max-w-md z-10"
    >
      <div className="bg-blue-50 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">Mentoons Chat</h2>
          <FaTimesCircle
            className="w-6 h-6 text-white cursor-pointer hover:text-gray-200 transition-colors"
            onClick={() => setIsChatbotOpen(false)}
          />
        </div>
        <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-blue-100">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                    message.isUser
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.text}
                  {message.suggestions && (
                    <div className="mt-2">
                      {message.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-blue-500 hover:underline mr-2"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center bg-white rounded-full overflow-hidden">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-2 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <FaPaperPlane className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default FAQChatbot;
