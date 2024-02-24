import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import TextInput from "@/src/components/TextInput";
import { Link, Stack } from "expo-router";
import Button from "@/src/components/Button";
import Colors from "@/src/constants/Colors";
import { supabase } from "@/src/lib/supabase";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setLoading(false);
      console.log(error.message);
      Alert.alert(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sign in" }} />
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
        text={loading ? "Loading..." : "Sign In"}
        onPress={signInWithEmail}
      />
      <Link
        href={"/(auth)/sign-up"}
        style={{
          alignSelf: "center",
          marginTop: 10,
        }}
      >
        <Text style={styles.signUpText}>Create an Account</Text>
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

    color: Colors.light.tint,
  },
});
