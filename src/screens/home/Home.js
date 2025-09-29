import React, { useRef, useState } from "react";
import { StatusBar, Vibration, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import tw from "../../../tw";
import Alarm from "../../../assets/alarm.mp3";
import HeaderSection from "../../components/home/HeaderSection";
import EmergencyButton from "../../components/home/EmergencyButton";
import QuickActions from "../../components/home/QuickActions";
import EmergencyModal from "../../components/home/EmergencyModal";
import ChatBotModal from "../../components/home/ChatBotModal";

export default function Home() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [modalVisible, setModalVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatBotVisible, setChatBotVisible] = useState(false);
  const [sound, setSound] = useState(null);

  const emergencyTypes = [
    {
      type: "Medical Emergency",
      icon: "🚑",
      color: "#EF4444",
      description: "Ambulance & Medical Care",
    },
    {
      type: "Police Assistance",
      icon: "🚔",
      color: "#3B82F6",
      description: "Law Enforcement Help",
    },
    {
      type: "Fire Emergency",
      icon: "🚒",
      color: "#F59E0B",
      description: "Fire Department Response",
    },
    {
      type: "General Emergency",
      icon: "⚠️",
      color: "#8B5CF6",
      description: "Other Emergency Services",
    },
  ];

  const handleAlertPress = async () => {
    // Vibrate the phone
    Vibration.vibrate([0, 100, 50, 100]);

    // Play emergency ringtone
    const { sound } = await Audio.Sound.createAsync(
      require("../../../assets/alarm.mp3"),
      {
        shouldPlay: true,
        isLooping: true,
      }
    );
    setSound(sound);

    // Show modal
    setModalVisible(true);
  };

  const handleSelectEmergency = (type) => {
    setModalVisible(false);
    setChatVisible(true);
    Vibration.vibrate([0, 200, 100, 200]);
    setTimeout(() => alert(`🚨 Emergency Alert Sent: ${type}!`), 500);

    // Stop the ringtone when emergency is selected
    if (sound) {
      sound.stopAsync();
    }
  };

  const handleChatPress = () => {
    setChatBotVisible(true);
  };

  // Clean up sound when component unmounts
  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <SafeAreaView style={tw`flex-1`}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <Animated.View style={tw`flex-1 justify-center items-center px-6 py-10`}>
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
        onSelect={handleSelectEmergency}
      />

      {chatVisible && !chatBotVisible && (
        <ChatBotModal
          scaleAnim={scaleAnim}
          pulseAnim={pulseAnim}
          onPress={handleChatPress}
        />
      )}

      <ChatBotModal
        visible={chatBotVisible}
        onClose={() => setChatBotVisible(false)}
      />
      <QuickActions />
    </SafeAreaView>
  );
}
