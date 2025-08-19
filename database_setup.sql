-- Create user_uploads table
CREATE TABLE IF NOT EXISTS user_uploads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  size INT NOT NULL,
  original_size INT NOT NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_uploaded_at (uploaded_at)
);

-- Create productos_detectados table for AI analysis results
CREATE TABLE IF NOT EXISTS productos_detectados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  foto_id INT NOT NULL,
  producto_id VARCHAR(255),
  nombre VARCHAR(500) NOT NULL,
  marca VARCHAR(255),
  facing INT DEFAULT 0,
  precio_detectado VARCHAR(100),
  es_reconocido BOOLEAN DEFAULT TRUE,
  confidence DECIMAL(5,4),
  bounding_box JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_foto_id (foto_id),
  INDEX idx_producto_id (producto_id),
  INDEX idx_nombre (nombre),
  INDEX idx_marca (marca),
  FOREIGN KEY (foto_id) REFERENCES user_uploads(id) ON DELETE CASCADE
);

-- Add team columns to users table (if they don't exist)
ALTER TABLE users ADD COLUMN IF NOT EXISTS team_code VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS team_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_team_manager BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_team_code (team_code);
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_team_name (team_name);

-- Create tasks table for task management (single table approach)
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  assigned_by INT NOT NULL,
  assigned_to INT NOT NULL,
  team_code VARCHAR(10) NOT NULL,
  due_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completed_at DATETIME,
  estimated_hours DECIMAL(4,2),
  actual_hours DECIMAL(4,2),
  tags JSON,
  attachments JSON,
  comments JSON,
  history JSON,
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_assigned_by (assigned_by),
  INDEX idx_team_code (team_code),
  INDEX idx_status (status),
  INDEX idx_due_date (due_date),
  INDEX idx_priority (priority),
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE CASCADE
); 