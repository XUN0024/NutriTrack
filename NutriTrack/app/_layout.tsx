import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, createContext, useContext } from 'react';
import { View, Text } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Create auth context
type AuthContextType = {
  user: string | null;
  signIn: (userData: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const rootRouter = useRouter();
  const segments = useSegments();

  // This effect will run only when segments or user changes
  useEffect(() => {
    const inAuthGroup = segments[0] === '(screens)';
    
    if (!user && !inAuthGroup) {
      // If the user is not signed in and not in auth group, redirect to login
      // We use setTimeout to ensure this happens after initial render
      setTimeout(() => {
        rootRouter.replace('/(screens)/loginScreen');
      }, 0);
    } else if (user && inAuthGroup) {
      // If the user is signed in and in auth group, redirect to home
      setTimeout(() => {
        rootRouter.replace('/(tabs)');
      }, 0);
    }
  }, [user, segments]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn: (userData) => setUser(userData),
        signOut: () => setUser(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}

// Define screen options for the stack navigator
export const screenOptions = {
  headerShown: false,
};
