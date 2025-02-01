import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AttendQuizScreen = ({ route, navigation }) => {
  const { quizIndex } = route.params;
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      const storedQuizzes = JSON.parse(await AsyncStorage.getItem('quizzes')) || [];
      const loggedInUser = JSON.parse(await AsyncStorage.getItem('loggedInUser'));

      setQuiz(storedQuizzes[quizIndex]);
      if (loggedInUser) {
        setStudentName(loggedInUser.name);
      }
    };

    fetchQuiz();
  }, [quizIndex]);

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== quiz.options.length) {
      Alert.alert('Error', 'Please answer all questions.');
      return;
    }

    const correctCount = quiz.options.reduce((count, option, index) => {
      if (answers[index] === quiz.correctAnswer) {
        return count + 1;
      }
      return count;
    }, 0);

    const percentage = ((correctCount / quiz.options.length) * 100).toFixed(2);
    Alert.alert('Quiz Completed', `You scored ${percentage}%`);

    const results = JSON.parse(await AsyncStorage.getItem('results')) || [];
    results.push({ studentName, percentage });
    await AsyncStorage.setItem('results', JSON.stringify(results));

    navigation.goBack();
  };

  if (!quiz) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quiz {quizIndex + 1}</Text>
      <Text style={styles.quizQuestion}>{quiz.question}</Text>

      {quiz.options.map((option, optIndex) => (
        <TouchableOpacity
          key={optIndex}
          style={[
            styles.option,
            answers[optIndex] === option ? styles.optionSelected : null,
          ]}
          onPress={() => setAnswers({ [optIndex]: option })}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
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
  quizQuestion: {
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: '#007BFF',
    backgroundColor: '#e6f3ff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AttendQuizScreen;
