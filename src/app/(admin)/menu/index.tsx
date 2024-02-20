import products from "@/assets/data/products";
import { ProductListItem } from "@/src/components/ProductListItem";
import { View, StyleSheet, FlatList } from "react-native";
export default function TabOneScreen() {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductListItem product={item} />}
      numColumns={2}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
});
