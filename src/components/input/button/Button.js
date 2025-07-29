import React from 'react';
import { Pressable, Text } from 'react-native';
import tw from '../../../../tw';

export default function Button({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        tw`bg-blue-600 py-3 px-6 rounded-xl shadow-md items-center`,
        pressed && tw`opacity-70`,
        disabled && tw`bg-gray-400`,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[tw`text-white font-bold text-base`, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
}
