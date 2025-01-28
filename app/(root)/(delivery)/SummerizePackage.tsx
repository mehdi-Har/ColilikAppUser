import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSearchParams } from "expo-router/build/hooks";
import { icons } from "@/constants";
import API_BASE_URL from "@/src/apiUrls/apiConfig";

const SummarizePackage = () => {
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const searchParams = useSearchParams();

  const senderName = searchParams.get("senderName");
  const senderPhone = searchParams.get("senderPhone");
  const altPhone = searchParams.get("altSenderPhone");

  const destinationLocation = searchParams.get("destinationLocation");
  const pickupLocation = searchParams.get("pickupLocation");

  const receiverName = searchParams.get("receiverName");
  const receiverPhone = searchParams.get("receiverPhone");
  const altReceiverPhone = searchParams.get("altReceiverPhone");

  const scheduleDate = searchParams.get("scheduleDate");
  const scheduleTime = searchParams.get("scheduleTime");
  const pickupDate = searchParams.get("pickupDate");
  const pickupTime = searchParams.get("pickupTime");
  const source = searchParams.get("source");
  const pickupLongitude = searchParams.get("pickupLongitude");
  const pickupLatitude = searchParams.get("pickupLatitude");
  const destinationLongitude = searchParams.get("destinationLongitude");
  const destinationLatitude = searchParams.get("destinationLatitude");
  const [isLoading, setIsLoading] = useState(false);
  const userId = searchParams.get("userId");
  const items = JSON.parse(searchParams.get("items") || "[]");
  console.log("Parsed items:", items);
  const fileToBase64 = (fileUri) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fetch(fileUri)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.status}`);
          }
          return response.blob();
        })
        .then((blob) => {
          fileReader.onload = () => {
            if (fileReader.result) {
              resolve(fileReader.result.split(",")[1]); // Remove Base64 header
            } else {
              reject(new Error("FileReader result is null"));
            }
          };

          fileReader.onerror = () => {
            reject(new Error("FileReader error"));
          };

          fileReader.readAsDataURL(blob);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const confirmPackage = async () => {
    setIsLoading(true); // Start loading
    try {
      const itemsData = await Promise.all(
        items.map(async (item) => ({
          dimension: item.dimension,
          quantity: item.quantity,
          photo: item.photo ? await fileToBase64(item.photo) : null,
        })),
      );

      const payload = {
        userId: userId,
        pickUpTime: `${pickupDate}T${pickupTime}`,
        depart: pickupLocation,
        longDest: destinationLongitude,
        latDest: destinationLatitude,
        longDepart: pickupLongitude,
        latDepart: pickupLatitude,
        deliveryTime: `${scheduleDate}T${scheduleTime}`,
        senderName: senderName,
        phoneNumber: senderPhone,
        alternativeSenderPhoneNumber: altPhone || "",
        receiverName: receiverName,
        receiverPhoneNumber: receiverPhone,
        alternativeReceiverPhoneNumber: altReceiverPhone || "",
        items: itemsData,
      };

      const response = await fetch(
        `${API_BASE_URL}/announcements/users/${userId}/announcements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      router.push({
        pathname: "/DriverList",
        params: {
          announcementId: data.announcementId,
          pickupLongitude: pickupLongitude,
          pickupLatitude: pickupLatitude,
          destinationLongitude: destinationLongitude,
          destinationLatitude: destinationLatitude,
          userId: userId,
          pickUpTime: `${pickupDate}T${pickupTime}`,
          deliveryTime: `${scheduleDate}T${scheduleTime}`,
        },
      });
    } catch (error: any) {
      setIsErrorModalVisible(true);
    } finally {
      setIsLoading(false);
    }
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
          {altReceiverPhone && (
            <View className="flex-row items-center mb-4 space-x-3">
              <Image source={icons.phone} className="w-6 h-6" />
              <Text className="text-lg text-gray-700">
                Rcv Alt. Phone: {altReceiverPhone}
              </Text>
            </View>
          )}
        </View>
        <View className="mb-8">
          <Text className="text-xl font-semibold mb-4 text-gray-800">
            Items
          </Text>

          {items.length > 0 ? (
            items.map((item: any, index: number) => (
              <View key={index} className="border-b border-gray-300 py-4 mb-4">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  Item {index + 1}:
                </Text>
                <Text className="text-lg text-gray-700">
                  Dimensions: {item.dimension}
                </Text>
                <Text className="text-lg text-gray-700">
                  Quantity: {item.qte}
                </Text>

                {item.photo && (
                  <Image
                    source={{ uri: item.photo }}
                    className="w-32 h-32 rounded-lg mt-4 self-center"
                  />
                )}
              </View>
            ))
          ) : (
            <Text className="text-lg text-gray-700">No items added yet.</Text>
          )}
        </View>
      </ScrollView>

      <View className="p-4">
        <TouchableOpacity
          className="bg-blue-700 py-4 rounded-full items-center"
          onPress={confirmPackage}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white text-xl font-bold">
              Confirm Package
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <Modal
        visible={isErrorModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsErrorModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-4/5">
            <Text className="text-lg font-bold text-center mb-4">
              Announcement Creation Failed
            </Text>
            <Text className="text-sm text-center mb-6 text-gray-600">
              Something went wrong while creating the announcement. Please try
              again later.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsErrorModalVisible(false);
                router.push("/(root)/(tabs)/home");
              }}
              className="bg-blue-600 px-5 py-2 rounded-lg mt-4"
            >
              <Text className="text-white text-center font-bold">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SummarizePackage;
