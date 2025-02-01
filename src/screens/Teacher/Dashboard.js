import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TeacherDashboard = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('loggedInUser'); // Remove logged-in user data
      Alert.alert('Logout Successful', 'You have been logged out.');
      navigation.replace('Login'); // Navigate back to the Login screen
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome, Teacher!</Text>
      <Text style={styles.subtitle}>Manage your classroom effectively with these tools:</Text>

      {/* Attendance Card */}
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3197/3197469.png' }} // Card Checklist Icon
          style={styles.icon}
        />
        <Text style={styles.cardTitle}>Attendance</Text>
        <Text style={styles.cardDescription}>
          Mark and manage student attendance easily.
        </Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate('TeacherAttendanceScreen')}
        >
          <Text style={styles.cardButtonText}>Go to Attendance</Text>
        </TouchableOpacity>
      </View>

      {/* Presentations Card */}
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/609/609823.png' }} // Screen Presentation Icon
          style={styles.icon}
        />
        <Text style={styles.cardTitle}>Presentations</Text>
        <Text style={styles.cardDescription}>
          Share your screen or presentations with the class.
        </Text>
        <TouchableOpacity style={styles.cardButton}>
          <Text style={styles.cardButtonText}>Share Screen</Text>
        </TouchableOpacity>
      </View>

      {/* Quizzes Card */}
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3197/3197499.png' }} // Question Circle Icon
          style={styles.icon}
        />
        <Text style={styles.cardTitle}>Quizzes</Text>
        <Text style={styles.cardDescription}>
          Create and manage in-class quizzes.
        </Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate('QuizScreen')}
        >
          <Text style={styles.cardButtonText}>Create Quiz</Text>
        </TouchableOpacity>
      </View>

      {/* Student List Card */}
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077113.png' }} // Person Lines Fill Icon
          style={styles.icon}
        />
        <Text style={styles.cardTitle}>Student List</Text>
        <Text style={styles.cardDescription}>
          View and manage your student list and attendance.
        </Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate('StudentList')}
        >
          <Text style={styles.cardButtonText}>View Students</Text>
        </TouchableOpacity>
      </View>

      {/* View Analytics Card */}
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5488/5488717.png' }} // Graph Up Icon
          style={styles.icon}
        />
        <Text style={styles.cardTitle}>View Analytics</Text>
        <Text style={styles.cardDescription}>
          Analyze student performance based on quiz results.
        </Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate('Analytics')}
        >
          <Text style={styles.cardButtonText}>View Analytics</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
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
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 16,
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

export default TeacherDashboard;
