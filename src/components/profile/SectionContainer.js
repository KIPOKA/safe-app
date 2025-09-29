import React from "react";
import { View, Text } from "react-native";
import tw from "../../../tw";
import ProfileField from "./ProfileField";

export default function BasicInfoSection({
  fields,
  profileData,
  handleInputChange,
  isEditing,
}) {
  return (
    <View style={tw`bg-white rounded-xl shadow-sm mb-6 p-4`}>
      <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
        Basic Information
      </Text>
      <View style={tw`flex-row flex-wrap -mx-2`}>
        {fields.map((field) => (
          <ProfileField
            key={field.key}
            label={field.label}
            icon={field.icon}
            value={profileData[field.key]}
            editable={isEditing && field.editable}
            multiline={field.multiline}
            onChange={(val) => handleInputChange(field.key, val)}
          />
        ))}
      </View>
    </View>
  );
}
