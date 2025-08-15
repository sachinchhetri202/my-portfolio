# Sachin Chhetri's Portfolio Template

[Live Demo »](https://sachinpc202.netlify.app/)

A modern, dark-themed Next.js + Tailwind CSS portfolio.

---

## 🚀 Features

- **Next.js App Router** with server-side data fetching and ISR  
- **Dark gradient** background with animated particle effects  
- **Framer Motion** for subtle reveal & hover animations  
- **Tailwind CSS** utility-first styling  
- **Responsive** layout — mobile, tablet & desktop ready  
- **Easy customization** of colors, fonts & sections  
- **Pages included**: Home, About, Services, Projects, Contact  
- **Custom AI Chatbot**: Integrated a personalized AI assistant (Sachin's AI Assistant) powered by Google Gemini for interactive user engagement.
- **Maintenance Mode**: Environment variable-controlled maintenance mode with user-friendly messaging, estimated return time, and alternative contact methods.

---

## 🛠️ Technologies

- [Next.js](https://nextjs.org/)  
- [React](https://reactjs.org/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [Framer Motion](https://www.framer.com/motion/)  
- [react-icons](https://react-icons.github.io/react-icons/)

## ⚙️ Configuration

### Chatbot Maintenance Mode

To enable maintenance mode for the chatbot, add the following environment variable to your `.env.local` file:

```bash
NEXT_PUBLIC_BOT_MAINTENANCE=true
```

When enabled, the chatbot will:
- Display a maintenance message instead of the chat interface
- Show an estimated return time
- Provide alternative contact methods
- Maintain visual presence while clearly indicating unavailability

To disable maintenance mode, either remove the variable or set it to `false`.  
