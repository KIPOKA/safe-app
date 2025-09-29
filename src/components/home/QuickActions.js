import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Phone, MapPin, Clock } from "lucide-react-native";
import tw from "../../../tw";

export default function QuickActions() {
  const actions = [
    {
      icon: <Phone size={24} color="#3B82F6" />,
      label: "Call 911",
      bg: "bg-blue-200/50",
      border: "border-blue-200/60",
      color: "text-blue-500",
    },
    {
      icon: <MapPin size={24} color="#8B5CF6" />,
      label: "Share Location",
      bg: "bg-purple-200/50",
      border: "border-purple-200/60",
      color: "text-purple-500",
    },
    {
      icon: <Clock size={24} color="#22C55E" />,
      label: "History",
      bg: "bg-green-200/50",
      border: "border-green-200/60",
      color: "text-green-500",
    },
  ];

  return (
    <View style={tw`flex-row justify-around w-full gap-3`}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.label}
          style={tw`flex-1 ${action.bg} rounded-xl p-4 items-center border ${action.border}`}
        >
          {action.icon}
          <Text style={tw`mt-1 ${action.color} text-xs font-semibold`}>
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
