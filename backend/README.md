# Blog Platform Backend API

A comprehensive Node.js backend for a blog platform with Express.js, MongoDB, and complete authentication system.

## Features

### Authentication
- ✅ Email/Password registration and login
- ✅ Google OAuth integration
- ✅ JWT-based session management
- ✅ Protected route middleware
- ✅ Secure password hashing with bcrypt

### User Management
- ✅ User profiles with bio and profile pictures
- ✅ Profile updates
- ✅ User post listings
- ✅ Bookmarked posts management

### Blog Posts
- ✅ Create, read, update, delete posts
- ✅ Rich content support with tags and images
- ✅ Author-only edit/delete permissions
- ✅ Post feed with pagination and search
- ✅ Like and bookmark functionality

### Comments System
- ✅ Add comments to posts
- ✅ Edit/delete own comments
- ✅ Paginated comment listings
- ✅ Comment count tracking

### Additional Features
- ✅ Input validation with Joi
- ✅ Error handling middleware
- ✅ Rate limiting
- ✅ Security headers with Helmet
- ✅ CORS configuration
- ✅ MongoDB indexing for performance

## Setup Instructions

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the environment variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/blog-platform

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start MongoDB

**Important**: This application is configured to use MongoDB Atlas (cloud database) by default since local MongoDB is not available in browser-based environments.

For local development, you can:
- Use MongoDB Atlas (recommended for WebContainer/browser environments)
- Use a local MongoDB installation (if running on your local machine)
- Use Docker: `docker run -d -p 27017:27017 mongo` (if running locally)

### 4. Run the Application

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile (protected)
- `GET /api/users/:id/posts` - Get user's posts
- `GET /api/users/bookmarks` - Get bookmarked posts (protected)

### Posts
- `GET /api/posts` - Get all posts (with optional auth)
- `POST /api/posts` - Create post (protected)
- `GET /api/posts/:id` - Get single post (with optional auth)
- `PUT /api/posts/:id` - Update post (protected, owner only)
- `DELETE /api/posts/:id` - Delete post (protected, owner only)
- `PUT /api/posts/:id/like` - Like/unlike post (protected)
- `PUT /api/posts/:id/bookmark` - Bookmark/unbookmark post (protected)

### Comments
- `GET /api/comments/:postId` - Get post comments
- `POST /api/comments/:postId` - Add comment (protected)
- `PUT /api/comments/:id` - Update comment (protected, owner only)
- `DELETE /api/comments/:id` - Delete comment (protected, owner only)

## Query Parameters

### Posts Endpoint (`GET /api/posts`)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `tag` - Filter by tag
- `search` - Search in title, content, or tags

### Comments Endpoint (`GET /api/comments/:postId`)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

## Request Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Post
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post...",
    "tags": ["technology", "nodejs"],
    "imageUrl": "https://example.com/image.jpg"
  }'
```

### Get Posts with Search
```bash
curl "http://localhost:5000/api/posts?search=nodejs&page=1&limit=5"
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Secret to your `.env` file

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Protected routes middleware

## Database Schema

### User Model
- `name` - User's display name
- `email` - Unique email address
- `password` - Hashed password
- `profilePicture` - Profile image URL
- `bio` - User biography
- `googleId` - Google OAuth ID (optional)
- `likedPosts` - Array of liked post IDs
- `bookmarkedPosts` - Array of bookmarked post IDs

### Post Model
- `title` - Post title
- `content` - Post content
- `tags` - Array of tags
- `imageUrl` - Featured image URL
- `author` - Reference to User
- `likes` - Array of user IDs who liked
- `likesCount` - Total likes count
- `commentsCount` - Total comments count

### Comment Model
- `postId` - Reference to Post
- `userId` - Reference to User
- `text` - Comment text
- `createdAt` - Creation timestamp

## Project Structure

```
├── config/
│   └── passport.js          # Passport authentication strategies
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   ├── postController.js    # Blog post operations
│   └── commentController.js # Comment operations
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── User.js              # User schema
│   ├── Post.js              # Post schema
│   └── Comment.js           # Comment schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User routes
│   ├── posts.js             # Post routes
│   └── comments.js          # Comment routes
├── utils/
│   ├── validation.js        # Input validation schemas
│   └── jwt.js               # JWT utilities
├── .env.example             # Environment variables template
├── server.js                # Application entry point
├── package.json             # Dependencies and scripts
└── README.md                # Documentation
```

## Development Notes

- All passwords are hashed using bcrypt with 12 salt rounds
- JWT tokens expire based on `JWT_EXPIRE` environment variable
- MongoDB indexes are created for optimal query performance
- User can only edit/delete their own posts and comments
- Like and bookmark states are returned when user is authenticated
- Pagination is implemented for all list endpoints
- Input validation is performed using Joi schemas
- Error responses follow a consistent format

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.