import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Linking} from 'react-native';

const StartPresentation = ({navigation}) => {
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');

  const createMeeting = async () => {
    // Open Google Meet to create a new meeting
    const googleMeetLink = 'https://meet.google.com/new'; // Link to create a new Google Meet
    setMeetingLink(googleMeetLink); // Store the generated meeting link if needed (e.g., to share)

    try {
      // Open the Google Meet link in the default browser or app
      await Linking.openURL(googleMeetLink);
      setMeetingStarted(true); // Meeting is started
    } catch (error) {
      console.error('Error opening Google Meet link:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Display Meeting Link and Controls */}
      {meetingStarted && (
        <View style={styles.meetingInfo}>
          <Text style={styles.meetingLink}>
            Meeting Link: {meetingLink || 'Waiting for the meeting link...'}
          </Text>
        </View>
      )}

      {/* Create Room Button */}
      {!meetingStarted && (
        <TouchableOpacity style={styles.button} onPress={createMeeting}>
          <Text style={styles.buttonText}>Create Room</Text>
        </TouchableOpacity>
      )}

      {/* End Meeting Button */}
      {meetingStarted && (
        <TouchableOpacity
          style={styles.endButton}
          onPress={() => setMeetingStarted(false)}>
          <Text style={styles.controlText}>❌ End Meeting</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9fc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  meetingInfo: {marginBottom: 20},
  meetingLink: {color: '#007BFF', fontSize: 16, textAlign: 'center'},
  button: {
    backgroundColor: '#007BFF',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontSize: 18, fontWeight: '600'},
  endButton: {
    backgroundColor: 'red',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  controlText: {color: '#fff', fontSize: 16},
});

export default StartPresentation;
