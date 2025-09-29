import React from "react";
import { TouchableOpacity, Text, Animated, View } from "react-native";
import { AlertCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import tw from "../../../tw";

export default function EmergencyButton({ scaleAnim, pulseAnim, onPress }) {
  return (
    <View style={tw`justify-center items-center`}>
      <Animated.View
        style={[
          {
            transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
          },
          tw`mb-10`,
        ]}
      >
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          style={tw`w-60 h-60 rounded-full justify-center items-center shadow-lg`}
        >
          <LinearGradient
            colors={["#FEE2E2", "#FCA5A5", "#EF4444", "#DC2626"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={tw`w-full h-full rounded-full justify-center items-center border-4 border-red-200`}
          >
            <AlertCircle size={72} color="#FFFFFF" />
            <Text
              style={tw`text-white text-2xl font-black mt-2 tracking-wider`}
            >
              EMERGENCY
            </Text>
            <Text style={tw`text-white text-sm font-semibold mt-1 opacity-90`}>
              Tap for Help
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      <View style={tw`bg-white/10 rounded-2xl p-5 mb-8 border border-white/20`}>
        <Text
          style={tw`text-gray-200 text-base text-center leading-6 font-medium`}
        >
          Press the emergency button to instantly connect with local emergency
          services. Your location will be shared automatically.
        </Text>
      </View>
    </View>
  );
}
