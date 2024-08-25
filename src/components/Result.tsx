import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Result = ({ route }) => {
  const { imageUri, classificationResult } = route.params;

  // Use the provided imageUri or fallback to a default image if imageUri is not available
  const displayImageUri = imageUri || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdZOQh13Cl80G8RSx7fslkZyWSEIN-ICnxUt7V0VDTjMUfxjvy46UkzoXvSVvXaWtpYx8&usqp=CAU';

  return (
    <View style={styles.container}>
      <Image source={{ uri: displayImageUri }} style={styles.image} />
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Scientific Name: {classificationResult.scientific_name}</Text>
        <Text style={styles.resultText}>Common Name: {classificationResult.common_name}</Text>
        <Text style={styles.resultText}>Description: {classificationResult.description}</Text>
        <Text style={styles.resultText}>Habitat: {classificationResult.habitat}</Text>
        <Text style={styles.resultText}>Endangered: {classificationResult.endangered}</Text>
        <Text style={styles.resultText}>Dangerous: {classificationResult.dangerous}</Text>
        <Text style={styles.resultText}>Poisonous: {classificationResult.poisonous}</Text>
        <Text style={styles.resultText}>Venomous: {classificationResult.venomous}</Text>
        <Text style={styles.resultText}>Probability: {classificationResult.probability}%</Text>
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
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  resultContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
});

export default Result;
