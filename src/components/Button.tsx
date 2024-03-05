import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import Colors from "../constants/Colors";
import { forwardRef } from "react";

type ButtonProps = {
  text: string;
  containerStyle?: ViewStyle;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, containerStyle, ...pressableProps }, ref) => {
    return (
      <Pressable
        ref={ref}
        {...pressableProps}
        style={({ pressed }) => [
          styles.container,
          {
            opacity: pressed ? 0.5 : 1,
          },
          containerStyle,
        ]}
      >
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    alignItems: "center",
    borderRadius: 100,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default Button;
