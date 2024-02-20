import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import Button from "@/src/components/Button";
import Colors from "@/src/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
export default function CreateProductScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const onCreate = () => {
    if (!validation()) {
      return;
    }
    console.log(" item created");
    resetFields();
  };
  const resetFields = () => {
    setName("");
    setPrice("");
  };
  const validation = () => {
    setError("");
    if (!name) {
      setError("Name is required");
      return false;
    }
    if (!price) {
      setError("Price is required");
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setError("Price should be a number");
      return false;
    }

    return true;
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri || null);
    }
  };
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Create Product" }} />

      <Image
        source={{
          uri: image || "https://via.placeholder.com/200x200",
        }}
        style={styles.image}
      />
      <Text style={styles.selectImageText} onPress={pickImage}>
        Select Image
      </Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        placeholder="name"
        style={styles.input}
        onChangeText={setName}
      />
      <Text style={styles.label}>Price (R)</Text>
      <TextInput
        value={price}
        placeholder="9.99"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setPrice}
      />
      <Text style={{ color: "red" }}>{error}</Text>
      <Button text="Create" onPress={onCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
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
  image: {
    width: "50%",
    aspectRatio: 1,
    borderRadius: 100,
    alignSelf: "center",
  },
  selectImageText: {
    alignSelf: "center",
    fontWeight: "bold",
    marginTop: 10,
    color: Colors.light.tint,
  },
});
