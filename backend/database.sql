-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'member'
);

-- Projects Table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) DEFAULT 'medium',
    due_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    owner_id INTEGER REFERENCES users(id)
);

-- Tasks Table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) DEFAULT 'medium',
    due_date DATE,
    status VARCHAR(50) DEFAULT 'todo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to VARCHAR(255) REFERENCES users(email)
);

-- Create some default roles or constraints if needed
-- ALTER TABLE users ADD CONSTRAINT chk_role CHECK (role IN ('admin', 'member'));
-- ALTER TABLE projects ADD CONSTRAINT chk_priority CHECK (priority IN ('low', 'medium', 'high', 'critical'));
-- ALTER TABLE projects ADD CONSTRAINT chk_status CHECK (status IN ('active', 'on_hold', 'completed', 'archived'));
-- ALTER TABLE tasks ADD CONSTRAINT chk_task_status CHECK (status IN ('todo', 'in_progress', 'in_review', 'done'));
