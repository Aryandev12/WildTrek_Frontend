import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const Alert: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleAlertHistoryPress = () => {
    if (true) {
      navigation.navigate('AlertHistory'); // Navigate to Alert History if logged in
    } else {
      navigation.navigate('Profile'); // Redirect to Login if not logged in
    }
  };

  return (
    <View style={styles.container}>
      {/* Heading for the app */}
      <Text style={styles.heading}>Alert</Text>

      {/* Cards for Bird, Animal, Plant */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BirdAlert')}>
          <Image source={{ uri: 'https://t3.ftcdn.net/jpg/07/44/00/82/240_F_744008275_AHvOgcDuOj3JxyFYBDZNe2MHbG8qvJpV.jpg' }} style={styles.image} />
          <Text style={styles.text}>BIRD</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AnimalAlert')}>
          <Image source={{ uri: 'https://t3.ftcdn.net/jpg/03/02/14/00/240_F_302140095_ZNvUZwG6IofM1vt5VPC758sCFsT2BVYb.jpg' }} style={styles.image} />
          <Text style={styles.text}>ANIMAL</Text>
        </TouchableOpacity>

        {/* Button for Alert History */}
      <TouchableOpacity style={styles.historyButton} onPress={handleAlertHistoryPress}>
        <Text style={styles.historyButtonText}>View Alert History</Text>
      </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#add8e6',
    paddingTop: 50,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    textShadowColor: '#dcdcdc',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0e8d5',
    padding: 15,
    marginVertical: 10,
    width: '80%',
    height: 120,
    borderRadius: 10,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 20,
    borderRadius: 40,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
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
