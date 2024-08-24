import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';

const Signup: React.FC<{ navigation: any }> = ({ navigation }) => {
  useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSignup = async () => {
    // Replace with actual signup logic
    
    
    if (name && email && password) {
      let username=name;
     
      const user = { username, email , password}; // Use user-defined name
      console.log(user);
      try {
        const response = await axios.post('http://10.0.2.2:5000/signup', user);
        console.log(response);
        if(( response).status === 200 || ( response).status === 201){
          navigation.navigate('Login');
        
        }else{
          alert('Error signing up');
        }
        
      } catch (error) {
        
      }
     
    } else {
      alert('Please enter your name, email, and password.');
    }
  };
 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
      <Button title="Submit" onPress={handleSignup} />
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

export default Signup;
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}

