// PopupAlert.js

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const PopupAlert = ({type, message, onClose}) => {
  const isError = type === 'error';
  return (
    <View
      style={[
        styles.container,
        isError ? styles.errorContainer : styles.successContainer,
      ]}>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    padding: 15,
    borderRadius: 8,
    minWidth: '80%',
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  successContainer: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  message: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  closeText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PopupAlert;
