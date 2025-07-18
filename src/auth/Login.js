import { useState } from 'react';
import {
  Text,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import InputField from '../components/input/InputField';
import { Title , Subtitle} from '../utils/TextComponents';
import Button from '../components/input/button/Button';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }
    Alert.alert('Success', 'Logged in successfully!');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topContainer}>
        <Title>Welcome Back</Title>
        <Subtitle>Login to your account</Subtitle>
      </View>

      <View style={styles.bottomContainer}>
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
            title="Login"
            onPress={handleLogin}
            style={{ backgroundColor: '#2563EB' }}
            textStyle={{ fontSize: 18 }}
            /> 
        <Pressable onPress={() => navigation.navigate('register')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flex: 0.4,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 0.6,
    backgroundColor: '#1E40AF',
    paddingHorizontal: 24,
    paddingTop: 40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
 
  link: {
    color: '#BBDEFB',
    marginTop: 10,
    fontSize: 14,
  },
});
