import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { useAuthStore } from "@/state/authStore";
import {
  confirmOrder,
  getOrderByID,
  sendLiveOrderUpdates,
} from "@/services/orderService";
import { Colors, Fonts } from "@/utils/Constants";

import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "@/components/ui/CustomText";

import { useSearchParams } from "expo-router/build/hooks";
import * as Location from "expo-location";
import LiveHeader from "./map/LiveHeader";
import LiveMap from "./map/LiveMap";
import DeliveryAndDetails from "./map/DeliveryAndDetails";
import OrderSummary from "./map/OrderSummary";
import { hocStyles } from "@/components/global/GlobelStyles";
import CustomButton from "@/components/ui/CustomButton";

const DeliveryMap: FC = () => {
  const user = useAuthStore((state) => state.user);
  const [orderData, setOrderData] = useState<any>(null);
  const [mylocation, setMylocation] = useState<any>(null);
  const searchParams = useSearchParams();
  const item = searchParams.get("item");
  console.log(item,30);
  
  const parsedItem = item ? JSON.parse(item) : null;

  const { setCurrentOrder } = useAuthStore();

  const fetchOrderDetails = async () => {
    const data = await getOrderByID(parsedItem?._id as any);
    setOrderData(data);
  };
  useEffect(() => {
    fetchOrderDetails();
  }, []);
  const configureLocation = async (): Promise<void> => {
    // Request foreground permission for precise location
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
  };

  useEffect(() => {
    configureLocation();
    const watchID = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      async (position) => {
        const { latitude, longitude } = position.coords;

        setMylocation({ latitude, longitude });
      }
    );
    // return()=>watchID.remove();
  }, [mylocation]);

  let message = "Start this order";
  if (
    orderData?.deliveryPartner?._id == user?._id &&
    orderData?.status === "confirmed"
  ) {
    message = "Grab your order";
  } else if (
    orderData?.deliveryPartner?._id == user?._id &&
    orderData?.status === "arriving"
  ) {
    message = "Complete your order";
  } else if (
    orderData?.deliveryPartner?._id == user?._id &&
    orderData?.status === "delivered"
  ) {
    message = "Your milestone";
  } else if (
    orderData?.deliveryPartner?._id != user?._id &&
    orderData?.status === "available"
  ) {
    message = "You Missed it";
  }

  useEffect(() => {
    async function sendLiveUpdates() {
      if (
        orderData?.deliveryPartner?._id == user?._id &&
        orderData?.status != "delivered" &&
        orderData?.status != "cancelled"
      ) {
        await sendLiveOrderUpdates(
          mylocation,
          orderData?._id,
          orderData?.status
        );
        fetchOrderDetails();
      }
    }
    sendLiveUpdates()
  }, [mylocation]);

  const acceptOrder = async () => {
    console.log("clicked accept order", orderData?._id);

    const data = await confirmOrder(mylocation, orderData?._id);
    if (data) {
      setCurrentOrder(data);
      Alert.alert("Order Accepted, Grab your package");
    } else {
      Alert.alert("There was an error");
    }
    fetchOrderDetails();
  };
  const orderPickedUp = async () => {
    const data = await sendLiveOrderUpdates(
      mylocation,

      orderData?._id,
      "arriving"
    );
    if (data) {
      setCurrentOrder(data);
      //   Alert.alert("Order Accepted, Grab your package");
    } else {
      Alert.alert("There was an error");
    }
    fetchOrderDetails();
  };

  const DeliverOrder = async () => {
    const data = await sendLiveOrderUpdates(
      mylocation,

      orderData?._id,
      "delivered"
    );
    if (data) {
      setCurrentOrder(data);
      //   Alert.alert("Order Accepted, Grab your package");
    } else {
      Alert.alert("There was an error");
    }
    fetchOrderDetails();
  };


  return (
    <View style={styles.container}>
      <LiveHeader
        type="Delivery"
        title={message}
        secondTitle="Delivery in 10 minutes"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollcontainer}
      >
        <LiveMap
          deliveryPersonLocation={
            orderData?.deliveryPersonLocation || mylocation
          }
          deliveryLocation={orderData?.deliveryLocation || null}
          hasAccepted={
            orderData?.deliveryPartner?._id === user?._id &&
            orderData?.status == "confirmed"
          }
          hasPickedUp={orderData?.status == "arriving"}
          pickupLocation={orderData?.pickupLocation || null}
        />

        <DeliveryAndDetails details={orderData?.customer} />
        <OrderSummary order={orderData} />

        <CustomText
          variant="h8"
          fontFamily={Fonts.SemiBold}
          style={{ opacity: 0.6, marginTop: 20 }}
        >
          Atul Soam X Blinkit
        </CustomText>
      </ScrollView>
      {orderData?.status != "delivered" && orderData?.status != "cancelled" && (
        <View style={[hocStyles.cartContainer, styles.btncontainer]}>
          {orderData?.status == "available" && (
            <CustomButton
              disabled={false}
              title="Accept Order"
              onPress={acceptOrder}
              loading={false}
            />
          )}
          {orderData?.status == "confirmed" &&
            orderData?.deliveryPartner?._id === user?._id && (
              <CustomButton
                disabled={false}
                title="PickUp order"
                onPress={orderPickedUp}
                loading={false}
              />
            )}
          {orderData?.status == "arriving" &&
            orderData?.deliveryPartner?._id === user?._id && (
              <CustomButton
                disabled={false}
                title="Delivered"
                onPress={DeliverOrder}
                loading={false}
              />
            )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    // color:Colors.primary
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
  btncontainer: {
    padding: 10,
  },
});

export default  DeliveryMap;
