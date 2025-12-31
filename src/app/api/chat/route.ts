import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { retrieveRelevantChunks, type KnowledgeChunk } from '@/lib/rag/knowledgeBase';
import { generateResponse, type ChatMessage as RAGChatMessage } from '@/lib/rag/llm';
import { generateResponseFallback } from '@/lib/rag/fallbackLLM';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Rate limiting constants
const MAX_HISTORY_LENGTH = 10;
const MAX_TOKEN_LENGTH = 250;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

// Enhanced API key validation
if (!HUGGINGFACE_API_KEY) {
  console.warn("WARNING: HUGGINGFACE_API_KEY environment variable is not set! The chatbot will use free tier (may be slower).");
}

// Updated information based on the resume
const YOUR_NAME = "Sachin Paudel Chhetri";
const YOUR_ROLE = "Software/AI-Driven Applications Engineer, currently working as a Field Trip & Club Travel Assistant at Weber State University.";
const YOUR_SUMMARY = "Sachin is an AI Engineer with 4+ years of experience crafting intelligent applications. He combines his software engineering expertise with AI capabilities to build practical solutions - from real-time music classifiers to conversational AI chatbots. Currently pursuing his Master's in Computer Science with a focus on ML/DL, he's passionate about turning complex data into valuable insights that solve real-world problems.";

// CV/Resume Information
const CV_DETAILS = {
  downloadLink: "/resume/Resume.pdf",
  lastUpdated: "2025-06",
  format: "PDF",
  description: "A comprehensive CV detailing Sachin's education, work experience, technical skills, projects, and achievements. The CV is regularly updated to reflect his latest accomplishments and skills.",
  sections: {
    education: "Detailed academic journey from Japan to USA, including GPA and relevant coursework in AI/ML",
    experience: "Professional experience as Field Trip & Club Travel Assistant and previous roles, highlighting AI project implementations and achievements",
    skills: "Comprehensive list of technical skills, including AI/ML frameworks, programming languages, and cloud platforms",
    projects: "Notable AI-driven and software engineering projects with technologies used and impact metrics",
    leadership: "Leadership roles and community involvement in tech communities",
    languages: "Multilingual proficiency in Nepali, Japanese, Hindi, and English"
  },
  highlights: [
    "4+ years of AI/ML development experience",
    "Master's in Computer Science",
    "Full-stack development expertise",
    "International education and work experience",
    "Multiple successful AI-driven applications"
  ]
};

const CV_RELATED_RESPONSES = {
  howToGet: `You can download my CV directly from my website. Just click this link: [Download CV](/resume/Resume.pdf). The CV is in PDF format and was last updated in ${CV_DETAILS.lastUpdated}.`,
  whatIncludes: "My CV includes detailed information about my education, work experience, technical skills, notable projects, and achievements. It's regularly updated to reflect my latest accomplishments.",
  format: `The CV is available in ${CV_DETAILS.format} format, making it easy to view and print while maintaining consistent formatting across different devices.`,
  highlights: `Here are some key highlights from my CV:\n${CV_DETAILS.highlights.join('\n')}`,
  sections: `My CV is organized into several key sections:\n${Object.entries(CV_DETAILS.sections).map(([key, value]) => `* **${key.charAt(0).toUpperCase() + key.slice(1)}**: ${value}`).join('\n')}`,
  education: `The education section of my CV details my unique international academic journey: ${CV_DETAILS.sections.education}`,
  experience: `My professional experience section showcases: ${CV_DETAILS.sections.experience}`,
  skills: `The skills section comprehensively covers: ${CV_DETAILS.sections.skills}`,
  contextual: {
    forRecruiters: "My CV is tailored to highlight my technical achievements, project impacts, and quantifiable results that would be relevant for technical roles.",
    forAcademic: "The CV includes detailed academic achievements, research interests, and relevant coursework in Computer Science.",
    forNetworking: "You'll find a good overview of my professional journey, technical expertise, and areas of interest for potential collaboration."
  }
};

const YOUR_STUDIES = "M.S. in Computer Science at Weber State University (Ogden, Utah), expected graduation April 2026. Previously, B.S. in Computer Science from Weber State University (2021-2024, GPA 3.6) and Kanto International Senior High School (Tokyo, Japan, 2016-2019).";
const YOUR_LANGUAGES = "Sachin is fluent in Nepali (mother tongue), Japanese (lived and studied in Japan for junior high and high school), Hindi (learned through media), and English (learned from a young age).";
const YOUR_ORIGIN_DETAILS = "He is originally from Nepal, born in Baglung. He lived and completed his schooling up to the 9th grade in the city of Pokhara.";
const YOUR_EDUCATION_JOURNEY = "After completing 9th grade in Pokhara, Nepal, Sachin moved to Japan where he attended Ootsuna Junior High School located in Okurayama, Yokohama, Japan. He then continued his education at Kanto International Senior High School in Tokyo, Japan (2016-2019), before moving to the United States for his university studies at Weber State University.";
const RELEVANT_COURSEWORK = "Advanced Algorithms, Object-Oriented Programming, Software Engineering I & II, Advanced SQL Database Knowledge, Business Communication, Prompt Engineering (AI, ML), Deep Theory using ML/DL.";

const WORK_HISTORY = [
  { 
    title: "Field Trip & Club Travel Assistant", 
    company: "Weber State University, Study Abroad Office", 
    duration: "2025 - Present", 
    details: "Assisting the Director of Study Abroad with trip planning and execution. Coordinating with faculty, department chairs, and Risk Management to ensure university-wide compliance. Managing documentation by gathering necessary signatures from designated signatories. Maintaining a comprehensive database of all university field trips." 
  },
  { 
    title: "Computer Science Tutor", 
    company: "Weber State University, Engineering, Applied Science and Technology", 
    duration: "2024 - 2025", 
    details: "Provided one-on-one and group tutoring for students in CS, NET, and WEB courses, assisting with programming assignments, homework, and conceptual understanding. Supported students in foundational and intermediate Computer Science courses (CS 1400, 1410, 2550, 2420) with an emphasis on troubleshooting, problem-solving, and practical coding skills." 
  },
  { 
    title: "Marketing & CRM Specialist", 
    company: "Weber State University (International Student Scholar Center)", 
    duration: "2021 - 2024", 
    details: "Implemented data-driven marketing strategies, developed automated email systems, and used SQL analytics to optimize student engagement. Created predictive models to improve event attendance." 
  },
  { 
    title: "Assistant Manager", 
    company: "Lawson Store (Tokyo, Japan)", 
    duration: "Jan 2016 - Dec 2019", 
    details: "Led store operations, trained staff, and implemented efficient systems that improved performance metrics. Developed strong leadership and problem-solving skills." 
  }
];

const TECHNICAL_SKILLS = {
  programmingLanguages: "Python (primary), TypeScript, JavaScript, SQL, C++, C#",
  aiFrameworks: "TensorFlow, PyTorch, Scikit-learn, Hugging Face Transformers",
  webFrameworks: "Django, Next.js, React, Express",
  aiTools: "Google Gemini, OpenAI GPT, LangChain",
  databases: "MySQL, PostgreSQL, MongoDB",
  cloudPlatforms: "AWS, Google Cloud Platform",
  devTools: "Git, Docker, Postman, Jupyter Notebooks",
  dataProcessing: "Pandas, NumPy, SciPy"
};

const PROJECT_LINK = "https://sachinpc202.netlify.app/projects";
const PORTFOLIO_LINK = "https://sachinpc202.netlify.app";
const CONTACT_LINK = "https://sachinpc202.netlify.app/contact";

const SOCIAL_MEDIA = {
  linkedin: "https://www.linkedin.com/in/sachin-chhetri-475831199/",
  github: "https://github.com/sachinchhetri202",
  facebook: "https://www.facebook.com/sachin.chettri2/",
  twitter: "https://x.com/ghost__rider7"
};

const LEADERSHIP_MENTORING = [
  "Field Trip & Club Travel Assistant at Weber State University",
  "Former Computer Science Tutor at Weber State University",
  "International Student Mentor",
  "Founder & Former President of Nepalese Student Association @ WSU (Led a 500+ member group, coordinated cultural events, guided new students, and launched mentorship initiatives)."
];

// GitHub configuration
const GITHUB_CONFIG = {
  username: 'sachinchhetri202',
  // Repositories to exclude from latest project detection
  excludeRepos: ['sachinchhetri202', 'config-files', 'dotfiles'],
  // Cache duration for GitHub data (in minutes)
  cacheMinutes: 30
};

// GitHub repository interface
interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  topics: string[];
  homepage: string | null;
  fork: boolean;
  archived: boolean;
}

// Enhanced project info with GitHub data
interface ProjectInfo {
  name: string;
  description: string;
  githubData?: GitHubRepo;
  category: string;
  isLatest?: boolean;
  isFeatured?: boolean;
}

// Static project information for projects not on GitHub or need custom descriptions
const STATIC_PROJECTS_INFO: { [key: string]: Omit<ProjectInfo, 'name'> } = {
  'Music-Genre-Classifier': {
    description: "Real-time music classification system using deep learning and audio signal processing. Analyzes audio features to identify music genres with high accuracy.",
    category: "ai_ml",
    isFeatured: true
  },
  'Financial-Anomaly-Detection': {
    description: "Machine learning system for detecting unusual patterns in financial transactions. Uses advanced algorithms to identify potential fraud or anomalies.",
    category: "ai_ml",
    isFeatured: true
  },
  'HomeExpenseTracker': {
    description: "A modern, full-stack web application that simplifies household expense management. Built with React.js frontend and Node.js/Express backend, featuring user authentication, expense categorization, budget tracking, and interactive data visualization.",
    category: "business",
    isFeatured: true
  },
  'my-portfolio': {
    description: "An intelligent chatbot (the one you're talking to!) powered by Google's Gemini AI. Features natural conversation, custom knowledge integration, and context-aware responses to help visitors learn about my work and experience.",
    category: "web_dev",
    isFeatured: true
  },
  'SemanticFAQ-System': {
    description: "Natural Language Processing solution using sentence embeddings and cosine similarity for efficient question answering. Helps businesses automate customer support.",
    category: "ai_ml"
  },
  'SentimentAnalyzer': {
    description: "Desktop application for sentiment analysis with review visualization and topic extraction. Helps businesses understand customer feedback.",
    category: "ai_ml"
  },
  'GrantManagementSystem': {
    description: "Full-Stack system for role-based access using .NET, featuring secure authentication and comprehensive grant lifecycle management.",
    category: "business"
  }
};

// Cache for GitHub data
let githubDataCache: { data: GitHubRepo[]; timestamp: number } | null = null;

// Function to fetch GitHub repositories
async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    // Check cache first
    if (githubDataCache) {
      const now = Date.now();
      const cacheAge = (now - githubDataCache.timestamp) / (1000 * 60); // in minutes
      if (cacheAge < GITHUB_CONFIG.cacheMinutes) {
        return githubDataCache.data;
      }
    }

    const response = await fetch(
      `https://api.github.com/users/${GITHUB_CONFIG.username}/repos?per_page=100&sort=created&type=owner`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Bot'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();
    
    // Filter out excluded repositories
    const filteredRepos = repos.filter(repo => 
      !GITHUB_CONFIG.excludeRepos.includes(repo.name) && 
      !repo.fork && 
      !repo.archived
    );

    // Update cache
    githubDataCache = {
      data: filteredRepos,
      timestamp: Date.now()
    };

    return filteredRepos;
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    // Return cached data if available, otherwise empty array
    return githubDataCache?.data || [];
  }
}

// Function to get latest projects based on GitHub data
async function getLatestProjects(): Promise<{
  latest: ProjectInfo[];
  all: ProjectInfo[];
  mostRecent: ProjectInfo | null;
}> {
  try {
    const githubRepos = await fetchGitHubRepos();
    
    // Sort repositories by creation date (newest first)
    const sortedRepos = githubRepos.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Create project info combining GitHub data with static info
    const allProjects: ProjectInfo[] = sortedRepos.map((repo, index) => {
      const staticInfo = STATIC_PROJECTS_INFO[repo.name] || {
        description: repo.description || 'No description provided.',
        category: 'other'
      };

      return {
        name: repo.name,
        description: staticInfo.description,
        githubData: repo,
        category: staticInfo.category,
        isLatest: index < 3, // Mark top 3 most recent as latest
        isFeatured: staticInfo.isFeatured || false
      };
    });

    // Get the 3 most recent projects
    const latestProjects = allProjects.filter(p => p.isLatest);
    const mostRecent = allProjects.length > 0 ? allProjects[0] : null;

    return {
      latest: latestProjects,
      all: allProjects,
      mostRecent
    };
  } catch (error) {
    console.error('Error getting latest projects:', error);
    // Fallback to static data
    return {
      latest: [],
      all: [],
      mostRecent: null
    };
  }
}

// Function to format date for display
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Function to get project list for prompt (this will be called dynamically)
async function getProjectListForPrompt(): Promise<string> {
  const projectsInfo = await getLatestProjects();
  
  let prompt = '';
  
  if (projectsInfo.latest.length > 0) {
    prompt += `## Latest Projects (Most Recent)\n`;
    prompt += projectsInfo.latest.map((p, i) => {
      const createdDate = p.githubData ? formatDate(p.githubData.created_at) : 'Date unknown';
      const updatedDate = p.githubData ? formatDate(p.githubData.updated_at) : 'Date unknown';
      const featured = p.isFeatured ? ' Featured' : '';
      const stars = p.githubData ? ` (${p.githubData.stargazers_count} stars)` : '';
      
      return `${i + 1}. **${p.name}**${featured}${stars}\n   - ${p.description}\n   - Created: ${createdDate}\n   - Last Updated: ${updatedDate}`;
    }).join('\n\n');
    prompt += '\n\n';
  }

  // Group remaining projects by category
  const categorizedProjects = projectsInfo.all.reduce((acc, project) => {
    if (!project.isLatest) {
      if (!acc[project.category]) acc[project.category] = [];
      acc[project.category].push(project);
    }
    return acc;
  }, {} as { [key: string]: ProjectInfo[] });

  const categoryTitles = {
    'ai_ml': 'AI & Machine Learning',
    'business': 'Business Applications', 
    'data_analytics': 'Data Analytics',
    'web_dev': 'Web Development',
    'other': 'Other Projects'
  };

  Object.entries(categorizedProjects).forEach(([category, projects]) => {
    if (projects.length > 0) {
      prompt += `## ${categoryTitles[category as keyof typeof categoryTitles] || '🔧 Other Projects'}\n`;
      prompt += projects.map((p, i) => {
        const createdDate = p.githubData ? ` (${new Date(p.githubData.created_at).getFullYear()})` : '';
        return `${i + 1}. **${p.name}**${createdDate}\n   - ${p.description}`;
      }).join('\n\n');
      prompt += '\n\n';
    }
  });

  prompt += `For detailed documentation and code samples, visit: ${PROJECT_LINK}\n`;
  
  return prompt;
}

// Constructing parts of the system prompt dynamically
let workHistoryForPrompt = WORK_HISTORY.map(job => `* ${job.title} at ${job.company} (${job.duration}): ${job.details}`).join("\n");
let leadershipForPrompt = LEADERSHIP_MENTORING.map(item => `* ${item}`).join("\n");

const BOT_DISPLAY_NAME = "Sachin.dev Assistant";

// We'll build the system instruction dynamically in the POST function
// since we need to fetch GitHub data first

interface ChatRequestBody {
  message: string;
  history: { role: 'user' | 'model'; parts: { text: string }[] }[];
}

// Rate limit function
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip) || { count: 0, timestamp: now };
  
  if (now - userLimit.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  userLimit.count++;
  rateLimitMap.set(ip, userLimit);
  return true;
}

// Enhanced sanitize function for input validation
function sanitizeInput(text: string): string {
  // Remove potentially harmful characters and patterns
  let sanitized = text
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
    .replace(/data:/gi, '') // Remove data: protocol
    .trim();
  
  // Length check after sanitization
  if (sanitized.length === 0) {
    throw new Error('Empty message after sanitization');
  }
  
  // Check for excessive repetition (potential spam)
  const words = sanitized.split(/\s+/);
  const uniqueWords = new Set(words);
  if (words.length > 10 && uniqueWords.size / words.length < 0.3) {
    throw new Error('Message appears to be spam');
  }
  
  // Check for common misinformation patterns
  const misinformationPatterns = [
    /i (?:think|believe|heard) (?:sachin|he) (?:is|was|has)/i,
    /(?:sachin|he) (?:also|actually) (?:is|was|has)/i
  ];
  
  if (misinformationPatterns.some(pattern => pattern.test(sanitized))) {
    throw new Error('Potential misinformation detected');
  }
  
  return sanitized;
}

// Add conversational enhancements
const CONVERSATION_ENHANCEMENTS = {
  // Natural response patterns
  responsePatterns: {
    enthusiasm: [
      "I'm excited to share that...",
      "That's a great question!",
      "I love talking about this...",
      "This is one of my favorite topics!"
    ],
    acknowledgment: [
      "Absolutely!",
      "Of course!",
      "Sure thing!",
      "Got it!"
    ],
    transition: [
      "Now, regarding your question...",
      "To answer your question...",
      "Here's what I can tell you...",
      "Let me share that with you..."
    ]
  },
  
  // Context-aware responses
  contextResponses: {
    firstTimeUser: "Welcome! I'm so glad you're here to learn about Sachin's work.",
    returningUser: "Great to see you again! What would you like to know today?",
    technicalQuestion: "I love technical questions! Let me break this down for you...",
    projectInquiry: "Sachin's projects are really impressive! Here's what I can tell you..."
  }
};

export async function POST(req: NextRequest) {
  // Enhanced IP extraction for rate limiting
  const forwardedFor = headers().get('x-forwarded-for');
  const realIP = headers().get('x-real-ip');
  const cfConnectingIP = headers().get('cf-connecting-ip');
  
  // Use the most reliable IP source available
  const ip = cfConnectingIP || realIP || forwardedFor?.split(',')[0] || 'unknown';
  
  // Basic IP validation (IPv4/IPv6)
  if (ip !== 'unknown' && !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^[0-9a-fA-F:]+$/.test(ip)) {
    return NextResponse.json({ 
      error: 'Invalid request', 
      details: 'Request validation failed.' 
    }, { status: 400 });
  }
  
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ 
      error: 'I\'m receiving too many requests right now.', 
      details: `Please wait a moment before sending another message.` 
    }, { status: 429 });
  }

  try {
    const body: ChatRequestBody = await req.json();
    
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json({ 
        error: 'I didn\'t receive your message properly.', 
        details: 'Please try sending your message again.' 
      }, { status: 400 });
    }

    // Sanitize input
    const sanitizedMessage = sanitizeInput(body.message);
    
    if (sanitizedMessage.length > MAX_TOKEN_LENGTH) {
      return NextResponse.json({ 
        error: 'Your message is too long for me to process.', 
        details: `Please keep your message under ${MAX_TOKEN_LENGTH} characters.` 
      }, { status: 400 });
    }

    // RAG: Retrieve relevant knowledge chunks
    const relevantChunks = retrieveRelevantChunks(sanitizedMessage, 5);
    
    // Build RAG context from retrieved chunks
    let ragContext = relevantChunks.length > 0
      ? relevantChunks.map((chunk, index) => `[${index + 1}] ${chunk.content}`).join('\n\n')
      : 'General information about Sachin Chhetri: AI Engineer with 4+ years of experience, currently pursuing MS in Computer Science at Weber State University.';

    // Get dynamic project information for additional context
    try {
      const projectListForPrompt = await getProjectListForPrompt();
      const latestProjectsInfo = await getLatestProjects();
      
      // Add project info to RAG context if relevant
      if (sanitizedMessage.toLowerCase().includes('project')) {
        ragContext += `\n\n**Latest Projects:**\n${projectListForPrompt}`;
      }
    } catch (error) {
      console.error('Error fetching project info:', error);
      // Continue without project info if there's an error
    }

    // Convert history to RAG format
    const ragMessages: RAGChatMessage[] = [];
    if (Array.isArray(body.history)) {
      for (const msg of body.history.slice(-MAX_HISTORY_LENGTH)) {
        if (msg.role === 'user' && msg.parts?.[0]?.text) {
          ragMessages.push({ role: 'user', content: msg.parts[0].text });
        } else if (msg.role === 'model' && msg.parts?.[0]?.text) {
          ragMessages.push({ role: 'assistant', content: msg.parts[0].text });
        }
      }
    }
    
    // Add current user message
    ragMessages.push({ role: 'user', content: sanitizedMessage });

    // Generate response using RAG + Hugging Face LLM (with fallback)
    let text: string;
    try {
      text = await generateResponse(ragMessages, ragContext, relevantChunks);
    } catch (llmError: any) {
      console.error('LLM generation failed, using fallback:', llmError);
      // Use rule-based fallback system
      text = await generateResponseFallback(ragMessages, ragContext, relevantChunks);
    }

    if (!text || text.trim().length === 0) {
      throw new Error('Empty response from AI model');
    }

    return NextResponse.json({ 
      message: text.trim(),
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    // Handle specific error types
    if (error.message === 'Potential misinformation detected') {
      return NextResponse.json({ 
        error: 'I couldn\'t process that message. Could you please rephrase it?', 
        details: 'Please try asking your question in a different way.' 
      }, { status: 400 });
    }
    
    if (error.message?.includes('API key') || error.message?.includes('API configuration')) {
      return NextResponse.json({ 
        error: 'I\'m temporarily unavailable due to configuration issues.', 
        details: 'Please try again later or contact through other channels.' 
      }, { status: 503 });
    }

    if (error.message === 'Empty response from AI model') {
      return NextResponse.json({ 
        error: 'I\'m having trouble generating a response right now.', 
        details: 'Please try asking your question again in a moment.' 
      }, { status: 500 });
    }

    // Handle network or API-related errors
    if (error.name === 'AbortError' || error.message?.includes('fetch')) {
      return NextResponse.json({ 
        error: 'I\'m having trouble connecting right now.', 
        details: 'Please check your internet connection and try again.' 
      }, { status: 503 });
    }

    // Generic error with user-friendly message
    return NextResponse.json({ 
      error: 'I\'m having trouble processing your request right now.', 
      details: 'Please try again in a moment. If the problem persists, feel free to contact me through other channels.' 
    }, { status: 500 });
  }
} 