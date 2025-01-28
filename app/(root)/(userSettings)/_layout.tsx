import { Stack } from "expo-router";

export default function UserSettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="userConfig"
        options={{
          title: "user configuration",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BecomeDriver"
        options={{
          title: "becoming a driver",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
