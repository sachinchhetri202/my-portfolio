'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, ChatBubbleOvalLeftEllipsisIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FaRobot, FaUser } from 'react-icons/fa';

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

const BOT_NAME = "Sachin's AI Assistant";
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
    <motion.div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" animate={{ y: ["-25%", "0%", "-25%"] }} transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }} />
    <motion.div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" animate={{ y: ["-25%", "0%", "-25%"] }} transition={{ duration: 0.7, delay: 0.15, repeat: Infinity, ease: "easeInOut" }} />
    <motion.div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" animate={{ y: ["-25%", "0%", "-25%"] }} transition={{ duration: 0.7, delay: 0.3, repeat: Infinity, ease: "easeInOut" }} />
  </div>
);

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
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 200 } },
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };
  
  const teaserVariants = {
    hidden: { opacity: 0, y: 10, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } }, // Added slight delay for entry animation
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
            exit="hidden" // Use hidden variant for exit to ensure smooth transition
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
            <span className="text-sm font-medium">Hey, ask me something!</span>
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
            className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full p-4 shadow-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-400 dark:focus:ring-blue-700 transition-all duration-300 ease-in-out"
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
            key="chat-window" // Added key for AnimatePresence
            variants={chatWindowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 md:bottom-10 md:right-10 z-50 w-[calc(100%-3rem)] max-w-md overflow-hidden chat-window-open" // Added class for easier querySelector checks if needed
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col h-[60vh] max-h-[700px] min-h-[300px]">
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between rounded-t-xl shadow-sm">
                <div className="flex items-center gap-2">
                  <FaRobot className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">{BOT_NAME}</h3>
                </div>
                  <button
                    onClick={() => setIsOpen(false)} // This is the only place that should set isOpen to false
                  className="p-1.5 rounded-full text-white/80 hover:bg-white/20 focus:outline-none focus:bg-white/30 transition-colors"
                  aria-label="Close chat"
                  >
                  <XMarkIcon className="w-6 h-6" />
                  </button>
                  </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                <AnimatePresence initial={false}>
                    {messages.map((message) => (
                    <motion.div
                        key={message.id}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      layout
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                        className={`flex items-end space-x-2 max-w-[85%] ${
                            message.role === 'user'
                              ? 'flex-row-reverse space-x-reverse'
                              : 'flex-row'
                          }`}
                        >
                        {message.role !== 'user' && message.id !== 'init' && ( // Don't show icon for initial welcome message
                          <div
                            className={`p-2 rounded-full flex items-center justify-center text-white shadow-md shrink-0 ${
                              message.role === 'assistant' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                                : message.role === 'error' ? 'bg-red-500' 
                                : 'bg-gray-400'
                            }`}
                          >
                            <FaRobot className="w-5 h-5" />
                          </div>
                        )}
                         {message.id === 'init' && ( // Special styling for initial message if needed, or just a placeholder for icon space
                            <div className="w-9 h-9 shrink-0"> {/* Matches approx size of icon + padding */}
                                <ChatBubbleOvalLeftEllipsisIcon className="w-7 h-7 text-indigo-500 dark:text-indigo-400 opacity-80 ml-1 mt-1" />
                            </div>
                         )}
                          <div
                          className={`px-4 py-2.5 rounded-xl whitespace-pre-wrap break-words shadow ${
                              message.role === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-br-none'
                              : message.role === 'assistant' && message.id === 'init'
                              ? 'bg-transparent dark:bg-transparent text-gray-800 dark:text-gray-100 shadow-none -ml-2' // Custom for welcome: less prominent bg
                              : message.role === 'assistant' 
                              ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
                              : message.role === 'error'
                              ? 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-bl-none'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-bl-none' 
                            }`}
                          >
                            {message.content}
                          {message.status === 'error' && message.role !== 'error' && ( // Don't show retry for the error message itself
                            <button
                              onClick={() => handleSend(undefined, message.content)}
                              className="ml-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
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
              {messages.filter(m => m.role ==='user').length === 0 && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">Or try a starter question:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {STARTER_QUESTIONS.map((q, i) => (
                      <motion.button
                        key={i}
                        onClick={() => handleStarterQuestion(q)}
                        className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
                <form onSubmit={(e) => handleSend(e)} className="flex flex-col space-y-2">
                  {error && (
                    <motion.div 
                      className="text-sm text-red-500 dark:text-red-400"
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
                      placeholder="Ask something..."
                      className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-shadow focus:shadow-md"
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
                      className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-lg shadow hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-400 dark:focus:ring-blue-700 transition-all duration-300 ease-in-out transform active:scale-95"
                    >
                      {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
