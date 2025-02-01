import React, { useState } from 'react';
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

const QuizScreen = ({ navigation }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']); // Four options
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [quizzes, setQuizzes] = useState([]);

  const addQuiz = () => {
    // Ensure no fields are empty
    if (!question.trim() || options.some((opt) => opt.trim() === '') || !correctAnswer.trim()) {
      Alert.alert('Error', 'Please fill in all fields and provide a correct answer.');
      return;
    }

    // Ensure correctAnswer matches one of the provided options
    const correctOptionIndex = parseInt(correctAnswer.trim(), 10) - 1;
    if (isNaN(correctOptionIndex) || correctOptionIndex < 0 || correctOptionIndex >= options.length) {
      Alert.alert('Error', 'Correct answer must match one of the options (e.g., 1, 2, 3, 4).');
      return;
    }

    const newQuiz = {
      question: question.trim(),
      options: options.map((opt) => opt.trim()),
      correctAnswer: options[correctOptionIndex],
    };

    setQuizzes((prev) => [...prev, newQuiz]);
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
  };

  const saveQuizzes = async () => {
    if (quizzes.length === 0) {
      Alert.alert('Error', 'No quizzes to save.');
      return;
    }

    try {
      await AsyncStorage.setItem('quizzes', JSON.stringify(quizzes));
      Alert.alert('Success', 'Quizzes saved successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save quizzes. Please try again.');
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
          onChangeText={(text) => {
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

      <TouchableOpacity style={styles.saveButton} onPress={saveQuizzes}>
        <Text style={styles.saveButtonText}>Save Quiz</Text>
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
    shadowOffset: { width: 0, height: 1 },
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
