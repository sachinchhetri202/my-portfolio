'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, ChatBubbleOvalLeftEllipsisIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { FaUser, FaRobot } from 'react-icons/fa';
import { FiCpu, FiSend } from 'react-icons/fi';
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
I am ${BOT_NAME}, here to help you learn about Sachin, his skills, and projects. Feel free to ask me anything!`;

const QUICK_REPLIES = [
  "Show latest projects",
  "Tell me about skills",
  "Educational background",
  "Work experience"
];

// Premium Typing Indicator
const TypingIndicator = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className={`flex items-center space-x-2 p-4 rounded-2xl rounded-bl-md max-w-[80%] mb-4 transition-all duration-200 ${
      isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
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
    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Assistant is typing...</span>
  </motion.div>
);

// Quick Reply Chips Component
const QuickReplyChips = ({ onReplyClick, show }: { onReplyClick: (reply: string) => void; show: boolean }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex flex-wrap gap-2 p-4 pt-0"
      >
        {QUICK_REPLIES.map((reply, index) => (
          <motion.button
            key={reply}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onReplyClick(reply)}
            className="px-3 py-2 bg-white border-2 border-violet-200 text-violet-700 rounded-full text-sm font-medium hover:bg-violet-50 hover:border-violet-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {reply}
          </motion.button>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

// Message Bubble Component
const MessageBubble = ({ message, isUser, isDarkMode }: { message: ChatMessage; isUser: boolean; isDarkMode: boolean }) => {
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
    p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-none ml-6 mb-3 space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-none ml-6 mb-3 space-y-2">{children}</ol>,
    li: ({ children }) => <li className="text-sm leading-relaxed relative">{children}</li>,
    strong: ({ children }) => <strong className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    h1: ({ children }) => <h1 className={`text-lg font-bold mb-2 mt-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{children}</h1>,
    h2: ({ children }) => <h2 className={`text-base font-semibold mb-2 mt-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{children}</h2>,
    h3: ({ children }) => <h3 className={`text-sm font-semibold mb-1 mt-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{children}</h3>,
    code: ({ children }) => (
      <code className={`px-1 py-0.5 rounded text-sm font-mono ${
        isDarkMode 
          ? 'bg-gray-700 text-violet-300' 
          : 'bg-gray-100 text-violet-700'
      }`}>
        {children}
      </code>
    ),
    blockquote: ({ children }) => (
      <blockquote className={`border-l-4 pl-3 py-1 my-2 italic ${
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
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-start space-x-3 max-w-[90%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-violet-600 text-white' 
            : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white'
        }`}>
          {isUser ? <FaUser className="w-4 h-4" /> : <FaRobot className="w-4 h-4" />}
        </div>
        
        {/* Message Content */}
        <div className={`rounded-2xl px-4 py-4 transition-all duration-200 ${
          isUser 
            ? isDarkMode
              ? 'bg-gray-800 border-2 border-violet-400 text-white rounded-br-md'
              : 'bg-white border-2 border-violet-200 text-gray-900 rounded-br-md'
            : isDarkMode
              ? 'bg-gray-800 text-gray-100 rounded-bl-md'
              : 'bg-gray-50 text-gray-900 rounded-bl-md'
        }`}>
          {isUser ? (
            <p className="text-sm font-medium leading-relaxed break-words">{message.content}</p>
          ) : (
            <div className="text-sm leading-relaxed prose prose-sm max-w-none break-words prose-p:my-2 prose-li:my-1 chatbot-message">
              <ReactMarkdown components={markdownComponents}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          
          {/* Status indicator for user messages */}
          {isUser && message.status && (
            <div className="flex justify-end mt-2">
              <span className={`text-xs ${
                message.status === 'sending' ? 'text-gray-400' :
                message.status === 'sent' ? 'text-green-500' :
                'text-red-500'
              }`}>
                {message.status === 'sending' ? 'Sending...' :
                 message.status === 'sent' ? '✓' :
                 'Failed'}
              </span>
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (isOpen) {
      setShowTeaser(false);
      sessionStorage.setItem('chatInteracted', 'true');
    } else {
      setShowTeaser(true);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages]);

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
    setIsLoading(true);
    setIsTyping(true);
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

    try {
      const conversationHistory = messagesRef.current.filter(msg => msg.role !== 'error' && msg.id !== 'init').slice(-6);
      const reply = await sendMessageToAPI(messageText, conversationHistory);
      const botMessage: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        content: reply, 
        role: 'assistant', 
        timestamp: new Date(), 
        status: 'sent' 
      };
      setMessages(prev => {
        const updatedMessages = prev.map(msg => msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg);
        return [...updatedMessages, botMessage];
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessageText = error.message || 'An error occurred while sending your message.';
      setError(errorMessageText);
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
      if (isOpen) inputRef.current?.focus();
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

  const chatWindowVariants = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      scale: 0.95,
      transformOrigin: "bottom right"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 25,
        mass: 0.8
      } 
    },
    exit: { 
      opacity: 0, 
      y: 30, 
      scale: 0.95,
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      } 
    },
  };

  return (
    <>
      {/* Premium Teaser Message */}
      <AnimatePresence>
        {showTeaser && !isOpen && (
          <motion.div
            variants={teaserVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed bottom-24 right-4 sm:right-6 z-40 max-w-xs"
          >
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-4 shadow-2xl cursor-pointer hover:shadow-3xl transition-all duration-300 border border-blue-500/20"
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
              {/* Notification dot */}
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full border-2 border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium FAB Button */}
      <AnimatePresence>
        {!isOpen && !showTeaser && (
          <motion.button
            onClick={() => {
              setIsOpen(true);
              sessionStorage.setItem('chatInteracted', 'true');
            }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all duration-300 z-50"
            initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open chat assistant"
          >
            <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 mx-auto" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Premium Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="premium-chat-window"
            variants={chatWindowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[min(320px,calc(100vw-2rem))] h-[450px] sm:w-[380px] sm:h-[540px] lg:w-[420px] lg:h-[580px] flex flex-col rounded-2xl shadow-2xl border overflow-hidden transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-900 border-gray-700/50' 
                : 'bg-white border-gray-200/50'
            }`}
            style={{
              backdropFilter: 'blur(20px)',
              background: isDarkMode ? 'rgba(17, 24, 39, 0.98)' : 'rgba(255, 255, 255, 0.98)'
            }}
          >
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ring-2 ring-white/30">
                  <FaRobot className="w-5 h-5" />
                </div>
                {/* Title */}
                <div>
                  <h3 className="font-semibold text-lg tracking-tight font-montserrat">
                    {BOT_NAME}
                  </h3>
                  <p className="text-blue-100 text-xs">Online • Ready to help</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Dark Mode Toggle */}
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
                
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
                  aria-label="Close chat"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className={`flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-b from-gray-800/50 to-gray-900' 
                : 'bg-gradient-to-b from-gray-50/50 to-white'
            }`}>
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
              
              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && <TypingIndicator isDarkMode={isDarkMode} />}
              </AnimatePresence>
              
              {/* Quick Reply Chips */}
              <QuickReplyChips 
                onReplyClick={handleQuickReply} 
                show={showQuickReplies && messages.length === 1 && !isLoading}
              />
              
              <div ref={messagesEndRef} />
            </div>

            {/* Error Display */}
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

            {/* Premium Input Bar */}
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
                  style={{ fontSize: '16px' }} // Prevents zoom on iOS
                />
                
                {/* Send Button */}
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
    </>
  );
}
