import React, {useState, useEffect, useRef} from 'react';
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
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

const AttendanceScreen = ({navigation}) => {
  const [attendance, setAttendance] = useState([]);
  const [currentClass, setCurrentClass] = useState(1);
  const [timer, setTimer] = useState(0);
  const [cameraOpen, setCameraOpen] = useState(false);
  const cameraRef = useRef(null);
  const rnBiometrics = new ReactNativeBiometrics();
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('front');

  useEffect(() => {
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

  useEffect(() => {
    const getCameraPermission = async () => {
      const status = await Camera.requestCameraPermission();
    };

    getCameraPermission();
  }, []);

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
          markAttendance();
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

  // Mark Attendance in the system
  const markAttendance = async () => {
    const loggedInUser =
      JSON.parse(await AsyncStorage.getItem('loggedInUser')) || {};
    const username = loggedInUser.username;

    if (attendance.includes(currentClass)) {
      Alert.alert(
        'Already Marked',
        `Attendance for Class ${currentClass} is already marked.`,
      );
      return;
    }

    const updatedAttendance = [...attendance, currentClass];

    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const response = await fetch(
        'https://smart-classroom-backend-2.onrender.com/mark-attendance', // Backend endpoint to mark attendance
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({class_number: currentClass}),
        },
      );

      const result = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem(
          `attendance_${username}`,
          JSON.stringify(updatedAttendance),
        );
        setAttendance(updatedAttendance);
        Alert.alert('Success', 'Attendance marked successfully!');
        setCameraOpen(false); // Close camera after success
      } else {
        Alert.alert('Error', result.msg || 'Failed to mark attendance.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to mark attendance due to network error.');
    }
  };

  // Calculate Attendance Percentage
  const calculateAttendancePercentage = () => {
    return ((attendance.length / 10) * 100).toFixed(2);
  };

  // Handle camera permission and display
  if (device == null || !hasPermission) {
    return <Text>Loading Camera...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Attendance</Text>
      <Text style={styles.subtitle}>Mark your attendance for each class</Text>

      {cameraOpen && (
        <Camera
          ref={cameraRef}
          style={styles.fullScreenCamera} // Full screen camera
          device={device}
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
              handleBiometricAuth();
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
    width: '120%',
    height: '70%',
    zIndex: 100,
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
