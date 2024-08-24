import React, { useState, useRef } from 'react';
import {
    Button,
  Dimensions,
  PermissionsAndroid,
  Platform,
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


const screenWidth = Dimensions.get('screen').width;

const AudioRecorder: React.FC = () => {
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');

  const dirs = RNFetchBlob.fs.dirs;
  const path = Platform.select({
    ios: undefined,
    android: `${dirs.CacheDir}/hello.mp3`,
  });

  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  
  audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.5

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
    console.log(`uri: ${uri}`);
  };




  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    console.log(result);
  };

  const onStartPlay = async () => {
    try {
      const msg = await audioRecorderPlayer.startPlayer(path);
      await audioRecorderPlayer.setVolume(1.0);
      console.log(`path: ${msg}`);

      audioRecorderPlayer.addPlayBackListener((e) => {
        setCurrentPositionSec(e.currentPosition);
        setCurrentDurationSec(e.duration);
        setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
      });
    } catch (err) {
      console.log('startPlayer error', err);
    }
  };



  const onStopPlay = async () => {
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  const onStatusPress = (e: any) => {
    const touchX = e.nativeEvent.locationX;

    const playWidth = (currentPositionSec / currentDurationSec) * (screenWidth - 56);

    if (playWidth && playWidth < touchX) {
      const addSecs = Math.round(currentPositionSec + 1000);
      audioRecorderPlayer.seekToPlayer(addSecs);
      console.log(`addSecs: ${addSecs}`);
    } else {
      const subSecs = Math.round(currentPositionSec - 1000);
      audioRecorderPlayer.seekToPlayer(subSecs);
      console.log(`subSecs: ${subSecs}`);
    }
  };

  let playWidth = (currentPositionSec / currentDurationSec) * (screenWidth - 56);

  if (!playWidth) {
    playWidth = 0;
  }

  return (
    <SafeAreaView >
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
      </View>
      <View >
        <TouchableOpacity
         
          onPress={onStatusPress}>
          <View>
            <View  />
          </View>
        </TouchableOpacity>
        <Text style={styles.text}>
          Playing time: {playTime} / {duration}
        </Text>
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={onStartPlay}>
            <Text style={styles.buttonText}>Play</Text>
          </TouchableOpacity>
         
          <TouchableOpacity style={styles.button} onPress={onStopPlay}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text:{
    color: '#000000'
  },
  container: {
    flexDirection: 'row',  
    justifyContent: 'space-between', 
    padding: 10,
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
});

export default AudioRecorder;

