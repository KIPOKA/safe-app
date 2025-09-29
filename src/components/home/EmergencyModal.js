import React from "react";
import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import tw from "../../../tw";

export default function EmergencyModal({
  visible,
  onClose,
  emergencyTypes,
  onSelect,
}) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={tw`flex-1 justify-center items-center bg-black bg-opacity-70 px-5`}
      >
        <View
          style={tw`bg-white rounded-2xl p-6 w-full max-w-[380px] max-h-[80%]`}
        >
          <Text
            style={tw`text-center text-2xl font-extrabold text-gray-900 mb-2`}
          >
            Emergency Type
          </Text>
          <Text style={tw`text-center text-base text-gray-400 mb-4 leading-6`}>
            Select the type of emergency assistance you need
          </Text>

          {/* Scrollable list with fixed max height */}
          <ScrollView
            contentContainerStyle={{ paddingBottom: 10 }}
            style={{ maxHeight: 300 }}
          >
            {emergencyTypes.map((emergency) => (
              <Pressable
                key={emergency.type}
                onPress={() => onSelect(emergency.type)}
                style={({ pressed }) =>
                  tw.style(
                    "flex-row items-center p-4 rounded-xl mb-3 border",
                    pressed ? "bg-opacity-20" : "bg-opacity-10",
                    {
                      backgroundColor: pressed
                        ? emergency.color + "33"
                        : emergency.color + "1A",
                      borderColor: emergency.color + "30",
                    }
                  )
                }
              >
                <Text style={tw`text-2xl mr-4`}>{emergency.icon}</Text>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-lg font-bold text-gray-900 mb-1`}>
                    {emergency.type}
                  </Text>
                  <Text style={tw`text-sm text-gray-400`}>
                    {emergency.description}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            onPress={onClose}
            style={({ pressed }) =>
              tw.style(
                "mt-2 p-4 rounded-xl border border-gray-300",
                pressed ? "bg-red-500" : "bg-red-400"
              )
            }
          >
            <Text style={tw`text-center text-white font-semibold text-base `}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
