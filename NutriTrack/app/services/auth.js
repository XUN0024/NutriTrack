import { supabase } from '../../lib/supabase';

/**
 * 注册新用户
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>} data or error
 */
export const signUp = async (email, password, name) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: name
      }
    }
  });

  if (error) {
    console.log('❌ 注册失败:', error.message);
    throw error;
  }

  console.log('✅ 注册成功，用户数据:', data);
  return data;
};

/**
 * 登录已有用户
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>} data or error
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log('❌ 登录失败:', error.message);
    throw error;
  }

  console.log('✅ 登录成功，session 数据:', data);
  return data;
};

/**
 * 登出用户
 * @returns {Promise<void>}
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log('❌ 登出失败:', error.message);
    throw error;
  }

  console.log('👋 成功登出');
};
