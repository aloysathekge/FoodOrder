import { FlatList, StyleSheet, View, Text, Pressable } from "react-native";
import React from "react";
import orders from "@/assets/data/orders";
import OrderListItem from "@/src/components/OrderListItem";
import { OrderStatusList } from "@/src/types";
import Colors from "@/src/constants/Colors";
export default function OrdersScreen() {
  return (
    <View>
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderListItem order={item} />}
        contentContainerStyle={{ gap: 10, padding: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
