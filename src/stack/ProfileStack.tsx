import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../components/Profile';
import Login from '../components/Login';
import Signup from '../components/Signup';

export type ProfileStackParamList = {
  Profile: undefined;
  Login: undefined;
  Signup: undefined;
};

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#192f6a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: '#f0f8ff',
        },
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
