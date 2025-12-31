// Fallback rule-based response system when LLM fails
// Uses RAG retrieval but generates responses from templates

import { KnowledgeChunk } from './knowledgeBase';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Generate response using rule-based templates with RAG context
 * This is a fallback when the LLM API fails
 */
export async function generateResponseFallback(
  messages: ChatMessage[],
  ragContext: string,
  relevantChunks: KnowledgeChunk[]
): Promise<string> {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
  
  // Extract key information from relevant chunks
  const skillsChunks = relevantChunks.filter(c => c.category === 'skills');
  const workChunks = relevantChunks.filter(c => c.category === 'work');
  const projectChunks = relevantChunks.filter(c => c.category === 'projects');
  const educationChunks = relevantChunks.filter(c => c.category === 'education');
  const personalChunks = relevantChunks.filter(c => c.category === 'personal');
  const cvChunks = relevantChunks.filter(c => c.category === 'cv');
  const linksChunks = relevantChunks.filter(c => c.category === 'links');

  // Skills questions
  if (lastMessage.includes('skill') || lastMessage.includes('technology') || lastMessage.includes('tech stack')) {
    if (skillsChunks.length > 0) {
      const skills = skillsChunks.map(c => c.content).join('\n');
      return `Sachin has expertise in a wide range of technologies:\n\n${skills}\n\nHe's particularly strong in Python, AI/ML frameworks, and modern web development. Would you like to know more about any specific area?`;
    }
    return "Sachin has strong skills in Python, AI/ML frameworks (TensorFlow, PyTorch), web development (React, Next.js, Django), databases (MySQL, PostgreSQL, MongoDB), and cloud platforms (AWS, GCP). He's also proficient in various dev tools and data processing libraries.";
  }

  // Work experience questions
  if (lastMessage.includes('work') || lastMessage.includes('job') || lastMessage.includes('experience') || lastMessage.includes('employment')) {
    if (workChunks.length > 0) {
      const work = workChunks.map(c => c.content).join('\n\n');
      return `Here's Sachin's work experience:\n\n${work}\n\nHe's currently working as a Field Trip & Club Travel Assistant at Weber State University. Would you like more details about any specific role?`;
    }
    return "Sachin is currently working as a Field Trip & Club Travel Assistant at Weber State University. Previously, he worked as a Computer Science Tutor, Marketing & CRM Specialist, and Assistant Manager at Lawson Store in Tokyo, Japan.";
  }

  // Project questions
  if (lastMessage.includes('project') || lastMessage.includes('portfolio') || lastMessage.includes('github')) {
    if (projectChunks.length > 0) {
      const projects = projectChunks.slice(0, 3).map(c => c.content).join('\n\n');
      return `Sachin has worked on several impressive projects:\n\n${projects}\n\nYou can see more projects and details at [his projects page](/projects) or check out his [GitHub](https://github.com/sachinchhetri202).`;
    }
    return "Sachin has developed several AI/ML projects including a Music Genre Classifier, Financial Anomaly Detection system, and various web applications. Check out his [projects page](/projects) for more details!";
  }

  // Education questions
  if (lastMessage.includes('education') || lastMessage.includes('degree') || lastMessage.includes('university') || lastMessage.includes('school') || lastMessage.includes('gpa')) {
    if (educationChunks.length > 0) {
      const education = educationChunks.map(c => c.content).join('\n\n');
      return `Sachin's educational journey:\n\n${education}\n\nHe has a unique international background, having studied in Nepal, Japan, and the USA.`;
    }
    return "Sachin is currently pursuing an M.S. in Computer Science at Weber State University (expected graduation April 2026). He completed his B.S. in Computer Science there with a GPA of 3.6. He also attended Kanto International Senior High School in Tokyo, Japan.";
  }

  // CV/Resume questions
  if (lastMessage.includes('cv') || lastMessage.includes('resume') || lastMessage.includes('download')) {
    if (cvChunks.length > 0) {
      const cvInfo = cvChunks.map(c => c.content).join('\n\n');
      return `${cvInfo}\n\nYou can download it directly: [Download CV](/resume/Resume.pdf)`;
    }
    return "You can download Sachin's CV at [Download CV](/resume/Resume.pdf). It includes his education, work experience, technical skills, projects, and achievements. The CV was last updated in 2025-06.";
  }

  // Contact/Links questions
  if (lastMessage.includes('contact') || lastMessage.includes('email') || lastMessage.includes('linkedin') || lastMessage.includes('github') || lastMessage.includes('social')) {
    if (linksChunks.length > 0) {
      const links = linksChunks.map(c => c.content).join('\n');
      return `Here are ways to connect with Sachin:\n\n${links}\n\nYou can also visit the [contact page](/contact) for more information.`;
    }
    return "You can reach Sachin through:\n- LinkedIn: https://www.linkedin.com/in/sachin-chhetri-475831199/\n- GitHub: https://github.com/sachinchhetri202\n- Contact page: [Contact](/contact)\n- Email: sachinpc202@gmail.com";
  }

  // About/Introduction questions
  if (lastMessage.includes('who') || lastMessage.includes('about') || lastMessage.includes('introduce') || lastMessage.includes('tell me about')) {
    if (personalChunks.length > 0) {
      const personal = personalChunks.map(c => c.content).join('\n\n');
      return `About Sachin:\n\n${personal}\n\nHe's passionate about AI and building intelligent solutions. What would you like to know more about?`;
    }
    return "Sachin is an AI Engineer with 4+ years of experience crafting intelligent applications. He combines software engineering expertise with AI capabilities to build practical solutions. Currently pursuing his Master's in Computer Science with a focus on ML/DL. He's originally from Nepal and has studied in Japan and the USA.";
  }

  // Language questions
  if (lastMessage.includes('language') || lastMessage.includes('speak') || lastMessage.includes('multilingual')) {
    return "Sachin is fluent in 4 languages: Nepali (mother tongue), Japanese (lived and studied in Japan), Hindi (learned through media), and English (learned from a young age).";
  }

  // Leadership questions
  if (lastMessage.includes('leadership') || lastMessage.includes('president') || lastMessage.includes('mentor')) {
    return "Sachin has strong leadership experience. He was the Founder & Former President of the Nepalese Student Association @ WSU, leading a 500+ member organization. He's also worked as a Computer Science Tutor and International Student Mentor.";
  }

  // Default response - use RAG context
  if (relevantChunks.length > 0) {
    const topChunk = relevantChunks[0];
    return `Based on what I know about Sachin:\n\n${topChunk.content}\n\nIs there something specific you'd like to know more about?`;
  }

  // Ultimate fallback
  return "I can help you learn about Sachin's skills, work experience, projects, education, and more. Try asking about:\n- His technical skills\n- Work experience\n- Projects\n- Education background\n- How to download his CV\n\nWhat would you like to know?";
}

