// screens/settings/Settings.js
import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "../../../tw";
import { logoutUser, changePassword } from "../../api/Api";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  const navigation = useNavigation();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Change Password Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logoutUser();
            await AsyncStorage.multiRemove([
              "userToken",
              "userEmail",
              "userData",
            ]);
            navigation.replace("login");
          } catch (err) {
            console.error("Logout failed:", err);
            Alert.alert("Error", "Failed to log out. Try again.");
          }
        },
      },
    ]);
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const email = await AsyncStorage.getItem("userEmail");
      const response = await changePassword({
        email,
        oldPassword,
        newPassword,
      });
      Alert.alert("Success", response.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setModalVisible(false);
    } catch (err) {
      console.error("Change password failed:", err);
      Alert.alert("Error", err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const SettingItem = ({
    icon,
    label,
    value,
    onPress,
    isSwitch,
    switchValue,
    onSwitchChange,
    isDanger,
  }) => (
    <TouchableOpacity
      style={tw`flex-row items-center justify-between px-4 py-4 bg-white mb-2 rounded-xl shadow-sm`}
      onPress={onPress}
      activeOpacity={isSwitch ? 1 : 0.7}
      disabled={isSwitch}
    >
      <View style={tw`flex-row items-center flex-1`}>
        <View
          style={tw`w-10 h-10 rounded-full ${
            isDanger ? "bg-red-50" : "bg-blue-50"
          } items-center justify-center mr-3`}
        >
          <Ionicons
            name={icon}
            size={22}
            color={isDanger ? "#dc2626" : "#2563eb"}
          />
        </View>
        <Text
          style={tw`text-base ${
            isDanger ? "text-red-600" : "text-gray-800"
          } font-medium`}
        >
          {label}
        </Text>
      </View>

      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          thumbColor={switchValue ? "#2563eb" : "#f4f3f4"}
          trackColor={{ false: "#e5e7eb", true: "#93c5fd" }}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );

  const PasswordInput = ({
    placeholder,
    value,
    onChangeText,
    show,
    toggleShow,
  }) => (
    <View style={tw`mb-4`}>
      <View
        style={tw`flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50`}
      >
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#6b7280"
          style={tw`mr-3`}
        />
        <TextInput
          placeholder={placeholder}
          secureTextEntry={!show}
          value={value}
          onChangeText={onChangeText}
          style={tw`flex-1 text-base text-gray-800`}
          placeholderTextColor="#9ca3af"
        />
        <TouchableOpacity onPress={toggleShow} style={tw`ml-2`}>
          <Ionicons
            name={show ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#6b7280"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-5 py-6`}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-3xl font-bold text-gray-900 mb-1`}>
            Settings
          </Text>
          <Text style={tw`text-base text-gray-500`}>
            Manage your account and preferences
          </Text>
        </View>

        {/* Preferences Section */}
        <View style={tw`mb-6`}>
          <Text
            style={tw`text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1`}
          >
            Preferences
          </Text>
          <SettingItem
            icon="notifications-outline"
            label="Notifications"
            isSwitch
            switchValue={notificationsEnabled}
            onSwitchChange={setNotificationsEnabled}
          />
        </View>

        {/* Account Section */}
        <View style={tw`mb-6`}>
          <Text
            style={tw`text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1`}
          >
            Account
          </Text>
          <SettingItem
            icon="key-outline"
            label="Change Password"
            onPress={() => setModalVisible(true)}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            label="Privacy Settings"
            onPress={() =>
              Alert.alert("Privacy Settings", "Privacy settings flow goes here")
            }
          />
        </View>

        {/* Danger Zone */}
        <View style={tw`mb-8`}>
          <Text
            style={tw`text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1`}
          >
            Danger Zone
          </Text>
          <SettingItem
            icon="log-out-outline"
            label="Logout"
            onPress={handleLogout}
            isDanger
          />
        </View>

        {/* Change Password Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={tw`flex-1 justify-end bg-black/50`}>
            <View style={tw`bg-white rounded-t-3xl px-6 pt-6 pb-8 shadow-2xl`}>
              {/* Modal Header */}
              <View style={tw`flex-row items-center justify-between mb-6`}>
                <View style={tw`flex-row items-center`}>
                  <View
                    style={tw`w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-3`}
                  >
                    <Ionicons name="key" size={22} color="#2563eb" />
                  </View>
                  <Text style={tw`text-2xl font-bold text-gray-900`}>
                    Change Password
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  disabled={loading}
                  style={tw`w-8 h-8 items-center justify-center`}
                >
                  <Ionicons name="close" size={28} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Password Inputs */}
              <PasswordInput
                placeholder="Current Password"
                value={oldPassword}
                onChangeText={setOldPassword}
                show={showOldPassword}
                toggleShow={() => setShowOldPassword(!showOldPassword)}
              />
              <PasswordInput
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                show={showNewPassword}
                toggleShow={() => setShowNewPassword(!showNewPassword)}
              />
              <PasswordInput
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                show={showConfirmPassword}
                toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              {/* Action Buttons */}
              <View style={tw`flex-row gap-3 mt-2`}>
                <TouchableOpacity
                  style={tw`flex-1 px-6 py-4 rounded-xl bg-gray-100 items-center justify-center`}
                  onPress={() => setModalVisible(false)}
                  disabled={loading}
                >
                  <Text style={tw`text-base font-semibold text-gray-700`}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`flex-1 px-6 py-4 rounded-xl ${
                    loading ? "bg-blue-400" : "bg-blue-600"
                  } items-center justify-center flex-row`}
                  onPress={handleChangePassword}
                  disabled={loading}
                >
                  {loading && (
                    <ActivityIndicator
                      color="white"
                      size="small"
                      style={tw`mr-2`}
                    />
                  )}
                  <Text style={tw`text-base font-semibold text-white`}>
                    {loading ? "Updating..." : "Update Password"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
