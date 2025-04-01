import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';

const JoinPresentation = () => {
  // Predefined Google Meet link (you can change this or pass it from another screen)
  const meetingLink = 'https://meet.google.com/new'; // This creates a new meeting when clicked

  const joinMeeting = () => {
    // Check if the meeting link is valid (optional check)
    if (!meetingLink || !meetingLink.includes('https://meet.google.com')) {
      Alert.alert('Error', 'Invalid meeting link.');
      return;
    }

    // Open Google Meet
    Linking.openURL(meetingLink).catch(err => {
      console.error('Error opening Google Meet link:', err);
      Alert.alert('Error', 'Could not open the meeting link.');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎥 Join Live Presentation</Text>

      {/* Join Button */}
      <TouchableOpacity style={styles.joinButton} onPress={joinMeeting}>
        <Text style={styles.joinButtonText}>Join Now</Text>
      </TouchableOpacity>
    </View>
  );
};

// 🔹 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 20},
  joinButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  joinButtonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});

export default JoinPresentation;
