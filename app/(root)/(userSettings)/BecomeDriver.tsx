import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";

const BecomeDriver = () => {
  const [isDriver, setIsDriver] = useState(false);

  const toggleDriverStatus = () => {
    setIsDriver((prevState) => !prevState);
  };

  return (
    <>
      {/* Set the StatusBar to blue */}
      <StatusBar backgroundColor="#3b82f6" barStyle="light-content" />
      <SafeAreaView className="flex-1 bg-blue-500 justify-center">
        <View className="items-center mb-12">
          <Text className="text-2xl font-bold text-white">
            Becoming a Driver?
          </Text>
        </View>
        <View className="items-center">
          <TouchableOpacity
            className={`w-32 h-12 rounded-full flex justify-center items-center ${
              isDriver ? "bg-white" : "bg-white border-2 border-white"
            }`}
            onPress={toggleDriverStatus}
          >
            <Text
              className={`text-lg font-bold ${
                isDriver ? "text-blue-500" : "text-gray-800"
              }`}
            >
              {isDriver ? "ON" : "OFF"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default BecomeDriver;
