import React, { useState } from "react";
import {
  Modal,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { MessageSquare, Send, Trash2 } from "lucide-react-native";
import tw from "../../../tw";

export default function ChatBotModal({
  visible = false,
  onClose = () => {},
  messages = [],
  setMessages = () => {},
  isTyping = false,
  renderMessage = () => null,
  renderTypingIndicator = () => null,
}) {
  // Local state for input
  const [inputText, setInputText] = useState("");

  // Handle sending a message
  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      user: { fullName: "You" }, // example user
    };
    setMessages([newMessage, ...messages]); // prepend to messages
    setInputText(""); // clear input
  };

  // Handle clearing chat
  const handleClearChat = () => {
    setMessages([]);
  };

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
              <View
                style={tw`w-10 h-10 rounded-full bg-blue-500 justify-center items-center mr-3`}
              >
                <MessageSquare size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={tw`text-lg font-bold text-slate-900`}>
                  Ubuntu Safe Assistant
                </Text>
                <Text style={tw`text-sm text-slate-400`}>
                  Always here to help
                </Text>
              </View>
            </View>

            <View style={tw`flex-row items-center`}>
              {/* Clear Chat */}
              <Pressable
                style={tw`w-8 h-8 rounded-full bg-slate-100 justify-center items-center mr-3`}
                onPress={handleClearChat}
              >
                <Trash2 size={18} color="#64748B" />
              </Pressable>

              {/* Close */}
              <Pressable
                style={tw`w-8 h-8 rounded-full bg-slate-100 justify-center items-center`}
                onPress={onClose}
              >
                <Text style={tw`text-slate-400 text-lg font-semibold`}>✕</Text>
              </Pressable>
            </View>
          </View>

          {/* Messages */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={
              renderMessage ||
              (({ item }) => (
                <View style={tw`p-3 my-1 bg-gray-100 rounded-lg mx-4`}>
                  <Text style={tw`text-slate-900 font-medium`}>
                    {item.user.fullName}:
                  </Text>
                  <Text style={tw`text-slate-700`}>{item.text}</Text>
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
              disabled={!inputText.trim()}
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
