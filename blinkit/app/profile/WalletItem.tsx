import { View, Text, StyleSheet } from "react-native";
import React, { FC } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "@/utils/Constants";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "@/components/ui/CustomText";

const WalletItem: FC<{ icon: string; label: string }> = ({ icon, label }) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon as any} color={Colors.text} size={RFValue(20)} />
      <CustomText variant="h8" fontFamily={Fonts.Medium}>
        {label}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});

export default WalletItem;
