import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Result = ({ route }) => {
  const { imageUri, classificationResult } = route.params;

  // Use the provided imageUri or fallback to a default image if imageUri is not available
  const displayImageUri = imageUri || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdZOQh13Cl80G8RSx7fslkZyWSEIN-ICnxUt7V0VDTjMUfxjvy46UkzoXvSVvXaWtpYx8&usqp=CAU';

  return (
    <View style={styles.container}>
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
    backgroundColor: '#ffffff',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Adds shadow for Android
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
});

export default Result;
