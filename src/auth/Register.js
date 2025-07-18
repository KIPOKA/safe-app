import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import InputField from '../components/input/InputField';
import { SubtitleTwo, TitleTwo } from '../utils/TextComponents';
import Button from '../components/input/button/Button';
export default function Register({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    } 
    // Add your registration logic here (e.g., Firebase or API call)
    Alert.alert('Success', 'Account created successfully!');
    // navigation.replace('Login');
  };

  const handleLogin =() =>{
        navigation.navigate('login')
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
 
      <TitleTwo>Create Account</TitleTwo>
      <SubtitleTwo>Sign up to get started</SubtitleTwo> 

      <InputField
        placeholder="Full Name" 
        style={styles.input} 
        value={fullName}
        onChangeText={setFullName}
      />

      <InputField
        style={styles.input}
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <InputField
        style={styles.input}
        placeholder="Password" 
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title="Register"
        onPress={handleRegister}
        style={{ backgroundColor: '#2563EB' }}
        textStyle={{ fontSize: 18 }}
        />


      <Pressable onPress={handleLogin}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  }, 
  
  link: {
    color: '#BBDEFB',
    marginTop: 10,
    fontSize: 14,
  },
});
