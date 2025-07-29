import React from 'react';
import { Text } from 'react-native';
import tw from '../../tw';

export function Title({ children, style }) {
  return (
    <Text style={[tw`text-4xl font-bold text-blue-900 mb-2`, style]}>
      {children}
    </Text>
  );
}

 
 

export function Subtitle({ children, style }) {
  return (
    <Text style={[tw`text-base text-blue-900 mb-6`, style]}>
      {children}
    </Text>
  );
} 

export function TitleTwo({ children, style }) {
  return <Text style={[tw`text-4xl font-bold text-white mb-2 text-center`, style]}>{children}</Text>;
}

export function SubtitleTwo({ children, style }) {
  return <Text style={[tw`text-base text-white mb-6 text-center`, style]}>{children}</Text>;
}

export function DisplayText({ children, style }) {
  return <Text style={[tw`text-base text-black mb-6 text-center`, style]}>{children}</Text>;
}