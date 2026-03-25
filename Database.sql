-- =========================-- Mystery Night Planner DB Schema-- =========================

-- Drop tables in correct order (to avoid FK conflicts)DROP TABLE IF EXISTS feedback CASCADE;DROP TABLE IF EXISTS availability CASCADE;DROP TABLE IF EXISTS tasks CASCADE;DROP TABLE IF EXISTS events CASCADE;DROP TABLE IF EXISTS users CASCADE;

-- =========================-- USERS-- =========================CREATE TABLE users (id SERIAL PRIMARY KEY,name VARCHAR(100) NOT NULL,email VARCHAR(150) UNIQUE NOT NULL,password_hash TEXT NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- =========================-- EVENTS-- =========================CREATE TABLE events (id SERIAL PRIMARY KEY,title VARCHAR(150) NOT NULL,description TEXT,location VARCHAR(150),event_date TIMESTAMP NOT NULL,created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- =========================-- TASKS-- =========================CREATE TABLE tasks (id SERIAL PRIMARY KEY,event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,title VARCHAR(150) NOT NULL,completed BOOLEAN DEFAULT FALSE,assigned_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- =========================-- AVAILABILITY-- =========================CREATE TABLE availability (id SERIAL PRIMARY KEY,user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,available_date DATE NOT NULL,status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'unavailable')),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- =========================-- FEEDBACK-- =========================CREATE TABLE feedback (id SERIAL PRIMARY KEY,event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,game_title VARCHAR(150) NOT NULL,rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),comment TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);