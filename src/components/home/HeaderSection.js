import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { Shield, MapPin } from "lucide-react-native";
import * as Location from "expo-location";
import NetInfo from "@react-native-community/netinfo";
import tw from "../../../tw";

export default function HeaderSection() {
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Subscribe to network status changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Request location permission and get location
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is required.");
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
    })();
  }, []);

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
      <View style={tw`flex-row mt-5`}>
        {/* Online Badge */}
        <View
          style={[
            tw`flex-row items-center px-3 py-1 rounded-lg border mr-4`,
            isOnline
              ? tw`bg-green-200/20 border-green-200/30`
              : tw`bg-red-200/20 border-red-200/30`,
          ]}
        >
          <View
            style={[
              tw`w-2 h-2 rounded-full mr-1.5`,
              { backgroundColor: isOnline ? "#22C55E" : "#EF4444" },
            ]}
          />
          <Text
            style={[
              tw`text-xs font-semibold`,
              { color: isOnline ? "#22C55E" : "#EF4444" },
            ]}
          >
            {isOnline ? "Online" : "Offline"}
          </Text>
        </View>

        {/* Located Badge */}
        <View
          style={[
            tw`flex-row items-center px-3 py-1 rounded-lg border`,
            location
              ? tw`bg-blue-200/20 border-blue-200/30`
              : tw`bg-gray-200/20 border-gray-200/30`,
          ]}
        >
          <MapPin
            size={12}
            color={location ? "#3B82F6" : "#9CA3AF"}
            style={tw`mr-1`}
          />
          <Text
            style={[
              tw`text-xs font-semibold`,
              { color: location ? "#3B82F6" : "#9CA3AF" },
            ]}
          >
            {location ? "Located" : "Locating..."}
          </Text>
        </View>
      </View>
    </View>
  );
}
