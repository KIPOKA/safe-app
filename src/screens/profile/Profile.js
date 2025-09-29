import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "../../../tw";
import {
  Feather,
  MaterialIcons,
  FontAwesome5,
  Entypo,
  Ionicons,
} from "@expo/vector-icons";
import {
  getBloodTypes,
  getUserByEmail,
  updateProfile,
  getMedicalAids,
} from "../../api/Api";

export default function Profile({ navigation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [medicalAids, setMedicalAids] = useState([]);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    bloodType: "",
    allergies: "",
    conditions: "",
    medicalAid: "",
    userRole: "",
  });

  // Store original data to enable cancel functionality
  const [originalProfileData, setOriginalProfileData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchBloodTypes(),
          fetchMedicalAids(),
          fetchUserProfile(),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        Alert.alert("Error", "Failed to load profile data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchBloodTypes = async () => {
    try {
      const data = await getBloodTypes();
      console.log("Fetched blood types:", data);
      setBloodTypes(data.bloodTypes || []);
    } catch (err) {
      console.error("Failed to fetch blood types:", err);
      throw err;
    }
  };

  const fetchMedicalAids = async () => {
    try {
      const data = await getMedicalAids();
      console.log("Fetched medical aids raw:", data);

      // Handle different response formats
      if (Array.isArray(data)) {
        setMedicalAids(data);
      } else if (data.medicalAids) {
        setMedicalAids(data.medicalAids);
      } else {
        setMedicalAids([]);
      }
    } catch (err) {
      console.error("Failed to fetch medical aids:", err);
      throw err;
    }
  };

  const fetchUserProfile = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      if (!email) {
        Alert.alert("Error", "User session expired. Please login again.");
        navigation.replace("login");
        return;
      }

      const user = await getUserByEmail(email);
      const userData = {
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.cellNumber || "",
        address: user.address || "",
        emergencyContactName: user.emergencyContacts?.[0]?.name || "",
        emergencyContactPhone: user.emergencyContacts?.[0]?.phone || "",
        bloodType: user.bloodType?.type || "",
        allergies: user.allergies || "",
        conditions: user.conditions || "",
        medicalAid: user.medicalAid?.name || "",
        userRole: user.userRole?.roleName || "",
      };

      setProfileData(userData);
      setOriginalProfileData(userData); // Store original data
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      throw err;
    }
  };

  const handleInputChange = (key, value) => {
    setProfileData((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // If canceling edit, restore original data
      Alert.alert(
        "Cancel Changes",
        "Are you sure you want to discard your changes?",
        [
          { text: "Continue Editing", style: "cancel" },
          {
            text: "Discard Changes",
            style: "destructive",
            onPress: () => {
              setProfileData(originalProfileData);
              setIsEditing(false);
            },
          },
        ]
      );
    } else {
      setIsEditing(true);
    }
  };

  const validateForm = () => {
    // Basic validation
    if (!profileData.phone?.trim()) {
      Alert.alert("Validation Error", "Phone number is required.");
      return false;
    }

    if (!profileData.address?.trim()) {
      Alert.alert("Validation Error", "Address is required.");
      return false;
    }

    // Phone number format validation (basic)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(profileData.phone)) {
      Alert.alert("Validation Error", "Please enter a valid phone number.");
      return false;
    }

    if (
      profileData.emergencyContactPhone &&
      !phoneRegex.test(profileData.emergencyContactPhone)
    ) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid emergency contact phone number."
      );
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const email = await AsyncStorage.getItem("userEmail");
      if (!email) {
        Alert.alert("Error", "User session expired. Please login again.");
        navigation.replace("login");
        return;
      }

      // Prepare emergency contacts array - only include if both name and phone are provided
      const emergencyContacts = [];
      if (
        profileData.emergencyContactName.trim() &&
        profileData.emergencyContactPhone.trim()
      ) {
        emergencyContacts.push({
          name: profileData.emergencyContactName.trim(),
          phone: profileData.emergencyContactPhone.trim(),
          relation: "Primary",
        });
      }

      const updateData = {
        email,
        cellNumber: profileData.phone.trim(),
        address: profileData.address.trim(),
        bloodType: profileData.bloodType || null,
        allergies: profileData.allergies.trim() || null,
        conditions: profileData.conditions.trim() || null,
        medicalAid: profileData.medicalAid || null,
        userRole: profileData.userRole || null,
        emergencyContacts,
      };

      console.log("Sending update data:", updateData);

      const response = await updateProfile(updateData);

      if (response?.user) {
        // Update profile data with the response from server
        const updatedData = {
          fullName: response.user.fullName || profileData.fullName,
          email: response.user.email || profileData.email,
          phone: response.user.cellNumber || profileData.phone,
          address: response.user.address || profileData.address,
          emergencyContactName:
            response.user.emergencyContacts?.[0]?.name || "",
          emergencyContactPhone:
            response.user.emergencyContacts?.[0]?.phone || "",
          bloodType: response.user.bloodType?.type || "",
          allergies: response.user.allergies || "",
          conditions: response.user.conditions || "",
          medicalAid: response.user.medicalAid?.name || "",
          userRole: response.user.userRole?.roleName || "",
        };

        setProfileData(updatedData);
        setOriginalProfileData(updatedData); // Update original data
      }

      setIsEditing(false);
      Alert.alert(
        "Success",
        response.message || "Profile updated successfully!"
      );
    } catch (err) {
      console.error("Profile update failed:", err);
      Alert.alert(
        "Update Failed",
        err.message ||
          "Failed to update profile. Please check your connection and try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(["userToken", "userEmail"]);
            navigation.replace("login");
          } catch (err) {
            console.error("Logout failed:", err);
            Alert.alert("Error", "Failed to log out. Try again.");
          }
        },
      },
    ]);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const basicInfoFields = [
    {
      label: "Email",
      key: "email",
      icon: <Feather name="mail" size={18} style={tw`text-blue-600`} />,
      editable: false,
    },
    {
      label: "Phone Number",
      key: "phone",
      icon: <Feather name="phone" size={18} style={tw`text-green-600`} />,
      editable: true,
      required: true,
    },
    {
      label: "Address",
      key: "address",
      icon: <Feather name="map-pin" size={18} style={tw`text-blue-600`} />,
      editable: true,
      multiline: true,
      required: true,
    },
  ];

  const medicalInfoFields = [
    {
      label: "Blood Type",
      key: "bloodType",
      icon: <Entypo name="drop" size={18} style={tw`text-red-500`} />,
      editable: true,
      isDropdown: true,
    },
    {
      label: "Medical Aid",
      key: "medicalAid",
      icon: (
        <MaterialIcons
          name="health-and-safety"
          size={18}
          style={tw`text-blue-600`}
        />
      ),
      editable: true,
      isDropdown: true,
    },
    {
      label: "Allergies",
      key: "allergies",
      icon: (
        <Ionicons
          name="alert-circle-outline"
          size={18}
          style={tw`text-orange-600`}
        />
      ),
      editable: true,
      multiline: true,
    },
    {
      label: "Medical Conditions",
      key: "conditions",
      icon: (
        <MaterialIcons
          name="medical-services"
          size={18}
          style={tw`text-purple-600`}
        />
      ),
      editable: true,
      multiline: true,
    },
  ];

  const emergencyFields = [
    {
      label: "Emergency Contact Name",
      key: "emergencyContactName",
      icon: (
        <FontAwesome5 name="user-friends" size={16} style={tw`text-red-600`} />
      ),
      editable: true,
    },
    {
      label: "Emergency Contact Phone",
      key: "emergencyContactPhone",
      icon: <Feather name="phone-call" size={18} style={tw`text-red-600`} />,
      editable: true,
    },
  ];

  const renderDropdownOptions = (field) => {
    if (field.key === "bloodType") {
      console.log("Rendering blood types:", bloodTypes);
      return bloodTypes.map((item) => (
        <Picker.Item
          key={item.id || item.type}
          label={item.type}
          value={item.type}
        />
      ));
    } else if (field.key === "medicalAid") {
      return medicalAids.map((item) => (
        <Picker.Item
          key={item.id || item.name}
          label={`${item.name} ${item.type ? `(${item.type})` : ""}`}
          value={item.name}
        />
      ));
    }
    return [];
  };

  const renderField = (field) => (
    <View key={field.key} style={tw`w-full p-2`}>
      <View
        style={tw`bg-white rounded-xl shadow-sm border border-gray-100 p-4`}
      >
        <View style={tw`flex-row items-center mb-3`}>
          {field.icon}
          <Text style={tw`text-xs font-semibold text-gray-600 ml-2`}>
            {field.label}
            {field.required && <Text style={tw`text-red-500`}> *</Text>}
          </Text>
        </View>

        {isEditing && field.isDropdown ? (
          <View style={tw`border border-gray-200 rounded-lg bg-gray-50`}>
            <Picker
              selectedValue={profileData[field.key]}
              onValueChange={(value) => {
                console.log(`Selected ${field.key}:`, value);
                handleInputChange(field.key, value);
              }}
              style={tw`h-12`}
            >
              <Picker.Item
                label={`Select ${field.label}`}
                value=""
                color="#999"
              />
              {renderDropdownOptions(field)}
            </Picker>
          </View>
        ) : isEditing && field.editable ? (
          <TextInput
            style={tw`border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 ${
              field.required && !profileData[field.key] ? "border-red-300" : ""
            }`}
            value={profileData[field.key]}
            onChangeText={(text) => handleInputChange(field.key, text)}
            placeholder={`Enter ${field.label.toLowerCase()}${
              field.required ? " (required)" : ""
            }`}
            multiline={field.multiline || false}
            numberOfLines={field.multiline ? 3 : 1}
          />
        ) : (
          <Text style={tw`text-sm text-gray-900 font-medium`}>
            {profileData[field.key] || "Not provided"}
          </Text>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-blue-600 justify-center items-center`}>
        <ActivityIndicator size="large" color="white" />
        <Text style={tw`text-white mt-4 text-lg`}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-blue-600`}>
      <SafeAreaView style={tw`flex-1`}>
        {/* Header */}
        <View
          style={tw`bg-gradient-to-r from-blue-600 to-blue-800 px-6 pt-4 pb-8`}
        >
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <Text style={tw`text-2xl font-bold text-white`}>My Profile</Text>
            <View style={tw`flex-row gap-4`}>
              <TouchableOpacity
                onPress={handleEditToggle}
                style={tw`bg-white/20 rounded-full p-2`}
                disabled={isSaving}
              >
                <Feather
                  name={isEditing ? "x" : "edit"}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                style={tw`bg-red-500/20 rounded-full p-2`}
                disabled={isSaving}
              >
                <Feather name="log-out" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Avatar */}
          <View style={tw`items-center`}>
            <View
              style={tw`w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-3`}
            >
              <Text style={tw`text-2xl font-bold text-white`}>
                {getInitials(profileData.fullName || "User")}
              </Text>
            </View>
            <Text style={tw`text-xl font-bold text-white`}>
              {profileData.fullName.toUpperCase() || "User Name"}
            </Text>
          </View>
        </View>

        <View style={tw`px-4 -mt-4`}>
          {/* Basic Info */}
          <View style={tw`bg-white rounded-xl shadow-sm mb-6 p-4`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
              Basic Information
            </Text>
            <View style={tw`flex-row flex-wrap -mx-2`}>
              {basicInfoFields.map(renderField)}
            </View>
          </View>

          {/* Medical Info */}
          <View style={tw`bg-white rounded-xl shadow-sm mb-6 p-4`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
              Medical Information
            </Text>
            <View style={tw`flex-row flex-wrap -mx-2`}>
              {medicalInfoFields.map(renderField)}
            </View>
          </View>

          {/* Emergency Contact */}
          <View style={tw`bg-white rounded-xl shadow-sm mb-6 p-4`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
              Emergency Contact
            </Text>
            <View style={tw`flex-row flex-wrap -mx-2`}>
              {emergencyFields.map(renderField)}
            </View>
          </View>

          {/* Save Button */}
          {isEditing && (
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              style={tw`bg-blue-600 rounded-xl py-4 mb-8 shadow-lg ${
                isSaving ? "opacity-50" : ""
              }`}
            >
              {isSaving ? (
                <View style={tw`flex-row justify-center items-center`}>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={tw`text-white font-bold text-lg ml-2`}>
                    Saving...
                  </Text>
                </View>
              ) : (
                <Text style={tw`text-white text-center font-bold text-lg`}>
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
