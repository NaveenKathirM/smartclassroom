import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';

const UploadStudyMaterial = ({navigation}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUploadMaterial = async () => {
    try {
      // Pick a PDF file using Document Picker
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf], // Allow only PDF files
      });

      if (result) {
        setSelectedFile(result);

        // Store file metadata (name and URI) in AsyncStorage
        const storedMaterials =
          JSON.parse(await AsyncStorage.getItem('studyMaterials')) || [];
        const newMaterial = {name: result.name, uri: result.uri};
        const updatedMaterials = [...storedMaterials, newMaterial];

        await AsyncStorage.setItem(
          'studyMaterials',
          JSON.stringify(updatedMaterials),
        );

        Alert.alert('Success', 'Study material uploaded successfully!');
        navigation.goBack(); // Go back to Teacher Dashboard
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled document picker');
      } else {
        console.error('Upload Error:', error);
        Alert.alert(
          'Error',
          'Failed to upload study material. Please try again.',
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Study Material 📚</Text>
      <Text style={styles.subtitle}>Upload PDFs for students to access.</Text>

      {selectedFile && (
        <View style={styles.fileContainer}>
          <Text style={styles.fileText}>📄 {selectedFile.name}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleUploadMaterial}>
        <Text style={styles.uploadButtonText}>Select & Upload PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

// 🔹 **Enhanced Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  fileContainer: {
    backgroundColor: '#e0f7fa',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  fileText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UploadStudyMaterial;
