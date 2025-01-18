import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useState } from "react";
import { icons } from "@/constants";
import InputField from "@/components/InputField";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useNavigation } from "@react-navigation/native";
const PackageInfo = () => {
  const searchParams = useSearchParams();
  const imageUri = searchParams.get("imageUri");

  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");

  const [errors, setErrors] = useState({
    senderName: false,
    senderPhone: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = () => {
    setFormSubmitted(true);

    let valid = true;
    if (!senderName) {
      setErrors((prevErrors) => ({ ...prevErrors, senderName: true }));
      valid = false;
    }
    if (!senderPhone) {
      setErrors((prevErrors) => ({ ...prevErrors, senderPhone: true }));
      valid = false;
    }

    if (valid) {
      router.push({
        pathname: "/PackageDetails",
        params: {
          imageUri: encodeURI(imageUri!),
        },
      });
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-gray-100 p-4">
          <View className="flex-row items-center mb-5">
            <TouchableOpacity
              onPress={() => router.push("/NewOrder")}
              className="mr-3"
            >
              <Image source={icons.backArrow} className="w-6 h-6" />
            </TouchableOpacity>
            <Text className="text-xl font-bold">Package Information</Text>
          </View>

          <View className="items-center mb-5">
            {imageUri ? (
              <Image
                source={{ uri: encodeURI(imageUri) }}
                className="w-52 h-52 rounded-lg border border-gray-300"
              />
            ) : (
              <Text>No image provided.</Text>
            )}
          </View>

          <View className="space-y-4 mb-5">
            <InputField
              label="Sender's Name"
              placeholder="Enter sender name"
              value={senderName}
              onChangeText={setSenderName}
              containerStyle="bg-white rounded-lg border border-gray-300 p-3"
              inputStyle="text-left"
            />
            {formSubmitted && errors.senderName && (
              <Text className="text-red-500 text-sm">
                Sender's name is required.
              </Text>
            )}
            <InputField
              label="Sender's Phone Number"
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={senderPhone}
              onChangeText={setSenderPhone}
              containerStyle="bg-white rounded-lg border border-gray-300 p-3"
              inputStyle="text-left"
            />
            {formSubmitted && errors.senderPhone && (
              <Text className="text-red-500 text-sm">
                Sender's phone is required.
              </Text>
            )}

            <InputField
              label="Alternative Number (Optional)"
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={altPhone}
              onChangeText={setAltPhone}
              containerStyle="bg-white rounded-lg border border-gray-300 p-3"
              inputStyle="text-left"
            />
          </View>

          <View className="flex-1 justify-end">
            <TouchableOpacity
              className="bg-blue-600 py-4 rounded-full items-center"
              onPress={handleSubmit}
            >
              <Text className="text-white text-lg font-bold">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default PackageInfo;
