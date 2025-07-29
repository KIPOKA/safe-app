import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,Alert
} from 'react-native';
import tw from '../../../tw';
import { Feather, MaterialIcons, FontAwesome5, Entypo, Ionicons } from '@expo/vector-icons';

export default function Profile({navigation}) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'Jane Doe',
    email: 'janedoe@example.com',
    phone: '+27 65 123 4567',
    address: '123 Main St, Cape Town, SA',
    emergencyContactName: 'John Doe',
    emergencyContactPhone: '+27 72 765 4321',
    bloodType: 'O+',
    allergies: 'Penicillin',
    conditions: 'Asthma',
  });

  const handleInputChange = (key, value) => {
    setProfileData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout now?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            // Do logout logic (e.g., clear storage, tokens, etc.)
            navigation.replace('login');  
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Saved profile:', profileData);
  };

  const fieldData = [
    { label: 'Full Name', key: 'fullName', icon: <Feather name="user" size={20} style={tw`text-blue-700 mr-2`} /> },
    { label: 'Email', key: 'email', icon: <Feather name="mail" size={20} style={tw`text-blue-700 mr-2`} /> },
    { label: 'Phone Number', key: 'phone', icon: <Feather name="phone" size={20} style={tw`text-blue-700 mr-2`} /> },
    { label: 'Address', key: 'address', icon: <Feather name="map-pin" size={20} style={tw`text-blue-700 mr-2`} /> },
    { label: 'Emergency Contact Name', key: 'emergencyContactName', icon: <FontAwesome5 name="user-friends" size={18} style={tw`text-red-600 mr-2`} /> },
    { label: 'Emergency Contact Phone', key: 'emergencyContactPhone', icon: <Feather name="phone-call" size={20} style={tw`text-red-600 mr-2`} /> },
    { label: 'Blood Type', key: 'bloodType', icon: <Entypo name="drop" size={20} style={tw`text-red-500 mr-2`} /> },
    { label: 'Allergies', key: 'allergies', icon: <Ionicons name="alert-circle-outline" size={20} style={tw`text-orange-600 mr-2`} /> },
    { label: 'Medical Conditions', key: 'conditions', icon: <MaterialIcons name="medical-services" size={20} style={tw`text-purple-700 mr-2`} /> },
  ];

  return (
    <ScrollView contentContainerStyle={tw`bg-white px-5 py-6`}>
      <SafeAreaView style={tw`flex-1`}>
        {/* Header */}
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <Text style={tw`text-3xl font-bold text-blue-900`}>Profile</Text>
          <View style={tw`flex-row gap-4`}>
            <TouchableOpacity onPress={handleEditToggle}>
              <Feather name="edit" size={24} style={tw`text-blue-900`} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <MaterialIcons name="logout" size={24} style={tw`text-red-600`} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Fields */}
        {fieldData.map(({ label, key, icon }) => (
          <View key={key} style={tw`mb-5`}>
            <View style={tw`flex-row items-center mb-1`}>
              {icon}
              <Text style={tw`text-sm font-semibold text-gray-700`}>{label}</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={tw`border border-gray-300 rounded-md px-3 py-2 text-sm`}
                value={profileData[key]}
                onChangeText={(text) => handleInputChange(key, text)}
                placeholder={label}
              />
            ) : (
              <View style={tw`bg-gray-100 rounded-md px-3 py-2`}>
                <Text style={tw`text-base text-gray-900`}>{profileData[key]}</Text>
              </View>
            )}
          </View>
        ))}

        {/* Save Button */}
        {isEditing && (
          <TouchableOpacity
            onPress={handleSave}
            style={tw`bg-blue-600 rounded-lg py-4 mt-8`}
          >
            <Text style={tw`text-white text-center font-bold text-lg`}>
              Save Changes
            </Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}
