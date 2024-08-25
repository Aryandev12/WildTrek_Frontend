import React, { useState } from 'react';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import Location from './Location';
import { useUser } from '../contexts/UserContext';

// Navigation prop type
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'BirdAlert'>;

const BirdAlert: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [severity, setSeverity] = useState<number>(5); // Default value of slider is set to 5
  const [classificationResult, setClassificationResult] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null); // State for address
  const navigation = useNavigation<NavigationProp>();
  const { user } = useUser();  // Access user data

  async function sendImageToServer(imageUri: string): Promise<void> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    try {
      const response = await axios.post('http://10.0.2.2:5000/classify-bird-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        const { scientific_name, common_name, description, habitat, endangered, dangerous, venomous, poisonous, probability } = response.data;
        const resultData = {
          scientific_name,
          common_name,
          description,
          habitat,
          endangered,
          dangerous,
          venomous,
          poisonous,
          probability: probability.toFixed(2),
        };
        setClassificationResult(resultData);
      }
    } catch (error) {
      console.error('Error sending image to server: ', error);
    }
  }

  async function pickImageFromGallery(): Promise<void> {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else {
        let imageUri = response.assets?.[0]?.uri || response.uri;
        if (imageUri) {
          setImageUri(imageUri);
          sendImageToServer(imageUri);
        }
      }
    });
  }

  function takePhoto(): void {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      saveToPhotos: true,
    };
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorCode);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        if (imageUri) {
          setImageUri(imageUri);
          sendImageToServer(imageUri);
        }
      }
    });
  }

  function handleSubmit(): void {
    if (!user) {
      Alert.alert('User', 'Please login to submit.');
      return;
    }
    if (!classificationResult) {
      Alert.alert('Model', 'Please classify the bird image first.');
      return;
    }
    if (!imageUri) {
      Alert.alert('Image', 'Please upload an image.');
      return;
    }
    if (!address) {
      Alert.alert('Address', 'Please wait for location to be determined.');
      return;
    }
  
    // Create a FormData object
    const formData = new FormData();
    formData.append('user_name', user.username);
    formData.append('user_email', user.email);
    formData.append('priority', classificationResult.endangered ? 'High' : 'Low');
    formData.append('address', address);
    formData.append('injury_level', severity.toString()); // Convert number to string
    formData.append('animal_name', classificationResult.common_name);
  
    // Add image if available
    if (imageUri) {
      const file = {
        uri: imageUri,
        type: 'image/jpeg', // Adjust based on the actual file type
        name: 'image.jpg', // You might want to generate a unique name for the file
      };
      formData.append('image', file);
    }
  
    console.log('Submit data:', formData);
  
    // Post the FormData to the server
    try {
      axios.post('http://10.0.2.2:5000/sendalert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log('Response:', response.data);
        // Handle success response here, e.g., navigate to another screen or show a success message
        Alert.alert('Success', 'Data submitted successfully!');
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        // Handle error response here, e.g., show an error message
        Alert.alert('Error', 'Failed to submit data.');
      });
    } catch (error) {
      console.error('Error during submission:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  }

  return (
    <View style={styles.container}>
      {/* Image Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>Image</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImageFromGallery}>
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.image} />
        )}
      </View>

      {/* Slider for Severity */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Set Severity of Bird Injury:</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={severity}
          onValueChange={(value) => setSeverity(value)}
        />
        <Text style={styles.sliderValue}>{severity}</Text>
      </View>

      {/* Location Component */}
      <Location address={address} setAddress={setAddress} />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  cardHeading: {
    fontSize: 24,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    resizeMode: 'cover',
  },
  sliderContainer: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
    padding: 15,
  },
  sliderLabel: {
    fontSize: 18,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 18,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default BirdAlert;
