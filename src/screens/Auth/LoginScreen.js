import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios'; // Axios for making HTTP requests
import AsyncStorage from '@react-native-async-storage/async-storage';
import PopupAlert from '../../components/PopupAlert';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({visible: false, type: '', message: ''});

  const handleLogin = async () => {
    // Basic validation
    if (!username || !password) {
      setAlert({
        visible: true,
        type: 'error',
        message: 'Please enter both username and password.',
      });
      return;
    }

    const userData = {
      username,
      password,
    };

    try {
      // Send login request to the backend
      const response = await axios.post(
        'http://192.168.1.11:6777/login',
        userData,
      ); // Replace with your local IP address or backend URL

      const {access_token, user, username: responseUsername} = response.data;

      // Store the logged-in user in AsyncStorage
      await AsyncStorage.setItem('access_token', access_token);
      await AsyncStorage.setItem(
        'loggedInUser',
        JSON.stringify({username: responseUsername, user}),
      );

      // Handle successful login based on user type
      setAlert({
        visible: true,
        type: 'success',
        message: `Welcome, ${responseUsername}! Redirecting to your dashboard...`,
      });

      setTimeout(() => {
        setAlert({visible: false, type: '', message: ''});
        if (user === 'Teacher') {
          navigation.navigate('TeacherDashboard');
        } else if (user === 'Student') {
          navigation.navigate('StudentDashboard');
        } else if (user === 'Admin') {
          navigation.navigate('AdminDashboard');
        }
      }, 2000);
    } catch (error) {
      setAlert({
        visible: true,
        type: 'error',
        message: error.response?.data?.msg || 'Invalid username or password.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Log in to your EngageSmart account</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
        Don't have an account? <Text style={styles.linkHighlight}>Sign Up</Text>
      </Text>

      {alert.visible && (
        <PopupAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({...alert, visible: false})}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  linkHighlight: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
