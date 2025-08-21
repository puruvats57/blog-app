# Blog App

A full-stack blog application with user authentication, post management, comments, and search functionality with deployment on docker.

## Features

### User Management
- User registration and login
- JWT-based authentication
- Protected routes for authenticated users

### Blog Posts
- Create, read, update posts
- Add tags to categorize posts
- Like/unlike posts (one per user)
- Search posts by title and content
- Filter posts by tags

### Comments
- Add comments to posts
- Nested replies to comments
- Threaded comment display

### UI/UX
- Responsive design (mobile and desktop)
- Debounced search and filtering
- Tag sidebar for easy browsing
- Real-time like counters

## Tech Stack

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

**Frontend:**
- React with React Router
- Tailwind CSS for styling
- Axios for API calls

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:


4. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Posts
- `GET /api/posts` - Get all posts (with search/filter)
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `PUT /api/posts/:id/like` - Like/unlike post
- `GET /api/posts/_tags/all` - Get all available tags

### Comments
- `GET /api/comments/post/:postId` - Get comments for post
- `POST /api/comments` - Add comment

## Usage

1. Register a new account or login
2. Browse posts using the search bar or tag filters
3. Click on posts to view details and add comments
4. Like posts and reply to comments
5. Create your own posts with tags
6. Edit your posts (only authors can edit)

## Project Structure

```
blogApp/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── middlewares/    # Auth middleware
│   └── server.js       # Express server
└── frontend/
    ├── src/
    │   ├── components/ # Reusable components
    │   ├── pages/      # Page components
    │   ├── services/   # API services
    │   └── App.js      # Main app component
    └── public/         # Static files
```
