import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminDashboard = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const storedUsers = JSON.parse(await AsyncStorage.getItem('users')) || [];
      const storedQuizzes = JSON.parse(await AsyncStorage.getItem('quizzes')) || [];
      const storedResults = JSON.parse(await AsyncStorage.getItem('results')) || [];
      setUsers(storedUsers);
      setQuizzes(storedQuizzes);
      setResults(storedResults);
    };

    fetchData();
  }, []);

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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Users</Text>
        {users.length > 0 ? (
          users.map((user, index) => (
            <Text key={index} style={styles.text}>
              {user.name} ({user.type})
            </Text>
          ))
        ) : (
          <Text style={styles.text}>No users available.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quizzes</Text>
        {quizzes.length > 0 ? (
          quizzes.map((quiz, index) => (
            <Text key={index} style={styles.text}>
              Quiz {index + 1}: {quiz.question}
            </Text>
          ))
        ) : (
          <Text style={styles.text}>No quizzes available.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Results</Text>
        {results.length > 0 ? (
          results.map((result, index) => (
            <Text key={index} style={styles.text}>
              {result.studentName}: {result.percentage}%
            </Text>
          ))
        ) : (
          <Text style={styles.text}>No results available.</Text>
        )}
      </View>

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
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
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
