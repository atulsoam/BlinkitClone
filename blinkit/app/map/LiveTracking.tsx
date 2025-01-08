import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { FC, useEffect } from "react";
import { useAuthStore } from "@/state/authStore";
import { getOrderByID } from "@/services/orderService";
import { Colors, Fonts } from "@/utils/Constants";
import LiveHeader from "./LiveHeader";
import LiveMap from "./LiveMap";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "@/components/ui/CustomText";
import DeliveryAndDetails from "./DeliveryAndDetails";
import OrderSummary from "./OrderSummary";
import withLiveStatus from "./WithLiveStatus";

const LiveTracking: FC = () => {
  const { currentOrder, setCurrentOrder } = useAuthStore();

  const fetchOrderDetails = async () => {
    const data = await getOrderByID(currentOrder?._id as any);
    setCurrentOrder(data);
  };
  useEffect(() => {
    fetchOrderDetails();
  }, []);
  console.log(currentOrder, 22);

  let message = "Packing your order";
  let time = "Arriving in 10 mins";
  if (currentOrder?.status == "confirmed") {
    message = "Arriving Soon";
    time = "Arriving in 8 Minutes";
  } else if (currentOrder?.status == "arriving") {
    message = "order picked up";
    time = "Arriving in 6 Minutes";
  } else if (currentOrder?.status == "delivered") {
    message = "order Delivered";
    time = "Fastest Delivery";
  }
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
          hasAccepted={currentOrder?.status == "confirmed"}
          hasPickedUp={currentOrder?.status == "arriving"}
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
                  "We will assign deliver Partner soon"}
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
                  ? "For Delivery instruction you can contact delivery partner"
                  : message}
              </CustomText>
            )}
          </View>
        </View>

        <DeliveryAndDetails details={currentOrder?.customer} />
        <OrderSummary order={currentOrder} />
        {/* <View style={styles.flexRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="heart-circle-outline" color={Colors.disabled} size={RFValue(20)}/>
          </View>
          <View style={{width}}></View>
        </View> */}
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

export default withLiveStatus(LiveTracking);
