import Colors from "@/src/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function MenuStack() {
  const itemCount = 3;
  {
    console.log("Am in a User mode");
  }

  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          <Link href="/cart" asChild>
            <Pressable>
              {({ pressed }) => (
                <>
                  <FontAwesome
                    name="shopping-cart"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />

                  {itemCount > 0 && (
                    <View
                      style={{
                        position: "absolute",
                        right: 8,
                        top: -12,
                        backgroundColor: "red",
                        borderRadius: 10,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 12 }}>
                        {itemCount}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </Pressable>
          </Link>
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: "Menu" }} />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
