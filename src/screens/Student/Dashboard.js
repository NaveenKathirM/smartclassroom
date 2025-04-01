import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const StudentDashboard = () => {
  const navigation = useNavigation();
  const [studyMaterials, setStudyMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      const storedMaterials = JSON.parse(await AsyncStorage.getItem('studyMaterials')) || [];
      setStudyMaterials(storedMaterials);
    };
    fetchMaterials();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('loggedInUser');
      Alert.alert('Logout Successful', 'You have been logged out.');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome, Student! 🎓</Text>
      <Text style={styles.subtitle}>Explore the available resources and tools:</Text>

      {/* Study Material Card */}
      <View style={styles.card}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' }} style={styles.icon} />
        <Text style={styles.cardTitle}>Study Materials</Text>
        <Text style={styles.cardDescription}>Access study materials shared by your teacher.</Text>
        <TouchableOpacity style={styles.cardButton} onPress={() => navigation.navigate('ViewStudyMaterials')}>
          <Text style={styles.cardButtonText}>View Materials</Text>
        </TouchableOpacity>
      </View>

      {/* Attendance Card */}
      <View style={styles.card}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png' }} style={styles.icon} />
        <Text style={styles.cardTitle}>Attendance</Text>
        <Text style={styles.cardDescription}>Check your attendance records and performance.</Text>
        <TouchableOpacity style={styles.cardButton} onPress={() => navigation.navigate('AttendanceScreen')}>
          <Text style={styles.cardButtonText}>Check Attendance</Text>
        </TouchableOpacity>
      </View>
          {/* View Timetable Card */}
          <View style={styles.card}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3197/3197480.png' }} style={styles.icon} />
        <Text style={styles.cardTitle}>Class Timetable</Text>
        <Text style={styles.cardDescription}>View your weekly class schedule.</Text>
        <TouchableOpacity style={styles.cardButton} onPress={() => navigation.navigate('ViewTimetable')}>
          <Text style={styles.cardButtonText}>View Timetable</Text>
        </TouchableOpacity>
      </View>
            {/* 📌 Join Presentation Card */}
            <View style={styles.card}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2904/2904069.png' }} style={styles.icon} />
        <Text style={styles.cardTitle}>Join Presentation</Text>
        <Text style={styles.cardDescription}>Join a live presentation by your teacher.</Text>
        <TouchableOpacity style={styles.cardButton} onPress={() => navigation.navigate('JoinPresentation')}>
          <Text style={styles.cardButtonText}>Join Now</Text>
        </TouchableOpacity>
      </View>
      {/* Quizzes Card */}
      <View style={styles.card}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1693/1693924.png' }} style={styles.icon} />
        <Text style={styles.cardTitle}>Quizzes</Text>
        <Text style={styles.cardDescription}>Attempt quizzes and view your results.</Text>
        <TouchableOpacity style={styles.cardButton} onPress={() => navigation.navigate('StudentQuizScreen')}>
          <Text style={styles.cardButtonText}>Take Quiz</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// 🔹 Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f7fa',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  cardButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginTop: 10,
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StudentDashboard;
