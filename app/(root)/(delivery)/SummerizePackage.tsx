import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSearchParams } from "expo-router/build/hooks";
import { icons } from "@/constants";

const SummarizePackage = () => {
  const searchParams = useSearchParams();
  const imageUri = searchParams.get("imageUri");
  const senderName = searchParams.get("senderName");
  const senderPhone = searchParams.get("senderPhone");
  const altPhone = searchParams.get("altPhone");
  const destinationLocation = searchParams.get("destinationLocation");
  const pickupLocation = searchParams.get("pickupLocation");
  const receiverName = searchParams.get("receiverName");
  const receiverPhone = searchParams.get("receiverPhone");
  const scheduleDate = searchParams.get("scheduleDate");
  const scheduleTime = searchParams.get("scheduleTime");
  const pickupLongitude = searchParams.get("pickupLongitude");
  const pickupLatitude = searchParams.get("pickupLatitude");
  const destinationLongitude = searchParams.get("destinationLongitude");
  const destinationLatitude = searchParams.get("destinationLatitude");
  const handleNavigation = () => {
    router.push({
      pathname: "/DummyListDrivers",
      params: {
        pickupLatitude: pickupLatitude,
        pickupLongitude: pickupLongitude,
        destinationLongitude: destinationLongitude,
        destinationLatitude: destinationLatitude,
      },
    });
  };
  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold ml-4">Delivery Summary</Text>
        </View>

        <View className="items-center mb-8">
          {imageUri ? (
            <Image
              source={{ uri: encodeURI(imageUri) }}
              className="w-64 h-64 rounded-lg border border-gray-300"
            />
          ) : (
            <Text className="text-lg">No image provided.</Text>
          )}
        </View>

        <View className="mb-8">
          <Text className="text-xl font-semibold mb-4">Delivery Details</Text>
          <View className="flex-row items-center mb-3">
            <Image source={icons.Currentlockation} className="w-6 h-6 mr-1" />
            <Text className="text-lg text-gray-800 max-w-xs truncate">
              Pickup Location: {pickupLocation || "Not specified"}
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Image source={icons.Location} className="w-6 h-6 mr-1" />
            <Text className="text-lg text-gray-800 max-w-xs truncate">
              Destination Location: {destinationLocation || "Not specified"}
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Image source={icons.Calendar} className="w-6 h-6 mr-3" />
            <Text className="text-lg text-gray-800">Date: {scheduleDate}</Text>
          </View>
          <View className="flex-row items-center">
            <Image source={icons.Clock} className="w-6 h-6 mr-3" />
            <Text className="text-lg text-gray-800">Time: {scheduleTime}</Text>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-xl font-semibold mb-4">Sender</Text>
          <View className="flex-row items-center mb-3">
            <Image source={icons.user} className="w-6 h-6 mr-3" />
            <Text className="text-lg text-gray-800">Name: {senderName}</Text>
          </View>
          <View className="flex-row items-center mb-3">
            <Image source={icons.phone} className="w-6 h-6 mr-3" />
            <Text className="text-lg text-gray-800">Phone: {senderPhone}</Text>
          </View>
          {altPhone && (
            <View className="flex-row items-center">
              <Image source={icons.phone} className="w-6 h-6 mr-3" />
              <Text className="text-lg text-gray-800">
                Alt. Phone: {altPhone}
              </Text>
            </View>
          )}
        </View>

        <View className="mb-8">
          <Text className="text-xl font-semibold mb-4">Receiver</Text>
          <View className="flex-row items-center mb-3">
            <Image source={icons.user} className="w-6 h-6 mr-3" />
            <Text className="text-lg text-gray-800">Name: {receiverName}</Text>
          </View>
          <View className="flex-row items-center">
            <Image source={icons.phone} className="w-6 h-6 mr-3" />
            <Text className="text-lg text-gray-800">
              Phone: {receiverPhone}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="p-4">
        <TouchableOpacity
          className="bg-blue-700 py-4 rounded-full items-center"
          onPress={handleNavigation}
        >
          <Text className="text-white text-xl font-bold">Confirm Package</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SummarizePackage;
