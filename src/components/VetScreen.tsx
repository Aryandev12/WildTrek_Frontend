import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import GetLocation from './GetLocation';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const VetScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
        <GetLocation />
        

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default VetScreen;
