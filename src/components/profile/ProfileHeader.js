import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "../../../tw";
import { Feather } from "@expo/vector-icons";

export default function ProfileHeader({
  fullName,
  onEditToggle,
  isEditing,
  onLogout,
}) {
  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <View style={tw`bg-gradient-to-r from-blue-600 to-blue-800 px-6 pt-4 pb-8`}>
      <View style={tw`flex-row justify-between items-center mb-6`}>
        <Text style={tw`text-2xl font-bold text-white`}>My Profile</Text>
        <View style={tw`flex-row gap-4`}>
          <TouchableOpacity
            onPress={onEditToggle}
            style={tw`bg-white/20 rounded-full p-2`}
          >
            <Feather name={isEditing ? "x" : "edit"} size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onLogout}
            style={tw`bg-red-500/20 rounded-full p-2`}
          >
            <Feather name="log-out" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={tw`items-center`}>
        <View
          style={tw`w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-3`}
        >
          <Text style={tw`text-2xl font-bold text-white`}>
            {getInitials(fullName || "User")}
          </Text>
        </View>
        <Text style={tw`text-xl font-bold text-white`}>
          {fullName || "User Name"}
        </Text>
      </View>
    </View>
  );
}
