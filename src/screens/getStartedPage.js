import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const GetStartedScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EngageSmart</Text>
      <Text style={styles.description}>
        Empowering you with smart solutions to stay connected and productive. Your journey begins here!
      </Text>
      <Image
        source={{ uri: 'https://via.placeholder.com/300x200.png?text=EngageSmart+Image' }}
        style={styles.image}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f9fafb' },
  title: { fontSize: 36, fontWeight: 'bold', color: '#007BFF', marginBottom: 20 },
  description: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 20 },
  image: { width: 300, height: 200, marginBottom: 20, borderRadius: 10 },
  button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 10, width: '80%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default GetStartedScreen;
