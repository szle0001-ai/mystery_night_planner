Mystery Night Planner

A collaborative web application for groups of friends who meet to play detective and logic games.

Features

- User registration and login
- Shared event creation
- Shared checklist/tasks
- Shared availability calendar
- Event feedback and evaluation
- Delete confirmation

Tech Stack

- Frontend: React
- Backend: Node.js + Express
- Database: PostgreSQL
- Authentication: JWT

---

Project Structure

- "/frontend" – React application
- "/backend" – Express API
- "/database" – SQL schema

---

Local Development

1. Clone repository

git clone <your-repo-link>
cd mystery-night-planner

---

2. Backend setup

cd backend
npm install

Create ".env" file in "/backend":

DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
PORT=5000

Run backend:

npm run dev

---

3. Frontend setup

cd frontend
npm install

Create ".env" file in "/frontend":

REACT_APP_API_URL=http://localhost:5000/api

Run frontend:

npm start

---

4. Database setup

Run the following SQL script in your PostgreSQL database:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(150),
    event_date TIMESTAMP NOT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    assigned_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE availability (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    available_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'unavailable')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    game_title VARCHAR(150) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---

Notes

- Environment variables are required to run the application
- The application uses JWT authentication for protected routes
- Backend and frontend must run simultaneously