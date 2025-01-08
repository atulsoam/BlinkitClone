import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "@/utils/Constants";
import WalletItem from "./WalletItem";

const WalletSection = () => {
  return (
    <View style={styles.walletContainer}>
      <WalletItem icon="wallet-outline" label="wallet" />
      <WalletItem icon="chatbubble-ellipses-outline" label="support" />
      <WalletItem icon="card-outline" label="payments" />
    </View>
  );
};

const styles = StyleSheet.create({
  walletContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    paddingVertical: 15,
    borderRadius: 15,
    paddingHorizontal: 20,
    marginVertical: 20,
  },
});

export default WalletSection;
