import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import OrderListItem from "@/src/components/OrderListItem";
import OrderItemListItem from "@/src/components/OrderItemListItem";
import { OrderStatusList } from "@/src/types";
import Colors from "@/src/constants/Colors";
import { useOrderDetails, useUpdateOrder } from "@/src/api/orders";
import { useUpdatetOrderSubscription } from "@/src/api/orders/subscriptions";
import { supabase } from "@/src/lib/supabase";
import { Tables } from "@/src/database.types";
//import { notifyUserAboutOrder } from "@/src/lib/notifications";

export default function OrderDetailsScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);
  const { data: order, isLoading, error } = useOrderDetails(id);
  const { mutate: updateOrder } = useUpdateOrder();
  useUpdatetOrderSubscription(id);

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Error with this: {error.message}</Text>;
  }
  const changeStatus = async (status: string) => {
    updateOrder({ id: id, updatedFields: { status } });
    console.log("updating status of user: ", order?.user_id);
    if (order) {
      notifyUserAboutOrderUpdate(order);
    }
  };

  const getUserToken = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("expo_push_token")
      .eq("id", userId)
      .single();
    return data?.expo_push_token;
  };

  const notifyUserAboutOrderUpdate = async (order: Tables<"orders">) => {
    const token = await getUserToken(order.user_id);
    console.log("Notifying : ", token);
  };
  return (
    <View style={{ padding: 10, gap: 5 }}>
      <Stack.Screen options={{ title: `Order #${id}` }} />
      {order && <OrderListItem order={order} />}
      <FlatList
        data={order && order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 5 }}
        ListFooterComponent={
          <>
            <Text style={{ fontWeight: "bold" }}>Status</Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              {OrderStatusList.map((status) => (
                <Pressable
                  key={status}
                  style={{
                    borderColor: Colors.light.tint,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 10,
                    backgroundColor:
                      order && order.status === status
                        ? Colors.light.tint
                        : "transparent",
                  }}
                  onPress={() => changeStatus(status)}
                >
                  <Text
                    style={{
                      color:
                        order && order.status === status
                          ? "white"
                          : Colors.light.tint,
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        }
      />
    </View>
  );
}
