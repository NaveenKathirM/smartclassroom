import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const QuizScreen = ({navigation}) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']); // Four options
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [quizzes, setQuizzes] = useState([]);

  const addQuiz = async () => {
    // Ensure no fields are empty
    if (
      !question.trim() ||
      options.some(opt => opt.trim() === '') ||
      !correctAnswer.trim()
    ) {
      Alert.alert(
        'Error',
        'Please fill in all fields and provide a correct answer.',
      );
      return;
    }

    // Ensure correctAnswer matches one of the provided options
    const correctOptionIndex = parseInt(correctAnswer.trim(), 10) - 1;
    if (
      isNaN(correctOptionIndex) ||
      correctOptionIndex < 0 ||
      correctOptionIndex >= options.length
    ) {
      Alert.alert(
        'Error',
        'Correct answer must match one of the options (e.g., 1, 2, 3, 4).',
      );
      return;
    }

    const newQuiz = {
      question: question.trim(),
      options: options.map(opt => opt.trim()),
      correctAnswer: correctOptionIndex + 1, // Send as an integer (1-based index)
    };

    try {
      // Get the token from AsyncStorage
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        throw new Error('No token found');
      }

      // Make API call to save the quiz
      await axios.post(
        'https://smart-classroom-backend-2.onrender.com//create-quiz',
        newQuiz,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Alert.alert('Success', 'Quiz added successfully!');
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
    } catch (error) {
      console.error('Error saving quiz:', error);
      Alert.alert('Error', 'Failed to add quiz. Please try again.');
    }
  };

  const fetchQuizzes = async () => {
    try {
      // Get the token from AsyncStorage
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        throw new Error('No token found');
      }

      // Fetch quizzes from the backend
      const response = await axios.get(
        'https://smart-classroom-backend-2.onrender.com//get-quizzes',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      Alert.alert('Error', 'Failed to fetch quizzes.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Multiple Choice Quiz</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Question"
        placeholderTextColor="#999"
        value={question}
        onChangeText={setQuestion}
      />
      {options.map((opt, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Option ${index + 1}`}
          placeholderTextColor="#999"
          value={opt}
          onChangeText={text => {
            const updatedOptions = [...options];
            updatedOptions[index] = text;
            setOptions(updatedOptions);
          }}
        />
      ))}
      <TextInput
        style={styles.input}
        placeholder="Correct Answer (e.g., 1 for Option 1)"
        placeholderTextColor="#999"
        value={correctAnswer}
        onChangeText={setCorrectAnswer}
      />
      <TouchableOpacity style={styles.addButton} onPress={addQuiz}>
        <Text style={styles.addButtonText}>Add Question</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={fetchQuizzes}>
        <Text style={styles.saveButtonText}>Fetch Quizzes</Text>
      </TouchableOpacity>

      <View style={styles.quizList}>
        {quizzes.map((quiz, index) => (
          <View key={index} style={styles.quizItem}>
            <Text style={styles.quizText}>
              {index + 1}. {quiz.question}
            </Text>
            {quiz.options.map((opt, i) => (
              <Text key={i} style={styles.optionText}>
                {i + 1}. {opt}
              </Text>
            ))}
            <Text style={styles.correctAnswerText}>
              Correct Answer: {quiz.correctAnswer}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Add styles for the page
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
  input: {
    height: 50,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#28A745',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizList: {
    marginTop: 20,
  },
  quizItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
  },
  quizText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  correctAnswerText: {
    fontSize: 14,
    color: '#28A745',
    fontWeight: 'bold',
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuizScreen;
