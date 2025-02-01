import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

const AttendanceScreen = ({ navigation }) => {
  const [attendance, setAttendance] = useState([]);
  const [currentClass, setCurrentClass] = useState(1);
  const [timer, setTimer] = useState(0);
  const rnBiometrics = new ReactNativeBiometrics();

  useEffect(() => {
    const fetchAttendance = async () => {
      const loggedInUser = JSON.parse(await AsyncStorage.getItem('loggedInUser')) || {};
      const username = loggedInUser.username;
      const storedAttendance = JSON.parse(await AsyncStorage.getItem(`attendance_${username}`)) || [];
      setAttendance(storedAttendance);
    };

    fetchAttendance();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 20);
  
      return () => clearInterval(interval);
    } else if (timer === 0 && attendance.includes(currentClass)) {
      setCurrentClass((prev) => prev + 1); // Move to the next class after the timer ends
    }
  }, [timer, attendance, currentClass]); // Include dependencies
  

  const handleBiometricAuth = async () => {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();

      if (available) {
        const result = await rnBiometrics.simplePrompt({
          promptMessage: 'Confirm your identity to mark attendance',
        });

        if (result.success) {
          markAttendance();
        } else {
          Alert.alert('Error', 'Authentication failed or canceled.');
        }
      } else {
        Alert.alert(
          'Error',
          `Biometric authentication not available. Please check your device settings.`
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during biometric authentication.');
    }
  };

  const markAttendance = async () => {
    const loggedInUser = JSON.parse(await AsyncStorage.getItem('loggedInUser')) || {};
    const username = loggedInUser.username;

    if (attendance.includes(currentClass)) {
      Alert.alert('Already Marked', `Attendance for Class ${currentClass} is already marked.`);
      return;
    }

    const updatedAttendance = [...attendance, currentClass];
    await AsyncStorage.setItem(`attendance_${username}`, JSON.stringify(updatedAttendance));
    setAttendance(updatedAttendance);

    if (currentClass < 10) {
      setTimer(60); // Start the timer for the next class
    } else {
      Alert.alert('Completed', 'Attendance for all classes is marked.');
    }
  };

  const calculateAttendancePercentage = () => {
    return ((attendance.length / 10) * 100).toFixed(2);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Attendance</Text>
      <Text style={styles.subtitle}>Mark your attendance for each class</Text>

      {Array.from({ length: 10 }, (_, index) => (
        <View key={index + 1} style={styles.classCard}>
          <Text style={styles.classText}>Class {index + 1}</Text>
          <Text style={styles.subjectText}>Subject: Subject {index + 1}</Text>
          <TouchableOpacity
            style={[
              styles.attendanceButton,
              attendance.includes(index + 1) || currentClass !== index + 1
                ? styles.disabledButton
                : {},
            ]}
            disabled={attendance.includes(index + 1) || currentClass !== index + 1 || timer > 0}
            onPress={handleBiometricAuth}
          >
            <Text style={styles.attendanceButtonText}>
              {attendance.includes(index + 1) ? 'Marked' : 'Mark Attendance'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {timer > 0 && (
        <Text style={styles.timerText}>Next class available in {timer} seconds...</Text>
      )}

      <Text style={styles.percentageText}>
        Attendance Percentage: {calculateAttendancePercentage()}%
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  classCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    width: '100%',
  },
  classText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subjectText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  attendanceButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  attendanceButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 16,
    color: '#FF4C4C',
    marginTop: 20,
    textAlign: 'center',
  },
  percentageText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 30,
  },
});

export default AttendanceScreen;
