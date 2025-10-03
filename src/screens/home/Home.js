import React, { useRef, useEffect, useState } from "react";
import {
  StatusBar,
  Vibration,
  Animated,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import { MessageSquare } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  HeaderSection,
  EmergencyButton,
  EmergencyModal,
  ChatBotModal,
} from "../../components/home/index";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../../../tw";
import {
  getEmergencyDetails,
  createNotification,
  getUserByEmail,
} from "../../api/Api";
import { getColorForType, getIconForType } from "../../utils/TextComponents";

export default function Home({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [modalVisible, setModalVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatBotVisible, setChatBotVisible] = useState(false);
  const [emergencyTypes, setEmergencyTypes] = useState([]);
  const [location, setLocation] = useState(null);
  const [userId, setUserId] = useState(null);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  // NEW: Chat state
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  // Request location permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to send emergency alerts."
        );
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      const [address] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (address) {
        setCity(address.city || "");
        setCountry(address.country || "");
      }
    })();
  }, []);

  // Fetch user ID from session
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        if (!email) {
          Alert.alert("Error", "User session expired. Please login again.");
          navigation.replace("login");
          return;
        }

        const user = await getUserByEmail(email);
        if (!user?.id) {
          Alert.alert("Error", "Failed to get user ID");
          return;
        }
        setUserId(user.id);
      } catch (err) {
        console.error("Failed to fetch user ID:", err);
      }
    };

    fetchUserId();
  }, []);

  // Fetch emergencies from API
  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const data = await getEmergencyDetails();

        const mappedData = data.emergencyTypes.map((item) => ({
          id: item.emergency_id,
          type: item.name,
          description: item.description,
          icon: getIconForType(item.name),
          color: getColorForType(item.name),
        }));

        setEmergencyTypes(mappedData);
      } catch (error) {
        console.error("Failed to fetch emergencies:", error);
      }
    };

    fetchEmergencies();
  }, []);

  const handleAlertPress = () => {
    Vibration.vibrate([0, 100, 50, 100]);
    setModalVisible(true);
  };

  const handleSelectEmergency = async (emergencyType) => {
    const emergency = emergencyTypes.find((e) => e.type === emergencyType);

    if (!emergency) {
      Alert.alert("Error", "Selected emergency type is invalid.");
      return;
    }

    const emergencyId = emergency.id;
    const emergencyTypeName = emergency.type;

    if (!emergencyId || !emergencyTypeName) {
      Alert.alert("Error", "Selected emergency type is invalid.");
      return;
    }

    if (!location || !userId) {
      Alert.alert(
        "Data missing",
        "Cannot send alert without user ID or location."
      );
      return;
    }

    setModalVisible(false);
    setChatVisible(true);
    Vibration.vibrate([0, 200, 100, 200]);

    const payload = {
      fromUserId: userId,
      emergencyTypeId: emergencyId,
      latitude: location.latitude,
      longitude: location.longitude,
      city: city,
      country: country,
      description: `Emergency Alert: ${emergencyTypeName}`,
    };

    try {
      await createNotification(payload);
      Alert.alert(
        "Alert Sent",
        `🚨 Emergency Alert Sent: ${emergencyTypeName}!`
      );
    } catch (error) {
      console.error("❌ Error creating notification:", error);
      Alert.alert("Failed", "Failed to send emergency alert");
    }
  };

  const handleChatPress = () => setChatBotVisible(true);

  // NEW: handle sending chat message
  const handleSendMessage = (text) => {
    if (!text.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      text,
      user: { fullName: "You" },
    };
    setMessages([newMessage, ...messages]);
    setInputText("");
  };
  // Function to close chat modal
  const handleCloseChatModal = () => {
    setChatBotVisible(false);
  };

  return (
    <SafeAreaView style={tw`flex-1 mb-[-15px]`}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />{" "}
      <LinearGradient
        colors={["#0F172A", "#1E293B", "#334155"]}
        style={tw`flex-1`}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View
          style={tw`flex-1 justify-center items-center px-6 py-10`}
        >
          <HeaderSection />
          <EmergencyButton
            scaleAnim={scaleAnim}
            pulseAnim={pulseAnim}
            onPress={handleAlertPress}
          />
        </Animated.View>

        <EmergencyModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          emergencyTypes={emergencyTypes}
          onSelect={(emergency) => handleSelectEmergency(emergency)}
        />

        {chatVisible && (
          <TouchableOpacity
            style={tw`absolute bottom-10 right-5 bg-blue-500 w-16 h-16 rounded-full justify-center items-center shadow-lg`}
            onPress={handleChatPress}
          >
            <MessageSquare size={28} color="white" />
          </TouchableOpacity>
        )}

        <ChatBotModal
          visible={chatBotVisible}
          messages={messages}
          setMessages={setMessages}
          sendMessage={() => handleSendMessage(inputText)}
          onClose={handleCloseChatModal}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}
