import React from 'react';
import { TextInput, View, StyleSheet, Platform } from 'react-native';

export default function InputField({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
}) {
  return (
    <View
      className="w-full mb-4"
      style={Platform.OS !== 'web' ? styles.container : null}
    >
      <TextInput
        className="bg-white p-4 rounded-xl text-base text-black shadow-md"
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: 'black',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,  
  },
});
