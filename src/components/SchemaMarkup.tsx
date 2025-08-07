import React from 'react'

interface PersonSchemaProps {
  name?: string
  jobTitle?: string
  url?: string
  description?: string
  image?: string
  sameAs?: string[]
}

interface ProjectSchemaProps {
  name: string
  description: string
  url?: string
  author: string
  programmingLanguage?: string[]
  dateCreated?: string
  dateModified?: string
}

export const PersonSchema: React.FC<PersonSchemaProps> = ({
  name = "Sachin Chhetri",
  jobTitle = "AI Engineer & Software Engineer",
  url = "https://sachinpc202.netlify.app",
  description = "AI Engineer specializing in Python, Machine Learning, and modern AI technologies. Experienced in full-stack development and AI integration.",
  image = "https://i.postimg.cc/0jbHD5jm/05ae2658-aec3-4526-9e97-1bfe5f5b60f8.jpg",
  sameAs = [
    "https://github.com/sachinchhetri202",
    "https://www.linkedin.com/in/sachin-chhetri-475831199/",
    "https://www.facebook.com/sachin.chettri2"
  ]
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": jobTitle,
    "description": description,
    "url": url,
    "image": image,
    "sameAs": sameAs,
    "knowsAbout": [
      "Python",
      "Machine Learning",
      "JavaScript",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "Git",
      "Web Development",
      "AI Development",
      "API Design",
      "Database Engineering"
    ],
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Weber State University",
      "sameAs": "https://weber.edu"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ogden",
      "addressRegion": "Utah",
      "addressCountry": "US"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export const ProjectSchema: React.FC<ProjectSchemaProps> = ({
  name,
  description,
  url,
  author = "Sachin Chhetri",
  programmingLanguage = [],
  dateCreated,
  dateModified
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": name,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "programmingLanguage": programmingLanguage,
    "url": url,
    "dateCreated": dateCreated,
    "dateModified": dateModified,
    "license": "https://opensource.org/licenses/MIT"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export const WebsiteSchema: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sachin Chhetri Portfolio",
    "description": "Portfolio website of Sachin Chhetri, AI Engineer and Software Engineer",
    "url": "https://sachinpc202.netlify.app",
    "author": {
      "@type": "Person",
      "name": "Sachin Chhetri"
    },
    "inLanguage": "en-US",
    "copyrightYear": new Date().getFullYear(),
    "genre": "Portfolio"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
} 