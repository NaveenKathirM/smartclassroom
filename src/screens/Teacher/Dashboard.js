import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TeacherDashboard = ({navigation}) => {
  const [studyMaterials, setStudyMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      const storedMaterials =
        JSON.parse(await AsyncStorage.getItem('studyMaterials')) || [];
      setStudyMaterials(storedMaterials);
    };
    fetchMaterials();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome, Teacher! 👨‍🏫</Text>
      <Text style={styles.subtitle}>
        Manage your classroom effectively with these tools:
      </Text>
      {/* 📌 Attendance Card */}
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/3197/3197469.png',
          }}
          style={styles.icon}
        />
        <Text style={styles.cardTitle}>Attendance</Text>
        <Text style={styles.cardDescription}>
          Mark and manage student attendance easily.
        </Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate('TeacherAttendanceScreen')}>
          <Text style={styles.cardButtonText}>Go to Attendance</Text>
        </TouchableOpacity>
      </View>
      📌 Study Materials Upload Card (Navigates to Upload Page)
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991100.png',
          }}
          style={styles.icon}
        />
        <Text style={styles.cardTitle}>Upload Study Materials</Text>
        <Text style={styles.cardDescription}>
          Upload and share PDFs with students.
        </Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate('UploadStudyMaterial')}>
          <Text style={styles.cardButtonText}>Upload PDF</Text>
        </TouchableOpacity>
      </View>
      {/* 📌 Quizzes Card */}
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/3197/3197499.png',
          }}
          style={styles.icon}
        />
        <Text style={styles.cardTitle}>Quizzes</Text>
        <Text style={styles.cardDescription}>
          Create and manage in-class quizzes.
        </Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate('QuizScreen')}>
          <Text style={styles.cardButtonText}>Create Quiz</Text>
        </TouchableOpacity>
      </View>
      {/* 📌 Student List Card */}
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077113.png',
          }}
          style={styles.icon}
        />
        <Text style={styles.cardTitle}>Student List</Text>
        <Text style={styles.cardDescription}>
          View and manage your student list.
        </Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate('StudentList')}>
          <Text style={styles.cardButtonText}>View Students</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/3197/3197480.png',
          }}
          style={styles.icon}
        />
        <Text style={styles.cardTitle}>Manage Timetable</Text>
        <Text style={styles.cardDescription}>
          Analyze timetable and manage timetable.
        </Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate('ManageTimetable')}>
          <Text style={styles.cardButtonText}>Edit Timetable</Text>
        </TouchableOpacity>
      </View>
      {/* 📌 Start Presentation */}
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/2891/2891445.png',
          }}
          style={styles.icon}
        />
        <Text style={styles.cardTitle}>Start Presentation</Text>
        <Text style={styles.cardDescription}>
          Share your screen with students.
        </Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate('StartPresentation')}>
          <Text style={styles.cardButtonText}>Start Now</Text>
        </TouchableOpacity>
      </View>
      {/* 📌 View Analytics Card */}
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/5488/5488717.png',
          }}
          style={styles.icon}
        />
        <Text style={styles.cardTitle}>View Analytics</Text>
        <Text style={styles.cardDescription}>
          Analyze student performance based on quiz results.
        </Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate('Analytics')}>
          <Text style={styles.cardButtonText}>View Analytics</Text>
        </TouchableOpacity>
      </View>
      {/* 📌 Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await AsyncStorage.removeItem('loggedInUser');
          Alert.alert('Logout Successful', 'You have been logged out.');
          navigation.replace('Login');
        }}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// 🔹 Styles
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
    shadowOffset: {width: 0, height: 3},
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

export default TeacherDashboard;
