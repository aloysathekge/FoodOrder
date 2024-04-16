import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthProvider";
import { router } from "expo-router";
import { ExpoPushToken } from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

interface NotificationContextValue {
  expoPushToken: string | undefined;
  notification: Notifications.Notification | null;
  sendPushNotification: (
    expoPushToken: string,
    title: string,
    body: string,
    data: { data: string; url: string }
  ) => Promise<void>;
  schedulePushNotification: (
    title: string,
    body: string,
    data: { data: string; url: string }
  ) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null
);

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const { profile, loading } = useAuth();

  const savePushToken = async (newToken: string | undefined) => {
    setExpoPushToken(newToken);
    if (!newToken || !profile) {
      return;
    }
    console.log("new token ready to be saved:", newToken);
    // update the token in the database
    const { error } = await supabase
      .from("profiles")
      .update({ expo_push_token: newToken })
      .eq("id", profile.id);
    console.log("error message, is", error);
  };

  const registerForPushNotificationsAsync = async () => {
    let token: ExpoPushToken | undefined;

    if (Platform.OS === "android") {
      console.log("running on Android Expo Go");
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      console.log("It's a physical device this one or considered as");

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
      console.log("executing line 83", token);
      savePushToken(token.data);
    } else {
      console.log("Must use physical device for Push Notifications");
    }

    return token;
  };

  const redirect = (notification: Notifications.Notification | null) => {
    if (notification) {
      const url = notification.request.content.data?.url;
      if (url) {
        router.push(url);
      }
    }
  };

  useEffect(() => {
    if (!profile || loading) {
      return; // Return early if profile is null or loading
    }
    registerForPushNotificationsAsync().then(async (token) => {
      setExpoPushToken(token?.data);
    });

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("The notification is tapped", response);
        redirect(response.notification);
      });

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response?.notification) {
        redirect(response.notification);
      }
    });

    return () => {
      if (notificationListener) {
        Notifications.removeNotificationSubscription(notificationListener);
      }
      if (responseListener) {
        Notifications.removeNotificationSubscription(responseListener);
      }
    };
  }, [profile, loading]);

  const sendPushNotification = async (
    expoPushToken: string,
    title: string,
    body: string,
    data: { data: string; url: string }
  ) => {
    const message = {
      to: expoPushToken,
      sound: "default",
      title,
      body,
      data: {
        ...data,
        url: data.url, // Include the url property in the data object
      },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  const schedulePushNotification = async (
    title: string,
    body: string,
    data: { data: string; url: string }
  ) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data,
      },
      trigger: {
        seconds: 5,
      },
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        sendPushNotification,
        schedulePushNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext)!;
