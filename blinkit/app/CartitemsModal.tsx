import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { FC, useState } from "react";
import { Colors, Fonts } from "@/utils/Constants";
import OrderList from "./order/OrderList";

import { useCartStore } from "@/state/cartStore";
import BillDetails from "./order/BillDetails";

import { useRouter } from "expo-router";

const CartitemsModal = () => {
  const router = useRouter();
  const { getTotalPrice } = useCartStore();
  const totalItemPrice = getTotalPrice();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <OrderList />
        <BillDetails totalItemPrice={totalItemPrice} />
      </ScrollView>
    </View>
  );
};

export default CartitemsModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    paddingBottom: 250,
  },
  flexRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  flexRowButton: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    flexDirection: "row",
    borderRadius: 15,
  },
  cancelText: {
    marginTop: 4,
    opacity: 0.6,
  },
  abscontainer: {
    marginVertical: 15,
    marginBottom: Platform.OS == "ios" ? 30 : 10,
  },
  addressContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.7,
    borderColor: Colors.border,
  },
  paymentGatway: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 14,
  },
});
