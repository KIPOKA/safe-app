import React from "react";
import { View, Text } from "react-native";
import { Shield, MapPin } from "lucide-react-native";
import tw from "../../../tw";

export default function HeaderSection() {
  return (
    <View style={tw`items-center mb-10`}>
      {/* Title */}
      <View style={tw`flex-row items-center mb-4`}>
        <Shield size={32} color="#3B82F6" style={tw`mr-3`} />
        <Text style={tw`text-white text-3xl font-extrabold tracking-tight`}>
          Ubuntu Safety
        </Text>
      </View>

      {/* Subtitle */}
      <Text
        style={tw`text-center text-lg text-slate-300 leading-7 font-medium`}
      >
        Emergency assistance at your fingertips
      </Text>

      {/* Status badges */}
      <View style={tw`flex-row mt-5 space-x-4`}>
        {/* Online Badge */}
        <View
          style={tw`flex-row items-center bg-green-200/20 px-3 py-1 rounded-lg border border-green-200/30`}
        >
          <View style={tw`w-2 h-2 bg-green-500 rounded-full mr-1.5`} />
          <Text style={tw`text-green-500 text-xs font-semibold`}>Online</Text>
        </View>

        {/* Located Badge */}
        <View
          style={tw`flex-row items-center bg-blue-200/20 px-3 py-1 rounded-lg border border-blue-200/30`}
        >
          <MapPin size={12} color="#3B82F6" style={tw`mr-1`} />
          <Text style={tw`text-blue-500 text-xs font-semibold`}>Located</Text>
        </View>
      </View>
    </View>
  );
}
