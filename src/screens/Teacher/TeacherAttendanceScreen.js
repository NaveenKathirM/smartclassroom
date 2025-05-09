import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TeacherAttendanceScreen = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        if (!accessToken) {
          Alert.alert('Error', 'No access token found.');
          return;
        }

        const response = await fetch(
          'https://smart-classroom-backend-2.onrender.com/students', // Replace with your backend endpoint to get student data
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const result = await response.json();
        if (response.ok) {
          setAttendanceData(result); // Update state with fetched data
        } else {
          Alert.alert('Error', 'Failed to fetch attendance data.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch attendance data.');
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchAttendanceData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>; // You can replace this with a spinner or a loading screen
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Attendance Overview</Text>
      <Text style={styles.subtitle}>
        Analyze attendance data for all students:
      </Text>

      {attendanceData.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No attendance data available.</Text>
        </View>
      ) : (
        attendanceData.map((record, index) => (
          <View key={index} style={styles.recordCard}>
            <View style={styles.row}>
              <Text style={styles.usernameText}>{record.username}</Text>
              <Text style={styles.percentageText}>{record.attendance}%</Text>
            </View>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.bar,
                  {width: `${record.attendance}%`}, // Adjust bar width dynamically
                ]}
              />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f3f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noDataText: {
    fontSize: 18,
    color: '#bdc3c7',
    fontStyle: 'italic',
  },
  recordCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  barBackground: {
    width: '100%',
    height: 15,
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 10,
  },
});

export default TeacherAttendanceScreen;
