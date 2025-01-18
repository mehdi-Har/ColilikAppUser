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
    </Stack>
  );
}
