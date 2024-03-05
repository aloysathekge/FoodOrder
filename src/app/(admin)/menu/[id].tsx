import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/src/components/Button";
import { useCart } from "@/src/providers/CartProvider";
import { PizzaSize } from "@/src/types";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";
import { useProduct } from "@/src/api/products";
import RemoteImage from "@/src/components/RemoteImage";
import { defaultImage } from "@/src/components/ProductListItem";

export default function ProductDetailsScreen() {
  const Size: PizzaSize[] = ["S", "M", "L", "XL"];
  const { id: idString } = useLocalSearchParams();

  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);
  const { data: product, error, isLoading } = useProduct(id);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("S");
  const router = useRouter();
  if (isLoading) {
    <ActivityIndicator />;
  }
  if (error) {
    <Text>Failed to load data</Text>;
  }
  const addToCart = () => {
    if (product) {
      addItem(product, selectedSize);
      router.push("/cart");
    } else {
      // Handle the case where product is undefined
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Menu",
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <>
                    <FontAwesome
                      name="pencil"
                      size={25}
                      color={Colors.light.tint}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  </>
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      {product && (
        <>
          <Stack.Screen options={{ title: product.name }} />
          <RemoteImage
            path={product.image}
            fallback={defaultImage}
            style={{ width: "100%", aspectRatio: 1 }}
          />
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 4 }}>
            R{product.price}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
});
