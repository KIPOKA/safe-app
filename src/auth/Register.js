import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import InputField from '../components/input/InputField';
import { SubtitleTwo, TitleTwo } from '../utils/TextComponents';
import Button from '../components/input/button/Button';
import tw from '../../tw';

export default function Register({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    Alert.alert('Success', 'Account created successfully!');
    // navigation.replace('Login');
  };

  const handleLogin = () => {
    navigation.navigate('login');
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-blue-900 justify-center items-center px-6`}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={tw`w-full`}>
        <TitleTwo>Create Account</TitleTwo>
        <SubtitleTwo>Sign up to get started</SubtitleTwo>

        <InputField
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        <InputField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title="Register"
          onPress={handleRegister}
          style={tw`bg-blue-600`}
          textStyle={tw`text-white text-lg`}
        />

        <Pressable onPress={handleLogin} style={tw `items-center`}>
          <Text style={tw`text-white mt-4 text-sm`}>
            Already have an account? <Text style={tw `underline`}>Login</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
