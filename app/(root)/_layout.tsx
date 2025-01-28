import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(delivery)" options={{ headerShown: false }} />
      <Stack.Screen name="(userSettings)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
