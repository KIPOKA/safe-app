import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function Button({ title, onPress, style, textStyle, disabled = false }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563EB', // blue
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    backgroundColor: '#a0aec0',
  },
  text: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
