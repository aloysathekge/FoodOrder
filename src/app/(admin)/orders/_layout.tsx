import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Order" }} />
      <Stack.Screen name="[id]" options={{ title: "Order Details" }} />
    </Stack>
  );
}
