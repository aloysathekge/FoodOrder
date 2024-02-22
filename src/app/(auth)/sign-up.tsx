import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Link, Stack } from "expo-router";
import TextInput from "@/src/components/TextInput";
import Button from "@/src/components/Button";
import Colors from "@/src/constants/Colors";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Create Account" }} />
      <TextInput
        label="Name"
        value={email}
        onChangeText={setEmail}
        placeHolder="Email"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeHolder="Password"
        secureText
      />
      <Button text="Sign Up" />
      <Link href={"/(auth)/sign-in"} style={{ alignSelf: "center" }}>
        <Text style={styles.signUpText}>Sign In</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  signUpText: {
    fontWeight: "bold",
    marginTop: 10,
    color: Colors.light.tint,
  },
});
