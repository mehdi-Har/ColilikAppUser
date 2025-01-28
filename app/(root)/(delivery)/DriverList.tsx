import React, { useEffect, useState } from "react";
import API_BASE_URL from "@/src/apiUrls/apiConfig";
import { Driver, User } from "@/types/type";
import {
  FlatList,
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  Modal,
} from "react-native";
import CheckBox from "expo-checkbox";
import { useSearchParams } from "expo-router/build/hooks";
import { router } from "expo-router";
const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const searchParams = useSearchParams();
  const [selectedDrivers, setSelectedDrivers] = useState<Set<string>>(
    new Set(),
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const announcementId = searchParams.get("announcementId");
  const pickupLongitude = searchParams.get("pickupLongitude");
  const pickupLatitude = searchParams.get("pickupLatitude");
  const destinationLongitude = searchParams.get("destinationLongitude");
  const destinationLatitude = searchParams.get("destinationLatitude");
  const userId = searchParams.get("userId");
  const pickUpTime = searchParams.get("pickUpTime");
  const deliveryTime = searchParams.get("deliveryTime");
  const navigateToHome = () => {
    router.push("/(root)/(tabs)/home");
  };
  const navigateToPackageDetails = () => {
    router.push("/PackageDetails");
  };
  const fetchDrivers = async () => {
    try {
      const pickupLongitude = -122.4194;
      const pickupLatitude = 37.7749;
      const destinationLongitude = -122.4094;
      const destinationLatitude = 37.7849;
      const pickUpTime = "2025-01-27T08:00:00";
      const deliveryTime = "2025-01-27T08:30:00";

      const response = await fetch(
        `${API_BASE_URL}/api/users/drivers/nearby?pickupLongitude=${pickupLongitude}&pickupLatitude=${pickupLatitude}&destinationLongitude=${destinationLongitude}&destinationLatitude=${destinationLatitude}&pickupTime=${pickUpTime}&deliveryTime=${deliveryTime}&toleranceDistance=10&toleranceTimeInMinutes=30`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch drivers");
      }

      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchDrivers, 5000);
    fetchDrivers();
    return () => clearInterval(interval);
  }, []);
  const toggleDriverSelection = (driverId: string) => {
    setSelectedDrivers((prev) => {
      const updated = new Set(prev);
      if (updated.has(driverId)) {
        updated.delete(driverId);
      } else {
        updated.add(driverId);
      }
      return updated;
    });
  };

  const handleSendRequest = async () => {
    const driverIds = Array.from(selectedDrivers);

    if (driverIds.length === 0) {
      alert("Please select at least one driver.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          driverIds.map((driverId) => ({
            announcementId: announcementId,
            driverId: driverId,
            customerId: userId,
          })),
        ),
      });

      if (response.ok) {
        setIsModalVisible(true);
      } else {
        alert("Failed to send requests.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while sending requests.");
    }
  };

  return (
    <View className="p-4">
      {drivers.length === 0 ? (
        <View className="flex flex-col items-center justify-center h-40 bg-gray-100 border border-gray-300 rounded-lg">
          <Text className="text-gray-500 text-center mb-4">
            No drivers found nearby.
          </Text>
          <View className="flex flex-row gap-2">
            <TouchableOpacity
              onPress={navigateToHome}
              className="bg-blue-200 px-5 py-2 rounded-lg border border-blue-200"
            >
              <Text className="text-blue-800 font-bold text-center">Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={fetchDrivers} // Manual fetch button
              className="bg-green-200 px-5 py-2 rounded-lg border border-green-200"
            >
              <Text className="text-green-800 font-bold text-center">
                Fetch Users
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <Text className="text-center text-lg font-bold text-purple-600 mb-4">
            List of Drivers
          </Text>
          <FlatList
            data={drivers}
            keyExtractor={(driver: User) => driver.userId!}
            renderItem={({ item: driver }) => (
              <View className="flex flex-row items-center justify-between p-4 border rounded-lg shadow-md mb-4 bg-gray-50">
                <View className="flex flex-row items-center">
                  <Image
                    source={{
                      uri: `${API_BASE_URL}/imageProfile/${driver.userId}`,
                    }}
                    alt={`${driver.fullName}'s profile`}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <View>
                    <Text className="text-lg font-semibold text-purple-600">
                      {driver.fullName}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Rating: {driver.rating}
                    </Text>
                  </View>
                </View>
                <CheckBox
                  value={selectedDrivers.has(driver.userId!)}
                  onValueChange={() => toggleDriverSelection(driver.userId!)}
                  className="w-5 h-5"
                />
              </View>
            )}
          />
          <TouchableOpacity
            onPress={handleSendRequest}
            className="bg-blue-600 px-5 py-3 rounded-lg mt-4"
          >
            <Text className="text-white text-center font-bold">
              Send Request
            </Text>
          </TouchableOpacity>
        </>
      )}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-4/5">
            <Text className="text-lg font-bold text-center mb-4">
              Request Sent Successfully!
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(false);
                navigateToHome();
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
export default DriverList;
