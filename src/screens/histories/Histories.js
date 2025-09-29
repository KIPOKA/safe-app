// screens/histories/Histories.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "../../../tw";
import { getUserByEmail } from "../../api/Api";

export default function Histories() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        if (!email) {
          Alert.alert("Session expired", "Please login again.");
          return;
        }

        const userData = await getUserByEmail(email);
        setNotifications(userData.notifications || []);
        console.log(notifications);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        Alert.alert(
          "Error",
          "Failed to load histories. Please check your connection."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const renderItem = ({ item }) => (
    <View
      style={tw`bg-white p-5 rounded-2xl shadow-lg mb-4 border border-gray-200`}
    >
      <Text style={tw`text-indigo-700 font-extrabold text-lg`}>
        {item.emergencyType?.name || "Notification"}
      </Text>
      <View style={tw`flex-row justify-between mt-1`}>
        <Text style={tw`text-gray-600 font-semibold`}>
          Status:{" "}
          <Text
            style={[
              tw`font-bold`,
              item.status?.name === "Resolved"
                ? tw`text-green-600`
                : item.status?.name === "Pending"
                ? tw`text-yellow-600`
                : tw`text-red-600`,
            ]}
          >
            {item.status?.name || "Pending"}
          </Text>
        </Text>
        <Text style={tw`text-gray-400 text-xs italic`}>
          {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
        </Text>
      </View>
      <Text style={tw`text-gray-700 mt-3 leading-relaxed`}>
        {item.message || "No message provided."}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View
        style={tw`flex-1 justify-center items-center bg-gradient-to-b from-indigo-600 to-indigo-800`}
      >
        <ActivityIndicator size="large" color="#E0E7FF" />
        <Text style={tw`text-indigo-200 mt-4 text-lg font-semibold`}>
          Loading Histories...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-indigo-700 px-6 pt-6`}>
      <Text style={tw`text-3xl font-extrabold text-white mb-6 tracking-wide`}>
        My Histories
      </Text>
      {notifications.length === 0 ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-indigo-200 text-center text-lg`}>
            No histories found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-10`}
        />
      )}
    </SafeAreaView>
  );
}
