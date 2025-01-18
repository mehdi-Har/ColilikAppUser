import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native"; // Use navigation for navigation
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation"; // Import the types
import { icons } from "@/constants";
import { router } from "expo-router";

const UploadImage = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasPermission(status === "granted");
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
    }
  };

  const TakeImage = async () => {
    if (hasPermission === null) {
      await requestPermission();
    }

    if (hasPermission) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
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

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    }
  };

  const navigateToPackageInfo = () => {
    router.push({
      pathname: "/PackageInfo",
      params: {
        imageUri: imageUri,
      },
    });
  };

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <View className="flex-row items-center mb-5">
        <TouchableOpacity
          onPress={() => router.push("/(root)/(delivery)/delivery")}
          className="mr-3"
        >
          <Image source={icons.backArrow} className="w-6 h-6" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Upload Image</Text>
      </View>

      <View className="items-center flex-1 justify-center">
        {imageUri ? (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={{ uri: imageUri }}
              className="w-52 h-52 rounded-lg"
              resizeMode="cover"
            />
          </TouchableOpacity>
        ) : (
          <>
            <Image source={icons.box} className="w-24 h-24 mb-4" />
            <Text className="text-center text-gray-700 mb-6">
              Please upload a picture of your package. Ensure you capture all
              the sides of the package.
            </Text>
          </>
        )}
      </View>

      <View className="w-full items-center pb-10">
        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-lg mb-4 w-4/5"
          onPress={TakeImage}
        >
          <Text className="text-white font-bold text-lg">Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-gray-400 px-6 py-3 rounded-lg mb-4 w-4/5"
          onPress={pickImage}
        >
          <Text className="text-white font-bold text-lg">Library</Text>
        </TouchableOpacity>
        {imageUri && (
          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-lg w-4/5"
            onPress={navigateToPackageInfo}
          >
            <Text className="text-white font-bold text-lg">Validate</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={modalVisible} transparent={false}>
        <View className="flex-1 bg-black justify-center items-center">
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              className="w-full h-full"
              resizeMode="contain"
            />
          )}
          <TouchableOpacity
            className="absolute top-10 left-5"
            onPress={() => setModalVisible(false)}
          >
            <Image source={icons.backArrow} className="w-8 h-8" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default UploadImage;
