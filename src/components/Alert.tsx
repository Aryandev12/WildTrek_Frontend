import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { AlertStackParamList } from '../stack/AlertStack';
import { useUser } from '../contexts/UserContext'; 
import { createStackNavigator } from '@react-navigation/stack';

type AlertScreenNavigationProp = StackNavigationProp<AlertStackParamList, 'Alert'>;

const Alert: React.FC = () => {
  const navigation = useNavigation<AlertScreenNavigationProp>();
  const { user } = useUser();

  const handleAlertHistoryPress = () => {
    if (user) {
      navigation.navigate('AlertHistory'); // Navigate to Alert History if logged in
    } else {
      navigation.navigate('Profile'); // Redirect to Login if not logged in
    }
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <Text style={styles.heading}>Alert</Text>

      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BirdAlert')}>
          <Image source={{ uri: 'https://images.pexels.com/photos/12290533/pexels-photo-12290533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} style={styles.image} />
          <Text style={styles.text}>BIRD</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AnimalAlert')}>
          <Image source={{ uri: 'https://images.pexels.com/photos/68669/wolf-predator-wildlife-montana-68669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} style={styles.image} />
          <Text style={styles.text}>ANIMAL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.historyButton} onPress={handleAlertHistoryPress}>
          <Text style={styles.historyButtonText}>View Alert History</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    width: '100%',
    height: '100%',
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 40,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 15,
    borderRadius: 15,
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    overflow: 'hidden',
    width: '80%', // Ensure card width is consistent
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 20,
    borderRadius: 40,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  historyButton: {
    width: '80%',
    backgroundColor: '#34495e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  historyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default Alert;
