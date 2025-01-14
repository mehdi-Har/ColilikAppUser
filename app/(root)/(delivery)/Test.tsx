import { Image, Text, View } from "react-native";
import React from "react";
import { useSearchParams } from "expo-router/build/hooks";
const Test = () => {
  const searchParams = useSearchParams();
  const imageUri = searchParams.get("imageUri");
  console.log("test 2", encodeURI(imageUri!));
  return (
    <View>
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
    </View>
  );
};
export default Test;
