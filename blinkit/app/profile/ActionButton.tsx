import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { Colors, Fonts } from "@/utils/Constants";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "@/components/ui/CustomText";

const ActionButton: FC<{ icon: any; label: string; onPress?: () => void }> = ({
  icon,
  label,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <View style={styles.iconcontainer}>
        <Ionicons name={icon} color={Colors.text} size={RFValue(14)} />
      </View>
      <CustomText variant="h7" fontFamily={Fonts.Medium}>
        {label}
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
  },
  iconcontainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 100,
    backgroundColor: Colors.backgroundSecondary,
  },
});

export default ActionButton;
