import { Ride } from "@/types/type";
import { View, Text, Image } from "react-native";
const RideCard = ({
  ride: {
    destination_longitude,
    destination_latitude,
    origin_address,
    destination_address,
    created_at,
    ride_time,
    driver,
    payment_status,
  },
}: {
  ride: Ride;
}) => {
  return (
    <View className="flex flex-row items-center justify-center bg-white rounded-lg shadow-sm">
      <View className="flex flex-row items-center justify-between p-3">
        <View className="flex flex-row items-center justify-between">
          <Image
            source={{
              uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat%3A${destination_longitude}%2C${destination_latitude}&zoom=14&apiKey=7462f9b410d94774a990be1135387188`,
            }}
            className="w-[80px] h-[90px] rounded-lg"
            onError={() => console.error("Failed to load the map image")}
          />
        </View>
      </View>
      <Text className="text-3xl">{driver.first_name}</Text>
    </View>
  );
};
export default RideCard;
