import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
});

export default Login;
function alert(arg0: string) {
  throw new Error('allert not implemented');
}

