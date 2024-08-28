import React, { useState } from 'react';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AnimalAudioRecorder from './AnimalAudioRecorder';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../stack/HomeStack'; // Adjust import based on your project structure
import GalleryIcon from '../../assets/galleryIcon.svg';
import CameraIcon from '../../assets/cameraIcon.svg';

// Navigation prop type
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Animal'>;

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
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Animal Classification</Text>
      </View>
      <View style={styles.contentContainer}>
        {/* Image Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Image</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={pickImageFromGallery}>
              <GalleryIcon />
              <Text style={styles.iconLabel}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={takePhoto}>
              <CameraIcon />
              <Text style={styles.iconLabel}>Camera</Text>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    width: '40%',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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
  resultHeading: {
    fontSize: 20,
    color: '#333333',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 5,
  },
  audioContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  icon: {
    width: 40, // Adjust icon size as needed
    height: 40,
    tintColor: '#ffffff', // Optionally add color tint
  },
  iconButton: {
    flex: 1,
    alignItems: 'center',
  },
  iconLabel: {
    fontSize: 15,
    color: '#333333',
  },
});

export default Animal;
