import { StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { Link, Stack } from "expo-router";
import TextInput from "@/src/components/TextInput";
import Button from "@/src/components/Button";
import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";
import { isLoaded } from "expo-font";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setLoading(false);
      console.log(error.message);
      Alert.alert(error.message);
    }
  }
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
      <Button
        text={loading ? "loading..." : "Create Account"}
        onPress={signUpWithEmail}
        disabled={loading}
      />
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
