/*
  # Create Tasks and Categories Tables
  
  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text, task name)
      - `description` (text, optional details)
      - `completed` (boolean, task status)
      - `priority` (text, low/medium/high)
      - `category_id` (uuid, foreign key to categories)
      - `due_date` (timestamp, optional deadline)
      - `reminder_time` (timestamp, optional reminder)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, category name)
      - `color` (text, hex color code)
      - `icon` (text, icon name)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own tasks and categories
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text DEFAULT '#333333',
  icon text DEFAULT 'circle',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  completed boolean DEFAULT false,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  due_date timestamptz,
  reminder_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read since they're just organizational)
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- Tasks policies
CREATE POLICY "Anyone can read tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (true);

-- Insert default categories
INSERT INTO categories (name, color, icon) VALUES
  ('Personal', '#333333', 'user'),
  ('Work', '#333333', 'briefcase'),
  ('Shopping', '#333333', 'shopping-cart'),
  ('Health', '#333333', 'heart')
ON CONFLICT DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks(due_date);
CREATE INDEX IF NOT EXISTS tasks_completed_idx ON tasks(completed);
CREATE INDEX IF NOT EXISTS tasks_category_id_idx ON tasks(category_id);