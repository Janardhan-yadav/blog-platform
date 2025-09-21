# BlogSpace – Fullstack Blogging Platform

## Tech Stack
- **Web Frontend:** React (Redux Toolkit for state management, SCSS for styling)
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas (or any preferred database)
- **Optional Integrations:** Firebase Auth (Google OAuth), Cloud Storage

---

## Project Overview

BlogSpace is a fullstack blogging platform allowing users to:  
- Sign up and log in (email/password or Google OAuth)  
- Create, edit, delete, and view blog posts  
- Like and bookmark posts  
- Search blogs by title or tags  
- View user profiles with their own posts  

**Bonus Features Implemented:**  
- SEO-friendly web frontend  
- Pagination / infinite scroll  
- Rich text editor for blog creation  
- AI-based content suggestions  

---

## Setup Instructions

### Backend

1. Navigate to the backend folder:
```bash
cd backend
Install dependencies:

bash
Copy code
npm install
Create .env file from .env.example and fill in your values:

env
Copy code
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
Start the backend server:

bash
Copy code
npm run dev
The backend API will run at http://localhost:5000.

Web Frontend
Navigate to the frontend folder:

bash
Copy code
cd frontend
Install dependencies:

bash
Copy code
npm install
Create .env.local if needed (for API URLs or keys):

env
Copy code
NEXT_PUBLIC_API_URL=http://localhost:5000/api
Start the development server:

bash
Copy code
npm run dev
The web app will run at http://localhost:3000.

Features
Authentication
Sign up / Log in using email/password or Google OAuth

JWT-based session handling for secure access

Blog Post CRUD
Create, edit, delete posts (only by the author)

View all posts in a feed

View individual post details

Author Profile
Basic profile page (name, profile picture, bio)

List of user’s own posts

Bonus Features
SEO-compliant web pages

Search blogs by title or tags

Like / bookmark posts

Pagination or infinite scroll

Rich text editor

AI-based content suggestions

How AI Was Used
AI was leveraged to suggest content ideas and auto-generate blog post outlines.

Prompting techniques included asking for topic suggestions and improving readability.

AI helped accelerate content creation and provided inspiration for blog examples.

Running the Application
Start the backend server:

bash
Copy code
cd backend
npm run dev
Start the frontend web server:

bash
Copy code
cd frontend
npm run dev
Open your browser at http://localhost:3000 to use the web app.
