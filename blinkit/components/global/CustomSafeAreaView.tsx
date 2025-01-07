import { View, Text, ViewStyle, SafeAreaView, StyleSheet } from "react-native";
import React, { ReactNode, FC } from "react";

interface CustomSafeAreaProps {
  children: ReactNode;
  customStyle?: ViewStyle;
}

const CustomSafeAreaView: FC<CustomSafeAreaProps> = ({
  children,
  customStyle,
}) => {
  return (
    <SafeAreaView style={[styles.container, customStyle]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",
  },
});

export default CustomSafeAreaView;
