import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { useSearchParams } from "expo-router/build/hooks";
import { icons } from "@/constants";
import * as ImagePicker from "expo-image-picker";
import { useUserContext } from "@/app/userContext";
import API_BASE_URL from "../../../src/apiUrls/apiConfig";
import { router } from "expo-router";
const UserProfile = () => {
  const params = useSearchParams();
  const userId = params.get("userId");
  const { imageUri, setImageUri } = useUserContext();
  const [cinImageUri, setCinImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState(false);
  const [extractedCIN, setExtractedCIN] = useState<string>("scan your CIN");
  const [hasPermission, setHasPermission] = useState<boolean | null>(false);
  const [hasImage, setHasImage] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const fetchUserById = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

      if (data && data.userId) {
        setImageUri(
          `${API_BASE_URL}/api/users/imageProfil/${data.userId}?timestamp=${new Date().getTime()}`,
        );
        setHasImage(true);
      } else {
        setImageUri(null);
        setHasImage(false);
      }
    } catch (error) {
      setImageUri(null);
      setHasImage(false);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteImage = async () => {
    try {
      setImageUri(null);

      const response = await fetch(
        `${API_BASE_URL}/api/users/imageProfile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Ensure that we send JSON, not an image
          },
          body: JSON.stringify({
            imageProfil: null, // Set imageProfil to null in backend
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Image delete failed:", errorText);
        Alert.alert(
          "Error",
          errorText || "Failed to delete the profile image.",
        );
        return;
      }

      Alert.alert("Success", "Image deleted successfully!");
    } catch (error) {
      console.error("Unexpected error:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while deleting the image.",
      );
    }
  };
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasPermission(status === "granted");
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
    }
  };

  const pickImage = async () => {
    if (hasPermission === null) {
      await requestPermission();
    }
    if (hasPermission) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } else {
      alert("Permission to access gallery is required!");
    }
  };
  const pickImageAndScan = async () => {
    if (hasPermission === null) {
      await requestPermission();
    }
    if (hasPermission) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCinImageUri(result.assets[0].uri);
        setExtractedCIN("CIN ready to be uploaded!");
      }
    } else {
      alert("Permission to access the gallery is required!");
    }
  };
  const saveChanges = async () => {
    try {
      const currentUserData = await fetch(
        `${API_BASE_URL}/api/users/${userId}`,
      );
      if (!currentUserData.ok) {
        const errorText: string = await currentUserData.text();
        console.error(errorText);
        Alert.alert("Error", "Failed to fetch current user data.");
        return;
      }
      const userData = await currentUserData.json();
      if (!fullName && !userData.fullName) {
        Alert.alert("Error", "Failed to fetch user data");
        return;
      }
      if (!phoneNumber && !userData.phone) {
        Alert.alert("Missing Information", "Phone number is required.");
        return;
      }
      const userUpdatePayload = {
        clerkId: userId,
        fullName: fullName || userData.fullName,
        userEmail: userData.userEmail || "",
        phone: phoneNumber || userData.phone,
        numero: "1",
        rating: 0.0,
        numeroCIN: extractedCIN || "",
        imageProfil: imageUri ? `${userId}.png` : userData.imageProfil || "",
        imageCIN: cinImageUri ? `${userId}CIN.png` : userData.imageCIN || "",
      };
      const userUpdateResponse = await fetch(
        `${API_BASE_URL}/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userUpdatePayload),
        },
      );
      if (!userUpdateResponse.ok) {
        const errorText = await userUpdateResponse.text();
        console.error("User info update failed:", errorText);
        Alert.alert("Error", errorText || "Failed to update user information.");
        return;
      }
      if (imageUri) {
        const profileResponse = await fetch(
          `${API_BASE_URL}/api/users/imageProfil/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "image/png",
            },
            body: await (await fetch(imageUri)).blob(),
          },
        );

        if (!profileResponse.ok) {
          Alert.alert(
            "Profile upload failed",
            "Failed to upload profile image.",
          );
          return;
        }
      }

      if (cinImageUri) {
        const cinResponse = await fetch(
          `${API_BASE_URL}/api/users/imageCIN/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "image/png",
            },
            body: await (await fetch(cinImageUri)).blob(),
          },
        );

        if (!cinResponse.ok) {
          const errorText = await cinResponse.text();
          console.error("CIN image upload failed:", errorText);
          Alert.alert(
            "CIN upload failed",
            errorText || "Failed to upload CIN image.",
          );
          return;
        }

        const contentType = cinResponse.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const data = await cinResponse.json();
          setExtractedCIN(data.extractedCIN || "CIN scanned successfully!");
        } else {
          console.warn(
            "Unexpected response format for CIN upload:",
            await cinResponse.text(),
          );
          setExtractedCIN("CIN scanned successfully!");
        }
      }

      Alert.alert("Success", "Changes saved successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    fetchUserById();
    requestPermission();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white px-4 py-6">
      <View className="flex-row items-center mb-5">
        <TouchableOpacity
          onPress={() => router.push("/(root)/(tabs)/home")}
          className="mr-3"
        >
          <Image source={icons.backArrow} className="w-6 h-6" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Package details</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            <View className="items-center">
              {isLoading ? (
                <ActivityIndicator size="large" color="#000" />
              ) : (
                <Image
                  source={imageUri ? { uri: imageUri } : icons.GreyUser}
                  className="w-32 h-32 rounded-full"
                />
              )}
            </View>
            <View className="flex-row justify-between items-center w-full mt-12 px-4">
              <TouchableOpacity
                className="bg-gray-200 py-3 w-5/12 rounded-lg items-center"
                onPress={deleteImage}
              >
                <Text className="text-gray-800 font-bold text-lg">Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 py-3 w-5/12 rounded-lg items-center"
                onPress={pickImage}
              >
                <Text className="text-white font-bold text-lg">Change</Text>
              </TouchableOpacity>
            </View>
            <View className="flex items-center w-full mt-8 px-4">
              <TouchableOpacity
                className="bg-blue-400 py-4 w-full rounded-lg items-center"
                onPress={pickImageAndScan}
              >
                <Text className="text-white font-bold text-lg">
                  {isScanning ? "Scanning..." : extractedCIN}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex items-center w-full mt-6 px-4">
              <TextInput
                className="bg-gray-100 py-4 px-3 w-full rounded-lg text-green-800 text-base border border-gray-300"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={(text: string) => setFullName(text)}
              />
            </View>
            <View className="flex items-center w-full mt-6 px-4">
              <TextInput
                className="bg-gray-100 py-4 px-3 w-full rounded-lg text-green-800 text-base border border-gray-300"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={(text: string) => setPhoneNumber(text)}
              />
            </View>
            <View className="absolute bottom-6 left-0 right-0 px-4">
              <TouchableOpacity
                className="bg-blue-700 py-3 rounded-lg items-center"
                onPress={saveChanges}
              >
                <Text className="text-white font-bold text-lg">
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserProfile;
