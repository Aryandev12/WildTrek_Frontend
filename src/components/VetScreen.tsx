import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { VetStackParamList } from '../stack/VetStack';
import GetLocation from './GetLocation';
import LinearGradient from 'react-native-linear-gradient';

type VetScreenNavigationProp = StackNavigationProp<VetStackParamList, 'Vet'>;

const VetScreen: React.FC = () => {
  const navigation = useNavigation<VetScreenNavigationProp>();

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Find a Vet</Text>
        </View>
        <GetLocation />
      </ScrollView>
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
  scrollView: {
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  historyButton: {
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  historyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
});

export default VetScreen;
