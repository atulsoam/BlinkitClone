import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { FC } from "react";
import { Colors, Fonts } from "@/utils/Constants";
import CustomText from "./CustomText";

interface CustomButtonprops {
  onPress?: () => void;
  title?: string;
  disabled?: boolean;
  loading?: boolean;
}

const CustomButton: FC<CustomButtonprops> = ({
  onPress,
  title,
  disabled,
  loading,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          backgroundColor: disabled ? Colors.disabled : Colors.secondary,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <CustomText
          variant="h6"
          fontFamily={Fonts.SemiBold}
          style={styles.text}
        >
          {title}
        </CustomText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
    width: "100%",
  },
  text: {
    color: "#fff",
  },
});

export default CustomButton;
