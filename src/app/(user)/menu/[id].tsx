import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/src/components/Button";
import { useCart } from "@/src/providers/CartProvider";
import { PizzaSize } from "@/src/types";
import { useProduct } from "@/src/api/products";
import { defaultImage } from "@/src/components/ProductListItem";

export default function ProductDetailsScreen() {
  const router = useRouter();
  const Size: PizzaSize[] = ["S", "M", "L", "XL"];
  const { id: idString } = useLocalSearchParams();

  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  const { data: product, error, isLoading } = useProduct(id);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("S");
  if (isLoading) {
    return <ActivityIndicator size={"small"} />;
  }
  if (error) {
    return <Text>Failed to load data</Text>;
  }
  console.log("product name is", product?.name);

  const addToCart = () => {
    if (product) {
      addItem(product, selectedSize);
      router.push("/cart");
    } else {
      // Handle the case where product is undefined
    }
  };
  if (isLoading) {
    return <ActivityIndicator size={"small"} />;
  }
  if (error) {
    return <Text>Failed to load data</Text>;
  }
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isLoading ? "Loading..." : product?.name }}
      />
      <Image
        source={{
          uri: product?.image || defaultImage,
        }}
        style={{ width: "100%", aspectRatio: 1 }}
      />
      <Text style={{ fontSize: 16 }}>Select Size</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 8,
        }}
      >
        {Size.map((size) => (
          <TouchableOpacity
            onPress={() => setSelectedSize(size)}
            style={{
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: "#ccc",
              backgroundColor: size === selectedSize ? "gainsboro" : "#fff",
              borderRadius: 5,
              padding: 10,
              minWidth: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text key={size}>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: "auto" }}>
        R{product?.price}
      </Text>
      <Button text="Add To Cart" onPress={() => addToCart()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
});
