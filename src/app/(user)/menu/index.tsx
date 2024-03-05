import { useProductList } from "@/src/api/products";
import { ProductListItem } from "@/src/components/ProductListItem";
import { supabase } from "@/src/lib/supabase";
import { Link } from "expo-router";
import { Text } from "react-native";
import { StyleSheet, FlatList, ActivityIndicator } from "react-native";
export default function TabOneScreen() {
  const { data: products, error, isLoading } = useProductList();

  if (isLoading) {
    <ActivityIndicator />;
  }
  if (error) {
    <Text>Failed to load data</Text>;
  }
  return (
    <>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductListItem product={item} />}
        numColumns={2}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
});
