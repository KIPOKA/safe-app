import React from "react";
import { View, Text, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import tw from "../../../tw";

export default function ProfileField({
  label,
  icon,
  value,
  editable,
  multiline = false,
  isDropdown = false,
  options = [],
  onChange,
}) {
  return (
    <View style={tw`w-full p-2`}>
      <View
        style={tw`bg-white rounded-xl shadow-sm border border-gray-100 p-4`}
      >
        <View style={tw`flex-row items-center mb-3`}>
          {icon}
          <Text style={tw`text-xs font-semibold text-gray-600 ml-2`}>
            {label}
          </Text>
        </View>

        {editable && isDropdown ? (
          <View style={tw`border border-gray-200 rounded-lg bg-gray-50`}>
            <Picker selectedValue={value} onValueChange={onChange}>
              <Picker.Item label={`Select ${label}`} value="" />
              {options.map((opt) => (
                <Picker.Item
                  key={opt.id}
                  label={opt.type || opt.name}
                  value={opt.type || opt.name}
                />
              ))}
            </Picker>
          </View>
        ) : editable ? (
          <TextInput
            style={tw`border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50`}
            value={value}
            onChangeText={onChange}
            placeholder={label}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
          />
        ) : (
          <Text style={tw`text-sm text-gray-900 font-medium`}>
            {value || "Not provided"}
          </Text>
        )}
      </View>
    </View>
  );
}
