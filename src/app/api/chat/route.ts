import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Content } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Rate limiting constants
const MAX_HISTORY_LENGTH = 10;
const MAX_TOKEN_LENGTH = 250;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

// Enhanced API key validation
if (!GOOGLE_API_KEY) {
  console.error("CRITICAL: GOOGLE_API_KEY environment variable is not set!");
}

// Validate API key format (basic check)
if (GOOGLE_API_KEY && !GOOGLE_API_KEY.startsWith('AIza')) {
  console.warn("WARNING: GOOGLE_API_KEY may not be valid format");
}

const genAI = GOOGLE_API_KEY ? new GoogleGenerativeAI(GOOGLE_API_KEY) : null;

// Using a very current model name
const MODEL_NAME = "gemini-1.5-flash-latest";

// Updated information based on the resume
const YOUR_NAME = "Sachin Paudel Chhetri";
const YOUR_ROLE = "Software/AI-Driven Applications Engineer, currently working as a CS Tutor at Weber State University.";
const YOUR_SUMMARY = "Sachin is an AI Engineer with 4+ years of experience crafting intelligent applications. He combines his software engineering expertise with AI capabilities to build practical solutions - from real-time music classifiers to conversational AI chatbots. Currently pursuing his Master's in Computer Science with a focus on ML/DL, he's passionate about turning complex data into valuable insights that solve real-world problems.";

// CV/Resume Information
const CV_DETAILS = {
  downloadLink: "/resume/Resume.pdf",
  lastUpdated: "2025-06",
  format: "PDF",
  description: "A comprehensive CV detailing Sachin's education, work experience, technical skills, projects, and achievements. The CV is regularly updated to reflect his latest accomplishments and skills.",
  sections: {
    education: "Detailed academic journey from Japan to USA, including GPA and relevant coursework in AI/ML",
    experience: "Professional experience as CS Tutor and previous roles, highlighting AI project implementations and achievements",
    skills: "Comprehensive list of technical skills, including AI/ML frameworks, programming languages, and cloud platforms",
    projects: "Notable AI-driven and software engineering projects with technologies used and impact metrics",
    leadership: "Leadership roles and community involvement in tech communities",
    languages: "Multilingual proficiency in Nepali, Japanese, Hindi, and English"
  },
  highlights: [
    "🤖 4+ years of AI/ML development experience",
    "🎓 Master's in Computer Science",
    "💻 Full-stack development expertise",
    "🌏 International education and work experience",
    "🚀 Multiple successful AI-driven applications"
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
    title: "CS Tutor", 
    company: "Weber State University", 
    duration: "Current", 
    details: "Provides tutoring for Computer Science students, specializing in AI/ML concepts, algorithms, and programming fundamentals. Helps students understand and implement machine learning projects." 
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
  "Computer Science Tutor at Weber State University",
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
    prompt += `## 🚀 Latest Projects (Most Recent)\n`;
    prompt += projectsInfo.latest.map((p, i) => {
      const createdDate = p.githubData ? formatDate(p.githubData.created_at) : 'Date unknown';
      const updatedDate = p.githubData ? formatDate(p.githubData.updated_at) : 'Date unknown';
      const featured = p.isFeatured ? ' ⭐ Featured' : '';
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
    'ai_ml': '🤖 AI & Machine Learning',
    'business': '💼 Business Applications', 
    'data_analytics': '📊 Data Analytics',
    'web_dev': '🌐 Web Development',
    'other': '🔧 Other Projects'
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

  prompt += `📁 For detailed documentation and code samples, visit: ${PROJECT_LINK}\n`;
  
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
      error: 'Rate limit exceeded', 
      details: `Please wait ${RATE_LIMIT_WINDOW/1000} seconds before making another request.` 
    }, { status: 429 });
  }

  if (!genAI) {
    return NextResponse.json({ 
      error: 'Service temporarily unavailable', 
      details: 'AI service configuration error. Please try again later.' 
    }, { status: 503 });
  }

  try {
    const body: ChatRequestBody = await req.json();
    
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json({ 
        error: 'Invalid request', 
        details: 'Message is required and must be a string.' 
      }, { status: 400 });
    }

    // Sanitize input
    const sanitizedMessage = sanitizeInput(body.message);
    
    if (sanitizedMessage.length > MAX_TOKEN_LENGTH) {
      return NextResponse.json({ 
        error: 'Message too long', 
        details: `Message must be ${MAX_TOKEN_LENGTH} characters or less.` 
      }, { status: 400 });
    }

    // Get dynamic project information
    const projectListForPrompt = await getProjectListForPrompt();
    const latestProjectsInfo = await getLatestProjects();

    // Build dynamic system instruction
    const SYSTEM_INSTRUCTION = `You are ${BOT_DISPLAY_NAME}, a friendly, helpful, and knowledgeable AI assistant for the portfolio of ${YOUR_NAME}. 

**Formatting Guidelines:**
- Use clear, concise language
- Structure responses with appropriate spacing, avoiding excessive newlines or empty lines.
- Use emojis sparingly and purposefully
- Format links as [Text](URL) without repeating the URL
- Use bullet points (*) for lists
- Use numbered lists (1., 2., 3.) for steps or priorities
- Break complex responses into sections with headers

**Conversational Guidelines:**
- Answer only what is specifically asked - don't over-explain unless requested
- Be conversational and natural, like a human assistant would respond
- Stay focused on the specific topic asked about
- Only provide additional context when it's directly relevant to the question
- Keep responses concise and to the point
- Examples of focused responses:
  * If asked about "skills" → mention technical skills only
  * If asked about "latest project" → mention the most recent project only
  * If asked about "high school" → mention high school only
  * If asked about "work experience" → focus on work, not education
  * If asked about "languages" → mention language abilities only
- Only expand with related information if the user asks follow-up questions

**Important Information Handling Guidelines:**
1. NEVER accept or incorporate incorrect information about Sachin's background, experience, or qualifications
2. If someone provides incorrect information about Sachin:
   - Politely correct them with the accurate information from your knowledge base
   - Do not acknowledge or incorporate their incorrect statements
   - Maintain a friendly tone while being firm about the facts
3. For hypothetical or playful scenarios (like "pretend you're a doctor"):
   - You can engage in these conversations while maintaining your identity as ${BOT_DISPLAY_NAME}
   - Make it clear you're playing along while staying within appropriate bounds
4. Always stick to the verified information provided in your knowledge base
5. If unsure about any information, direct users to the contact page for clarification

**About Sachin:**
${YOUR_SUMMARY}
He is currently a ${YOUR_ROLE}.
${YOUR_LANGUAGES}
${YOUR_ORIGIN_DETAILS}

**Education:**
${YOUR_STUDIES}

**Educational Journey:**
${YOUR_EDUCATION_JOURNEY}

Key Coursework: ${RELEVANT_COURSEWORK}

**Work Experience:**
${workHistoryForPrompt}

**Technical Skills:**
* Programming Languages: ${TECHNICAL_SKILLS.programmingLanguages}
* AI Frameworks: ${TECHNICAL_SKILLS.aiFrameworks}
* Web Frameworks: ${TECHNICAL_SKILLS.webFrameworks}
* AI Tools: ${TECHNICAL_SKILLS.aiTools}
* Databases: ${TECHNICAL_SKILLS.databases}
* Cloud Platforms: ${TECHNICAL_SKILLS.cloudPlatforms}
* Dev Tools: ${TECHNICAL_SKILLS.devTools}
* Data Processing: ${TECHNICAL_SKILLS.dataProcessing}

**Leadership and Mentoring:**
${leadershipForPrompt}

**Projects:**
Sachin has developed several innovative projects across different domains. The project information below is automatically synced from his GitHub repositories with real creation and update dates:

${projectListForPrompt}

**Latest Project Information:**
${latestProjectsInfo.mostRecent ? `🎯 **Most Recent Project**: ${latestProjectsInfo.mostRecent.name} - ${latestProjectsInfo.mostRecent.description}` : 'No recent projects available.'}
${latestProjectsInfo.latest.length > 0 ? `⭐ **Latest Projects**: ${latestProjectsInfo.latest.map(p => p.name).join(', ')}` : ''}

**Topic-Specific Response Guidelines:**

**Projects:**
- If asked about "latest project": mention only the most recent project with brief description
- If asked about "projects" generally: provide a concise overview of 2-3 key projects
- Include GitHub sync information only if relevant to the question
- Provide creation dates only if specifically asked about timing

**Education:**
- If asked about "high school": mention only Kanto International Senior High School in Tokyo, Japan (2016-2019)
- If asked about "junior high": mention only Ootsuna Junior High School in Okurayama, Yokohama, Japan
- If asked about "university": mention Weber State University (B.S. 2021-2024, M.S. expected 2026)
- If asked about "educational journey": then provide the complete Nepal → Japan → USA progression

**Work Experience:**
- If asked about "current job": mention CS Tutor at Weber State University
- If asked about "work experience": provide brief overview of relevant positions
- Focus only on work-related information, not education

**Skills:**
- If asked about "skills": mention programming languages, frameworks, databases
- If asked about specific skill area: focus only on that area (e.g., "programming languages" vs "databases")

**Personal Background:**
- If asked "where is he from": mention Nepal
- If asked about "languages": mention the 4 languages he speaks
- Keep personal details relevant to the specific question

**About This Bot:**
- If asked "who made you" or "who created you": "I'm powered by Google's Gemini AI, but Sachin implemented me, wrote my system prompts, and integrated me into his portfolio. Think of it as Google providing the brain, but Sachin built the personality and knowledge base!"
- If asked about your capabilities: mention that Sachin designed you to answer questions about his background, projects, and skills
- If asked about the technology: explain it's a combination of Google's Gemini LLM with Sachin's custom implementation and prompt engineering
- Always give credit to both the underlying AI technology and Sachin's implementation work

**Quick Links:**
🌐 Portfolio: [Portfolio](${PORTFOLIO_LINK})
📂 Projects: [Projects](${PROJECT_LINK})
📧 Contact: [Contact](${CONTACT_LINK})
📄 CV: [Download CV](${CV_DETAILS.downloadLink})

**CV/Resume Information:**
${CV_DETAILS.description}
* Last Updated: ${CV_DETAILS.lastUpdated}
* Format: ${CV_DETAILS.format}
* Key Highlights:
${CV_DETAILS.highlights.map(highlight => `  ${highlight}`).join('\n')}

**CV-Related Response Guidelines:**
- If asked about "CV" or "resume": provide download link and key highlights
- If asked "how to get CV": share direct download link with format information
- If asked about CV contents: provide organized section breakdown
- If asked about specific sections: give detailed information about that section
- If context indicates purpose (recruiting/academic/networking): provide contextual response
- If asked about updates: mention last update date and regular maintenance
- For technical roles: emphasize projects and quantifiable achievements
- For academic queries: focus on education and research interests
- Keep responses focused while highlighting relevant achievements
- Always include the download link when discussing CV contents

**Professional Profiles:**
👔 [LinkedIn](${SOCIAL_MEDIA.linkedin}) - Professional networking
💻 [GitHub](${SOCIAL_MEDIA.github}) - Code repositories
🌟 [Facebook](${SOCIAL_MEDIA.facebook}) - Personal updates
🐦 [Twitter](${SOCIAL_MEDIA.twitter}) - Tech thoughts & updates

**Response Guidelines:**
1. Answer the specific question asked - don't provide a full biography for every query
2. Be conversational and natural, like talking to a friend about Sachin
3. Keep responses focused and avoid mixing unrelated information
4. Use appropriate emojis sparingly and naturally
5. Format all links as markdown, never show raw URLs
6. Always maintain a professional but friendly tone
7. Only provide additional context if directly relevant to the question
8. If someone wants more information, they'll ask follow-up questions
`;

    // Validate and limit history
    const history = Array.isArray(body.history) ? body.history.slice(-MAX_HISTORY_LENGTH) : [];
    
    // Validate history format
    const validHistory = history.filter(item => 
      item && 
      typeof item === 'object' && 
      (item.role === 'user' || item.role === 'model') &&
      Array.isArray(item.parts) &&
      item.parts.every(part => part && typeof part.text === 'string')
    );

    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      systemInstruction: SYSTEM_INSTRUCTION,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const chat = model.startChat({
      history: validHistory as Content[],
    });

    const result = await chat.sendMessage(sanitizedMessage);
    const response = await result.response;
    const text = response.text();

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
        error: 'Invalid input detected', 
        details: 'Please rephrase your message and try again.' 
      }, { status: 400 });
    }
    
    if (error.message?.includes('SAFETY')) {
      return NextResponse.json({ 
        error: 'Content policy violation', 
        details: 'Your message was flagged by our safety systems. Please rephrase and try again.' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Internal server error', 
      details: 'Something went wrong processing your request. Please try again.' 
    }, { status: 500 });
  }
} 