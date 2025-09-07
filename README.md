# Teaching Assistant Prompt Generator App

A web application for generating, managing, and exporting prompts for teaching assistants. The app provides a streamlined interface for prompt creation, editing, and organization.

## Features

- Add, edit, and delete prompts
- Categorize prompts by subject or type
- Export prompts as text or JSON
- Responsive and user-friendly UI
- Persistent storage using local files or database

## Technologies Used

- **Frontend:** React (JavaScript/TypeScript), CSS/Styled Components
- **Backend:** Node.js, Express (if present)
- **Database:** MongoDB or SQLite (if present)
- **Other:** Axios (for API calls), dotenv (for environment variables)

## Folder Structure

- `/src` - React frontend source code
  - `/components` - Reusable UI components
  - `/pages` - Main application pages
  - `/utils` - Utility functions
  - `/assets` - Images and static files
- `/server` - Express backend (if present)
  - `/routes` - API route handlers
  - `/models` - Database models
- `/public` - Static assets (index.html, favicon, etc.)

## Getting Started

1. **Clone the repository:**
   ```
   git clone https://github.com/yourusername/teaching_assistant_prompt_generator_app.git
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Start the development server:**
   ```
   npm start
   ```

   If using a backend:
   ```
   cd server
   npm install
   npm run dev
   ```

## License

[MIT](LICENSE)
