import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

type Alert = {
  id: number;
  type: string;
  date: string;
  details: string;
};

const AlertHistory: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Simulating fetching data from a database
  useEffect(() => {
    const fetchAlerts = async () => {
      const fetchedAlerts = [
        { id: 1, type: 'Bird', date: '2024-08-21', details: 'Spotted a rare bird species' },
        { id: 2, type: 'Animal', date: '2024-08-20', details: 'Encountered a wild animal' },
        { id: 3, type: 'Bird', date: '2024-08-19', details: 'Birds chirping recorded' },
      ];

      setAlerts(fetchedAlerts);
    };

    fetchAlerts();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {alerts.length === 0 ? (
        <Text style={styles.noAlertsText}>No alerts found.</Text>
      ) : (
        alerts.map((alert) => (
          <View key={alert.id} style={styles.card}>
            <Text style={styles.alertType}>{alert.type} Alert</Text>
            <Text style={styles.alertDate}>{alert.date}</Text>
            <Text style={styles.alertDetails}>{alert.details}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  alertType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  alertDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  alertDetails: {
    fontSize: 16,
    color: '#34495e',
  },
});

export default AlertHistory;
