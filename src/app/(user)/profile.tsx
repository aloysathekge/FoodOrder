import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Button from "@/src/components/Button";
import { supabase } from "@/src/lib/supabase";
import { useNotification } from "@/src/providers/NotificationProvider";

export default function ProfileScreen() {
  const {
    expoPushToken,
    sendPushNotification,
    notification,
    schedulePushNotification,
  } = useNotification();
  const handleSendNotification = async () => {
    if (expoPushToken) {
      const title = "Food Ordering";
      const body = "your food is being cooked";
      const data = { data: "Data goes here", url: "/(user)/menu/" };
      await sendPushNotification(expoPushToken, title, body, data);
      //await schedulePushNotification();
    }
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>ProfileScreen</Text>
      <Text>{expoPushToken}</Text>
      <Text>Notification title: {notification?.request.content.body}</Text>
      <Button text="Send Notification" onPress={handleSendNotification} />

      <Button
        containerStyle={styles.button}
        text={"Log out"}
        onPress={() => supabase.auth.signOut()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "red",
    width: "80%",
    position: "absolute",
    bottom: 10,
  },
});
