'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, ChatBubbleOvalLeftEllipsisIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FaUser } from 'react-icons/fa';
import { FiCpu } from 'react-icons/fi';
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

const BOT_NAME = "SC.dev Assistant";
const WELCOME_MESSAGE_CONTENT = `नमस्ते! こんにちは! Hello! 👋
I am ${BOT_NAME}, here to help you learn about Sachin, his skills, and projects. Feel free to ask me anything!`;

const STARTER_QUESTIONS = [
  "What projects has Sachin worked on?",
  "Tell me about Sachin's skills.",
  "What is Sachin studying?",
  "Where did Sachin go to high school?"
];

const TypingIndicator = () => (
  <div className="flex items-center space-x-1.5 p-3">
    <span className="text-sm text-gray-500 dark:text-gray-400">Assistant is typing</span>
    <motion.div 
      className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" 
      animate={{ y: ["-25%", "0%", "-25%"] }} 
      transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }} 
    />
    <motion.div 
      className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" 
      animate={{ y: ["-25%", "0%", "-25%"] }} 
      transition={{ duration: 0.7, delay: 0.15, repeat: Infinity, ease: "easeInOut" }} 
    />
    <motion.div 
      className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" 
      animate={{ y: ["-25%", "0%", "-25%"] }} 
      transition={{ duration: 0.7, delay: 0.3, repeat: Infinity, ease: "easeInOut" }} 
    />
  </div>
);

const teaserVariants = {
  hidden: { 
    opacity: 0, 
    y: 10, 
    scale: 0.95, 
    transition: { duration: 0.2 } 
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: [1, 1.03, 1],
    transition: {
      opacity: { duration: 0.3, delay: 0.1 },
      y: { duration: 0.3, delay: 0.1 },
      scale: {
        duration: 2.0,
        ease: "easeInOut",
        repeat: Infinity,
        delay: 0.5,
        repeatDelay: 1.0
      }
    }
  },
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false); // New state for teaser
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

    const teaserTimer = setTimeout(() => {
      // Show teaser only if chat is not already open and no user messages have been sent yet.
      // This check ensures that `messages` state used here is the one from the effect's closure after setMessages.
      // For a more robust check against messages updated asynchronously, one might pass messages in dependency array,
      // but for one-time teaser, this should be fine.
      if (!isOpen && messages.filter(m => m.role === 'user').length === 0) {
         // A slight delay to ensure messages state is likely updated before this check
         // This is a bit of a workaround for the immediate check after setMessages.
         // A more React-idiomatic way would involve another useEffect dependent on messages.
         // However, for simplicity and one-time effect:
         setTimeout(() => {
            // Re-check messages state here, ensuring it's the most current.
            // This is still tricky. The most robust way is to check initial messages.
            // The original messages array is empty before setMessages, so any user interaction would add to it.
            // Let's rely on the initial state of `messages` being effectively empty of user messages.
             if (!document.querySelector('.chat-window-open') && // Check if chat window isn't already visibly open by some other means
                 messages.filter(m => m.role === 'user').length === 0 // Check against the current state of messages.
             ) {
                // Safest check might be simpler: if chat not open, show teaser
                // The `messages.filter` ensures it doesn't pop up if user is already chatting from a restored session (future).
                // For now, `!isOpen` and `messages.length <=1` (initial welcome message) is a good proxy.
                // Let's use the initially set messages for the check, as it's more stable for this effect.
                const currentMessages = messagesRef.current; // Need to use a ref for messages if checking its latest value inside setTimeout
                                                            // Or, simplify the condition for now.
                if (!isOpen && !sessionStorage.getItem('chatInteracted')) { // Use session storage as a proxy for interaction
                     setShowTeaser(true);
                }
             }
         }, 50); // Small delay for state to propagate for the check
      }
    }, TEASER_DELAY);
    
    // Simpler logic for teaser:
    const finalTeaserTimer = setTimeout(() => {
        if (!isOpen && !sessionStorage.getItem('chatInteracted')) {
            setShowTeaser(true);
        }
    }, TEASER_DELAY)


    return () => {
      clearTimeout(finalTeaserTimer);
      abortControllerRef.current?.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // isOpen dependency removed to prevent re-triggering teaser on chat close.


  const messagesRef = useRef(messages); // Ref to access current messages in setTimeout
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);


  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (isOpen) {
        setShowTeaser(false); // Ensure teaser is hidden when chat is open
        sessionStorage.setItem('chatInteracted', 'true'); // Mark interaction
    } else {
        // When chat is closed, always show the teaser again
        // We can add a small delay if we want it to reappear a moment after closing
        // For now, show immediately on close:
        setShowTeaser(true);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

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
      return data.reply;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request was cancelled.');
      }
      throw error;
    }
  };

  const handleStarterQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
    // Optionally send immediately:
    // handleSend(undefined, question); 
    // For now, user clicks send.
  };
  
  const handleSend = async (e?: FormEvent, messageOverride?: string) => {
    if (e) e.preventDefault();
    const messageToSend = messageOverride || input;
    const validationError = validateMessage(messageToSend);
    if (validationError) { setError(validationError); return; }
    if (isLoading && !messageOverride) return;
    
    setError(null);
    const messageText = messageToSend.trim();
    if (!messageText) return;

    setInput(''); 
    setIsLoading(true);
    setIsTyping(true);
    sessionStorage.setItem('chatInteracted', 'true'); // Mark interaction
    setShowTeaser(false); // Hide teaser on send

    const userMessage: ChatMessage = { id: Date.now().toString(), content: messageText, role: 'user', timestamp: new Date(), status: 'sending' };
    setMessages(prev => [...prev, userMessage]);

    try {
      const conversationHistory = messagesRef.current.filter(msg => msg.role !== 'error' && msg.id !== 'init').slice(-6); // Use ref for latest messages
      const reply = await sendMessageToAPI(messageText, conversationHistory);
      const botMessage: ChatMessage = { id: (Date.now() + 1).toString(), content: reply, role: 'assistant', timestamp: new Date(), status: 'sent' };
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
        return [ ...updatedMessages, { id: (Date.now() + 1).toString(), content: errorMessageText, role: 'error' as const, timestamp: new Date(), status: 'error' as const }];
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      if (isOpen) inputRef.current?.focus();
    }
  };

  const chatWindowVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: 'spring', 
        damping: 20, 
        stiffness: 200 
      } 
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95, 
      transition: { 
        duration: 0.2 
      } 
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.3 
      } 
    },
  };
  
  // Remove redundant animation
  const pulseAnimation = {
    scale: [1, 1.03, 1],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1,
      repeatDelay: 1
    }
  };

  return (
    <>
      {/* Teaser Message */}
      <AnimatePresence>
        {showTeaser && !isOpen && (
          <motion.div
            variants={teaserVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-br from-green-500 to-teal-600 dark:from-green-600 dark:to-teal-700 text-white rounded-lg shadow-xl cursor-pointer hover:from-green-600 hover:to-teal-700 dark:hover:from-green-700 dark:hover:to-teal-800 flex items-center space-x-2 transition-all duration-300 ease-in-out"
            onClick={() => {
              setIsOpen(true);
              setShowTeaser(false);
              sessionStorage.setItem('chatInteracted', 'true');
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
            <span className="text-sm font-medium">Welcome! Ask me about Sachin.</span>
            {/* Notification Dot */}
            <motion.span
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { delay: 0.3, type: 'spring', stiffness: 300, damping: 15 } }}
              exit={{ scale: 0, opacity: 0 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Toggle Button (FAB) */}
      <AnimatePresence>
        {!isOpen && !showTeaser && (
        <motion.button
          onClick={() => {
            setIsOpen(true);
            sessionStorage.setItem('chatInteracted', 'true');
          }}
            className="fixed bottom-6 right-6 bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-full p-4 shadow-xl hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-green-400 dark:focus:ring-green-600 transition-all duration-300 ease-in-out"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open chat"
          >
            <ChatBubbleOvalLeftEllipsisIcon className="w-7 h-7" />
        </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            variants={chatWindowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 md:bottom-10 md:right-10 z-50 w-full sm:w-[calc(100%-3rem)] sm:max-w-md overflow-hidden chat-window-open"
          >
            <div className="bg-white/95 backdrop-blur-sm flex flex-col h-[100dvh] sm:h-[60vh] sm:max-h-[700px] sm:min-h-[300px] sm:rounded-xl shadow-2xl">
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between sm:rounded-t-xl">
                <div className="flex items-center gap-2">
                  <FiCpu className="w-6 h-6 text-white" />
                  <h3 className="text-lg font-semibold">{BOT_NAME}</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 focus:outline-none focus:bg-white/20 transition-colors"
                  aria-label="Close chat"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 pb-safe">
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      layout
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end space-x-2 max-w-[85%] ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                      }`}>
                        {message.role !== 'user' && message.id !== 'init' && (
                          <div className="p-2 rounded-full flex items-center justify-center text-white shadow-md shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600">
                            <FiCpu className="w-5 h-5" />
                          </div>
                        )}
                        {message.id === 'init' && (
                          <div className="w-9 h-9 shrink-0 flex items-center justify-center">
                            <FiCpu className="w-7 h-7 text-blue-600 opacity-90" />
                          </div>
                        )}
                        <div className={`px-4 py-2.5 rounded-xl whitespace-pre-wrap break-words shadow-sm ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                            : message.role === 'assistant' && message.id === 'init'
                            ? 'bg-blue-50 text-gray-800 shadow-none -ml-2'
                            : message.role === 'assistant'
                            ? 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                            : message.role === 'error'
                            ? 'bg-red-50 text-red-600 rounded-bl-none border border-red-100'
                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                        }`}>
                          <ReactMarkdown
                            components={{
                              a: ({ href, children }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline"
                                >
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                          {message.status === 'error' && message.role !== 'error' && (
                            <button
                              onClick={() => handleSend(undefined, message.content)}
                              className="ml-2 text-sm text-blue-600 hover:underline"
                            >
                              Retry
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* Starter Questions */}
              {messages.filter(m => m.role === 'user').length === 0 && (
                <div className="p-3 border-t border-gray-100 bg-white/80">
                  <p className="text-xs text-gray-500 mb-2 text-center">Or try a starter question:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {STARTER_QUESTIONS.map((q, i) => (
                      <motion.button
                        key={i}
                        onClick={() => handleStarterQuestion(q)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {q}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 border-t border-gray-100 bg-white sm:rounded-b-xl">
                <form onSubmit={handleSend} className="flex flex-col space-y-2 pb-safe">
                  {error && (
                    <motion.div 
                      className="text-sm text-red-500"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}
                  <div className="flex items-center space-x-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        setError(null);
                      }}
                      onFocus={() => {
                        setTimeout(() => {
                          inputRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
                        }, 100);
                      }}
                      placeholder="Ask something..."
                      className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 transition-shadow focus:shadow-md placeholder-gray-400"
                      disabled={isLoading}
                      maxLength={MAX_MESSAGE_LENGTH}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend(e);
                        }
                      }}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 ease-in-out transform active:scale-95"
                    >
                      {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <PaperAirplaneIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
