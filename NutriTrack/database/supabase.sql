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

CREATE TYPE food_type AS ENUM ('raw', 'branded', 'recipe', 'restaurant', 'custom', 'supplement');

CREATE TABLE food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  food_type food_type NOT NULL,
  brand_name TEXT,
  barcode TEXT UNIQUE,
  energy_kcal DECIMAL(6,2) NOT NULL,
  protein_g DECIMAL(6,2) NOT NULL,
  fat_g DECIMAL(6,2) NOT NULL,
  carbs_g DECIMAL(6,2) NOT NULL,
  serving_size TEXT, -- 如 "100g"、"1 slice"
  image_url TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  food_item_id UUID NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
  quantity DECIMAL(6,2) NOT NULL,  -- 如 1.5 份
  unit TEXT,                       -- 如 "serving"、"g"、"ml"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  total_calories DECIMAL(6,2),
  total_protein DECIMAL(6,2),
  total_carbs DECIMAL(6,2),
  total_fat DECIMAL(6,2),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  food_item_id UUID NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
  quantity DECIMAL(6,2) NOT NULL,
  unit TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_food_items_name ON food_items(name);
CREATE INDEX idx_food_items_barcode ON food_items(barcode);

CREATE INDEX idx_meal_items_meal_id ON meal_items(meal_id);
CREATE INDEX idx_meal_items_food_item_id ON meal_items(food_item_id);

CREATE INDEX idx_recipes_user_id ON recipes(user_id);

CREATE INDEX idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);

CREATE INDEX idx_water_logs_user_id ON water_logs(user_id);
CREATE INDEX idx_water_logs_logged_at ON water_logs(logged_at);

-- 为外键和常用查询创建索引
CREATE INDEX idx_meals_user_id ON meals(user_id);
CREATE INDEX idx_meals_eaten_at ON meals(eaten_at);
CREATE INDEX idx_daily_goals_user_id ON daily_goals(user_id);
CREATE INDEX idx_daily_goals_date ON daily_goals(date);