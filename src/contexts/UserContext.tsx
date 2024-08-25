// src/context/UserContext.tsx
import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

interface User {
  username: string;
  email: string;
  accesstoken: string;

}

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    setUser(user);
  };

  const logout = async () => {
   

    try {
      await AsyncStorage.removeItem('userData');
      setUser(null);

      // Sign out from Firebase
      await auth().signOut();
      console.log('Signed out from Firebase');

      // Sign out from Google
      await GoogleSignin.signOut();
      console.log('Signed out from Google');
      
      alert('You have been signed out.');
    } catch (error) {
      alert('Logged Out');
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
