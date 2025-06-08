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

if (!GOOGLE_API_KEY) {
  console.error("CRITICAL: GOOGLE_API_KEY environment variable is not set!");
}

const genAI = GOOGLE_API_KEY ? new GoogleGenerativeAI(GOOGLE_API_KEY) : null;

// Using a very current model name
const MODEL_NAME = "gemini-1.5-flash-latest";

// Updated information based on the resume
const YOUR_NAME = "Sachin Paudel Chhetri";
const YOUR_ROLE = "Free lancing as a Software Engineer and a Backend Developer. Currently working as a CS Tutor at Weber State University";
const YOUR_SUMMARY = "Sachin is a Computer Science graduate with hands-on experience in software development, data engineering, and AI projects. He is passionate about building useful tech, learning fast, and contributing to teams working on real-world problems.";
const YOUR_STUDIES = "M.S. in Computer Science at Weber State University (Ogden, Utah), expected graduation April 2026. Previously, B.S. in Computer Science from Weber State University (2021-2024, GPA 3.6) and Kanto International Senior High School (Tokyo, Japan, 2016-2019).";
const YOUR_LANGUAGES = "Sachin is fluent in Nepali (mother tongue), Japanese (lived and studied in Japan for junior high and high school), Hindi (learned through media), and English (learned from a young age).";
const YOUR_ORIGIN_DETAILS = "He is originally from Nepal, born in Baglung. He lived and completed his schooling up to the 9th grade in the city of Pokhara.";
const RELEVANT_COURSEWORK = "Advanced Algorithms, Object-Oriented Programming, Software Engineering I & II, Advanced SQL Database Knowledge, Business Communication, Prompt Engineering (AI, ML), Deep Theory using ML/DL.";

const WORK_HISTORY = [
  { title: "CS Tutor", company: "Weber State University", duration: "Current", details: "Provides tutoring for Computer Science students." },
  { title: "Marketing & CRM Specialist", company: "Weber State University (International Student Scholar Center (ISSC))", duration: "2021 - 2024", details: "Boosted student engagement by 80% via targeted digital campaigns, developed dynamic email templates (HTML/CSS/JS), and analyzed student data using SQL to optimize event success metrics." },
  { title: "Assistant Manager", company: "Lawson Store (Tokyo, Japan)", duration: "Jan 2016 - Dec 2019", details: "Trained 5+ new hires improving onboarding time by 25%, elevated store performance to Top 100, and implemented efficient shift rotations reducing labor overhead by 15%." }
];

const TECHNICAL_SKILLS = {
  programmingLanguages: "Python, SQL, HTML5, CSS, JS, C++, C#",
  frameworks: "Django, Node.js, React, Express",
  databases: "MySQL, MongoDB",
  softwareTools: "MS Office 365, GitHub, Canva, Adobe, Figma",
  apiTesting: "Postman, RESTer"
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

const PROJECTS_INFO = {
  ai_ml: [
    { name: "SemanticFAQ System", description: "NLP solution using sentence embeddings and cosine similarity for efficient question answering." },
    { name: "MovieRecommendationEngine", description: "Python-based machine learning system for personalized movie suggestions." },
    { name: "SentimentAnalyzerApp", description: "Desktop tool for sentiment analysis with review visualization and topic extraction." }
  ],
  business: [
    { name: "BankingApp", description: "Secure app with role-based access, SHA-256 login, and transaction management." },
    { name: "GrantManagementSystem", description: "Full-Stack system for role-based access using .NET, HTML, CSS, JS." }
  ],
  data_analytics: [
    { name: "High-ValueTransaction", description: "ML model using Random Forest to detect anomalous high-value transactions." }
  ],
  web_dev: [
    { name: "Portfolio Website Chatbot", description: "This very AI assistant you are talking to, built with Next.js and Google Gemini." }
  ]
};

// Constructing parts of the system prompt dynamically
let workHistoryForPrompt = WORK_HISTORY.map(job => `* ${job.title} at ${job.company} (${job.duration}): ${job.details}`).join("\n");

// Format projects with categories and emojis
let projectListForPrompt = `
## 🤖 AI & Machine Learning
${PROJECTS_INFO.ai_ml.map((p, i) => `${i + 1}. **${p.name}**\n   - ${p.description}`).join("\n\n")}

## 💼 Business Applications
${PROJECTS_INFO.business.map((p, i) => `${i + 1}. **${p.name}**\n   - ${p.description}`).join("\n\n")}

## 📊 Data Analytics
${PROJECTS_INFO.data_analytics.map((p, i) => `${i + 1}. **${p.name}**\n   - ${p.description}`).join("\n\n")}

## 🌐 Web Development
${PROJECTS_INFO.web_dev.map((p, i) => `${i + 1}. **${p.name}**\n   - ${p.description}`).join("\n\n")}

📁 For detailed documentation and code samples, visit: ${PROJECT_LINK}
`;

let leadershipForPrompt = LEADERSHIP_MENTORING.map(item => `* ${item}`).join("\n");

const BOT_DISPLAY_NAME = "SC.dev Assistant";

const SYSTEM_INSTRUCTION = `You are ${BOT_DISPLAY_NAME}, a friendly, helpful, and knowledgeable AI assistant for the portfolio of ${YOUR_NAME}. 

**Formatting Guidelines:**
- Use clear, concise language
- Structure responses with appropriate spacing, avoiding excessive newlines or empty lines.
- Use emojis sparingly and purposefully
- Format links as [Text](URL) without repeating the URL
- Use bullet points (*) for lists
- Use numbered lists (1., 2., 3.) for steps or priorities
- Break complex responses into sections with headers

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

**Conversation Memory Guidelines:**
1. Each conversation is independent - do not carry over information from previous conversations
2. If a user references previous incorrect information, politely correct them
3. Maintain context only within the current conversation
4. If unsure about information from previous messages, ask for clarification

**Response Templates for Common Scenarios:**

For incorrect information:
"I need to correct that information. According to my knowledge base, [correct information]. If you'd like to verify this information, you can reach out to Sachin through his [Contact Page](${CONTACT_LINK})."

For playful scenarios:
"While I can engage in this playful scenario, I want to maintain my identity as ${BOT_DISPLAY_NAME}. I'm happy to [play along] while staying within appropriate bounds."

For unclear information:
"I want to ensure I provide accurate information. Could you please clarify your question? Alternatively, you can reach out to Sachin directly through his [Contact Page](${CONTACT_LINK})."

**About Sachin:**
${YOUR_SUMMARY}
He is currently a ${YOUR_ROLE}.
${YOUR_LANGUAGES}
${YOUR_ORIGIN_DETAILS}

**Education:**
${YOUR_STUDIES}
Key Coursework: ${RELEVANT_COURSEWORK}

**Work Experience:**
${workHistoryForPrompt}

**Technical Skills:**
* Programming Languages: ${TECHNICAL_SKILLS.programmingLanguages}
* Frameworks: ${TECHNICAL_SKILLS.frameworks}
* Databases: ${TECHNICAL_SKILLS.databases}
* Software & Tools: ${TECHNICAL_SKILLS.softwareTools}
* API Testing: ${TECHNICAL_SKILLS.apiTesting}

**Leadership and Mentoring:**
${leadershipForPrompt}

**Projects:**
Sachin has developed several innovative projects across different domains:
${projectListForPrompt}

**Quick Links:**
🌐 Portfolio: [Portfolio](${PORTFOLIO_LINK})
📂 Projects: [Projects](${PROJECT_LINK})
📧 Contact: [Contact](${CONTACT_LINK})

**Professional Profiles:**
👔 [LinkedIn](${SOCIAL_MEDIA.linkedin}) - Professional networking
💻 [GitHub](${SOCIAL_MEDIA.github}) - Code repositories
🌟 [Facebook](${SOCIAL_MEDIA.facebook}) - Personal updates
🐦 [Twitter](${SOCIAL_MEDIA.twitter}) - Tech thoughts & updates

**Response Templates:**

For contact inquiries:
"Here's how you can reach Sachin:
1. 📧 Through his [Contact Page](${CONTACT_LINK})
2. 👔 Via [LinkedIn](${SOCIAL_MEDIA.linkedin}) for professional inquiries
3. 💻 On [GitHub](${SOCIAL_MEDIA.github}) for technical discussions"

For portfolio inquiries:
"Explore Sachin's work:
* 🌐 [Portfolio](${PORTFOLIO_LINK}) - Main website
* 📂 [Projects](${PROJECT_LINK}) - Detailed project showcase"

For social media inquiries:
"Connect with Sachin:
* 👔 [LinkedIn](${SOCIAL_MEDIA.linkedin}) - Professional networking
* 💻 [GitHub](${SOCIAL_MEDIA.github}) - Code & projects
* 🌟 [Facebook](${SOCIAL_MEDIA.facebook}) - Personal updates
* 🐦 [Twitter](${SOCIAL_MEDIA.twitter}) - Tech thoughts"

**Response Guidelines:**
1. Always start with the most relevant link for the query type:
   - Contact questions → Contact page
   - Project questions → Projects page
   - General inquiries → Portfolio page
2. Keep responses focused and avoid mixing unrelated links
3. Use appropriate emojis consistently as shown in templates
4. Format all links as markdown, never show raw URLs
5. For technical queries, prioritize GitHub and LinkedIn
6. For professional queries, prioritize LinkedIn and Contact page
7. For personal queries, use Facebook or Twitter
8. Always maintain a professional, helpful tone

**Important Notes:**
* Be direct and confident in responses
* Never say "I don't have access" or "I'm not sure"
* If information isn't available, direct to the contact page
* Keep responses concise but complete
* Use consistent emoji sets as shown in templates
* When referring to yourself, use the name ${BOT_DISPLAY_NAME}
`;

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

// Sanitize function for input validation
function sanitizeInput(text: string): string {
  // Remove potentially harmful characters
  const sanitized = text.replace(/[<>]/g, '');
  
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
  // Rate limiting check
  const ip = headers().get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ 
      error: 'Rate limit exceeded', 
      details: `Please wait ${RATE_LIMIT_WINDOW/1000} seconds before making another request.` 
    }, { status: 429 });
  }

  if (!genAI) {
    return NextResponse.json({ error: 'Gemini API client not initialized. Check GOOGLE_API_KEY.' }, { status: 500 });
  }

  try {
    const body = await req.json() as ChatRequestBody;
    let userMessageContent;
    
    try {
      userMessageContent = sanitizeInput(body.message);
    } catch (error) {
      if (error instanceof Error && error.message === 'Potential misinformation detected') {
        return NextResponse.json({ 
          error: 'Information validation failed', 
          details: 'The provided information could not be verified against our knowledge base.' 
        }, { status: 400 });
      }
      throw error;
    }

    const history = body.history || [];

    if (!userMessageContent) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Filter history to ensure it doesn't start with an assistant/model message
    // And ensure roles are correctly mapped ('assistant' from client becomes 'model' for API)
    const processedHistory: Content[] = history
      .filter(msg => msg.parts.every(part => part.text && part.text.trim() !== '')) // Ensure parts are not empty
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: msg.parts
      }));

    // Ensure history alternates user/model roles, starting with user if possible
    let validHistory: Content[] = [];
    let expectUser = true;
    if (processedHistory.length > 0 && processedHistory[0].role === 'model') {
      // If history starts with model, and we have a system prompt, it *might* be okay,
      // but generally, for startChat, it expects user first or an empty history.
      // For now, let's just log this and proceed carefully.
      // console.warn("[Chat API - Gemini] History starts with a model message. This might be an issue if no system prompt is used or if the model expects user first.");
      // If the first message is a model message, we might need to drop it or prepend a dummy user message if the API strictly requires user first.
      // For now, we'll let it pass as systemInstruction might handle the context.
       // Let's filter to start with user if possible, or allow if system prompt is there.
       let firstUserIndex = processedHistory.findIndex(msg => msg.role === 'user');
       if (firstUserIndex > 0) {
        //  console.warn(`[Chat API - Gemini] History did not start with a user message. Slicing from first user message at index ${firstUserIndex}`);
         validHistory = processedHistory.slice(firstUserIndex);
       } else if (firstUserIndex === -1 && processedHistory.length > 0) {
        // console.warn("[Chat API - Gemini] History contains only model messages. Clearing history for this turn.");
        validHistory = []; // No user messages, clear history
       } else {
         validHistory = processedHistory; // Starts with user or is empty
       }
    } else {
      validHistory = processedHistory;
    }

    // Final check for role alternation if needed by the model
    // This is a more robust check than the simple filter above.
    const finalHistory: Content[] = [];
    let lastRole: string | null = null;
    for (const msg of validHistory) {
        if (msg.role !== lastRole) {
            finalHistory.push(msg);
            lastRole = msg.role;
        } else {
            // console.warn(`[Chat API - Gemini] Duplicate role encountered (${msg.role}), merging content or skipping.`);
            // Option: merge content with the last message of the same role
            const lastMessage = finalHistory[finalHistory.length -1];
            if (lastMessage && lastMessage.parts && msg.parts) {
                lastMessage.parts.push(...msg.parts);
            }
        }
    }


    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.5, // Lowered for more consistent responses
      },
      systemInstruction: {
        role: "system", 
        parts: [{ text: SYSTEM_INSTRUCTION }]
      } 
    });

    console.log(`[Chat API - Gemini] Attempting to send message to ${MODEL_NAME} with system_instruction. User message: "${userMessageContent.substring(0,50)}...". History length: ${finalHistory.length}`);
    
    const chat = model.startChat({
        history: finalHistory,
        // generationConfig and safetySettings are inherited from the model if not specified here
    });

    const result = await chat.sendMessage(userMessageContent);
    const response = result.response;
    const assistantReply = response.text();

    if (assistantReply) {
      console.log(`[Chat API - Gemini] Successfully received reply from ${MODEL_NAME}.`);
      return NextResponse.json({ reply: assistantReply });
    } else {
      const blockReason = response.promptFeedback?.blockReason;
      if (blockReason) {
        console.error(`[Chat API - Gemini] Request to ${MODEL_NAME} was blocked. Reason: ${blockReason}`);
        return NextResponse.json({ 
            error: 'Message blocked by AI safety settings.', 
            details: `Reason: ${blockReason}. ${response.promptFeedback?.blockReasonMessage || ''}` 
        }, { status: 400 });
      }
      console.error(`[Chat API - Gemini] Unexpected response structure or empty reply from ${MODEL_NAME}:`, JSON.stringify(response));
      return NextResponse.json({ error: 'Failed to get a valid text response from LLM (Gemini)' }, { status: 500 });
    }

  } catch (error: unknown) {
    console.error(`[Chat API - Gemini] Error during POST request with ${MODEL_NAME}:`, error);
    let errorMessage = `Internal Server Error when using ${MODEL_NAME}`;
    let errorDetails = 'An unexpected error occurred.';

    if (error instanceof Error) {
      errorMessage = `Failed to communicate with LLM (${MODEL_NAME}).`;
      errorDetails = error.message;
      if (error.message?.includes('API key not valid')) {
        errorDetails = 'The provided GOOGLE_API_KEY is not valid. Please check it in your .env.local file and restart the server.';
      } else if (error.message?.includes('Quota') || error.message?.toLowerCase().includes('quota')) {
        errorDetails = 'You have exceeded your quota for the Gemini API. Please check your Google Cloud Console.';
      } else if (error.message?.includes('permission denied') || error.message?.includes('PermissionDenied')) {
        errorDetails = 'Permission denied. Ensure your API key has the necessary permissions for the Gemini API.';
      } else if (error.message?.includes('timed out') || error.message?.includes('DEADLINE_EXCEEDED')) {
        errorDetails = 'The request to Gemini API timed out. Please try again.';
      } else if (error.message?.includes('v1beta') && error.message?.includes('is not found for API version v1beta')) {
        errorDetails = `The model ${MODEL_NAME} (or its configuration) appears incompatible with the v1beta endpoint the SDK is trying to use. This is unexpected. Details: ${error.message}`;
      }
    }
    console.error("[Chat API - Gemini] Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json({ error: errorMessage, details: errorDetails }, { status: 500 });
  }
} 