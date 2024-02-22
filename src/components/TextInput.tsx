import { StyleSheet, Text, View, TextInput as RNTextInput } from "react-native";
import React from "react";
type TextInputProps = {
  label: string;
  placeHolder: string;
  onChangeText: (text: string) => void;
  value: string;
  secureText?: boolean;
};
export default function TextInput({
  label,
  placeHolder,
  onChangeText,
  value,
  secureText,
}: TextInputProps) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <RNTextInput
        placeholder={placeHolder}
        onChangeText={(text) => onChangeText(text)}
        value={value}
        style={styles.input}
        secureTextEntry={secureText}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "gray",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
});
