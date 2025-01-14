import React, { useState } from "react";
import { useSearchParams } from "expo-router/build/hooks";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import { router } from "expo-router";
import MapModal from "@/components/MapModal";

const PackageDetails = () => {
  const searchParams = useSearchParams();
  const imageUri = searchParams.get("imageUri");
  const senderName = searchParams.get("senderName");
  const altPhone = searchParams.get("altPhone");
  const senderPhone = searchParams.get("senderPhone");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");

  const [pickupLocation, setPickupLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [activeLocationType, setActiveLocationType] = useState<
    "pickup" | "destination"
  >();

  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [altReceiverPhone, setAltReceiverPhone] = useState("");

  const [pickupCoords, setPickupCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const handleOpenMap = (type: "pickup" | "destination") => {
    setActiveLocationType(type);
    setMapModalVisible(true);
  };

  const handleSelectLocation = (
    address: string,
    coords: { latitude: number; longitude: number },
  ) => {
    if (activeLocationType === "pickup") {
      setPickupLocation(address);
      setPickupCoords(coords);
    } else if (activeLocationType === "destination") {
      setDestinationLocation(address);
      setDestinationCoords(coords);
    }
    setMapModalVisible(false);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(true);
    setShowTimePicker(false);
  };
  const toggleTimePicker = () => {
    setShowTimePicker(true);
    setShowDatePicker(false);
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split("T")[0];
      setDateInput(formattedDate);
    }
  };

  const onTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (time) {
      setSelectedTime(time);
      const formattedTime = time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTimeInput(formattedTime);
    }
  };
  const handleNavigation = () => {
    router.push({
      pathname: "/SummerizePackage",
      params: {
        imageUri: encodeURI(imageUri!),
        senderName: senderName,
        altPhone: altPhone,
        senderPhone: senderPhone,
        destinationLocation: destinationLocation,
        pickupLocation: pickupLocation,
        receiverName: receiverName,
        receiverPhone: receiverPhone,
        altReceiverPhone: altReceiverPhone,
        scheduleDate: dateInput,
        scheduleTime: timeInput,
        destinationLongitude: destinationCoords?.longitude,
        destinationLatitude: destinationCoords?.latitude,
        pickupLongitude: pickupCoords?.longitude,
        pickupLatitude: pickupCoords?.latitude,
      },
    });
  };
  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-xl font-bold mb-4">Package Information</Text>

      <Text className="text-lg font-semibold mb-2">Location</Text>
      <View className="mb-4">
        <Text className="text-gray-600 mb-1">Pick-up Location</Text>
        <TouchableOpacity onPress={() => handleOpenMap("pickup")}>
          <TextInput
            placeholder="Select pick-up location"
            value={pickupLocation}
            editable={false}
            className="bg-white rounded-lg border border-gray-300 p-3"
          />
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-1">Destination</Text>
        <TouchableOpacity onPress={() => handleOpenMap("destination")}>
          <TextInput
            placeholder="Select destination"
            value={destinationLocation}
            editable={false}
            className="bg-white rounded-lg border border-gray-300 p-3"
          />
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-1">Receiver’s Name</Text>
        <TextInput
          placeholder="Receiver's Name"
          className="bg-white rounded-lg border border-gray-300 p-3"
          value={receiverName}
          onChangeText={setReceiverName}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-1">Receiver’s Phone Number</Text>
        <TextInput
          placeholder="Receiver's Phone Number"
          keyboardType="phone-pad"
          className="bg-white rounded-lg border border-gray-300 p-3"
          value={receiverPhone}
          onChangeText={setReceiverPhone} // Update the state
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-1">Alternative Phone Number</Text>
        <TextInput
          placeholder="Alternative Phone Number"
          keyboardType="phone-pad"
          className="bg-white rounded-lg border border-gray-300 p-3"
          value={altReceiverPhone}
          onChangeText={setAltReceiverPhone} // Update the state
        />
      </View>

      <Text className="text-lg font-semibold mb-2">Schedule</Text>
      <View className="flex-row justify-between mb-4">
        <View className="flex-1 mr-2">
          <Text className="text-gray-600 mb-1">Date</Text>
          <TouchableOpacity onPress={toggleDatePicker}>
            <TextInput
              placeholder="Select Date"
              value={dateInput}
              editable={false}
              className="bg-white rounded-lg border border-gray-300 p-3"
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>

        <View className="flex-1 ml-2">
          <Text className="text-gray-600 mb-1">Time</Text>
          <TouchableOpacity onPress={toggleTimePicker}>
            <TextInput
              placeholder="Select Time"
              value={timeInput}
              editable={false}
              className="bg-white rounded-lg border border-gray-300 p-3"
            />
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
        </View>
      </View>

      <TouchableOpacity
        className="bg-blue-600 py-4 rounded-full items-center mt-4"
        onPress={handleNavigation}
      >
        <Text className="text-white text-lg font-bold">Continue</Text>
      </TouchableOpacity>
      <MapModal
        visible={mapModalVisible}
        onClose={() => setMapModalVisible(false)}
        onSelectLocation={handleSelectLocation}
      />
    </View>
  );
};

export default PackageDetails;
