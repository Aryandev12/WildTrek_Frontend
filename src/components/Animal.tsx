import React, { useState } from 'react';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AnimalAudioRecorder from './AnimalAudioRecorder';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types'; // Adjust import based on your project structure

// Navigation prop type
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Animal'>;

const Animal: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [classificationResult, setClassificationResult] = useState<any>(null); 
  const navigation = useNavigation<NavigationProp>(); 

  async function sendImageToServer(imageUri: string): Promise<void> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    try {
      const response = await axios.post('http://10.0.2.2:5000/classify-animal-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
   
      console.log(response);
      if (response.data) {
        const {  scientific_name,common_name,description,habitat, endangered, dangerous,venomous ,poisonous ,probability} = response.data;
        const resultData = {
          scientific_name,
          common_name,
          description,
          habitat,
          endangered,
          dangerous,
          venomous,
          poisonous,
          probability: probability.toFixed(2)
          
        }
        console.log(resultData);
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
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorCode);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        console.log(imageUri);

        if (imageUri) {
          setImageUri(imageUri);
          sendImageToServer(imageUri);
        }
      }
    });
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
      </View>

      {/* Audio Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>Audio</Text>
        <View style={styles.audioContainer}>
         <AnimalAudioRecorder />
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 30,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
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
    marginBottom: 15,
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
    alignSelf: 'center',
    marginTop: 20,
    resizeMode: 'cover',
  },
  resultContainer: {
    marginTop: 20,
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
  audioContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
});

export default Animal;

