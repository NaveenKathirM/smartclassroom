import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator, // Import ActivityIndicator for the loader
} from 'react-native';
import axios from 'axios'; // Make sure axios is installed
import DropDownPicker from 'react-native-dropdown-picker';

const SignUpScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState(null);
  const [teacherCode, setTeacherCode] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [studentDetails, setStudentDetails] = useState({
    class: '',
    registerNumber: '',
    mobileNumber: '',
    address: '',
  });

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Teacher', value: 'Teacher'},
    {label: 'Student', value: 'Student'},
    {label: 'Admin', value: 'Admin'},
  ]);

  const [loading, setLoading] = useState(false); // State for loading

  const handleSignUp = async () => {
    // Basic Validation
    if (!name || !username || !password || !type) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    // Teacher Code Validation
    if (
      type === 'Teacher' &&
      !/^teacher00[1-9]|teacher010$/.test(teacherCode)
    ) {
      Alert.alert(
        'Error',
        'Invalid Teacher Code. Use teacher001 to teacher010.',
      );
      return;
    }

    // Admin Code Validation
    if (type === 'Admin' && !/^admin00[1-9]|admin010$/.test(adminCode)) {
      Alert.alert('Error', 'Invalid Admin Code. Please try again.');
      return;
    }

    // Student Details Validation
    if (type === 'Student') {
      const {
        class: studentClass,
        registerNumber,
        mobileNumber,
        address,
      } = studentDetails;
      if (!studentClass || !registerNumber || !mobileNumber || !address) {
        Alert.alert('Error', 'All student details are required.');
        return;
      }
    }

    const userData = {
      name,
      username,
      password,
      type,
      ...(type === 'Student' ? studentDetails : {}),
    };

    try {
      setLoading(true); // Start loading when the request begins
      // Use your local IP address (for real device testing)
      const response = await axios.post(
        'https://smart-classroom-backend-2.onrender.com//signup',
        userData,
      ); // Replace with your local IP address

      Alert.alert('Success', response.data.msg);
      setTimeout(() => navigation.navigate('Login'), 2000);
    } catch (error) {
      console.error('Error:', error); // Log the error for debugging
      Alert.alert(
        'Error',
        error.response?.data?.msg ||
          'Failed to create account. Please try again.',
      );
    } finally {
      setLoading(false); // Stop loading after the request is complete
    }
  };

  const handleStudentDetailChange = (key, value) => {
    setStudentDetails(prev => ({...prev, [key]: value}));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <FlatList
        data={[1]} // Dummy data for proper rendering
        renderItem={() => (
          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>
              Join EngageSmart and start your journey today!
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* Role Selection Dropdown */}
            <DropDownPicker
              open={open}
              value={type}
              items={items}
              setOpen={setOpen}
              setValue={setType}
              setItems={setItems}
              placeholder="Select Role"
              placeholderStyle={{color: '#999'}}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />

            {type === 'Teacher' && (
              <TextInput
                style={styles.input}
                placeholder="Enter Teacher Code"
                placeholderTextColor="#999"
                value={teacherCode}
                onChangeText={setTeacherCode}
              />
            )}

            {type === 'Admin' && (
              <TextInput
                style={styles.input}
                placeholder="Enter Admin Code"
                placeholderTextColor="#999"
                value={adminCode}
                onChangeText={setAdminCode}
              />
            )}

            {type === 'Student' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Class"
                  placeholderTextColor="#999"
                  value={studentDetails.class}
                  onChangeText={value =>
                    handleStudentDetailChange('class', value)
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Register Number"
                  placeholderTextColor="#999"
                  value={studentDetails.registerNumber}
                  onChangeText={value =>
                    handleStudentDetailChange('registerNumber', value)
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  value={studentDetails.mobileNumber}
                  onChangeText={value =>
                    handleStudentDetailChange('mobileNumber', value)
                  }
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Address"
                  placeholderTextColor="#999"
                  multiline
                  value={studentDetails.address}
                  onChangeText={value =>
                    handleStudentDetailChange('address', value)
                  }
                />
              </>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSignUp}
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" /> // Show loader when loading
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f4f7f8'},
  scrollContainer: {flexGrow: 1, justifyContent: 'center', padding: 20},
  formContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 6,
    elevation: 5,
  },
  input: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ced6e0',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {height: 100, textAlignVertical: 'top', paddingTop: 10},
  dropdown: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ced6e0',
    borderRadius: 10,
    height: 50,
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  dropdownContainer: {borderWidth: 1, borderColor: '#ced6e0', borderRadius: 10},
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default SignUpScreen;
