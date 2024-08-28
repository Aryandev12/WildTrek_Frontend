import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './src/stack/HomeStack';
import AlertStack from './src/stack/AlertStack';
import ProfileStack from './src/stack/ProfileStack';
import VetStack from './src/stack/VetStack';
import { UserProvider, useUser } from './src/contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const Tab = createBottomTabNavigator();

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
            backgroundColor: '#192f6a',
            borderTopWidth: 0,
            elevation: 2,
            height: 50, 
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 8,
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#3f89b8',
          tabBarIcon: () => null, // Hide icons
          tabBarLabelStyle: {
            fontWeight: 'bold',
            fontSize: 14, 
            textAlign: 'center',
          },
        }}
      >
        <Tab.Screen 
          name="HomeStack" 
          component={HomeStack} 
          options={{ 
            headerShown: false, 
            tabBarLabel: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <LinearGradient
                  colors={focused ? ['#00c6ff', '#0072ff'] : ['#3f89b8', '#192f6a']}
                  style={{ padding: 5, borderRadius: 10, width: 80 }} // Set fixed width
                  start={{ x: 0, y: 0 }} // Left to right gradient
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={{ color: '#fff', textAlign: 'center' }}>Home</Text>
                </LinearGradient>
              </View>
            ),
          }} 
        />
        <Tab.Screen
          name="AlertStack"
          component={AlertStack}
          options={{
            headerShown: false,
            tabBarLabel: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <LinearGradient
                  colors={focused ? ['#00c6ff', '#0072ff'] : ['#3f89b8', '#192f6a']}
                  style={{ padding: 5, borderRadius: 10, width: 80 }} // Set fixed width
                  start={{ x: 0, y: 0 }} // Left to right gradient
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={{ color: '#fff', textAlign: 'center' }}>Alert</Text>
                </LinearGradient>
              </View>
            ),

          }}
        />
        <Tab.Screen
          name="VetStack"
          component={VetStack}
          options={{
            headerShown: false,
            tabBarLabel: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <LinearGradient
                  colors={focused ? ['#00c6ff', '#0072ff'] : ['#3f89b8', '#192f6a']}
                  style={{ padding: 5, borderRadius: 10, width: 80 }} // Set fixed width
                  start={{ x: 0, y: 0 }} // Left to right gradient
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={{ color: '#fff', textAlign: 'center' }}>Vet</Text>
                </LinearGradient>
              </View>
            ),
            headerStyle: {
              backgroundColor: '#3f89b8',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Tab.Screen
          name="ProfileStack"
          component={ProfileStack} 
          options={{
            headerShown: false,
            tabBarLabel: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <LinearGradient
                  colors={focused ? ['#00c6ff', '#0072ff'] : ['#3f89b8', '#192f6a']}
                  style={{ padding: 5, borderRadius: 10, width: 80 }} // Set fixed width
                  start={{ x: 0, y: 0 }} // Left to right gradient
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={{ color: '#fff', textAlign: 'center' }}>Profile</Text>
                </LinearGradient>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
