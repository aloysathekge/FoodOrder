import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Button from "@/src/components/Button";
import Colors from "@/src/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/src/api/products";
import { supabase } from "@/src/lib/supabase";
import { randomUUID } from "expo-crypto";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
export default function CreateProductScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const { id: idString } = useLocalSearchParams();
  const isUpdating = !!idString;
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0]
  );
  const router = useRouter();
  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: updatingProduct } = useProduct(id);
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setImage(updatingProduct.image);
      setPrice(updatingProduct.price.toString());
    }
  }, [updatingProduct]);

  const onCreate = async () => {
    if (!validation()) {
      return;
    }
    const imagePath = await uploadImage();
    insertProduct(
      { name, image: imagePath, price: parseFloat(price) },
      {
        onSuccess: () => {
          console.log(" item created");
          resetFields();
          router.back();
        },
      }
    );
  };
  const onUpdate = () => {
    if (!validation()) {
      console.log("Validation error");
      return;
    }
    console.log(name, price);

    if (typeof price !== "undefined") {
      updateProduct(
        { id, name, image, price: parseFloat(price) },
        {
          onSuccess: () => {
            console.log(" item Updated");
            resetFields();
            router.back();
          },
          onError: (error) => {
            console.log(error);
          },
        }
      );
    }
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
  const onSubmit = () => {
    if (isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
  };
  const onDelete = () => {
    deleteProduct(id, {
      onSuccess: () => {
        router.replace("/(admin)");
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };
  const confirmDelete = () => {
    if (Platform.OS === "web") {
      console.log("Are you sure you want to delete?");
      //onDelete()
    } else {
      Alert.alert("Confirm", "Are you sure you want to delete ", [
        {
          text: "Cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: onDelete,
        },
      ]);
    }
  };

  const uploadImage = async () => {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), { contentType });

    if (data) {
      return data.path;
    }
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
  return isPending ? (
    <ActivityIndicator />
  ) : (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? "Update Product" : "Create Product" }}
      />

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
      <Button text={isUpdating ? "Update" : "Create"} onPress={onSubmit} />
      {isUpdating && (
        <Text onPress={confirmDelete} style={styles.selectImageText}>
          Delete
        </Text>
      )}
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
