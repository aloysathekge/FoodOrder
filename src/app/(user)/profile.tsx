import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Button from "@/src/components/Button";
import { supabase } from "@/src/lib/supabase";

export default function ProfileScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>ProfileScreen</Text>
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