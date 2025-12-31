// Knowledge base chunks for RAG
export interface KnowledgeChunk {
  id: string;
  content: string;
  category: string;
  keywords: string[];
}

export const knowledgeBase: KnowledgeChunk[] = [
  // Personal Information
  {
    id: 'personal-1',
    content: 'Sachin Paudel Chhetri is an AI Engineer with 4+ years of experience crafting intelligent applications. He combines software engineering expertise with AI capabilities to build practical solutions.',
    category: 'personal',
    keywords: ['sachin', 'chhetri', 'ai engineer', 'software developer', 'introduction', 'about']
  },
  {
    id: 'personal-2',
    content: 'Sachin is currently working as a Field Trip & Club Travel Assistant at Weber State University, Study Abroad Office. He assists with trip planning, coordinates with faculty and Risk Management, and maintains a comprehensive database of university field trips.',
    category: 'work',
    keywords: ['current job', 'work', 'employment', 'weber state', 'field trip', 'assistant']
  },
  {
    id: 'personal-3',
    content: 'Sachin is originally from Nepal, born in Baglung. He lived and completed schooling up to 9th grade in Pokhara, Nepal. He is fluent in Nepali (mother tongue), Japanese, Hindi, and English.',
    category: 'personal',
    keywords: ['nepal', 'baglung', 'pokhara', 'languages', 'multilingual', 'origin', 'background']
  },

  // Education
  {
    id: 'edu-1',
    content: 'Sachin is currently pursuing M.S. in Computer Science at Weber State University (Ogden, Utah), expected graduation April 2026. Previously completed B.S. in Computer Science from Weber State University (2021-2024, GPA 3.6).',
    category: 'education',
    keywords: ['education', 'masters', 'ms', 'bachelors', 'bs', 'degree', 'university', 'weber state', 'gpa']
  },
  {
    id: 'edu-2',
    content: 'Educational journey: Completed 9th grade in Pokhara, Nepal, then moved to Japan. Attended Ootsuna Junior High School in Okurayama, Yokohama, Japan, followed by Kanto International Senior High School in Tokyo, Japan (2016-2019), before moving to USA for university studies.',
    category: 'education',
    keywords: ['high school', 'japan', 'tokyo', 'yokohama', 'kanto', 'educational journey', 'junior high']
  },
  {
    id: 'edu-3',
    content: 'Relevant coursework includes: Advanced Algorithms, Object-Oriented Programming, Software Engineering I & II, Advanced SQL Database Knowledge, Business Communication, Prompt Engineering (AI, ML), Deep Theory using ML/DL.',
    category: 'education',
    keywords: ['coursework', 'courses', 'classes', 'algorithms', 'software engineering', 'sql', 'ml', 'dl', 'ai']
  },

  // Work Experience
  {
    id: 'work-1',
    content: 'Field Trip & Club Travel Assistant at Weber State University, Study Abroad Office (2025 - Present): Assisting with trip planning and execution, coordinating with faculty and Risk Management for compliance, managing documentation and signatures, maintaining comprehensive database of university field trips.',
    category: 'work',
    keywords: ['field trip', 'travel assistant', 'study abroad', 'current', 'present', '2025']
  },
  {
    id: 'work-2',
    content: 'Computer Science Tutor at Weber State University, Engineering, Applied Science and Technology (2024 - 2025): Provided one-on-one and group tutoring for CS, NET, and WEB courses. Supported students in foundational and intermediate Computer Science courses (CS 1400, 1410, 2550, 2420) with emphasis on troubleshooting, problem-solving, and practical coding skills.',
    category: 'work',
    keywords: ['tutor', 'tutoring', 'computer science', 'teaching', 'cs courses', '2024', '2025']
  },
  {
    id: 'work-3',
    content: 'Marketing & CRM Specialist at Weber State University, International Student Scholar Center (2021 - 2024): Implemented data-driven marketing strategies, developed automated email systems, used SQL analytics to optimize student engagement, and created predictive models to improve event attendance.',
    category: 'work',
    keywords: ['marketing', 'crm', 'specialist', 'issc', 'sql', 'analytics', 'predictive models', '2021', '2024']
  },
  {
    id: 'work-4',
    content: 'Assistant Manager at Lawson Store, Tokyo, Japan (Jan 2016 - Dec 2019): Led store operations, trained staff, implemented efficient systems that improved performance metrics. Developed strong leadership and problem-solving skills.',
    category: 'work',
    keywords: ['lawson', 'tokyo', 'japan', 'assistant manager', 'retail', 'leadership', '2016', '2019']
  },

  // Technical Skills
  {
    id: 'skills-1',
    content: 'Programming Languages: Python (primary), TypeScript, JavaScript, SQL, C++, C#',
    category: 'skills',
    keywords: ['programming', 'languages', 'python', 'typescript', 'javascript', 'sql', 'c++', 'c#', 'coding']
  },
  {
    id: 'skills-2',
    content: 'AI Frameworks: TensorFlow, PyTorch, Scikit-learn, Hugging Face Transformers',
    category: 'skills',
    keywords: ['ai', 'ml', 'machine learning', 'tensorflow', 'pytorch', 'scikit-learn', 'hugging face', 'frameworks']
  },
  {
    id: 'skills-3',
    content: 'Web Frameworks: Django, Next.js, React, Express',
    category: 'skills',
    keywords: ['web', 'frameworks', 'django', 'next.js', 'react', 'express', 'frontend', 'backend']
  },
  {
    id: 'skills-4',
    content: 'AI Tools: Google Gemini, OpenAI GPT, LangChain',
    category: 'skills',
    keywords: ['ai tools', 'gemini', 'openai', 'gpt', 'langchain', 'llm']
  },
  {
    id: 'skills-5',
    content: 'Databases: MySQL, PostgreSQL, MongoDB',
    category: 'skills',
    keywords: ['databases', 'mysql', 'postgresql', 'mongodb', 'database']
  },
  {
    id: 'skills-6',
    content: 'Cloud Platforms: AWS, Google Cloud Platform',
    category: 'skills',
    keywords: ['cloud', 'aws', 'gcp', 'google cloud', 'platforms']
  },
  {
    id: 'skills-7',
    content: 'Dev Tools: Git, Docker, Postman, Jupyter Notebooks',
    category: 'skills',
    keywords: ['tools', 'git', 'docker', 'postman', 'jupyter', 'devops']
  },
  {
    id: 'skills-8',
    content: 'Data Processing: Pandas, NumPy, SciPy',
    category: 'skills',
    keywords: ['data', 'processing', 'pandas', 'numpy', 'scipy', 'data science']
  },

  // Projects
  {
    id: 'project-1',
    content: 'Music Genre Classifier: Real-time music classification system using deep learning and audio signal processing. Analyzes audio features to identify music genres with high accuracy. Featured AI/ML project.',
    category: 'projects',
    keywords: ['music', 'genre', 'classifier', 'deep learning', 'audio', 'ml', 'ai', 'project']
  },
  {
    id: 'project-2',
    content: 'Financial Anomaly Detection: Machine learning system for detecting unusual patterns in financial transactions. Uses advanced algorithms to identify potential fraud or anomalies. Featured AI/ML project.',
    category: 'projects',
    keywords: ['financial', 'anomaly', 'detection', 'fraud', 'ml', 'ai', 'project']
  },
  {
    id: 'project-3',
    content: 'Home Expense Tracker: Modern, full-stack web application for household expense management. Built with React.js frontend and Node.js/Express backend, featuring user authentication, expense categorization, budget tracking, and interactive data visualization. Featured business application.',
    category: 'projects',
    keywords: ['expense', 'tracker', 'home', 'react', 'node.js', 'full-stack', 'web', 'project']
  },
  {
    id: 'project-4',
    content: 'Semantic FAQ System: Natural Language Processing solution using sentence embeddings and cosine similarity for efficient question answering. Helps businesses automate customer support.',
    category: 'projects',
    keywords: ['faq', 'semantic', 'nlp', 'embeddings', 'question answering', 'project']
  },
  {
    id: 'project-5',
    content: 'Sentiment Analyzer: Desktop application for sentiment analysis with review visualization and topic extraction. Helps businesses understand customer feedback.',
    category: 'projects',
    keywords: ['sentiment', 'analyzer', 'nlp', 'analysis', 'project']
  },
  {
    id: 'project-6',
    content: 'Grant Management System: Full-Stack system for role-based access using .NET, featuring secure authentication and comprehensive grant lifecycle management.',
    category: 'projects',
    keywords: ['grant', 'management', 'system', '.net', 'full-stack', 'project']
  },

  // Leadership
  {
    id: 'leadership-1',
    content: 'Founder & Former President of Nepalese Student Association @ WSU (2022-2024): Led a 500+ member student organization, coordinated cultural events, guided new students, and launched comprehensive mentorship programs. Successfully transitioned leadership and maintained organizational continuity.',
    category: 'leadership',
    keywords: ['leadership', 'president', 'nepalese', 'student association', 'wsu', 'mentor', 'founder']
  },
  {
    id: 'leadership-2',
    content: 'Leadership roles include: Field Trip & Club Travel Assistant, Former Computer Science Tutor, International Student Mentor, and Founder & Former President of Nepalese Student Association.',
    category: 'leadership',
    keywords: ['leadership', 'roles', 'mentor', 'tutor', 'assistant']
  },

  // CV/Resume
  {
    id: 'cv-1',
    content: 'CV/Resume is available for download at /resume/Resume.pdf. Last updated in 2025-06. Format: PDF. Includes detailed information about education, work experience, technical skills, notable projects, and achievements.',
    category: 'cv',
    keywords: ['cv', 'resume', 'download', 'pdf', '2025']
  },
  {
    id: 'cv-2',
    content: 'CV highlights: 4+ years of AI/ML development experience, Master\'s in Computer Science, Full-stack development expertise, International education and work experience, Multiple successful AI-driven applications.',
    category: 'cv',
    keywords: ['cv', 'highlights', 'experience', 'masters', 'full-stack', 'ai']
  },

  // Contact & Links
  {
    id: 'links-1',
    content: 'Portfolio: https://sachinpc202.netlify.app | Projects: https://sachinpc202.netlify.app/projects | Contact: https://sachinpc202.netlify.app/contact',
    category: 'links',
    keywords: ['portfolio', 'projects', 'contact', 'links', 'website']
  },
  {
    id: 'links-2',
    content: 'Social Media: LinkedIn: https://www.linkedin.com/in/sachin-chhetri-475831199/ | GitHub: https://github.com/sachinchhetri202 | Facebook: https://www.facebook.com/sachin.chettri2/ | Twitter: https://x.com/ghost__rider7',
    category: 'links',
    keywords: ['linkedin', 'github', 'facebook', 'twitter', 'social media', 'contact']
  }
];

// Simple text similarity function (keyword-based)
export function calculateSimilarity(query: string, chunk: KnowledgeChunk): number {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);
  
  // Check keyword matches
  let keywordMatches = 0;
  for (const keyword of chunk.keywords) {
    if (queryLower.includes(keyword.toLowerCase())) {
      keywordMatches++;
    }
  }
  
  // Check content matches
  const contentLower = chunk.content.toLowerCase();
  let contentMatches = 0;
  for (const word of queryWords) {
    if (contentLower.includes(word)) {
      contentMatches++;
    }
  }
  
  // Weighted score: keywords are more important
  const keywordScore = (keywordMatches / chunk.keywords.length) * 0.6;
  const contentScore = (contentMatches / queryWords.length) * 0.4;
  
  return keywordScore + contentScore;
}

// Retrieve relevant chunks based on query
export function retrieveRelevantChunks(query: string, topK: number = 5): KnowledgeChunk[] {
  const scoredChunks = knowledgeBase.map(chunk => ({
    chunk,
    score: calculateSimilarity(query, chunk)
  }));
  
  // Sort by score (descending) and return top K
  return scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(item => item.score > 0) // Only return chunks with some relevance
    .map(item => item.chunk);
}

