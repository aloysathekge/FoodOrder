import { FlatList, StyleSheet, Text, View } from "react-native";
import { useCart } from "../providers/CartProvider";
import CartListItem from "../components/CartListItem";
import Button from "../components/Button";

export default function CartScreen() {
  const { items, addItem, total, checkout } = useCart();
  return (
    <View style={{ padding: 10 }}>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{ gap: 10 }}
      />
      <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "500" }}>
        Total:R{total}
      </Text>
      <Button text="Checkout" onPress={checkout} />
    </View>
  );
}

const styles = StyleSheet.create({});
