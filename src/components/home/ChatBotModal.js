import React, { useState } from "react";
import {
  Modal,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
} from "react-native";
import { Send, Trash2, ArrowLeft } from "lucide-react-native";
import tw from "../../../tw";
import { sendMessageToChatBot } from "../../api/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper function to format timestamp
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const msgTime = new Date(timestamp);
  const diff = Math.floor((now - msgTime) / 1000); // difference in seconds

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} day${
    Math.floor(diff / 86400) > 1 ? "s" : ""
  } ago`;
};

export default function ChatBotModal({
  visible = false,
  onClose = () => {},
  messages = [],
  setMessages = () => {},
  isTyping = false,
  renderMessage = null,
  renderTypingIndicator = null,
}) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      if (!email) return console.warn("User email not found");
      if (!inputText.trim()) return;

      const userMessage = {
        id: Date.now().toString(),
        text: inputText,
        timestamp: new Date().toISOString(), // Add timestamp
        user: { fullName: "You" },
      };

      setMessages([userMessage, ...messages]);
      setInputText("");
      setLoading(true);

      const result = await sendMessageToChatBot({
        message: userMessage.text,
        conversationHistory: messages,
        email,
      });

      if (result?.aiResponse) {
        const botMessage = {
          id: (Date.now() + 1).toString(),
          text: result.aiResponse,
          timestamp: new Date().toISOString(),
          user: { fullName: "Ubuntu Safe Assistant" },
        };
        setMessages([botMessage, userMessage, ...messages]);
      }
    } catch (error) {
      console.error("ChatBot error:", error);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your query.",
        timestamp: new Date().toISOString(),
        user: { fullName: "Ubuntu Safe Assistant" },
      };
      setMessages([botMessage, ...messages]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => setMessages([]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 bg-black/50`}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={tw`flex-1 mt-15 bg-white rounded-t-2xl`}
        >
          {/* Header */}
          <View
            style={tw`flex-row items-center justify-between p-5 border-b border-gray-300 bg-gray-100 rounded-t-2xl`}
          >
            <View style={tw`flex-row items-center`}>
              <Pressable
                style={tw`mr-3 p-2 rounded-full bg-red-400`}
                onPress={onClose}
              >
                <ArrowLeft size={20} color="white" />
              </Pressable>
              <View>
                <Text style={tw`text-lg font-bold text-slate-900`}>
                  Ubuntu Safe Assistant
                </Text>
                <Text style={tw`text-sm text-slate-400`}>
                  Always here to help
                </Text>
              </View>
            </View>
            <Pressable
              style={tw`w-8 h-8 rounded-full bg-slate-100 justify-center items-center`}
              onPress={handleClearChat}
            >
              <Trash2 size={18} color="#64748B" />
            </Pressable>
          </View>

          {/* Messages */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={
              renderMessage ||
              (({ item }) => (
                <View
                  style={tw`p-3 my-1 bg-gray-100 rounded-lg mx-4 max-w-[80%] self-start`}
                >
                  {/* Message text */}
                  <Text style={tw`text-slate-700`}>{item.text}</Text>
                  {/* Timestamp */}
                  <Text style={tw`text-xs text-gray-400 mt-1 self-end`}>
                    {formatTimeAgo(item.timestamp)}
                  </Text>
                </View>
              ))
            }
            inverted
            contentContainerStyle={tw`py-4`}
            style={tw`flex-1 bg-white`}
            keyboardDismissMode="on-drag"
            ListHeaderComponent={isTyping ? renderTypingIndicator : null}
          />

          {/* Input */}
          <View
            style={tw`flex-row items-end p-4 border-t border-gray-300 bg-gray-100`}
          >
            <View
              style={tw`flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 mr-3 max-h-30`}
            >
              <TextInput
                style={tw`text-base text-slate-900 max-h-25`}
                placeholder="Type your message..."
                placeholderTextColor={tw.color("slate-400")}
                value={inputText}
                onChangeText={setInputText}
                multiline
                returnKeyType="send"
                blurOnSubmit={false}
              />
            </View>
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim() || loading}
              style={tw.style(
                "w-12 h-12 rounded-full justify-center items-center",
                inputText.trim() ? "bg-blue-500" : "bg-slate-300"
              )}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
