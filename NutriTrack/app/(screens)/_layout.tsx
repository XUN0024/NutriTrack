import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="loginScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signupScreen"
        options={{
          title: 'Create Account',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
} 