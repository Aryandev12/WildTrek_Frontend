import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import axios from 'axios'; // Make sure to import axios
import { useUser } from '../contexts/UserContext'; // Adjust the import path as needed

const AlertHistory: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { user } = useUser();

  const fetchAlerts = async () => {
    if (!user || !user.accesstoken) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      const response = await axios.get('http://10.0.2.2:5000/api/alerts', {
        headers: {
          Authorization: `Bearer ${user.accesstoken}`, // Include the token in the header
        },
      });
      setAlerts(response.data.alerts); // Adjusted to match the response structure
    } catch (error) {
      console.error('Error fetching alerts:', error);
      Alert.alert('Error', 'Failed to fetch alerts');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={fetchAlerts}>
        <Text style={styles.buttonText}>Fetch Alerts</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {alerts.length === 0 ? (
          <Text style={styles.noAlertsText}>No alerts found.</Text>
        ) : (
          alerts.map((alert) => (
            <View key={alert._id} style={styles.card}>
              <Image source={{ uri: alert.photo_url }} style={styles.alertImage} />
              <Text style={styles.alertAnimal}>{alert.animal_name}</Text>
              <Text style={styles.alertPriority}>{alert.priority} Priority</Text>
              <Text style={styles.alertInjury}>Injury Level: {alert.injury_level}</Text>
              <Text style={styles.alertAddress}>{alert.address}</Text>
              <Text style={styles.alertUser}>Reported by: {alert.username} ({alert.user_email})</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#192f6a', // Background color for consistency
  },
  scrollView: {
    padding: 16,
  },
  noAlertsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#ffffff', // Consistent text color
  },
  card: {
    backgroundColor: '#4c669f', // Card color consistent with the gradient
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  alertAnimal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff', // Text color consistent with card background
    marginBottom: 4,
  },
  alertPriority: {
    fontSize: 14,
    color: '#f39c12', // Highlight color for priority
    marginBottom: 8,
  },
  alertInjury: {
    fontSize: 16,
    color: '#e67e22', // Consistent with previous color scheme
    marginBottom: 8,
  },
  alertAddress: {
    fontSize: 14,
    color: '#bdc3c7', // Light color for address
    marginBottom: 8,
  },
  alertUser: {
    fontSize: 14,
    color: '#ecf0f1', // Consistent text color
    marginBottom: 8,
  },
  alertImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#ffffff', // Button background color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#192f6a', // Button text color
    fontWeight: '600',
  },
});

export default AlertHistory;
