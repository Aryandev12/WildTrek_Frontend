import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid, Button } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { GEOCODING_API } from '@env';

type LocationProps = {
  address: string | null;
  setAddress: (address: string | null) => void;
};

const Location: React.FC<LocationProps> = ({ address, setAddress }) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const licenceKey = GEOCODING_API;

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app requires access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            fetchReverseGeocode(latitude, longitude);
          },
          error => console.log('Error getting location:', error),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchReverseGeocode = (latitude: number, longitude: number) => {
    const url = `https://apis.mapmyindia.com/advancedmaps/v1/${licenceKey}/rev_geocode?lat=${latitude}&lng=${longitude}`;
    fetch(url)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const address = data.results[0].formatted_address;
        setAddress(address);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Location: {address || 'Fetching location...'}</Text>
      <Button title="Refresh Location" onPress={() => requestLocationPermission()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default Location;
