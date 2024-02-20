import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import products from "@/assets/data/products";
import Button from "@/src/components/Button";
import { useCart } from "@/src/providers/CartProvider";
import { PizzaSize } from "@/src/types";

export default function ProductDetailsScreen() {
  const Size: PizzaSize[] = ["S", "M", "L", "XL"];
  const { id } = useLocalSearchParams();
  const { addItem } = useCart();
  const product = products.find((item) => item.id.toString() === id);
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("S");
  const router = useRouter();
  if (!product) {
    return <Text>no product found</Text>;
  }
  {
    console.log(selectedSize);
  }
  const addToCart = () => {
    addItem(product, selectedSize);
    router.push("/cart");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />
      <Image
        source={{ uri: product.image }}
        style={{ width: "100%", aspectRatio: 1 }}
      />

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 4 }}>
        R{product.price}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
});
