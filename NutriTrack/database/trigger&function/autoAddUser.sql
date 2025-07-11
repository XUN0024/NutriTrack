-- 创建一个函数，在新用户注册时自动创建 users 记录
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email, -- 默认使用邮箱作为初始用户名，用户可以稍后更新
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器，在 auth.users 表中插入新行时触发
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();