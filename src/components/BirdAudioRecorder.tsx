import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';
import DocumentPicker, { types } from 'react-native-document-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
// Navigation prop type
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Bird'>;

const AudioRecorder: React.FC = () => {
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [recordedFile, setRecordedFile] = useState(null);
  const [classificationResult, setClassificationResult] = useState<any>(null); 
  const navigation = useNavigation<NavigationProp>(); 

  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  const dirs = RNFetchBlob.fs.dirs;
  const path = `${dirs.CacheDir}/hello.mp3`;

  audioRecorderPlayer.setSubscriptionDuration(0.1);

  const onStartRecord = async () => {
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    };

    const uri = await audioRecorderPlayer.startRecorder(path, audioSet);

    audioRecorderPlayer.addRecordBackListener((e) => {
      setRecordSecs(e.currentPosition);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
    });
    setRecordedFile(uri);
    console.log(`uri: ${uri}`);
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    console.log(result);
  };

  const onSelectAudio = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: types.audio,
      });

      setSelectedFile(res);
      console.log('Selected file:', res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Unknown error:', err);
      }
    }
  };

  const onUploadAudio = async (fileUri: null) => {
    if (!fileUri) {
      console.log('No file selected or recorded');
      return;
    }

    try {
        // Prepare form data
     const formData = new FormData();
     formData.append('audio', {
       uri: fileUri,
       type: 'audio/mp3', // Replace with the correct MIME type
       name: 'audio',
     });

     // Send the audio file to the server
     const response = await axios.post('http://10.0.2.2:5000/classify-animal-audio', formData, {
       headers: {
         'Content-Type': 'multipart/form-data',
       },
     });
     console.log(response)

     console.log('File uploaded successfully:', response.data);

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
     navigation.navigate('Result', { fileUri, classificationResult: resultData });
     

      
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  let playWidth = (currentPositionSec / currentDurationSec) * (300 - 56);
  if (!playWidth) {
    playWidth = 0;
  }

  return (
    <SafeAreaView>
      <Text style={styles.text}>Recording time: {recordTime}</Text>

      <View>
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={onStartRecord}>
            <Text style={styles.buttonText}>Record</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onStopRecord}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.singleButtonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onUploadAudio(recordedFile)}
          >
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Divider Line */}
      <View style={styles.divider} />

      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={onSelectAudio}>
          <Text style={styles.buttonText}>Select Audio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => onUploadAudio(selectedFile?.uri)}
        >
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {selectedFile && (
        <Text style={styles.text}>Selected file: {selectedFile.name}</Text>
      )}
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 10, 
  },
  singleButtonContainer: {
    marginTop: 10, 
    alignItems: 'center', 
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12, 
    borderRadius: 8, 
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold', 
  },
  text: {
    color: '#000',
    marginTop: 20, 
    textAlign: 'center',
    fontSize: 16, 
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD',  
    marginVertical: 20,  
  },
});

export default AudioRecorder;
