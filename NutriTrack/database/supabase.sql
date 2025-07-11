create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text NOT NULL UNIQUE,
  avatar_url text,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  gender VARCHAR(20),
  age INTEGER,
  activity_level VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  calories INTEGER NOT NULL,
  protein DECIMAL(6,2) NOT NULL,
  carbs DECIMAL(6,2) NOT NULL,
  fat DECIMAL(6,2) NOT NULL,
  meal_type VARCHAR(50) NOT NULL,  -- 早餐/午餐/晚餐/零食
  image_url TEXT,
  eaten_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE daily_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  calorie_goal INTEGER NOT NULL,
  protein_goal DECIMAL(6,2) NOT NULL,
  carbs_goal DECIMAL(6,2) NOT NULL,
  fat_goal DECIMAL(6,2) NOT NULL,
  water_goal INTEGER,  -- 以毫升为单位
  steps_goal INTEGER,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)  -- 确保每个用户每天只有一个目标记录
);

-- 为外键和常用查询创建索引
CREATE INDEX idx_meals_user_id ON meals(user_id);
CREATE INDEX idx_meals_eaten_at ON meals(eaten_at);
CREATE INDEX idx_daily_goals_user_id ON daily_goals(user_id);
CREATE INDEX idx_daily_goals_date ON daily_goals(date);