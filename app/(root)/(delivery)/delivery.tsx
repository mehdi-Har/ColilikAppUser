import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { icons } from "@/constants";
import { router, useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import API_BASE_URL from "@/src/apiUrls/apiConfig";
import { format } from "node:url";
import { parseISO } from "date-fns";
import { Property } from "csstype";
import { Order } from "@/types/type";

const Delivery = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/orders/ordersById/${userId}`,
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch orders. Status code: ${response.status}`,
        );
      }

      const orders = await response.json();
      const pending = orders.filter(
        (order: Order) =>
          order.status.toLowerCase() === "pending" ||
          order.status.toLowerCase() === "transit",
      );
      const recent = orders.filter(
        (order: Order) =>
          order.status.toLowerCase() === "delivered" ||
          order.status.toLowerCase() === "cancelled",
      );

      setPendingOrders(pending);
      setRecentOrders(recent);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      Alert.alert("Error", `An error occurred: ${errorMessage}`);
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching orders for userId:", userId); // Debug log
    fetchOrders();
  }, [userId]);
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-200 text-yellow-600";
      case "TRANSIT":
        return "bg-purple-200 text-purple-600";
      case "DELIVERED":
        return "bg-green-200 text-green-600";
      case "CANCELLED":
        return "bg-red-200 text-red-600";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => router.push("(tabs)/home")}
          className="flex-row items-center"
        >
          <Image source={icons.backArrow} className="w-6 h-6 mr-2" />
          <Text className="text-lg font-bold">Delivery</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={icons.list} className="w-12 h-12" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="bg-blue-600 p-4 rounded-lg mt-5"
        onPress={() => {
          router.push({
            pathname: "/NewOrder",
            params: {
              userId: userId,
            },
          });
        }}
      >
        <Text className="text-white text-center text-lg font-bold">
          Create New Order
        </Text>
      </TouchableOpacity>

      <ScrollView className="mt-5">
        <Text className="text-lg font-bold">Pending Delivery</Text>
        {pendingOrders.length > 0 ? (
          pendingOrders.map((order, index) => (
            <View
              key={index}
              className="flex-row bg-white p-4 mt-2 rounded-lg shadow-sm items-center"
            >
              <Image source={icons.box} className="w-10 h-10 mr-4" />
              <View className="flex-1">
                <Text className="text-gray-800 font-bold">{order.orderId}</Text>
                <Text className="text-gray-600">
                  {order.announcement?.destination}
                </Text>
                <Text className="text-gray-400 text-sm">
                  {order.announcement?.deliveryTime
                    ? new Date(order.announcement.deliveryTime).toLocaleString() // e.g., 1/26/2025, 12:34 PM
                    : "No delivery time available"}
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}
              >
                <Text className="text-sm font-bold">{order.status}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className="flex items-center justify-center mt-10">
            <Image source={icons.box} className="w-20 h-20" />
            <Text className="text-gray-500 text-center mt-2">
              No pending deliveries to display.
            </Text>
          </View>
        )}

        <Text className="mt-5 text-lg font-bold">Recent Delivery</Text>
        {recentOrders.length > 0 ? (
          recentOrders.map((order, index) => (
            <View
              key={index}
              className="flex-row bg-white p-4 mt-2 rounded-lg shadow-sm items-center"
            >
              <Image source={icons.box} className="w-10 h-10 mr-4" />
              <View className="flex-1">
                <Text className="text-gray-800 font-bold">{order.orderId}</Text>
                <Text className="text-gray-600">
                  {order.announcement?.destination}
                </Text>
                <Text className="text-gray-400 text-sm">
                  {order.announcement?.deliveryTime
                    ? new Date(order.announcement.deliveryTime).toLocaleString() // e.g., 1/26/2025, 12:34 PM
                    : "No delivery time available"}
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}
              >
                <Text className="text-sm font-bold">{order.status}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className="flex items-center justify-center mt-10">
            <Image source={icons.box} className="w-20 h-20" />
            <Text className="text-gray-500 text-center mt-2">
              No recent deliveries to display.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Delivery;
