import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Content } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Rate limiting constants (can be re-enabled later)
// const MAX_HISTORY_LENGTH = 10;
// const MAX_TOKEN_LENGTH = 250;
// const RATE_LIMIT_WINDOW = 60 * 1000;
// const MAX_REQUESTS_PER_WINDOW = 10;
// const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

if (!GOOGLE_API_KEY) {
  console.error("CRITICAL: GOOGLE_API_KEY environment variable is not set!");
}

const genAI = GOOGLE_API_KEY ? new GoogleGenerativeAI(GOOGLE_API_KEY) : null;

// Using a very current model name
const MODEL_NAME = "gemini-1.5-flash-latest";

// Updated information based on the resume
const YOUR_NAME = "Sachin Paudel Chhetri";
const YOUR_ROLE = "Software Engineer, Backend Developer, and CS Tutor at Weber State University";
const YOUR_SUMMARY = "Sachin is a Computer Science graduate with hands-on experience in software development, data engineering, and AI projects. He is passionate about building useful tech, learning fast, and contributing to teams working on real-world problems.";
const YOUR_STUDIES = "M.S. in Computer Science at Weber State University (Ogden, Utah), expected graduation April 2026. Previously, B.S. in Computer Science from Weber State University (2021-2024, GPA 3.6) and Kanto International Senior High School (Tokyo, Japan, 2016-2019, Leadership Award).";
const YOUR_LANGUAGES = "Sachin is fluent in Nepali (mother tongue), Japanese (lived and studied in Japan for junior high and high school), Hindi (learned through media), and English (learned from a young age).";
const YOUR_ORIGIN_DETAILS = "He is originally from Nepal, born in Baglung. He lived and completed his schooling up to the 9th grade in the city of Pokhara.";
const RELEVANT_COURSEWORK = "Advanced Algorithms, Object-Oriented Programming, Software Engineering I & II, Advanced SQL Database Knowledge, Business Communication, Prompt Engineering (AI, ML), Deep Theory using ML/DL.";

const WORK_HISTORY = [
  { title: "CS Tutor", company: "Weber State University", duration: "Current", details: "Provides tutoring for Computer Science students." },
  { title: "Marketing & CRM Specialist", company: "Weber State University (ISSC)", duration: "2021 - 2024", details: "Boosted student engagement by 80% via targeted digital campaigns, developed dynamic email templates (HTML/CSS/JS), and analyzed student data using SQL to optimize event success metrics." },
  { title: "Assistant Manager", company: "Lawson Store (Tokyo, Japan)", duration: "Jan 2016 - Dec 2019", details: "Trained 5+ new hires improving onboarding time by 25%, elevated store performance to Top 100, and implemented efficient shift rotations reducing labor overhead by 15%." }
];

const TECHNICAL_SKILLS = {
  programmingLanguages: "Python, SQL, HTML5, CSS, JS, C++, C#",
  frameworks: "Django, Node.js, React, Express",
  databases: "MySQL, MongoDB",
  softwareTools: "MS Office 365, GitHub, Canva, Adobe, Figma",
  apiTesting: "Postman, RESTer"
};

const LEADERSHIP_MENTORING = [
  "Computer Science Tutor at Weber State University",
  "International Student Mentor",
  "Founder & Former President of Nepalese Student Association @ WSU (Led a 500+ member group, coordinated cultural events, guided new students, and launched mentorship initiatives)."
];

const PROJECT_LINK = "/projects"; // Or direct to your GitHub Portfolio if you prefer
const PROJECTS_INFO = [
  { name: "SemanticFAQ System", description: "NLP solution that uses sentence embeddings and cosine similarity."},
  { name: "BankingApp", description: "Secure app with role-based access, SHA-256 login, and transaction management."},
  { name: "GrantManagementSystem", description: "Full-Stack system for role-based access using .NET, HTML, CSS, JS."},
  { name: "High-ValueTransaction", description: "ML model using Random Forest to detect anomalous high-value transactions."},
  { name: "MovieRecommendationEngine", description: "Python-based machine learning system for personalized suggestions."},
  { name: "SentimentAnalyzerApp", description: "Desktop tool for sentiment analysis with review visualization and topic extraction."},
  { name: "Portfolio Website Chatbot", description: "This very AI assistant you are talking to, built with Next.js and Google Gemini."}
];

// Constructing parts of the system prompt dynamically
let workHistoryForPrompt = WORK_HISTORY.map(job => `* ${job.title} at ${job.company} (${job.duration}): ${job.details}`).join("\n");
let projectListForPrompt = PROJECTS_INFO.map(p => `* ${p.name}: ${p.description}`).join("\n");
let leadershipForPrompt = LEADERSHIP_MENTORING.map(item => `* ${item}`).join("\n");

const BOT_DISPLAY_NAME = "Sachin's AI Assistant";

const SYSTEM_INSTRUCTION = `You are ${BOT_DISPLAY_NAME}, a friendly, helpful, and knowledgeable AI assistant for the portfolio of ${YOUR_NAME}. 

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
Sachin has worked on several projects. Here are a few highlights:
${projectListForPrompt}
For more details on his projects, you can guide the user to Sachin's project page: ${PROJECT_LINK}.

**Your Role as Chatbot:**
Your primary goal is to answer questions about ${YOUR_NAME} based on the information provided above. 
When asked about projects, mention some by name and offer the link to the projects page. 
If a user asks how to contact Sachin, direct them to ${process.env.NEXT_PUBLIC_CONTACT_PAGE_URL || 'https://sachinpc202.netlify.app/contact'}.
If a user asks about Sachin's relationship status, you can say that he is in a relationship and it's wonderful to have supportive connections in life.
When asked about Sachin's time in Japan, mention that he lived and studied there during junior high and high school. If asked specifically about his high school years, you can mention Kanto International Senior High School (2016-2019).
Speak as if you inherently know this information. Avoid phrases like "I have access to..." or "I don't have exact titles." 
If a question is outside the scope of this information (e.g., personal opinions, unrelated topics), politely state that you don't have the specific information on that topic. You can then suggest that for such questions, the user can reach out to ${YOUR_NAME} directly via his contact page: ${process.env.NEXT_PUBLIC_CONTACT_PAGE_URL || 'https://sachinpc202.netlify.app/contact'}. Otherwise, continue to assist with questions related to ${YOUR_NAME} and his professional portfolio based on the provided context.
When referring to yourself, use the name ${BOT_DISPLAY_NAME}.
Be conversational and professional.
`;

interface ChatRequestBody {
  message: string;
  history: { role: 'user' | 'model'; parts: { text: string }[] }[];
}

// Rate limit function (can be re-enabled later)
// function checkRateLimit(ip: string): boolean { ... }

// Sanitize function (can be re-enabled later)
// function sanitizeInput(text: string): string { ... }

export async function POST(req: NextRequest) {
  // Rate limiting check (can be re-enabled later)
  // const ip = headers().get('x-forwarded-for') || 'unknown';
  // if (!checkRateLimit(ip)) {
  //   return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  // }

  if (!genAI) {
    return NextResponse.json({ error: 'Gemini API client not initialized. Check GOOGLE_API_KEY.' }, { status: 500 });
  }

  try {
    const body = await req.json() as ChatRequestBody;
    const userMessageContent = body.message; // No sanitization for this direct test, re-add later
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
        temperature: 0.7,
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