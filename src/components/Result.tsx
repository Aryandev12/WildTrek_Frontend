import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Result = ({ route }) => {
  const { imageUri, classificationResult } = route.params;

  // Use the provided imageUri or fallback to a default image if imageUri is not available
  const displayImageUri = imageUri || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdZOQh13Cl80G8RSx7fslkZyWSEIN-ICnxUt7V0VDTjMUfxjvy46UkzoXvSVvXaWtpYx8&usqp=CAU';

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Result</Text>
      </View>      
      <Image source={{ uri: displayImageUri }} style={styles.image} />
      <View style={styles.card}>
        <Text style={styles.resultText}><Text style={styles.label}>Scientific Name:</Text> {classificationResult.scientific_name}</Text>
        <Text style={styles.resultText}><Text style={styles.label}>Common Name:</Text> {classificationResult.common_name}</Text>
        <Text style={styles.resultText}><Text style={styles.label}>Description:</Text> {classificationResult.description}</Text>
        <Text style={styles.resultText}><Text style={styles.label}>Habitat:</Text> {classificationResult.habitat}</Text>
        <Text style={styles.resultText}><Text style={styles.label}>Endangered:</Text> {classificationResult.endangered}</Text>
        <Text style={styles.resultText}><Text style={styles.label}>Dangerous:</Text> {classificationResult.dangerous}</Text>
        <Text style={styles.resultText}><Text style={styles.label}>Poisonous:</Text> {classificationResult.poisonous}</Text>
        <Text style={styles.resultText}><Text style={styles.label}>Venomous:</Text> {classificationResult.venomous}</Text>
        <Text style={styles.resultText}><Text style={styles.label}>Probability:</Text> {classificationResult.probability}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#192f6a', // Consistent background color
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f0e8d5', // Title color consistent with label color
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    borderColor: '#4c669f', // Border color to match card color
    borderWidth: 2,
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: '#4c669f', // Card background color consistent with the previous design
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Adds shadow for Android
    alignItems: 'flex-start', // Align items to the start of the card
  },
  resultText: {
    fontSize: 16,
    color: '#ffffff', // Text color consistent with card background
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#f0e8d5', // Label color to contrast with the resultText
  },
});

export default Result;
