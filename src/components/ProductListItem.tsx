import { Image, StyleSheet } from "react-native";
import { Text, View } from "@/src/components/Themed";
import Colors from "@/src/constants/Colors";
import { Product } from "../types";
import { Link, useSegments } from "expo-router";

export const ProductListItem = ({ product }: { product: Product }) => {
  const segment = useSegments();
  console.log(segment);

  return (
    // @ts-expect-error This is necessary because <explanation>
    <Link href={`/${segment[0]}/menu/${product.id}`} asChild>
      <View style={styles.container}>
        <Image
          source={{ uri: product.image || undefined }}
          style={styles.image}
        />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>R{product.price}</Text>
      </View>
    </Link>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  price: {
    fontWeight: "bold",
    color: Colors.light.tint,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
});
