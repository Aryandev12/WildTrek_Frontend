import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid, Button, ScrollView, TouchableOpacity } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { GEOCODING_API ,TOKEN_VET} from '@env';

const GetLocation: React.FC = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState<string | null>(null);
  const licenceKey = GEOCODING_API;
  const [vets, setVets] = useState<any[]>([]); // Allowing any type for array elements for now

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "App needs access to your location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Location permission granted");
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        fetchReverseGeocode(position.coords.latitude, position.coords.longitude);
        console.log(position);
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
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

  const getNearByVet = async () => {
    if (location.latitude && location.longitude) {
      try {
        const response = await fetch(
          `https://atlas.mappls.com/api/places/nearby/json?keywords=veterinary&refLocation=${location.latitude},${location.longitude}&page=1&region=IND&sortBy=dist:asc&searchBy=dist`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${TOKEN_VET}`,
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        // Set the vets state using the suggestedLocations array from the response
        if (Array.isArray(data.suggestedLocations)) {
          setVets(data.suggestedLocations);
        } else {
          setVets([]); // If no results found, set an empty array
          console.error('No results found');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Latitude: {location.latitude}</Text>
      <Text style={styles.heading}>Longitude: {location.longitude}</Text>
      <Text style={styles.heading}>Address: {address}</Text>
      <Button title="Get Location" onPress={getCurrentLocation}></Button>
      <Button title="Get NearBy Vet" onPress={getNearByVet}></Button>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {vets.length > 0 ? (
          vets.map((vet, index) => (
            <TouchableOpacity key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{vet.placeName}</Text>
              <Text style={styles.cardAddress}>{vet.placeAddress}</Text>
              <Text style={styles.cardDistance}>{vet.distance} meters away</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResultsText}>No veterinary services found nearby.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 4,
  },
  scrollView: {
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3, // Adds shadow for Android
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cardDistance: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
    fontStyle: 'italic',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default GetLocation;
