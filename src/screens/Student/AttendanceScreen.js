import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import {Camera, CameraType} from 'react-native-camera-kit'; // Correct import for CameraKit
import axios from 'axios';
import RNFS from 'react-native-fs';

const AttendanceScreen = ({navigation}) => {
  const [attendance, setAttendance] = useState([]);
  const [currentClass, setCurrentClass] = useState(1);
  const [timer, setTimer] = useState(0);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);
  const rnBiometrics = new ReactNativeBiometrics();

  // Fetch Attendance data from the backend
  const fetchAttendance = async () => {
    const accessToken = await AsyncStorage.getItem('access_token');
    try {
      const response = await fetch(
        'https://smart-classroom-backend-2.onrender.com/get-attendance', // Backend endpoint to fetch attendance
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
        setAttendance(result.attendance);
      } else {
        console.error('Failed to fetch attendance', result.msg);
        setAttendance([]);
      }
    } catch (error) {
      console.error('Network error while fetching attendance', error);
      setAttendance([]);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Timer logic to increment class number after each class
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && attendance.includes(currentClass)) {
      setCurrentClass(prev => prev + 1);
    }
  }, [timer, attendance, currentClass]);

  // Request Camera Permission
  const requestPermission = async () => {
    const status = await Camera.requestCameraPermission(); // Using CameraKitCamera for permission
    if (status) {
      setCameraOpen(true);
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  // Handle Biometric Authentication
  const handleBiometricAuth = async () => {
    try {
      const {available, biometryType} = await rnBiometrics.isSensorAvailable();

      if (available) {
        let promptMessage = 'Confirm your identity to mark attendance';
        if (biometryType === 'Fingerprint') {
          promptMessage = 'Please place your finger to mark attendance';
        }

        const result = await rnBiometrics.simplePrompt({promptMessage});

        if (result.success) {
          captureImage(); // Proceed with image capture after successful authentication
        } else {
          Alert.alert('Error', 'Authentication failed or canceled.');
        }
      } else {
        Alert.alert('Error', 'Biometric authentication not available.');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred during biometric authentication.',
      );
    }
  };

  const captureImage = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.5}; // No base64
      const data = await cameraRef.current.capture(options);
      markAttendance(data.uri);

      if (data?.uri) {
        setCapturedImage(data.uri);
      } else {
        Alert.alert('Error', 'Failed to capture image.');
      }
    }
    console.log('adsfasd');
  };

  const markAttendance = async () => {
    const loggedInUser = await AsyncStorage.getItem('loggedInUser');
    const user = loggedInUser ? JSON.parse(loggedInUser) : null;

    if (!user || !user.username) {
      Alert.alert('Error', 'User not logged in.');
      return;
    }

    const class_number = currentClass;
    console.log('Username:', user.username); // Debug it!

    try {
      const response = await axios.post(
        'http://192.168.1.23:6777/mark-attendance',
        {username: user.username, class_number}, // Sending username along with class number
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const result = response.data;

      if (response.status === 200) {
        Alert.alert('Success', 'Attendance marked successfully!');
        setCameraOpen(false);
        fetchAttendance();
      } else {
        Alert.alert('Error', result.msg || 'Failed to mark attendance.');
        console.log(result);
        setCameraOpen(false);
        fetchAttendance();
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert('Error', 'Failed to mark attendance.');
    }
  };

  // Calculate Attendance Percentage
  const calculateAttendancePercentage = () => {
    return ((attendance.length / 10) * 100).toFixed(2);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Attendance</Text>
      <Text style={styles.subtitle}>
        Please confirm your identity and mark attendance
      </Text>

      {cameraOpen && (
        <Camera
          ref={cameraRef}
          style={styles.fullScreenCamera}
          cameraType={CameraType.Front} // Using front camera
          isActive={cameraOpen}
        />
      )}

      {/* Class list */}
      {Array.from({length: 10}, (_, index) => (
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
            disabled={
              attendance.includes(index + 1) ||
              currentClass !== index + 1 ||
              timer > 0
            }
            onPress={() => {
              setCameraOpen(true); // Open camera when marking attendance
              handleBiometricAuth(); // Trigger biometric authentication
            }}>
            <Text style={styles.attendanceButtonText}>
              {attendance.includes(index + 1) ? 'Marked' : 'Mark Attendance'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {timer > 0 && (
        <Text style={styles.timerText}>
          Next class available in {timer} seconds...
        </Text>
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
    shadowOffset: {width: 0, height: 2},
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
  fullScreenCamera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '123%',
    height: '53%',
    zIndex: 1,
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
