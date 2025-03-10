import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AppContext, User } from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }: any) => {
  const { setUser } = useContext(AppContext);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  // Prompt the user for confirmation before clearing AsyncStorage
  const confirmClearAsyncStorage = () => {
    Alert.alert(
      'Clear Async Storage',
      'Are you sure you want to clear all stored data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'AsyncStorage cleared successfully.');
            } catch (error) {
              console.error('Error clearing AsyncStorage:', error);
              Alert.alert('Error', 'Failed to clear AsyncStorage.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleLogin = async () => {
    if (!usernameOrEmail || !password) {
      Alert.alert('Error', 'Please enter your credentials.');
      return;
    }

    try {
      // Get stored users
      const storedUsersStr = await AsyncStorage.getItem('users');
      const users: User[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];

      // Find user
      const foundUser = users.find(
        (u) =>
          (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
          u.password === password
      );

      if (foundUser) {
        setUser(foundUser);
        await AsyncStorage.setItem('user', JSON.stringify(foundUser));
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Invalid username/email or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Login failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username or Email"
        value={usernameOrEmail}
        onChangeText={setUsernameOrEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <CustomButton title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={confirmClearAsyncStorage}>
        <Text style={styles.clearText}>Clear Async Storage</Text>
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
  clearText: { color: 'red', textAlign: 'center', marginTop: 15 },
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

export default LoginScreen;
