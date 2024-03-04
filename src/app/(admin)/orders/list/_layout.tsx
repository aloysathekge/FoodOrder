import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { SafeAreaView } from "react-native";

const TobTab = withLayoutContext(createMaterialTopTabNavigator().Navigator);
export default function _layout() {
  return (
    <SafeAreaView style={{ flex: 1, marginTop: 22 }}>
      <TobTab>
        <TobTab.Screen name="index" options={{ title: "Active" }} />
        <TobTab.Screen name="archive" options={{ title: "Delivered" }} />
      </TobTab>
    </SafeAreaView>
  );
}
