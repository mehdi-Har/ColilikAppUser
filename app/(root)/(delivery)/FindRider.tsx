import React from "react";
import { View } from "react-native";
import Map from "@/components/Map"; // Adjust the import path based on your project structure

const FindRider = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Map />
    </View>
  );
};

export default FindRider;
