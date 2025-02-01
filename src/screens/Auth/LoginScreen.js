import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PopupAlert from '../../components/PopupAlert'; // Assuming PopupAlert component exists

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' });

  const handleLogin = async () => {
    const existingUsers = JSON.parse(await AsyncStorage.getItem('users')) || [];
    const user = existingUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      setAlert({ visible: true, type: 'error', message: 'Invalid username or password.' });
      return;
    }

    await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));

    setAlert({
      visible: true,
      type: 'success',
      message: `Welcome, ${user.username}! Redirecting to your dashboard...`,
    });

    setTimeout(() => {
      setAlert({ visible: false, type: '', message: '' });
      if (user.type === 'Teacher') {
        navigation.navigate('TeacherDashboard', { user });
      } else if (user.type === 'Student') {
        navigation.navigate('StudentDashboard', { user });
      } else if (user.type === 'Admin') {
        navigation.navigate('AdminDashboard', { user });
      }
    }, 2000);
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
          onClose={() => setAlert({ ...alert, visible: false })}
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
