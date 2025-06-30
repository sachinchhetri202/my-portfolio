'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { PaperAirplaneIcon, ChatBubbleOvalLeftEllipsisIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FaUser, FaRobot } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

// Interface for chat messages remains the same for now
// We might enhance this later if we store more metadata
interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system' | 'error'; // Added system/error roles
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  retryCount?: number;
}

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second
const MAX_MESSAGE_LENGTH = 1000;
const TEASER_DELAY = 2000; // 2 seconds for teaser to appear

const BOT_NAME = "Sachin.dev Assistant";
const WELCOME_MESSAGE_CONTENT = `नमस्ते! こんにちは! Hello! 👋
I am ${BOT_NAME}, here to help you learn about Sachin, his skills, and projects. You can also ask me about his CV/resume - I can show you what's included and help you download it! Feel free to ask me anything!`;

const QUICK_REPLIES = [
  "How can I get Sachin's CV?",
  "What's in the CV?",
  "Show latest projects",
  "Tell me about skills",
  "Work experience"
];

// Mobile-optimized Typing Indicator
const TypingIndicator = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className={`flex items-center space-x-2 p-3 rounded-2xl rounded-bl-md max-w-[85%] mb-3 ${
      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
    }`}
  >
    <div className="flex space-x-1">
      <motion.div 
        className="w-2 h-2 bg-gray-400 rounded-full" 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
        transition={{ duration: 1, repeat: Infinity, delay: 0 }} 
      />
      <motion.div 
        className="w-2 h-2 bg-gray-400 rounded-full" 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} 
      />
      <motion.div 
        className="w-2 h-2 bg-gray-400 rounded-full" 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} 
      />
    </div>
    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      Assistant is typing...
    </span>
  </motion.div>
);

// Mobile Quick Reply Chips
const QuickReplyChips = ({ onReplyClick, show, isDarkMode }: { 
  onReplyClick: (reply: string) => void; 
  show: boolean;
  isDarkMode: boolean;
}) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="px-4 pb-3"
      >
        <div className="flex flex-wrap gap-2">
          {QUICK_REPLIES.map((reply, index) => (
            <motion.button
              key={reply}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onReplyClick(reply)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isDarkMode
                  ? 'bg-gray-800 text-gray-200 border border-gray-600 active:bg-gray-700'
                  : 'bg-white text-violet-700 border border-violet-200 active:bg-violet-50'
              }`}
            >
              {reply}
            </motion.button>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Mobile-optimized Message Bubble
const MessageBubble = ({ message, isUser, isDarkMode }: { 
  message: ChatMessage; 
  isUser: boolean; 
  isDarkMode: boolean;
}) => {
  const markdownComponents: Components = {
    a: ({ href, children }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-violet-600 hover:text-violet-800 underline font-medium break-all"
      >
        {children}
      </a>
    ),
    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-none ml-4 mb-2 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-none ml-4 mb-2 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="text-sm leading-relaxed relative">{children}</li>,
    strong: ({ children }) => <strong className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    h1: ({ children }) => <h1 className={`text-base font-bold mb-2 mt-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{children}</h1>,
    h2: ({ children }) => <h2 className={`text-sm font-semibold mb-1 mt-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{children}</h2>,
    h3: ({ children }) => <h3 className={`text-sm font-semibold mb-1 mt-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{children}</h3>,
    code: ({ children }) => (
      <code className={`px-1 py-0.5 rounded text-xs font-mono ${
        isDarkMode 
          ? 'bg-gray-700 text-violet-300' 
          : 'bg-gray-100 text-violet-700'
      }`}>
        {children}
      </code>
    ),
    blockquote: ({ children }) => (
      <blockquote className={`border-l-2 pl-2 py-1 my-1 italic text-sm ${
        isDarkMode 
          ? 'border-violet-400 text-gray-300' 
          : 'border-violet-200 text-gray-600'
      }`}>
        {children}
      </blockquote>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 px-4`}
    >
      <div className={`flex items-start space-x-2 max-w-[90%] w-full ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-violet-600 text-white' 
            : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white'
        }`}>
          {isUser ? <FaUser className="w-3 h-3" /> : <FaRobot className="w-3 h-3" />}
        </div>
        
        {/* Message Content */}
        <div className={`rounded-2xl px-3 py-3 ${
          isUser 
            ? isDarkMode
              ? 'bg-violet-600 text-white rounded-br-md'
              : 'bg-violet-600 text-white rounded-br-md'
            : isDarkMode
              ? 'bg-gray-800 text-gray-100 rounded-bl-md'
              : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}>
          {isUser ? (
            <p className="text-sm leading-relaxed break-words">{message.content}</p>
          ) : (
            <div className="text-sm leading-relaxed break-words chatbot-message">
              <ReactMarkdown components={markdownComponents}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          
          {/* Status indicator for user messages */}
          {isUser && message.status && (
            <div className="flex justify-end mt-1">
              {message.status === 'sending' && (
                <div className="flex items-center space-x-1">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-3 h-3 border border-violet-200 border-t-transparent rounded-full"
                  />
                  <span className="text-xs text-violet-200">Sending</span>
                </div>
              )}
              {message.status === 'sent' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="flex items-center"
                >
                  <svg className="w-4 h-4 text-violet-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
              {message.status === 'error' && (
                <span className="text-xs text-red-300">Failed</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputHeight, setInputHeight] = useState(48);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMessages([
      {
        id: 'init',
        content: WELCOME_MESSAGE_CONTENT,
        role: 'assistant',
        timestamp: new Date(),
        status: 'sent',
      },
    ]);

    const finalTeaserTimer = setTimeout(() => {
      if (!isOpen && !sessionStorage.getItem('chatInteracted')) {
        setShowTeaser(true);
      }
    }, TEASER_DELAY);

    return () => {
      clearTimeout(finalTeaserTimer);
      abortControllerRef.current?.abort();
    };
  }, []);

  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      // Focus appropriate input based on screen size
      const isMobile = window.innerWidth < 640; // sm breakpoint
      if (isMobile && mobileInputRef.current) {
        mobileInputRef.current.focus();
      } else if (!isMobile && inputRef.current) {
        inputRef.current.focus();
      }
      setShowTeaser(false);
      sessionStorage.setItem('chatInteracted', 'true');
    } else {
      setShowTeaser(true);
    }
  }, [isOpen]);

  const scrollToBottom = (force = false) => {
    const performScroll = () => {
      const scrollElement = messagesEndRef.current;
      
      // Try multiple methods to ensure scrolling works
      const methods = [
        // Method 1: Direct container targeting
        () => {
          const isMobile = window.innerWidth < 640;
          const containerId = isMobile ? 'mobile-messages-container' : 'desktop-messages-container';
          const container = document.getElementById(containerId);
          if (container) {
            const scrollTop = container.scrollHeight - container.clientHeight;
            if (force) {
              container.scrollTop = scrollTop;
            } else {
              container.scrollTo({ top: scrollTop, behavior: 'smooth' });
            }
            return true;
          }
          return false;
        },
        
        // Method 2: scrollIntoView on end element
        () => {
          if (scrollElement) {
            scrollElement.scrollIntoView({ 
              behavior: force ? "auto" : "smooth", 
              block: "end",
              inline: "nearest"
            });
            return true;
          }
          return false;
        },
        
        // Method 3: Find closest overflow container
        () => {
          if (scrollElement) {
            const container = scrollElement.closest('.overflow-y-auto');
            if (container) {
              const scrollTop = container.scrollHeight - container.clientHeight;
              if (force) {
                container.scrollTop = scrollTop;
              } else {
                container.scrollTo({ top: scrollTop, behavior: 'smooth' });
              }
              return true;
            }
          }
          return false;
        }
      ];
      
      // Try each method until one succeeds
      for (let i = 0; i < methods.length; i++) {
        try {
          if (methods[i]()) {
            break;
          }
        } catch (error) {
          // Silently continue to next method
        }
      }
    };

    // Use requestAnimationFrame for better timing
    if (force) {
      performScroll();
      requestAnimationFrame(performScroll);
    } else {
      requestAnimationFrame(performScroll);
    }
  };

  useEffect(() => {
    // Scroll when messages change
    scrollToBottom(true); // Immediate
    const timer = setTimeout(() => scrollToBottom(), 200);
    
    return () => {
      clearTimeout(timer);
    };
  }, [messages]);

  // Additional scroll trigger for typing state changes
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => scrollToBottom(), 100);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  // Scroll to bottom when chat opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => scrollToBottom(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const validateMessage = (message: string): string | null => {
    if (!message.trim()) {
      return 'Please enter a message.';
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return `Message is too long. Maximum length is ${MAX_MESSAGE_LENGTH} characters.`;
    }
    return null;
  };

  const sendMessageToAPI = async (
    message: string,
    history: ChatMessage[],
    retryCount = 0
  ): Promise<string> => {
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          })).filter(msg => msg.role === 'user' || msg.role === 'model')
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429 && retryCount < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
          return sendMessageToAPI(message, history, retryCount + 1);
        }
        throw new Error(errorData.error || errorData.details || `API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request was cancelled.');
      }
      throw error;
    }
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
    setShowQuickReplies(false);
    handleSend(undefined, reply);
  };

  const handleSend = async (e?: FormEvent, messageOverride?: string) => {
    if (e) e.preventDefault();
    const messageToSend = messageOverride || input;
    const validationError = validateMessage(messageToSend);
    if (validationError) { 
      setError(validationError); 
      return; 
    }
    if (isLoading && !messageOverride) return;
    
    setError(null);
    const messageText = messageToSend.trim();
    if (!messageText) return;

    setInput(''); 
    setInputHeight(48);
    setIsLoading(true);
    setShowQuickReplies(false);
    sessionStorage.setItem('chatInteracted', 'true');

    const userMessage: ChatMessage = { 
      id: Date.now().toString(), 
      content: messageText, 
      role: 'user', 
      timestamp: new Date(), 
      status: 'sending' 
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Force immediate scroll when user sends a message
    setTimeout(() => scrollToBottom(true), 100);

    try {
      // Step 1: Wait a moment, then mark message as sent
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages(prev => 
        prev.map(msg => msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg)
      );
      
      // Step 2: Wait another moment, then start typing indicator
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsTyping(true);
      
      // Step 3: Get the bot response
      const conversationHistory = messagesRef.current.filter(msg => msg.role !== 'error' && msg.id !== 'init').slice(-6);
      const reply = await sendMessageToAPI(messageText, conversationHistory);
      
      // Step 4: Stop typing and show bot response
      setIsTyping(false);
      const botMessage: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        content: reply, 
        role: 'assistant', 
        timestamp: new Date(), 
        status: 'sent' 
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Force immediate scroll when bot responds
      setTimeout(() => scrollToBottom(true), 200);
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessageText = error.message || 'An error occurred while sending your message.';
      setError(errorMessageText);
      setIsTyping(false);
      setMessages(prev => {
        const updatedMessages = prev.map(msg => msg.id === userMessage.id ? { ...msg, status: 'error' as const } : msg);
        return [...updatedMessages, { 
          id: (Date.now() + 1).toString(), 
          content: errorMessageText, 
          role: 'error' as const, 
          timestamp: new Date(), 
          status: 'error' as const 
        }];
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      if (isOpen) {
        const isMobile = window.innerWidth < 640;
        if (isMobile) {
          mobileInputRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 48), 120); // Min 48px, max 120px (3 lines)
    textarea.style.height = `${newHeight}px`;
    setInputHeight(newHeight);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y > 100) {
      setIsOpen(false);
    }
  };

  // Animation variants
  const teaserVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
  };



  return (
    <>
      {/* Mobile Teaser Notification */}
      <AnimatePresence>
        {showTeaser && !isOpen && (
          <motion.div
            variants={teaserVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed bottom-20 left-4 right-4 z-40 sm:left-auto sm:right-6 sm:max-w-xs"
          >
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-4 shadow-2xl cursor-pointer"
              onClick={() => {
                setIsOpen(true);
                setShowTeaser(false);
                sessionStorage.setItem('chatInteracted', 'true');
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaRobot className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Hi! I'm Sachin's AI Assistant</p>
                  <p className="text-blue-100 text-xs mt-1">Ask me anything about his work!</p>
                </div>
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full border-2 border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile FAB Button */}
      <AnimatePresence>
        {!isOpen && !showTeaser && (
          <motion.button
            onClick={() => {
              setIsOpen(true);
              sessionStorage.setItem('chatInteracted', 'true');
            }}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full shadow-2xl z-50 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open chat assistant"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <ChatBubbleOvalLeftEllipsisIcon className="w-7 h-7" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Desktop Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="desktop-chat-window"
            initial={{ 
              opacity: 0, 
              y: 30, 
              scale: 0.95,
              transformOrigin: "bottom right"
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { 
                type: 'spring', 
                stiffness: 300, 
                damping: 25,
                mass: 0.8
              } 
            }}
            exit={{ 
              opacity: 0, 
              y: 30, 
              scale: 0.95,
              transition: { 
                duration: 0.2,
                ease: "easeInOut"
              } 
            }}
            className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[min(320px,calc(100vw-2rem))] h-[450px] sm:w-[380px] sm:h-[540px] lg:w-[420px] lg:h-[580px] flex flex-col rounded-2xl shadow-2xl border overflow-hidden transition-all duration-300 hidden sm:flex ${
              isDarkMode 
                ? 'bg-gray-900 border-gray-700/50' 
                : 'bg-white border-gray-200/50'
            }`}
            style={{
              backdropFilter: 'blur(20px)',
              background: isDarkMode ? 'rgba(17, 24, 39, 0.98)' : 'rgba(255, 255, 255, 0.98)'
            }}
          >
            {/* Desktop Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ring-2 ring-white/30">
                  <FaRobot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg tracking-tight font-montserrat">
                    {BOT_NAME}
                  </h3>
                  <p className="text-blue-100 text-xs">Online • Ready to help</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
                  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDarkMode ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
                  aria-label="Close chat"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Desktop Messages Area */}
            <div 
              id="desktop-messages-container"
              className={`flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1 transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-b from-gray-800/50 to-gray-900' 
                  : 'bg-gradient-to-b from-gray-50/50 to-white'
              }`}
            >
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isUser={message.role === 'user'}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </AnimatePresence>
              
              <AnimatePresence>
                {isTyping && <TypingIndicator isDarkMode={isDarkMode} />}
              </AnimatePresence>
              
              <QuickReplyChips 
                onReplyClick={handleQuickReply} 
                show={showQuickReplies && messages.length === 1 && !isLoading}
                isDarkMode={isDarkMode}
              />
              
              <div ref={messagesEndRef} />
            </div>

            {/* Desktop Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-2 bg-red-50 border-t border-red-200"
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop Input Bar */}
            <div className={`p-4 border-t transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-900 border-gray-700' 
                : 'bg-white border-gray-100'
            }`}>
              <form onSubmit={handleSend} className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className={`w-full h-12 pl-4 pr-12 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-200 disabled:opacity-50 ${
                    isDarkMode 
                      ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                  style={{ fontSize: '16px' }}
                />
                
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-2 w-8 h-8 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <FiSend className="w-4 h-4" />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 sm:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile Bottom Sheet */}
            <motion.div
              key="mobile-bottom-sheet"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                transition: { 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30,
                  mass: 0.8
                } 
              }}
              exit={{ 
                y: "100%", 
                opacity: 0,
                transition: { 
                  duration: 0.3,
                  ease: "easeInOut"
                } 
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className={`fixed bottom-0 left-0 right-0 z-50 flex flex-col max-h-[85vh] w-full sm:hidden ${
                isDarkMode ? 'bg-gray-900' : 'bg-white'
              }`}
              style={{
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                paddingBottom: 'env(safe-area-inset-bottom)',
                boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Mobile Header */}
              <div className={`flex items-center justify-between px-4 py-3 border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`} style={{ minHeight: '48px' }}>
                {/* Mobile Drag Handle */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                  <div className={`w-10 h-1 rounded-full ${
                    isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`} />
                </div>
                
                <div className="flex items-center space-x-3 mt-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                    <FaRobot className="w-4 h-4 text-white" />
                  </div>
                  <h3 className={`font-semibold text-base ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {BOT_NAME}
                  </h3>
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                  {/* Dark Mode Toggle */}
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`p-2 rounded-full transition-colors ${
                      isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    {isDarkMode ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    )}
                  </button>
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-full transition-colors ${
                      isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    aria-label="Close chat"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mobile Messages Area */}
              <div 
                id="mobile-messages-container"
                className="flex-1 overflow-y-auto overflow-x-hidden overscroll-bounce" 
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <div className="py-4">
                  <AnimatePresence initial={false}>
                    {messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isUser={message.role === 'user'}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </AnimatePresence>
                  
                  <AnimatePresence>
                    {isTyping && (
                      <div className="px-4">
                        <TypingIndicator isDarkMode={isDarkMode} />
                      </div>
                    )}
                  </AnimatePresence>
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Mobile Quick Reply Chips */}
              <QuickReplyChips 
                onReplyClick={handleQuickReply} 
                show={showQuickReplies && messages.length === 1 && !isLoading}
                isDarkMode={isDarkMode}
              />

              {/* Mobile Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 py-2 bg-red-50 border-t border-red-200"
                  >
                    <p className="text-red-600 text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile Input Bar */}
              <div className={`border-t ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                <form onSubmit={handleSend} className="p-4">
                  <div className={`flex items-end space-x-2 rounded-2xl ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                  }`} style={{ minHeight: '48px' }}>
                    <textarea
                      ref={mobileInputRef}
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask me anything..."
                      disabled={isLoading}
                      rows={1}
                      className={`flex-1 resize-none border-0 bg-transparent px-3 py-3 text-sm placeholder-gray-500 focus:outline-none ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}
                      style={{ 
                        height: `${inputHeight}px`,
                        maxHeight: '120px',
                        fontSize: '16px' // Prevents zoom on iOS
                      }}
                    />
                    
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="flex-shrink-0 w-10 h-10 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors mr-1 mb-1"
                      aria-label="Send message"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <FiSend className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
