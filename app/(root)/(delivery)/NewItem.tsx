import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Text,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { Item } from "@/types/type";
const NewItem = () => {
  const searchParams = useSearchParams();
  const parsedItems = searchParams.get("items");
  const initialItems = parsedItems ? JSON.parse(parsedItems) : [];

  const senderName = searchParams.get("senderName");
  const senderPhone = searchParams.get("senderPhone");
  const altSenderPhone = searchParams.get("altSenderPhone");

  const destinationLocation = searchParams.get("destinationLocation");
  const pickupLocation = searchParams.get("pickupLocation");

  const receiverName = searchParams.get("receiverName");
  const receiverPhone = searchParams.get("receiverPhone");
  const altReceiverPhone = searchParams.get("altReceiverPhone");

  const scheduleDate = searchParams.get("scheduleDate");
  const scheduleTime = searchParams.get("scheduleTime");

  const pickupLongitude = searchParams.get("pickupLongitude");
  const pickupLatitude = searchParams.get("pickupLatitude");
  const pickupDate = searchParams.get("pickupDate");
  const pickupTime = searchParams.get("pickupTime");
  const destinationLongitude = searchParams.get("destinationLongitude");
  const destinationLatitude = searchParams.get("destinationLatitude");

  const userId = searchParams.get("userId");

  const [dimension, setDimension] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [items, setItems] = useState<Item[]>(initialItems);
  useEffect(() => {
    const updatedItems = items.map((item) => ({
      ...item,
      photo: encodeURI(item.photo),
    }));
    setItems(updatedItems);
  }, []);
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access gallery is required!");
    }
  };

  const takeImage = async () => {
    await requestPermission();
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    await requestPermission();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const addItem = () => {
    if (quantity && dimension && imageUri) {
      const newItem: Item = {
        dimension: parseInt(dimension, 10),
        qte: parseInt(quantity, 10),
        photo: imageUri,
      };
      setItems((prevItems) => [...prevItems, newItem]); // Append the new item
      setQuantity("");
      setImageUri("");
      setDimension("");
    } else {
      Alert.alert("Please fill all fields and add an image.");
    }
  };
  const navigateToSummary = () => {
    const fromPackageDetails = "2";
    const encodedItems = items.map((item) => ({
      ...item,
      photo: encodeURI(item.photo),
    }));
    router.push({
      pathname: "/SummerizePackage",
      params: {
        senderName: senderName,
        altSenderPhone: altSenderPhone,
        senderPhone: senderPhone,
        destinationLocation: destinationLocation,
        pickupLocation: pickupLocation,
        receiverName: receiverName,
        receiverPhone: receiverPhone,
        altReceiverPhone: altReceiverPhone,
        scheduleDate: scheduleDate,
        scheduleTime: scheduleTime,
        pickupDate: pickupDate,
        pickupTime: pickupTime,
        destinationLongitude: destinationLongitude,
        destinationLatitude: destinationLatitude,
        pickupLongitude: pickupLongitude,
        pickupLatitude: pickupLatitude,
        items: JSON.stringify(encodedItems),
        source: fromPackageDetails,
        userId: userId,
      },
    });
  };
  return (
    <ScrollView className="flex-1 bg-gray-100 p-5">
      <Text className="text-lg font-semibold mb-2">Add Item Details</Text>

      <View className="mb-4">
        <Text className="text-gray-600 mb-1">Item's Dimension</Text>
        <TextInput
          placeholder="Enter dimension"
          keyboardType="numeric"
          className="bg-white rounded-lg border border-gray-300 p-3"
          value={dimension}
          onChangeText={setDimension}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-1">Quantity</Text>
        <TextInput
          placeholder="Enter quantity"
          keyboardType="numeric"
          className="bg-white rounded-lg border border-gray-300 p-3"
          value={quantity}
          onChangeText={setQuantity}
        />
      </View>

      <View className="flex-row justify-between mb-4">
        <TouchableOpacity
          className="bg-blue-600 w-[48%] h-12 rounded-lg items-center justify-center"
          onPress={takeImage}
        >
          <Text className="text-white text-sm text-center">Take Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-blue-100 w-[48%] h-12 rounded-lg items-center justify-center"
          onPress={pickImage}
        >
          <Text className="text-blue-700 text-sm text-center">
            Pick from Gallery
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className={`py-4 rounded-full items-center mb-4 ${
          dimension && quantity && imageUri ? "bg-blue-600" : "bg-blue-200"
        }`}
        onPress={addItem}
        disabled={!dimension || !quantity || !imageUri} // Disable the button if fields are missing
      >
        <Text
          className={`text-lg font-bold ${
            dimension && quantity && imageUri ? "text-white" : "text-blue-700"
          }`}
        >
          Add Item
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-blue-600 py-4 rounded-full items-center mt-4"
        onPress={navigateToSummary}
      >
        <Text className="text-white text-lg font-bold">Finish</Text>
      </TouchableOpacity>

      <View className="mt-8">
        <Text className="text-lg font-semibold mb-2">Your Items:</Text>
        {items.map((item, index) => (
          <View
            key={index}
            className="bg-white rounded-lg border border-gray-300 p-4 mb-4"
          >
            <View className="flex-row justify-center items-center mb-4 space-x-4 mr-4">
              <Text className="text-gray-700 text-md font-bold">
                Dimension: {item.dimension}
              </Text>
              <Text className="text-gray-700 text-md font-bold ml-5 mr-3">
                Quantity: {item.qte}
              </Text>
            </View>
            <Image
              source={{
                uri: item.photo,
              }}
              className="w-32 h-32 rounded-lg self-center"
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default NewItem;
