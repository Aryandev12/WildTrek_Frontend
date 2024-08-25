import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Button, Image } from 'react-native';
import axios from 'axios'; // Make sure to import axios
import { useUser } from '../contexts/UserContext'; // Adjust the import path as needed



const AlertHistory: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { user } = useUser(); 

  const fetchAlerts = async () => {
    console.log(user)
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
      console.log(response);

      setAlerts(response.data.alerts); // Adjusted to match the response structure
      console.log('Alerts fetched:', response.data.alerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      Alert.alert('Error', 'Failed to fetch alerts');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Fetch Alerts" onPress={fetchAlerts} />
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
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 16,
  },
  noAlertsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
  card: {
    backgroundColor: '#f0e8d5',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  alertAnimal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  alertPriority: {
    fontSize: 14,
    color: '#e74c3c',
    marginBottom: 8,
  },
  alertInjury: {
    fontSize: 16,
    color: '#e67e22',
    marginBottom: 8,
  },
  alertAddress: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  alertUser: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 8,
  },
  alertImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default AlertHistory;


