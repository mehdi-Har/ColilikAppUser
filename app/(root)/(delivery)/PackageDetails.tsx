import React, { useState } from "react";
import { useSearchParams } from "expo-router/build/hooks";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Platform,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import MapModal from "@/components/MapModal";
import { icons } from "@/constants";
import { Item } from "@/types/type";

const PackageDetails = () => {
  const [errors, setErrors] = useState({
    pickupLocation: "",
    destinationLocation: "",
    receiverName: "",
    receiverPhone: "",
    altReceiverPhone: "",
    dimension: "",
    qte: "",
    scheduleDate: "",
    scheduleTime: "",
    pickUpDate: "",
    pickUpTime: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const imageUri = searchParams.get("imageUri");
  const senderName = searchParams.get("senderName");
  const altSenderPhone = searchParams.get("altSenderPhone");
  const senderPhone = searchParams.get("senderPhone");
  const userId = searchParams.get("userId");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState<string | false>(false);
  const [showTimePicker, setShowTimePicker] = useState<string | false>(false);

  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [pickUpDateInput, setPickUpDateInput] = useState("");
  const [pickUpTimeInput, setPickUpTimeInput] = useState("");

  const [qte, setQte] = useState("");
  const [dimension, setDimension] = useState("");
  const [items, setItems] = useState<Item[]>([]);
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
  const navigation = useNavigation();
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
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split("T")[0];
      setDateInput(formattedDate);
    }
  };

  const onPickUpDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setPickupDate(date);
      const formattedDate = date.toISOString().split("T")[0];
      setPickUpDateInput(formattedDate);
    }
  };

  const onTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      setSelectedTime(time);
      const formattedTime = time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTimeInput(formattedTime);
    }
  };

  const onPickUpTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      setPickupTime(time);
      const formattedTime = time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setPickUpTimeInput(formattedTime);
    }
  };
  const handleAddNewItem = () => {
    const newItem: Item = {
      dimension: parseInt(dimension),
      qte: parseInt(qte),
      photo: encodeURI(imageUri!),
    };
    setItems((prevItems) => [...prevItems, newItem]);
    router.push({
      pathname: "/NewItem",
      params: {
        imageUri: encodeURI(imageUri!),
        senderName: senderName,
        altSenderPhone: altSenderPhone,
        senderPhone: senderPhone,
        destinationLocation: destinationLocation,
        pickupLocation: pickupLocation,
        receiverName: receiverName,
        receiverPhone: receiverPhone,
        altReceiverPhone: altReceiverPhone,
        scheduleDate: dateInput,
        scheduleTime: timeInput,
        pickupDate: pickUpDateInput,
        pickupTime: pickUpTimeInput,
        destinationLongitude: destinationCoords?.longitude,
        destinationLatitude: destinationCoords?.latitude,
        pickupLongitude: pickupCoords?.longitude,
        pickupLatitude: pickupCoords?.latitude,
        items: JSON.stringify([...items, newItem]),
        userId: userId,
      },
    });
  };
  const handleNavigation = () => {
    const newItem: Item = {
      dimension: parseInt(dimension),
      qte: parseInt(qte),
      photo: encodeURI(imageUri!),
    };

    if (items.length > 0 || (dimension && qte && imageUri)) {
      const updatedItems = [...items, newItem];
      const fromPackageDetails = "1";
      const encodedItems = updatedItems.map((item) => ({
        ...item,
        photo: encodeURI(item.photo),
      }));

      console.log("Parsed items:", encodedItems); // Debug updated items

      router.push({
        pathname: "/SummerizePackage",
        params: {
          senderName: senderName,
          altSenderPhone: altSenderPhone,
          senderPhone: senderPhone,
          destinationLocation: destinationLocation,
          pickupLocation: pickupLocation,
          receiverName: receiverName,
          receiverPhone: receiverPhone,
          altReceiverPhone: altReceiverPhone,
          scheduleDate: dateInput,
          scheduleTime: timeInput,
          pickupDate: pickUpDateInput,
          pickupTime: pickUpTimeInput,
          destinationLongitude: destinationCoords?.longitude,
          destinationLatitude: destinationCoords?.latitude,
          pickupLongitude: pickupCoords?.longitude,
          pickupLatitude: pickupCoords?.latitude,
          items: JSON.stringify(encodedItems), // Use updated items
          source: fromPackageDetails,
          userId: userId,
        },
      });

      setItems(updatedItems);
    } else {
      router.push({
        pathname: "/SummerizePackage",
        params: {
          senderName: senderName,
          altSenderPhone: altSenderPhone,
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
          items: JSON.stringify(items), // Use the current state
          source: "1",
        },
      });
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-gray-100 p-4">
          <View className="flex-row items-center mb-5">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-3"
            >
              <Image source={icons.backArrow} className="w-6 h-6" />
            </TouchableOpacity>
            <Text className="text-xl font-bold">Package details</Text>
          </View>

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
            {formSubmitted && errors.pickupLocation && (
              <Text className="text-red-500 text-sm">
                {errors.pickupLocation}
              </Text>
            )}
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
            {formSubmitted && errors.destinationLocation && (
              <Text className="text-red-500 text-sm">
                {errors.destinationLocation}
              </Text>
            )}
          </View>
          <Text className="text-lg font-semibold mb-2">Package details</Text>
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Receiver’s Name</Text>
            <TextInput
              placeholder="Receiver's Name"
              className="bg-white rounded-lg border border-gray-300 p-3"
              value={receiverName}
              onChangeText={setReceiverName}
            />
            {formSubmitted && errors.receiverName && (
              <Text className="text-red-500 text-sm">
                {errors.receiverName}
              </Text>
            )}
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Receiver’s Phone Number</Text>
            <TextInput
              placeholder="Receiver's Phone Number"
              keyboardType="phone-pad"
              className="bg-white rounded-lg border border-gray-300 p-3"
              value={receiverPhone}
              onChangeText={setReceiverPhone}
            />
            {formSubmitted && errors.receiverPhone && (
              <Text className="text-red-500 text-sm">
                {errors.receiverPhone}
              </Text>
            )}
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Alternative Phone Number</Text>
            <TextInput
              placeholder="Alternative Phone Number"
              keyboardType="phone-pad"
              className="bg-white rounded-lg border border-gray-300 p-3"
              value={altReceiverPhone}
              onChangeText={setAltReceiverPhone}
            />
          </View>
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Items dimension</Text>
            <TextInput
              placeholder="enter the dimension of your item"
              keyboardType="numeric"
              className="bg-white rounded-lg border border-gray-300 p-3"
              value={dimension}
              onChangeText={setDimension}
            />
            {formSubmitted && errors.dimension && (
              <Text className="text-red-500 text-sm">{errors.dimension}</Text>
            )}
          </View>
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Item quantity</Text>
            <TextInput
              placeholder="enter the quantity of your item"
              keyboardType="numeric"
              className="bg-white rounded-lg border border-gray-300 p-3"
              value={qte}
              onChangeText={setQte}
            />
            {formSubmitted && errors.qte && (
              <Text className="text-red-500 text-sm">{errors.qte}</Text>
            )}
          </View>

          <Text className="text-lg font-semibold mb-2">Schedule</Text>
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-gray-600 mb-1">Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker("schedule")}>
                <TextInput
                  placeholder="Select Date"
                  value={dateInput}
                  editable={false}
                  className="bg-white rounded-lg border border-gray-300 p-3"
                />
              </TouchableOpacity>
              {formSubmitted && errors.scheduleDate && (
                <Text className="text-red-500 text-sm">
                  {errors.scheduleDate}
                </Text>
              )}
              {showDatePicker === "schedule" && (
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
              <TouchableOpacity onPress={() => setShowTimePicker("schedule")}>
                <TextInput
                  placeholder="Select Time"
                  value={timeInput}
                  editable={false}
                  className="bg-white rounded-lg border border-gray-300 p-3"
                />
              </TouchableOpacity>
              {formSubmitted && errors.scheduleTime && (
                <Text className="text-red-500 text-sm">
                  {errors.scheduleTime}
                </Text>
              )}
              {showTimePicker === "schedule" && (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  display="default"
                  onChange={onTimeChange}
                />
              )}
            </View>
          </View>

          <Text className="text-lg font-semibold mb-2">Pick-up Time</Text>
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-gray-600 mb-1">Pick-up Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker("pickup")}>
                <TextInput
                  placeholder="Select Pick-up Date"
                  value={pickUpDateInput}
                  editable={false}
                  className="bg-white rounded-lg border border-gray-300 p-3"
                />
              </TouchableOpacity>
              {formSubmitted && errors.pickUpDate && (
                <Text className="text-red-500 text-sm">
                  {errors.pickUpDate}
                </Text>
              )}
              {showDatePicker === "pickup" && (
                <DateTimePicker
                  value={pickupDate}
                  mode="date"
                  display="default"
                  onChange={onPickUpDateChange}
                />
              )}
            </View>

            {/* Pick-up Time Section */}
            <View className="flex-1 ml-2">
              <Text className="text-gray-600 mb-1">Pick-up Time</Text>
              <TouchableOpacity onPress={() => setShowTimePicker("pickup")}>
                <TextInput
                  placeholder="Select Pick-up Time"
                  value={pickUpTimeInput}
                  editable={false}
                  className="bg-white rounded-lg border border-gray-300 p-3"
                />
              </TouchableOpacity>
              {formSubmitted && errors.pickUpTime && (
                <Text className="text-red-500 text-sm">
                  {errors.pickUpTime}
                </Text>
              )}
              {showTimePicker === "pickup" && (
                <DateTimePicker
                  value={pickupTime}
                  mode="time"
                  display="default"
                  onChange={onPickUpTimeChange}
                />
              )}
            </View>
          </View>
          <TouchableOpacity
            className="bg-blue-600 py-4 rounded-full items-center mt-4"
            onPress={handleAddNewItem}
          >
            <Text className="text-white text-lg font-bold">
              add another item
            </Text>
          </TouchableOpacity>
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
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default PackageDetails;
