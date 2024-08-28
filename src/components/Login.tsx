import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import GoogleIcon from '../../assets/googleIcon.svg';

const Login: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '82339088914-dvd34dgji7e2csaleq8uh88fddaker1u.apps.googleusercontent.com',
    });
  }, []);

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      const { user } = userCredential;

      const userData = {
        username: user.displayName,
        email: user.email,
        uid: user.uid,
      };

      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      login(userData);
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
        const response = await axios.post('http://10.0.2.2:5000/login', { email, password });
        const userData = {
          username: response.data.username,
          email: response.data.email,
          accesstoken: response.data.accesstoken
        };

        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        login(userData);
        navigation.navigate('Profile');
      } catch (error) {
        console.error('Error during login:', error);
        Alert.alert('Login failed', 'Please check your email and password and try again.');
      }
    } else {
      Alert.alert('Input Required', 'Please enter your email and password.');
    }
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.innerContainer}>
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.googleButton} onPress={onGoogleButtonPress}>
            <View style={styles.googleButtonContent}>
              <GoogleIcon style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Sign-In</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ffffff',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 15,
    borderRadius: 25,
    color: '#ffffff',
    backgroundColor: '#333333',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ffffff',
    height: 50,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    height: 50,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
  },
});

export default Login;
