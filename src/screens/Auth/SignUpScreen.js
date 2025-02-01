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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SignUpScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState(null);
  const [teacherCode, setTeacherCode] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [studentDetails, setStudentDetails] = useState({
    class: '',
    registerNumber: '',
    mobileNumber: '',
    address: '',
  });

  const [alert, setAlert] = useState({visible: false, type: '', message: ''});
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Teacher', value: 'Teacher'},
    {label: 'Student', value: 'Student'},
    {label: 'Admin', value: 'Admin'},
  ]);

  const handleSignUp = async () => {
    if (!name || !username || !password || !type) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

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

    if (type === 'Admin' && !/^admin00[1-9]|admin010$/.test(adminCode)) {
      Alert.alert('Error', 'Invalid Admin Code. Please try again.');
      return;
    }

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
      const existingUsers =
        JSON.parse(await AsyncStorage.getItem('users')) || [];
      await AsyncStorage.setItem(
        'users',
        JSON.stringify([...existingUsers, userData]),
      );
      Alert.alert('Success', 'Account created successfully!');
      setTimeout(() => navigation.navigate('Login'), 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
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

            {/* Password Input (Always Hidden with Asterisks) */}
            <View style={styles.passwordContainer}>
  <TextInput
    style={styles.passwordInput}
    placeholder="Password"
    placeholderTextColor="#999"
    // secureTextEntry={!showPassword} // Toggle visibility
    value={password}
    onChangeText={setPassword}
  />
  {/* <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconWrapper}>
    <Text style={{ fontSize: 20 }}>{showPassword ? '🔐' : '🔑'}</Text>
  </TouchableOpacity> */}
</View>
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

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ced6e0',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginBottom: 15,
    height: 52,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  iconWrapper: {
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
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
