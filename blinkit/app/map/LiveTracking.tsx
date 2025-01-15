import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { FC, useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/state/authStore";
import { Colors, Fonts } from "@/utils/Constants";
import LiveHeader from "./LiveHeader";
import LiveMap from "./LiveMap";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "@/components/ui/CustomText";
import DeliveryAndDetails from "./DeliveryAndDetails";
import OrderSummary from "./OrderSummary";
import { SOCKETURL } from "@/services/config";
import io from "socket.io-client";

// Socket Singleton
let socketInstance = io(SOCKETURL, {
  transports: ["websocket"],
  withCredentials: false,
});

const LiveTracking: FC = () => {
  const { currentOrder, setCurrentOrder } = useAuthStore();
  const [isOrderFetched, setIsOrderFetched] = useState(false);

  // Fetch the order details from socket
  const fetchOrderDetails = useCallback(() => {
    if (currentOrder?._id && !isOrderFetched) {
      socketInstance.emit("needOrderData", currentOrder._id);
      setIsOrderFetched(true); // To avoid multiple requests
    }
  }, [currentOrder?._id, isOrderFetched]);
  console.log(currentOrder);

  // Listen for order updates in real-time (optimized to only update if data changes)
  useEffect(() => {
    if (currentOrder?._id) {
      socketInstance.emit("joinRoom", currentOrder._id); // Join room by order ID
    }

    const orderUpdatesHandler = (updatedOrder: any) => {
      // Only update state if the order data has changed
      if (JSON.stringify(updatedOrder) !== JSON.stringify(currentOrder)) {
        setCurrentOrder(updatedOrder);
      }
    };

    socketInstance.on("orderUpdates", orderUpdatesHandler);

    // Cleanup the listener and leave the room when the component is unmounted
    return () => {
      socketInstance.off("orderUpdates", orderUpdatesHandler);
      if (currentOrder?._id) {
        socketInstance.emit("leaveRoom", currentOrder._id); // Optionally leave the room
      }
    };
  }, [currentOrder?._id, setCurrentOrder]);

  // Sync the order status
  let message = "Packing your order";
  let time = "Arriving in 10 mins";
  if (currentOrder?.status === "confirmed") {
    message = "Arriving Soon";
    time = "Arriving in 8 Minutes";
  } else if (currentOrder?.status === "arriving") {
    message = "Order picked up";
    time = "Arriving in 6 Minutes";
  } else if (currentOrder?.status === "delivered") {
    message = "Order Delivered";
    time = "Fastest Delivery";
  }

  // Fetch order details when the component is mounted or currentOrder changes
  useEffect(() => {
    fetchOrderDetails();
  }, [currentOrder?._id, fetchOrderDetails]); // This will only re-fetch when currentOrder changes

  return (
    <View style={styles.container}>
      <LiveHeader type="Customer" title={message} secondTitle={time} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollcontainer}
      >
        <LiveMap
          deliveryPersonLocation={currentOrder?.deliveryPersonLocation}
          deliveryLocation={currentOrder?.deliveryLocation || null}
          hasAccepted={currentOrder?.status === "confirmed"}
          hasPickedUp={currentOrder?.status === "arriving"}
          pickupLocation={currentOrder?.pickupLocation || null}
        />
        <View style={styles.flexRow}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={
                currentOrder?.deliveryPartner ? "call-outline" : "bag-outline"
              }
              color={Colors.disabled}
              size={RFValue(20)}
            />
          </View>

          <View style={{ width: "82%" }}>
            {currentOrder?.deliveryPartner && (
              <CustomText
                numberOfLines={1}
                variant="h7"
                fontFamily={Fonts.SemiBold}
              >
                {currentOrder?.deliveryPartner?.name ||
                  "We will assign a delivery partner soon"}
              </CustomText>
            )}
            {currentOrder?.deliveryPartner && (
              <CustomText variant="h7" fontFamily={Fonts.Medium}>
                {currentOrder?.deliveryPartner?.phone}
              </CustomText>
            )}
            {currentOrder?.deliveryPartner && (
              <CustomText variant="h9" fontFamily={Fonts.Medium}>
                {currentOrder?.deliveryPartner
                  ? "For delivery instructions, you can contact the delivery partner"
                  : message}
              </CustomText>
            )}
          </View>
        </View>
        {currentOrder && currentOrder?.customer && (
          <>
            <DeliveryAndDetails details={currentOrder?.customer} />
            <OrderSummary order={currentOrder} />
          </>
        )}

        <CustomText
          variant="h8"
          fontFamily={Fonts.SemiBold}
          style={{ opacity: 0.6, marginTop: 20 }}
        >
          Atul Soam X Blinkit
        </CustomText>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  scrollcontainer: {
    paddingBottom: 150,
    backgroundColor: Colors.backgroundSecondary,
    padding: 15,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    borderRadius: 15,
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 0.7,
    borderColor: Colors.border,
  },
  iconContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 100,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LiveTracking;
