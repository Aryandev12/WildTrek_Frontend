import React, { useState } from 'react';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Location from './Location';
import { useUser } from '../contexts/UserContext';
import { AlertStackParamList } from '../stack/AlertStack';
import GalleryIcon from '../../assets/galleryIcon.svg';
import CameraIcon from '../../assets/cameraIcon.svg';

// Navigation prop type
type NavigationProp = NativeStackNavigationProp<AlertStackParamList, 'AnimalAlert'>;

const AnimalAlert: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [severity, setSeverity] = useState<number>(5);
  const [classificationResult, setClassificationResult] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();
  const { user } = useUser();

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
      Alert.alert('Model', 'Please classify the animal image first.');
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

    const formData = new FormData();
    formData.append('user_name', user.username);
    formData.append('user_email', user.email);
    formData.append('priority', classificationResult.endangered ? 'High' : 'Low');
    formData.append('address', address);
    formData.append('injury_level', severity.toString());
    formData.append('animal_name', classificationResult.common_name);

    if (imageUri) {
      const file = {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      };
      formData.append('image', file);
    }

    console.log('Submit data:', formData);

    try {
      axios.post('http://10.0.2.2:5000/sendalert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          console.log('Response:', response.data);
          Alert.alert('Success', 'Data submitted successfully!');
        })
        .catch(error => {
          console.error('Error submitting form:', error);
          Alert.alert('Error', 'Failed to submit data.');
        });
    } catch (error) {
      console.error('Error during submission:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  }

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Animal Alert</Text>
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
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.image} />
            )}
          </View>

          {/* Severity Slider */}
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Set Severity of Animal Injury:</Text>
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
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 80,
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
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  sliderContainer: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 3,
  },
  sliderLabel: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
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

export default AnimalAlert;
