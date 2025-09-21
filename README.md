BlogSpace – Fullstack Blogging Platform

Tech Stack

Web Frontend: React (Redux Toolkit for state management, SCSS for styling)

Backend: Node.js + Express

Database: MongoDB Atlas (or any preferred database)

Optional Integrations: Firebase Auth for Google OAuth, Supabase, Cloud Storage (optional)

Project Overview

BlogSpace is a fullstack blogging platform that allows users to:

Sign up, log in (email/password or Google OAuth)

Create, edit, delete, and view blog posts

Like and bookmark posts

Search blogs by title or tags

View user profile with personal blog posts

Bonus Features Implemented:

SEO-friendly web frontend (Next.js SEO optimization)

Pagination and infinite scroll for posts

Rich text editor for blog creation

AI-based content suggestions for post drafts

Repository Structure
BlogSpace/
├─ backend/                 # Node.js + Express backend
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  ├─ middlewares/
│  ├─ utils/
│  ├─ .env.example
│  └─ server.js
├─ frontend/                # React web frontend
│  ├─ src/
│  ├─ components/
│  ├─ pages/
│  ├─ store/
│  ├─ styles/
│  └─ package.json
└─ README.md

Setup Instructions
1️⃣ Backend Setup

Navigate to the backend folder:

cd backend


Install dependencies:

npm install


Create .env file based on .env.example:

PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
GOOGLE_CLIENT_ID=<google-oauth-client-id>  # Optional


Start the backend server:

npm run dev


Backend will run at: http://localhost:5000

Endpoints Overview:

POST /auth/signup – Sign up

POST /auth/login – Log in

GET /posts – Get all posts

GET /posts/:id – Get single post

POST /posts – Create post (auth required)

PUT /posts/:id – Edit post (auth & owner only)

DELETE /posts/:id – Delete post (auth & owner only)

POST /posts/:id/like – Like/Unlike a post

POST /posts/:id/bookmark – Bookmark a post

2️⃣ Web Frontend Setup

Navigate to the frontend folder:

cd frontend


Install dependencies:

npm install


Create .env.local file:

NEXT_PUBLIC_API_URL=http://localhost:5000


Start the development server:

npm run dev


Web app will run at: http://localhost:3000

Notes:

Uses Redux Toolkit for state management

SCSS used for modular styling

Supports SEO meta tags and Open Graph for blog posts

AI Usage in Development

AI tools were used in the following areas:

Content suggestions: Integrated ChatGPT API to provide AI-based suggestions while drafting blog posts.

Code scaffolding & debugging: Copilot/ChatGPT helped in generating Redux slices, API calls, and React components.

UI/UX design: AI-assisted design recommendations for responsive components and user flows.

Prompting Technique Example:

Prompt: “Generate a Redux Toolkit slice for managing blog posts with actions for fetch, create, update, delete.”

Output: Copilot generated the slice; modified to match project backend API and type definitions.

Demo / Screenshots
Web Frontend




Optional Video Demo: Link to Video Demo

Deployment

Web Frontend: Hosted on Vercel

Backend API: Hosted on Render

Environment Variables for Deployment:

MONGO_URI → MongoDB Atlas connection

JWT_SECRET → Same as local dev

GOOGLE_CLIENT_ID → Optional

Security & Best Practices

Passwords are hashed using bcrypt

JWT used for authentication & session management

Role-based access for editing/deleting posts

API validation using express-validator

Challenges Faced

Integrating JWT authentication across web consistently

Handling image uploads for blog posts

Keeping Redux state in sync with backend

AI-assisted content suggestions required fine-tuning prompts

Bonus Features Implemented

Search posts by title and tags

Likes and bookmarks

Pagination on home feed

Rich text editor (React Quill)

AI content suggestions

SEO-compliant meta tags

How to Contribute

Fork the repository

Clone locally:

git clone <repo-url>


Create a branch:

git checkout -b feature/<feature-name>


Make changes and commit:

git commit -m "Add new feature"


Push branch and open a Pull Request

Contact

Author: Janardhan Yadav

Email: your.email@example.com

GitHub: https://github.com/your-username/BlogSpace
