import { Stack } from "expo-router";

export default function DeliveryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="delivery"
        options={{
          title: "Delivery",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NewOrder"
        options={{
          title: "Delivery",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ColisForm"
        options={{
          title: "Upload",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PackageInfo"
        options={{
          title: "packageInformation",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PackageDetails"
        options={{
          title: "continue",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DummyListDrivers"
        options={{
          title: "continue",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
