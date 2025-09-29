import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import InputField from "../components/input/InputField";
import { SubtitleTwo, TitleTwo } from "../utils/TextComponents";
import tw from "../../tw";
import { registerUser } from "../api/Api";

export default function Register({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({ fullName, email, password });
      Alert.alert("Success", data.message || "Account created successfully!");
      navigation.replace("login");
    } catch (error) {
      Alert.alert("Error", error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate("login");
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-blue-900 justify-center items-center px-6`}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={tw`w-full`}>
        <TitleTwo>Create Account</TitleTwo>
        <SubtitleTwo>Sign up to get started</SubtitleTwo>

        <InputField
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        <InputField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          onPress={handleRegister}
          style={tw`bg-white rounded-lg py-3 mt-4 items-center`}
          disabled={loading}
        >
          <Text style={tw`text-blue-900 font-bold`}>
            {loading ? "Creating Account..." : "Register"}
          </Text>
        </Pressable>

        <Pressable onPress={handleLogin} style={tw`items-center mt-4`}>
          <Text style={tw`text-white text-sm`}>
            Already have an account? <Text style={tw`underline`}>Login</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
