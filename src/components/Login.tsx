import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';


const Login: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '82339088914-dvd34dgji7e2csaleq8uh88fddaker1u.apps.googleusercontent.com',
    });
  }, [])

  async function onGoogleButtonPress() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Get the user's ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      const { user } = userCredential;

      // Extract user details
      const userData = {
        username: user.displayName,
        email: user.email,
        uid: user.uid,
      };

      // Store user data in AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      // Store user data in the context
      login(userData);

      // Navigate to the Profile page
      navigation.navigate('Profile');

      Alert.alert('Success', `Welcome ${user.displayName}!`);

    } catch (error) {
      console.error('Error during Google sign-in:', error);
      Alert.alert('Login failed', 'An error occurred during Google sign-in. Please try again.');
    }
  };


  const handleLogin = async () => {
    if (email && password) {
      try {
        console.log(email, password);
        const response = await axios.post('http://10.0.2.2:5000/login', { email, password });
        
        // Handling the response
        console.log(response.data);
        const userData = {
          username: response.data.username,
          email: response.data.email,
          accesstoken: response.data.accesstoken
        }
        

        await AsyncStorage.setItem('userData', JSON.stringify(userData));

        login(response.data);
        navigation.navigate('Profile');
  
        
  
      } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed. Please check your email and password and try again.');
      }
    } else {
      alert('Please enter your email and password.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
    
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Submit" onPress={handleLogin} />
      <View style={styles.buttonContainer}>

        <Button
        title="Google Sign-In"
        onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
        />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 10, 
  },
});

export default Login;

