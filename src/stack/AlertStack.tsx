import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Alert from '../components/Alert';
import BirdAlert from '../components/BirdAlert';
import AnimalAlert from '../components/AnimalAlert';
import AlertHistory from '../components/AlertHistory';
import Profile from '../components/Profile';

export type AlertStackParamList = {
  Alert: undefined;
  BirdAlert: undefined;
  AnimalAlert: undefined;
  AlertHistory: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<AlertStackParamList>();

const AlertStack = () => {
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
      <Stack.Screen name="AlertScreen" component={Alert} />
      <Stack.Screen name="AlertHistory" component={AlertHistory} />
      <Stack.Screen name="BirdAlert" component={BirdAlert} />
      <Stack.Screen name="AnimalAlert" component={AnimalAlert} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default AlertStack;
