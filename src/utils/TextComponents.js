import React from 'react';
import { Text, StyleSheet } from 'react-native';

export function Title({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}
export function TitleTwo({ children, style }) {
  return <Text style={[styles.titletwo, style]}>{children}</Text>;
}

export function Subtitle({ children, style }) {
  return <Text style={[styles.subtitle, style]}>{children}</Text>;
}
export function SubtitleTwo({ children, style }) {
  return <Text style={[styles.subtitletwo, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  titletwo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#1E40AF',
    marginBottom: 24,
  },
  subtitletwo: {
    fontSize: 16,
   color: '#ffffffff',
    marginBottom: 24,
  },
});
