import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminDashboard = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);

  // Function to fetch users, quizzes, and results
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');

        // Fetching users
        const usersResponse = await fetch(
          'https://smart-classroom-backend-2.onrender.com/students',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Fetching quizzes
        const quizzesResponse = await fetch(
          'https://smart-classroom-backend-2.onrender.com/get-quizzes',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const quizzesData = await quizzesResponse.json();
        setQuizzes(quizzesData);

        // Fetching results
        const resultsResponse = await fetch(
          'https://smart-classroom-backend-2.onrender.com/get-quiz-results',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const resultsData = await resultsResponse.json();
        setResults(resultsData);
      } catch (error) {
        console.error('Error fetching data: ', error);
        Alert.alert('Error', 'There was an error fetching the data.');
      }
    };

    fetchData();
  }, []);

  // Function to clear all data
  const clearAllData = async () => {
    await AsyncStorage.clear();
    Alert.alert('Success', 'All data has been cleared.');
    setUsers([]);
    setQuizzes([]);
    setResults([]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      {/* Display Users */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Users</Text>
        {users.length > 0 ? (
          users.map((user, index) => (
            <View key={index} style={styles.userCard}>
              <Text style={[styles.text, styles.bold]}>
                Username: {user.username}
              </Text>
              <Text style={[styles.text, styles.bold]}>Name: {user.name}</Text>
              <Text style={[styles.text, styles.bold]}>
                Class: {user.class}
              </Text>
              <Text style={[styles.text, styles.bold]}>
                Register No: {user.registerNumber}
              </Text>
              <Text style={[styles.text, styles.bold]}>
                Mobile: {user.mobileNumber}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No users available.</Text>
        )}
      </View>

      {/* Display Quizzes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quizzes</Text>
        {quizzes.length > 0 ? (
          quizzes.map((quiz, index) => (
            <View key={index} style={styles.quizCard}>
              <Text style={[styles.text, styles.bold]}>
                Question: {quiz.question}
              </Text>
              <Text style={[styles.text, styles.bold]}>Options:</Text>
              {quiz.options.map((option, i) => (
                <Text key={i} style={styles.text}>
                  Option {i + 1}: {option}
                </Text>
              ))}
              <Text style={[styles.text, styles.bold]}>
                Correct Answer: {quiz.correctAnswer}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No quizzes available.</Text>
        )}
      </View>

      {/* Display Results */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Results</Text>
        {results.length > 0 ? (
          results.map((result, index) => (
            <View key={index} style={styles.resultCard}>
              <Text style={[styles.text, styles.bold]}>
                Student: {result.studentUsername}
              </Text>
              <Text style={[styles.text, styles.bold]}>
                Percentage: {result.percentage}%
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No results available.</Text>
        )}
      </View>

      {/* Button to clear all data */}
      <TouchableOpacity style={styles.button} onPress={clearAllData}>
        <Text style={styles.buttonText}>Clear All Data</Text>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
  },
  userCard: {
    marginBottom: 10,
  },
  quizCard: {
    marginBottom: 15,
  },
  resultCard: {
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminDashboard;
