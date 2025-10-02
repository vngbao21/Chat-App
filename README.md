# Chat App

A modern messaging application inspired by popular chat platforms, built with Next.js and TypeScript. The app allows users to send and receive text, images, and files, with support for Markdown formatting and responsive design.

## Overview

This project demonstrates a chat application with core messaging features, including:
- Sending and displaying text, images, and files
- Drag & Drop support for files and images** (users can drag files into the chat input area)
- Markdown formatting in messages
- File and image attachment with preview before sending
- Add keyboard shortcuts for text formatting
- Implement message reactions (like, love, etc.)
- Responsive UI for desktop and mobile
- State management using React Context

## Technologies & Libraries Used

- [Next.js 13+](https://nextjs.org/) (React framework with server & client components )
- [TypeScript](https://www.typescriptlang.org/)
- [React Context API](https://react.dev/reference/react/useContext) (for global state management for messages attachments, and reactions)
- [Tailwind CSS](https://tailwindcss.com/) (for utility-first CSS framework for styling and responsiveness)
- No external libraries for core messaging logic

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm, yarn, pnpm, or bun

### Setup

1. **Clone repository:**
   ```bash
   git clone https://github.com/vngbao21/Chat-App.git
   cd chat-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to use the app.

### Build for Production

```bash
npm run build
npm start
```

## Features Implemented

- ✅ **Send and display text messages**  
- ✅ **Image and file attachments with preview before sending**  
- ✅ **Drag & Drop support for files and images** (users can drag files into the chat input area)  
- ✅ **Basic Markdown formatting (bold, italic, links, code, etc.)**  
- ✅ **Responsive UI (desktop + mobile)**  
- ✅ **Message reactions (👍 ❤️ 😂 😮 😢)**  
- ✅ **Hover to display timestamp on messages**  
- ✅ **Pasting images/links from clipboard**  
- ✅ **Keyboard shortcuts for text formatting**  

## Features Not Implemented

- ⬜ Scheduling messages  
  _Not implemented; would require a scheduling system and background job handling._
- ⬜ Real-time messaging (WebSocket integration)  
  _Not included; this demo focuses on local state only._

## Folder Structure

```
src/
  components/      # Reusable UI components
  context/         # React Context for chat state
  pages/           # Next.js pages
  styles/          # Tailwind/global styles
  types/           # TypeScript types
```

## License

This project is for educational

---