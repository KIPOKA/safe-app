// screens/histories/Histories.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "../../../tw";
import { getNotificationsByEmail } from "../../api/Api";
import { SafeAreaView } from "react-native-safe-area-context";
import { getIconForType, getColorForType } from "../../utils/TextComponents";

export default function Histories() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchNotifications = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");

      if (!email) {
        Alert.alert("Session expired", "Please login again.");
        return;
      }

      const response = await getNotificationsByEmail(email);
      const notifs = response.notifications || [];
      setNotifications(notifs);
      setFilteredNotifications(notifs);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      Alert.alert(
        "Error",
        "Failed to load histories. Please check your connection."
      );
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications(selectedFilter);
  }, [selectedFilter, notifications]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  const filterNotifications = (filter) => {
    if (filter === "All") {
      setFilteredNotifications(notifications);
    } else {
      const filtered = notifications.filter(
        (item) => item.status?.name === filter
      );
      setFilteredNotifications(filtered);
    }
  };

  const getStatusColor = (statusName) => {
    switch (statusName?.toLowerCase()) {
      case "resolved":
      case "completed":
        return { bg: "#10B981", light: "#D1FAE5", text: "#065F46", icon: "✓" };

      case "pending":
        return { bg: "#F59E0B", light: "#FEF3C7", text: "#92400E", icon: "⏳" };

      case "read":
      case "in progress":
        return { bg: "#3B82F6", light: "#DBEAFE", text: "#1E40AF", icon: "👁" };

      case "active":
      case "emergency":
        return { bg: "#EF4444", light: "#FEE2E2", text: "#991B1B", icon: "🚨" };

      case "dismissed":
        return { bg: "#9CA3AF", light: "#E5E7EB", text: "#374151", icon: "✖" };

      default:
        return { bg: "#6B7280", light: "#F3F4F6", text: "#1F2937", icon: "•" };
    }
  };

  // Removed old getEmergencyIcon function

  const handleCallContact = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const openLocationMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filters = ["All", "Pending", "Read", "Resolved", "Dismissed"];

  const openDetailModal = (item) => {
    setSelectedNotification(item);
    setModalVisible(true);
  };

  const renderFilterChip = (filter) => {
    const isSelected = selectedFilter === filter;
    const count =
      filter === "All"
        ? notifications.length
        : notifications.filter((n) => n.status?.name === filter).length;

    return (
      <TouchableOpacity
        key={filter}
        onPress={() => setSelectedFilter(filter)}
        style={tw`mr-2 mb-2 px-4 py-2 rounded-full flex-row items-center ${
          isSelected ? "bg-white shadow-lg" : "bg-indigo-500"
        }`}
      >
        <Text
          style={tw`font-semibold ${
            isSelected ? "text-indigo-700" : "text-white"
          }`}
        >
          {filter}
        </Text>
        {count > 0 && (
          <View
            style={tw`ml-2 px-2 py-0.5 rounded-full ${
              isSelected ? "bg-indigo-600" : "bg-indigo-700"
            }`}
          >
            <Text style={tw`text-white text-xs font-bold`}>{count}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderCompactItem = ({ item }) => {
    const statusColors = getStatusColor(item.status?.name);
    const emergencyIcon = getIconForType(item.emergencyType?.name || "");
    const emergencyColor = getColorForType(item.emergencyType?.name || "");

    return (
      <TouchableOpacity
        onPress={() => openDetailModal(item)}
        style={tw`bg-white rounded-2xl shadow-md mb-3 overflow-hidden active:opacity-70`}
      >
        {/* Status Bar */}
        <View style={[tw`h-1.5`, { backgroundColor: statusColors.bg }]} />

        <View style={tw`p-4`}>
          {/* Header Row */}
          <View style={tw`flex-row justify-between items-start mb-2`}>
            <View style={tw`flex-1 flex-row items-center`}>
              <Text style={[tw`text-3xl mr-2`, { color: emergencyColor }]}>
                {emergencyIcon}
              </Text>
              <View style={tw`flex-1`}>
                <Text
                  style={tw`text-gray-900 font-bold text-lg`}
                  numberOfLines={1}
                >
                  {item.emergencyType?.name || "Emergency"}
                </Text>
                <Text style={tw`text-gray-500 text-xs mt-0.5`}>
                  {getTimeAgo(item.createdAt)}
                </Text>
              </View>
            </View>
            <View
              style={[
                tw`px-3 py-1 rounded-full`,
                { backgroundColor: statusColors.light },
              ]}
            >
              <Text
                style={[tw`text-xs font-bold`, { color: statusColors.text }]}
              >
                {statusColors.icon} {item.status?.name}
              </Text>
            </View>
          </View>

          {/* Quick Info */}
          <View style={tw`flex-row items-center mb-2`}>
            <View style={tw`flex-row items-center flex-1`}>
              <Text style={tw`text-gray-600 text-sm`}>
                👤 {item.user?.fullName}
              </Text>
            </View>
            {item.user?.bloodType && (
              <View style={tw`bg-red-50 px-2 py-1 rounded-lg`}>
                <Text style={tw`text-red-700 font-bold text-xs`}>
                  🩸 {item.user.bloodType.type}
                </Text>
              </View>
            )}
          </View>

          {/* Location */}
          {item.location && (
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-gray-500 text-sm`} numberOfLines={1}>
                📍 {item.location.city}, {item.location.country}
              </Text>
            </View>
          )}

          {/* Allergies Warning */}
          {item.user?.allergies && item.user.allergies !== "No" && (
            <View
              style={tw`mt-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200`}
            >
              <Text style={tw`text-red-700 font-semibold text-xs`}>
                ⚠️ Allergies: {item.user.allergies}
              </Text>
            </View>
          )}

          {/* Tap to view hint */}
          <View style={tw`mt-2 pt-2 border-t border-gray-100`}>
            <Text style={tw`text-gray-400 text-xs text-center`}>
              Tap to view full details →
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetailModal = () => {
    if (!selectedNotification) return null;
    const item = selectedNotification;
    const statusColors = getStatusColor(item.status?.name);
    const emergencyIcon = getIconForType(item.emergencyType?.name || "");
    const emergencyColor = getColorForType(item.emergencyType?.name || "");

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 bg-black bg-opacity-50`}>
          <View style={tw`flex-1 mt-20 bg-white rounded-t-3xl shadow-2xl`}>
            {/* Modal Header */}
            <View style={[tw`p-5`, { backgroundColor: statusColors.bg }]}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={tw`absolute right-5 top-5 bg-white rounded-full p-2 z-10`}
              >
                <Text style={tw`text-gray-700 font-bold text-lg`}>✕</Text>
              </TouchableOpacity>

              <View style={tw`flex-row items-center`}>
                <Text style={[tw`text-5xl mr-3`, { color: emergencyColor }]}>
                  {emergencyIcon}
                </Text>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-white font-bold text-2xl`}>
                    {item.emergencyType?.name}
                  </Text>
                  <Text style={tw`text-white text-sm opacity-90 mt-1`}>
                    {new Date(item.createdAt).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>

              {item.emergencyType?.description && (
                <Text style={tw`text-white text-sm mt-3 opacity-90`}>
                  {item.emergencyType.description}
                </Text>
              )}
            </View>

            {/* Scrollable Content */}
            <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
              <View style={tw`p-5`}>
                {/* Status Card */}
                <View
                  style={[
                    tw`p-4 rounded-2xl mb-4`,
                    { backgroundColor: statusColors.light },
                  ]}
                >
                  <Text
                    style={[
                      tw`font-bold text-lg`,
                      { color: statusColors.text },
                    ]}
                  >
                    {statusColors.icon} Status: {item.status?.name}
                  </Text>
                </View>

                {/* Resolution Message */}
                {item.resolutionMessage && (
                  <View
                    style={tw`mb-4 bg-green-50 p-4 rounded-2xl border-2 border-green-200`}
                  >
                    <Text style={tw`text-green-900 font-bold text-base mb-2`}>
                      ✓ Resolution Update
                    </Text>
                    <Text style={tw`text-green-800 text-sm leading-relaxed`}>
                      {item.resolutionMessage}
                    </Text>
                  </View>
                )}

                {/* Patient Information Card */}
                {item.user && (
                  <View
                    style={tw`bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-4 mb-4 border border-indigo-200`}
                  >
                    <Text style={tw`text-indigo-900 font-bold text-xl mb-4`}>
                      👤 Patient Information
                    </Text>

                    <View style={tw`bg-white rounded-xl p-3 mb-3`}>
                      <Text
                        style={tw`text-gray-500 text-xs font-semibold mb-1`}
                      >
                        FULL NAME
                      </Text>
                      <Text style={tw`text-gray-900 text-lg font-semibold`}>
                        {item.user.fullName.toUpperCase()}
                      </Text>
                    </View>

                    {/* Critical Info Grid */}
                    <View style={tw`flex-row mb-3`}>
                      {item.user.bloodType && (
                        <View
                          style={tw`flex-1 mr-2 bg-red-50 rounded-xl p-3 border-2 border-red-200`}
                        >
                          <Text style={tw`text-red-600 text-xs font-bold mb-1`}>
                            🩸 BLOOD TYPE
                          </Text>
                          <Text style={tw`text-red-900 text-2xl font-bold`}>
                            {item.user.bloodType.type}
                          </Text>
                        </View>
                      )}

                      {item.user.medicalAid && (
                        <View
                          style={tw`flex-1 ml-2 bg-blue-50 rounded-xl p-3 border-2 border-blue-200`}
                        >
                          <Text
                            style={tw`text-blue-600 text-xs font-bold mb-1`}
                          >
                            🏥 MEDICAL AID
                          </Text>
                          <Text style={tw`text-blue-900 text-base font-bold`}>
                            {item.user.medicalAid.name}
                          </Text>
                          {item.user.medicalAid.type && (
                            <Text style={tw`text-blue-700 text-xs mt-1`}>
                              {item.user.medicalAid.type}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>

                    {/* Allergies Alert */}
                    {item.user.allergies && item.user.allergies !== "No" && (
                      <View
                        style={tw`bg-red-100 rounded-xl p-4 mb-3 border-2 border-red-300`}
                      >
                        <Text style={tw`text-red-900 font-bold text-base mb-1`}>
                          ⚠️ ALLERGIES - CRITICAL
                        </Text>
                        <Text style={tw`text-red-800 text-lg font-semibold`}>
                          {item.user.allergies}
                        </Text>
                      </View>
                    )}

                    {/* Emergency Contacts */}
                    {item.user.emergencyContacts?.length > 0 && (
                      <View style={tw`mt-2`}>
                        <Text
                          style={tw`text-indigo-900 font-bold text-base mb-3`}
                        >
                          📞 Emergency Contacts
                        </Text>
                        {item.user.emergencyContacts.map((contact, idx) => (
                          <View
                            key={idx}
                            style={tw`bg-white rounded-xl p-4 mb-2 border border-indigo-200`}
                          >
                            <View
                              style={tw`flex-row justify-between items-start mb-2`}
                            >
                              <View style={tw`flex-1`}>
                                <Text
                                  style={tw`text-gray-900 font-bold text-lg`}
                                >
                                  {contact.name}
                                </Text>
                                <Text style={tw`text-gray-600 text-sm`}>
                                  {contact.relation}
                                </Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              onPress={() => handleCallContact(contact.phone)}
                              style={tw`bg-green-500 rounded-lg py-3 flex-row justify-center items-center`}
                            >
                              <Text style={tw`text-white font-bold text-base`}>
                                📞 Call {contact.phone}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {/* Location Card */}
                {item.location && (
                  <View
                    style={tw`bg-green-50 rounded-2xl p-4 border border-green-200`}
                  >
                    <Text style={tw`text-green-900 font-bold text-xl mb-3`}>
                      📍 Location Details
                    </Text>

                    <View style={tw`bg-white rounded-xl p-3 mb-3`}>
                      <Text
                        style={tw`text-gray-900 text-lg font-semibold mb-1`}
                      >
                        {item.location.city}, {item.location.country}
                      </Text>
                      <Text style={tw`text-gray-600 text-sm`}>
                        📌 {item.location.latitude}, {item.location.longitude}
                      </Text>
                      {item.location.description && (
                        <Text style={tw`text-gray-700 text-sm mt-2 italic`}>
                          "{item.location.description}"
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        openLocationMap(
                          item.location.latitude,
                          item.location.longitude
                        )
                      }
                      style={tw`bg-green-500 rounded-lg py-3 flex-row justify-center items-center`}
                    >
                      <Text style={tw`text-white font-bold text-base`}>
                        🗺️ Open in Maps
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-indigo-600`}>
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={tw`text-white mt-4 text-lg font-semibold`}>
            Loading your emergency history...
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={tw`flex-1 bg-blue-600`}>
      {/* Header */}
      <View style={tw`px-6 pt-4 pb-3`}>
        <Text style={tw`text-3xl font-extrabold text-white mb-1`}>
          🚨 Emergency History
        </Text>
        <Text style={tw`text-indigo-200 text-sm`}>
          Manage and review your emergency alerts
        </Text>
      </View>

      {/* Filter Chips */}
      <View style={tw`px-6 pb-3`}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map(renderFilterChip)}
        </ScrollView>
      </View>

      {/* Content */}
      {filteredNotifications.length === 0 ? (
        <View style={tw`flex-1 justify-center items-center px-6 bg-indigo-600`}>
          <Text style={tw`text-8xl mb-4`}>📋</Text>
          <Text style={tw`text-white text-center text-2xl font-bold mb-2`}>
            {selectedFilter === "All"
              ? "No History Yet"
              : `No ${selectedFilter} Alerts`}
          </Text>
          <Text style={tw`text-indigo-200 text-center text-base px-6`}>
            {selectedFilter === "All"
              ? "Your emergency alerts will appear here"
              : `Try selecting a different filter to view more alerts`}
          </Text>
        </View>
      ) : (
        <View style={tw`flex-1 bg-gray-50`}>
          <FlatList
            data={filteredNotifications}
            renderItem={renderCompactItem}
            keyExtractor={(item, index) =>
              item.notification_id
                ? item.notification_id.toString()
                : index.toString()
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`px-6 pt-4 pb-6`}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#4F46E5"]}
                tintColor="#4F46E5"
              />
            }
          />
        </View>
      )}

      {/* Detail Modal */}
      {renderDetailModal()}
    </SafeAreaView>
  );
}
