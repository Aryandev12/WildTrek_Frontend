import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../components/Home';
import Bird from '../components/Bird';
import Result from '../components/Result';
import Animal from '../components/Animal';

export type HomeStackParamList = {
  HomeScreen: undefined;
  Bird: undefined;
  Result: undefined;
  Animal: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStack = () => {
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
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Bird" component={Bird} />
      <Stack.Screen name="Result" component={Result} />
      <Stack.Screen name="Animal" component={Animal} />
    </Stack.Navigator>
  );
};

export default HomeStack;
