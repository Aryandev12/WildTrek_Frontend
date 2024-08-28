import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VetScreen from '../components/VetScreen';

export type VetStackParamList = {
  VetScreen: undefined
};

const Stack = createStackNavigator<VetStackParamList>();

const VetStack = () => {
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
      <Stack.Screen name="VetScreen" component={VetScreen} />
    </Stack.Navigator>
  );
};

export default VetStack;
