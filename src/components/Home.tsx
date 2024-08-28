import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { HomeStackParamList } from '../stack/HomeStack';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

const Home: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Heading for the app */}
      <Text style={styles.heading}>WildTrek</Text>

      {/* Cards for Bird, Animal, Plant */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Bird')}>
          <Image source={{ uri: 'https://images.pexels.com/photos/12290533/pexels-photo-12290533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} style={styles.image} />
          <Text style={styles.text}>BIRD</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Animal')}>
          <Image source={{ uri: 'https://images.pexels.com/photos/68669/wolf-predator-wildlife-montana-68669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} style={styles.image} />
          <Text style={styles.text}>ANIMAL</Text>
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
});

export default Home;
