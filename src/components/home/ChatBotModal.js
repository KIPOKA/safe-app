import React from "react";
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
import { MessageSquare, Send } from "lucide-react-native";

export default function ChatBotModal({
  visible = false,
  onClose = () => {},
  messages = [],
  sendMessage = () => {},
  inputText = "",
  setInputText = () => {},
  isTyping = false,
  renderMessage = () => null,
  renderTypingIndicator = () => null,
}) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            marginTop: 60,
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: "#E2E8F0",
              backgroundColor: "#F8FAFC",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#3B82F6",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <MessageSquare size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text
                  style={{ fontSize: 18, fontWeight: "700", color: "#1E293B" }}
                >
                  Safety Assistant
                </Text>
                <Text style={{ fontSize: 14, color: "#64748B" }}>
                  Always here to help
                </Text>
              </View>
            </View>
            <Pressable
              onPress={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#F1F5F9",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#64748B", fontSize: 18, fontWeight: "600" }}
              >
                ✕
              </Text>
            </Pressable>
          </View>

          {/* Messages */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            inverted
            contentContainerStyle={{ paddingVertical: 16 }}
            style={{ flex: 1, backgroundColor: "#FFFFFF" }}
            keyboardDismissMode="on-drag"
            ListHeaderComponent={isTyping ? renderTypingIndicator : null}
          />

          {/* Input */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              padding: 16,
              borderTopWidth: 1,
              borderTopColor: "#E2E8F0",
              backgroundColor: "#F8FAFC",
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                borderRadius: 24,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginRight: 12,
                maxHeight: 120,
              }}
            >
              <TextInput
                style={{ fontSize: 16, color: "#1E293B", maxHeight: 100 }}
                placeholder="Type your message..."
                placeholderTextColor="#94A3B8"
                value={inputText || ""}
                onChangeText={setInputText}
                multiline
                returnKeyType="send"
                blurOnSubmit={false}
              />
            </View>
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!(inputText || "").trim()}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: (inputText || "").trim()
                  ? "#3B82F6"
                  : "#CBD5E1",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
