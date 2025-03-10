import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AppContext, User } from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const SignupScreen = ({ navigation }: any) => {
  const { setUser } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername || !trimmedEmail || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    if (trimmedUsername.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters long.');
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      Alert.alert('Error', 'Please enter a valid email.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    try {
      // Get stored users
      const storedUsersStr = await AsyncStorage.getItem('users');
      const users: User[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];

      // Check if username or email already exists
      if (users.some(u => u.username === trimmedUsername || u.email === trimmedEmail)) {
        Alert.alert('Error', 'Username or Email already exists.');
        return;
      }

      // Create new user
      const newUser: User = { username: trimmedUsername, email: trimmedEmail, password };

      // Save to AsyncStorage
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      setUser(newUser);

      Alert.alert('Success', 'Signup successful!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Error', 'Signup failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <CustomButton title="Sign Up" onPress={handleSignup} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress }) => (
  <TouchableOpacity style={styles.customButton} onPress={onPress}>
    <Text style={styles.customButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  linkText: { color: 'blue', textAlign: 'center', marginTop: 15 },
  customButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  customButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignupScreen;
