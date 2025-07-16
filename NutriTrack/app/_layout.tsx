import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, createContext, useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Define user type
type User = {
  id: string;
  email: string;
  name?: string;
  // Add any other user properties you need
};

// Create auth context
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (userData: User) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Storage keys
const USER_STORAGE_KEY = '@nutritrack_user';

// Auth provider component
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const rootRouter = useRouter();
  const segments = useSegments();

  // Load user data from storage on app start
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const userJSON = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (userJSON) {
          const userData = JSON.parse(userJSON);
          setUser(userData);
        }
      } catch (e) {
        setError('Failed to load user data');
        console.error('Failed to load user data:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Handle sign in with persistent storage
  const signIn = async (userData: User) => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      setError(null);
    } catch (e) {
      setError('Failed to save user data');
      console.error('Failed to save user data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign out with persistent storage
  const signOut = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (e) {
      setError('Failed to remove user data');
      console.error('Failed to remove user data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // This effect will run only when segments or user changes
  useEffect(() => {
    if (isLoading) return; // Don't redirect while loading

    const inAuthGroup = segments[0] === '(screens)';
    const allowList = ['addMealScreen'];
    const currentScreen = segments[1] ?? '';

    if (!user && !inAuthGroup) {
      // If the user is not signed in and not in auth group, redirect to login
      setTimeout(() => {
        rootRouter.replace('/(screens)/loginScreen');
      }, 0);
    } else if (user && inAuthGroup && !allowList.includes(currentScreen)) {
      // If the user is signed in and in auth group, but not in allowList, redirect to home
      setTimeout(() => {
        rootRouter.replace('/(tabs)');
      }, 0);
    }
  }, [user, segments, isLoading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
        error,
      }}
    >
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        children
      )}
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
