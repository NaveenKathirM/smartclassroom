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
import axios from 'axios';

const StudentQuizScreen = ({navigation}) => {
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [studentUsername, setStudentUsername] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        throw new Error('No token found');
      }

      try {
        const response = await axios.get(
          'https://smart-classroom-backend-2.onrender.com//get-quizzes',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setQuizzes(response.data);

        const loggedInUser = JSON.parse(
          await AsyncStorage.getItem('loggedInUser'),
        );
        if (loggedInUser) {
          setStudentUsername(loggedInUser.username); // Get the username
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleSelectOption = (quizIndex, option) => {
    setAnswers(prev => ({
      ...prev,
      [quizIndex]: option,
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== quizzes.length) {
      Alert.alert('Error', 'Please answer all questions.');
      return;
    }

    const correctCount = quizzes.reduce((count, quiz, index) => {
      if (answers[index] === quiz.correctAnswer) {
        return count + 1;
      }
      return count;
    }, 0);

    const percentage = ((correctCount / quizzes.length) * 100).toFixed(2);
    Alert.alert('Quiz Completed', `You scored ${percentage}%`);

    // Send the result to the backend for persistence
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.post(
        'https://smart-classroom-backend-2.onrender.com//save-quiz-result',
        {
          studentUsername,
          percentage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Alert.alert('Success', 'Your result has been saved.');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving result:', error);
      Alert.alert('Error', 'Failed to save result. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quiz</Text>
      {quizzes.map((quiz, index) => (
        <View key={index} style={styles.quizItem}>
          <Text style={styles.quizText}>
            {index + 1}. {quiz.question}
          </Text>
          {quiz.options.map((option, optIndex) => (
            <TouchableOpacity
              key={optIndex}
              style={[
                styles.option,
                answers[index] === option ? styles.optionSelected : null,
              ]}
              onPress={() => handleSelectOption(index, option)}>
              <View style={styles.radio}>
                {answers[index] === option && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  quizItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
  },
  quizText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  optionSelected: {
    borderColor: '#007BFF',
    backgroundColor: '#e6f3ff',
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
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
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StudentQuizScreen;
