import { Pressable, StyleSheet, Text, View } from "react-native";
import { Order } from "../types";
import moment from "moment";
import { Link, useSegments } from "expo-router";
type orderListItemProps = {
  order: Order;
};
export default function OrderListItem({ order }: orderListItemProps) {
  const segments = useSegments();
  return (
    // @ts-expect-error This is necessary because <explanation>
    <Link href={`/${segments[0]}/orders/${order.id}`} asChild>
      <Pressable style={styles.container}>
        <View>
          <Text style={{ fontSize: 12, fontWeight: "bold" }}>
            Order #{order.id}
          </Text>
          <Text>{moment(order.created_at).fromNow()}</Text>
        </View>
        <Text style={{ fontWeight: "bold" }}>{order.status}</Text>
      </Pressable>
    </Link>
  );
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    alignItems: "center",
  },
});
