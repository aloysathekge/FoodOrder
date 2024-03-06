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
  sendPushNotification: (expoPushToken: string) => Promise<void>;
  schedulePushNotification: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null
);

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const { session } = useAuth();
  const userId = session?.user.id;

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
      console.log(token);
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
    let isMounted = true;
    registerForPushNotificationsAsync().then(async (token) => {
      setExpoPushToken(token?.data);
      await supabase
        .from("profiles")
        .upsert({ id: userId ?? "", expo_push_token: token?.data });
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
      if (isMounted || (response && response?.notification)) {
        return;
      }
      console.log("I have last Notification...... wow!!");
      redirect(response?.notification ?? null);
    });

    return () => {
      if (notificationListener) {
        Notifications.removeNotificationSubscription(notificationListener);
      }
      if (responseListener) {
        Notifications.removeNotificationSubscription(responseListener);
      }
      isMounted = false;
    };
  }, []);

  const sendPushNotification = async (expoPushToken: string) => {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Original Title",
      body: "And here is the body!",
      data: { someData: "goes here" },
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

  const schedulePushNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Layo",
        body: "Arsenal vs Barcelona",
        data: { data: "goes here", url: "/(user)/menu/" },
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
