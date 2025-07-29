import React from 'react';
import { TextInput, View } from 'react-native';
import tw from '../../../tw'; // adjust this path to where your `tw.js` is located

export default function InputField({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
}) {
  return (
    <View style={tw`w-full mb-4`}>
      <TextInput
        style={tw`bg-white p-4 rounded-xl text-base text-black shadow-md`}
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
