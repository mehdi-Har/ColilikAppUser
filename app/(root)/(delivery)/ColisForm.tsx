import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

const ColisForm = () => {
  const { imageData } = useLocalSearchParams();
  const parsedImageData = JSON.parse(imageData as string);

  return (
    <View className="flex-1 bg-white justify-center items-center p-5">
      <Text className="text-lg font-bold">ID: {parsedImageData.id}</Text>
      <Text className="text-gray-700">URI: {parsedImageData.uri}</Text>
    </View>
  );
};

export default ColisForm;
