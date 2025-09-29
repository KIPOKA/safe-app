import React, { useRef, useEffect, useState } from "react";
import {
  StatusBar,
  Vibration,
  Animated,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MessageSquare } from "lucide-react-native";
import HeaderSection from "../../components/home/HeaderSection";
import EmergencyButton from "../../components/home/EmergencyButton";
import QuickActions from "../../components/home/QuickActions";
import EmergencyModal from "../../components/home/EmergencyModal";
import ChatBotModal from "../../components/home/ChatBotModal";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../../../tw";
import { getEmergencyDetails } from "../../api/Api";
import { getColorForType, getIconForType } from "../../utils/TextComponents";
export default function Home() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [modalVisible, setModalVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatBotVisible, setChatBotVisible] = useState(false);
  const [emergencyTypes, setEmergencyTypes] = useState([]);

  // Fetch emergencies from API on mount
  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const data = await getEmergencyDetails();
        // Map API data to match EmergencyModal expected format (add color/icon if needed)
        const mappedData = data.emergencyTypes.map((item, index) => ({
          type: item.name,
          icon: getIconForType(item.name),
          color: getColorForType(item.name),
          description: item.description,
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

  const handleSelectEmergency = (type) => {
    setModalVisible(false);
    setChatVisible(true);
    Vibration.vibrate([0, 200, 100, 200]);
    setTimeout(() => alert(`🚨 Emergency Alert Sent: ${type}!`), 500);
  };

  const handleChatPress = () => setChatBotVisible(true);

  return (
    <SafeAreaView style={tw`flex-1`}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
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
          {/* <QuickActions /> */}
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
          onSelect={handleSelectEmergency}
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
          onClose={() => setChatBotVisible(false)}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}
