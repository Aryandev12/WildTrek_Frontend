import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/components/Home';
import AlertScreen from './src/components/Alert';
import ProfileStack from './src/stack/ProfileStack'; // Import the ProfileStack
import { createStackNavigator } from '@react-navigation/stack';
import Bird from './src/components/Bird';
import Alert from './src/components/Alert';
import AlertHistory from './src/components/AlertHistory';
import BirdAlert from './src/components/BirdAlert';
import AnimalAlert from './src/components/AnimalAlert';
import Result from './src/components/Result';
import Animal from './src/components/Animal';
import Profile from './src/components/Profile';
import { UserProvider, useUser } from './src/contexts/UserContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage';


const Tab = createBottomTabNavigator();
export type RootStackParamList = {
  Home: undefined;
  Bird: undefined;
  Animal: undefined;
  Plant: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3f89b8',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Bird" component={Bird} />
      <Stack.Screen name="Result" component={Result} />
      <Stack.Screen name="Animal" component={Animal} />
      <Stack.Screen name="Alert" component={Alert} />
      <Stack.Screen name="AlertHistory" component={AlertHistory} />
      <Stack.Screen name="BirdAlert" component={BirdAlert} />
      <Stack.Screen name="AnimalAlert" component={AnimalAlert} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
};

const MainApp: React.FC = () => {
  const { login } = useUser();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          login(user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, [login]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            backgroundColor: '#3f89b8',
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#000000',
          tabBarIcon: () => null, 
          tabBarLabelStyle: {
            fontWeight: 'bold',
            fontSize: 18,
            textAlignVertical: 'center',
            height: '100%',
            paddingBottom: 0,
          },
        }}
      >
        <Tab.Screen name="MainStack" component={MainStack} options={{ headerShown: false, tabBarLabel: 'Home' }} />
        <Tab.Screen
          name="Alert"
          component={AlertScreen}
          options={{
            tabBarLabel: 'Alert',
            headerStyle: {
              backgroundColor: '#3f89b8',
            },
            headerTintColor: '#000000',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Tab.Screen
          name="ProfileStack"
          component={ProfileStack} 
          options={{
            tabBarLabel: 'Profile',
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
