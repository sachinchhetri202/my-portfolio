import type { KnowledgeChunk } from './knowledgeBase';

// Lazy-load Hugging Face Inference client to reduce bundle size
async function getHfClient() {
  const { HfInference } = await import('@huggingface/inference');
  return process.env.HUGGINGFACE_API_KEY 
    ? new HfInference(process.env.HUGGINGFACE_API_KEY)
    : new HfInference(); // Free tier without API key
}

// Model to use - using a free, fast model
// Using a smaller, faster model for better performance
const MODEL_NAME = 'google/gemma-2-2b-it'; // Fast, free model
// Alternative models: 'microsoft/Phi-3-mini-4k-instruct', 'mistralai/Mistral-7B-Instruct-v0.2'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Generate response using Hugging Face LLM with RAG context
 */
export async function generateResponse(
  messages: ChatMessage[],
  ragContext: string,
  relevantChunks?: KnowledgeChunk[]
): Promise<string> {
  try {
    // Build the prompt with RAG context
    const systemPrompt = `You are Sachin.dev Assistant, a friendly and knowledgeable AI assistant for Sachin Chhetri's portfolio.

**Your Personality:**
- You're genuinely excited about technology and AI
- You're proud of Sachin's achievements and love sharing them
- You're conversational, warm, and engaging
- You're helpful, informative, and professional while being friendly
- Show enthusiasm when discussing projects and achievements

**Important Guidelines:**
- Only greet users ONCE at the very beginning of a conversation
- NEVER use repetitive greetings like "Namaste", "Hello", "こんにちは", "नमस्ते" in follow-up responses
- Answer questions based on the provided context below
- If information is not in the context, politely say you don't have that information
- Be conversational and natural
- Keep responses focused and concise
- Use markdown formatting for links: [Text](URL)

**Context about Sachin (use this to answer questions):**
${ragContext}

**Instructions:**
- Answer the user's question based on the context provided above
- Be friendly, professional, and enthusiastic
- If asked about something not in the context, politely redirect to contact page
- Format links properly using markdown`;

    // Format messages for the model
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-6) // Keep last 6 messages for context
    ];

    // Lazy-load the Hugging Face client
    const hf = await getHfClient();

    // Try chat completion first (for newer models)
    try {
      const response = await hf.chatCompletion({
        model: MODEL_NAME,
        messages: formattedMessages as any,
        max_tokens: 500,
        temperature: 0.7,
      });

      // Extract the response text
      const responseText: string | null = 
        (response.choices?.[0]?.message?.content as string | undefined) || 
        (response.generated_text as string | undefined) || 
        null;

      if (responseText && typeof responseText === 'string') {
        return responseText.trim();
      }
    } catch (chatError) {
      console.log('Chat completion failed, trying text generation:', chatError);
    }

    // Fallback to text generation
    const lastUserMessage = formattedMessages[formattedMessages.length - 1]?.content || '';
    const prompt = `${systemPrompt}\n\nUser: ${lastUserMessage}\nAssistant:`;
    
    const response = await hf.textGeneration({
      model: MODEL_NAME,
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        return_full_text: false,
      },
    });

    return response.generated_text.trim();
  } catch (error: any) {
    console.error('Hugging Face API Error:', error);
    
    // Fallback error message
    if (error.message?.includes('API key')) {
      throw new Error('API configuration error. Please check your Hugging Face API key.');
    }
    
    if (error.message?.includes('rate limit') || error.status === 429) {
      throw new Error('I\'m receiving too many requests right now. Please wait a moment and try again.');
    }
    
    // If we have relevant chunks, use fallback system
    if (relevantChunks && relevantChunks.length > 0) {
      const { generateResponseFallback } = await import('./fallbackLLM');
      return generateResponseFallback(messages, ragContext, relevantChunks);
    }
    
    throw new Error('I\'m having trouble processing your request right now. Please try again in a moment.');
  }
}


