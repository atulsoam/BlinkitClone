import CustomButton from "@/components/ui/CustomButton";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import CardsPayment from "./paymentModes/CardsPayment";
import UpiPayment from "./paymentModes/UpiPayment";
import { useCartStore } from "@/state/cartStore";
import { useRouter } from "expo-router";

const paymentModes = [
  { id: "upi", label: "UPI", image: require("../assets/icons/upi.png") },
  {
    id: "card",
    label: "Credit/Debit Card",
    image: require("../assets/icons/cards.png"),
  },
];

const PaymentModal = () => {
  const { setPaymentMode, getPaymentMode } = useCartStore();

  const [selectedPaymentMode, setSelectedPaymentMode] = useState(
    paymentModes[0].id
  );

  const router = useRouter();

  const handleSelectPaymentMode = (mode: any) => {
    setSelectedPaymentMode(mode);
  };

  const handlePaymentMode = async (selectedMode: any) => {
    await setPaymentMode(selectedMode);
    router.back();
  };

  const renderContent = () => {
    switch (selectedPaymentMode) {
      case "upi":
        return <UpiPayment setPaymentMode={handlePaymentMode} />;
      case "card":
        return <CardsPayment />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Payment Method</Text>
      <View style={styles.tabsContainer}>
        {paymentModes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[
              styles.tab,
              selectedPaymentMode === mode.id && styles.activeTab,
            ]}
            onPress={() => handleSelectPaymentMode(mode.id)}
          >
            <Image source={mode.image} style={styles.tabImage} />
            <Text
              style={[
                styles.tabText,
                selectedPaymentMode === mode.id && styles.activeTabText,
              ]}
            >
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.contentContainer}>{renderContent()}</View>
      <View style={styles.buttonContainer}>
        <CustomButton title="Done" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  activeTab: {
    borderBottomColor: "#007BFF",
  },
  tabImage: {
    width: 50,
    height: 20,
    marginBottom: 5,
    resizeMode: "contain",
  },
  tabText: {
    fontSize: 16,
    color: "#000",
  },
  activeTabText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    // padding: 20,
    // backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  contentText: {
    fontSize: 16,
  },
  buttonContainer: {
    justifyContent: "flex-end",
  },
});

export default PaymentModal;
