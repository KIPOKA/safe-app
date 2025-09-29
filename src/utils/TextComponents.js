import React from "react";
import { Text } from "react-native";
import tw from "../../tw";

export function Title({ children, style }) {
  return (
    <Text style={[tw`text-4xl font-bold text-blue-900 mb-2`, style]}>
      {children}
    </Text>
  );
}

export function Subtitle({ children, style }) {
  return (
    <Text style={[tw`text-base text-blue-900 mb-6`, style]}>{children}</Text>
  );
}

export function TitleTwo({ children, style }) {
  return (
    <Text style={[tw`text-4xl font-bold text-white mb-2 text-center`, style]}>
      {children}
    </Text>
  );
}

export function SubtitleTwo({ children, style }) {
  return (
    <Text style={[tw`text-base text-white mb-6 text-center`, style]}>
      {children}
    </Text>
  );
}

export function DisplayText({ children, style }) {
  return (
    <Text style={[tw`text-base text-black mb-6 text-center`, style]}>
      {children}
    </Text>
  );
}

// Helper functions to assign icon and color
export const getIconForType = (name) => {
  switch (name.toLowerCase()) {
    case "medical":
      return "🚑";
    case "police":
    case "crime":
      return "🚔";
    case "fire":
      return "🚒";
    case "accident":
      return "⚠️";
    case "natural disaster":
      return "🌪️";
    case "missing person":
      return "🕵️";
    case "hazardous material":
      return "☣️";
    case "animal attack":
      return "🐾";
    case "power outage":
      return "💡";
    default:
      return "❗";
  }
};

export const getColorForType = (name) => {
  switch (name.toLowerCase()) {
    case "medical":
      return "#EF4444";
    case "police":
    case "crime":
      return "#3B82F6";
    case "fire":
      return "#F59E0B";
    case "accident":
      return "#8B5CF6";
    case "natural disaster":
      return "#10B981";
    case "missing person":
      return "#F472B6";
    case "hazardous material":
      return "#FBBF24";
    case "animal attack":
      return "#8B5CF6";
    case "power outage":
      return "#64748B";
    default:
      return "#9CA3AF";
  }
};
