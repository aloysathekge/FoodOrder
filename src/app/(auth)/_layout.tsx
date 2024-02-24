import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/src/providers/AuthProvider";

export default function AuthStack() {
  const { session } = useAuth();
  if (session) {
    return <Redirect href={"/"} />;
  }
  return <Stack />;
}
