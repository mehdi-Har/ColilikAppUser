import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Animated,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { icons, images } from "@/constants";
import { useUserContext } from "@/app/userContext";
import API_BASE_URL from "../../../src/apiUrls/apiConfig";
const Home = () => {
  const router = useRouter();
  const { imageUri, setImageUri } = useUserContext();
  const [user, setUser] = useState<string>("Guest");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isProfileVisible, setIsProfileVisible] = useState<boolean>(false);
  const [rating, setRating] = useState<number | null>(0);
  const slideAnim = useRef(
    new Animated.Value(-Dimensions.get("window").width),
  ).current;
  const userId = "1";
  const fetchUserById = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

      if (data && data.userId) {
        setUser(data.fullName || "Guest");
        setImageUri(
          `${API_BASE_URL}/api/users/imageProfile/${data.userId}?timestamp=${new Date().getTime()}`,
        );
        setRating(data.rating);
      } else {
        setUser("Guest");
        setImageUri(null);
        setRating(0.0);
      }
    } catch (error) {
      setError(error.message || "Unable to fetch user data");
      Alert.alert("cant fetch user data");
      setUser("Guest");
      setImageUri(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserById();
  }, []);

  const toggleProfile = () => {
    if (isProfileVisible) {
      Animated.timing(slideAnim, {
        toValue: -Dimensions.get("window").width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsProfileVisible(false));
    } else {
      setIsProfileVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const navigationToConfig = () => {
    router.push({
      pathname: "/(root)/(userSettings)/userConfig",
      params: {
        userId: userId,
      },
    });
  };
  const navigateToBecomeDriver = () => {
    router.push("/(root)/(userSettings)/BecomeDriver");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 relative">
      <View className="flex-row justify-between items-center p-5">
        <TouchableOpacity onPress={toggleProfile}>
          <Image
            source={imageUri ? { uri: imageUri } : icons.GreyUser}
            className="w-12 h-12 rounded-full"
          />
        </TouchableOpacity>
        {isLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text className="text-xl font-bold">Hello, {user}!</Text>
        )}
        <TouchableOpacity>
          <Image source={icons.notification} className="w-6 h-6" />
        </TouchableOpacity>
      </View>

      <View className="mx-5 h-[25%] bg-blue-700 rounded-lg p-5 flex justify-center items-center">
        <Text className="text-white text-base">Total Balance</Text>
        <TouchableOpacity className="mt-2">
          <Text className="text-white text-2xl">****</Text>
        </TouchableOpacity>
      </View>

      <Text className="mt-7 ml-5 text-lg font-bold">Activities</Text>
      <View className="flex-row justify-between mx-5 mt-4">
        <TouchableOpacity
          className="flex-1 bg-yellow-50 rounded-lg p-5 mr-2 items-center justify-center"
          onPress={() =>
            router.push({
              pathname: "/(root)/(delivery)/delivery",
              params: {
                userId: userId,
              },
            })
          }
        >
          <Image
            source={images.moto}
            className="max-w-full max-h-64"
            resizeMode="contain"
          />
          <Text className="mt-3 font-semibold">Delivery</Text>
        </TouchableOpacity>

        <View className="flex-1 bg-green-50 rounded-lg p-5 ml-2 items-center justify-center">
          <Image
            source={images.camion}
            className="max-w-full max-h-64"
            resizeMode="contain"
          />
          <Text className="mt-3 font-semibold">Haulage</Text>
        </View>
      </View>

      {isProfileVisible && (
        <Pressable
          onPress={toggleProfile}
          className="absolute top-0 left-0 w-full h-full bg-black/50"
        />
      )}

      <Animated.View
        style={{
          transform: [{ translateX: slideAnim }],
        }}
        className="absolute top-0 left-0 h-full w-[60%] bg-white shadow-lg z-50"
      >
        <View className="bg-blue-700 p-5 items-center">
          <Image
            source={imageUri ? { uri: imageUri } : icons.GreyUser}
            className="w-20 h-20 rounded-full"
          />
          <Text className="text-white text-lg font-bold mt-2">{user}</Text>
          <Text className="text-white text-sm mt-1">⭐ {rating}</Text>
        </View>

        <View className="p-5">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={navigationToConfig}
          >
            <Image source={icons.GreyUser} className="w-5 h-5" />
            <Text className="text-base ml-2">Edit Profile</Text>
          </TouchableOpacity>

          <View className="mt-5 border-t border-gray-200" />

          <TouchableOpacity className="flex-row items-center mt-5">
            <Image source={icons.list} className="w-5 h-5" />
            <Text className="text-base ml-2">Delivery History</Text>
          </TouchableOpacity>
          <View className="mt-5 border-t border-gray-200" />

          <TouchableOpacity
            className="flex-row items-center mt-5"
            onPress={navigateToBecomeDriver}
          >
            <Image source={icons.Gear} className="w-5 h-5" />
            <Text className="text-base ml-2">Become a driver</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Home;
