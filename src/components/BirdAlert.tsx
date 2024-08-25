import React, { useState } from 'react';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Slider from '@react-native-community/slider';  // Updated import
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Your component code here...


// Navigation prop type
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'BirdAlert'>;

const BirdAlert: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [severity, setSeverity] = useState<number>(5); // Default value of slider is set to 5
  const [classificationResult, setClassificationResult] = useState<any>(null);
  const navigation = useNavigation<NavigationProp>();

  async function sendImageToServer(imageUri: string): Promise<void> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });
    formData.append('severity', severity.toString());

    try {
      const response = await axios.post('http://10.0.2.2:5000/classify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data && response.data.result) {
        const { scientific_name, common_name, endangered, probability } = response.data.result;
        const resultData = {
          scientific_name,
          common_name,
          endangered,
          probability: probability.toFixed(2),
        };
        setClassificationResult(resultData);

        // Navigating to Result page with parameters
        navigation.navigate('Result', { imageUri, classificationResult: resultData });
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
        console.log(imageUri);

        if (imageUri) {
          setImageUri(imageUri);
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
        console.log(imageUri);

        if (imageUri) {
          setImageUri(imageUri);
        }
      }
    });
  }

  function handleSubmit(): void {
    if (imageUri) {
      sendImageToServer(imageUri);
    } else {
      console.log('No image selected');
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
    justifyContent: 'center',
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
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
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
