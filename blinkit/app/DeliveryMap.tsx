import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React, { FC, useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/state/authStore";
import { confirmOrder, sendLiveOrderUpdates } from "@/services/orderService";
import { Colors, Fonts } from "@/utils/Constants";
import { useSearchParams } from "expo-router/build/hooks";
import * as Location from "expo-location";
import LiveHeader from "./map/LiveHeader";
import LiveMap from "./map/LiveMap";
import DeliveryAndDetails from "./map/DeliveryAndDetails";
import OrderSummary from "./map/OrderSummary";
import { hocStyles } from "@/components/global/GlobelStyles";
import CustomButton from "@/components/ui/CustomButton";
import io from "socket.io-client";
import { SOCKETURL } from "@/services/config";
import CustomText from "@/components/ui/CustomText";

// Socket Singleton to avoid multiple instances
let socketInstance = io(SOCKETURL, {
  transports: ["websocket"],
  withCredentials: false,
});

const DeliveryMap: FC = () => {
  const user = useAuthStore((state) => state.user);
  const [orderData, setOrderData] = useState<any>(null);
  const [mylocation, setMylocation] = useState<any>(null);
  const searchParams = useSearchParams();
  const item = searchParams.get("item");
  const parsedItem = item ? JSON.parse(item) : null;
  const { setCurrentOrder } = useAuthStore();

  const fetchOrderDetails = useCallback(async () => {
    console.log("data requested socket");
    socketInstance.emit("needOrderData", parsedItem?._id);
  }, [parsedItem?._id]);

  useEffect(() => {
    socketInstance.emit("joinRoom", parsedItem?._id);
    fetchOrderDetails();
    return () => {
      socketInstance.off("joinRoom");
      socketInstance.off("needOrderData");
    };
  }, [parsedItem?._id, fetchOrderDetails]);

  useEffect(() => {
    socketInstance.on("orderUpdates", (updatedOrder) => {
      console.log("data received from socket");
      setOrderData(updatedOrder);
    });

    return () => {
      socketInstance.off("orderUpdates");
    };
  }, [mylocation]);

  useEffect(() => {
    const watchID = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 50,
      },
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, 67);

        // Avoid triggering unnecessary updates
        if (
          mylocation &&
          (mylocation.latitude !== latitude ||
            mylocation.longitude !== longitude)
        ) {
          setMylocation({ latitude, longitude });
          syncLocation(latitude, longitude);
        }
        if (!mylocation){
          setMylocation({ latitude, longitude });

        }
      }
    );
    return () => {
      watchID.then((subscription) => subscription.remove());
    };
  }, [mylocation, orderData]);

  const syncLocation = async (latitude: number, longitude: number) => {
    if (orderData && orderData?.deliveryPartner) {
      socketInstance.emit("updateLocation", {
        location: { latitude, longitude },
        orderId: orderData._id,
        userID: user?._id,
      });
    }
  };

  const acceptOrder = async () => {
    const data = await confirmOrder(mylocation, orderData?._id);
    if (data) {
      setCurrentOrder(data);
      Alert.alert("Order Accepted, Grab your package");
      fetchOrderDetails();
    } else {
      Alert.alert("There was an error");
    }
  };

  const orderPickedUp = async () => {
    const data = await sendLiveOrderUpdates(
      mylocation,
      orderData?._id,
      "arriving"
    );
    if (data) {
      setCurrentOrder(data);
      Alert.alert("Order Picked Up, Deliver as soon as possible");
      fetchOrderDetails();
    } else {
      Alert.alert("There was an error");
    }
  };

  const DeliverOrder = async () => {
    const data = await sendLiveOrderUpdates(
      mylocation,
      orderData?._id,
      "delivered"
    );
    if (data) {
      setCurrentOrder(data);
      Alert.alert("Order Delivered, Thank you");
      fetchOrderDetails();
    } else {
      console.log(data,132);
      
      Alert.alert("There was an error");
    }
  };

  const getMessage = () => {
    if (orderData?.deliveryPartner?._id === user?._id) {
      switch (orderData?.status) {
        case "confirmed":
          return "Grab your order";
        case "arriving":
          return "Complete your order";
        case "delivered":
          return "Your milestone";
        default:
          return "Start this order";
      }
    } else if (orderData?.status === "available") {
      return "You Missed it";
    }
    return "Start this order";
  };

  return (
    <View style={styles.container}>
      <LiveHeader
        type="Delivery"
        title={getMessage()}
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
            orderData?.status === "confirmed"
          }
          hasPickedUp={orderData?.status === "arriving"}
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
      {orderData?.status !== "delivered" &&
        orderData?.status !== "cancelled" && (
          <View style={[hocStyles.cartContainer, styles.btncontainer]}>
            {orderData?.status === "available" && (
              <CustomButton
                disabled={false}
                title="Accept Order"
                onPress={acceptOrder}
                loading={false}
              />
            )}
            {orderData?.status === "confirmed" &&
              orderData?.deliveryPartner?._id === user?._id && (
                <CustomButton
                  disabled={false}
                  title="PickUp order"
                  onPress={orderPickedUp}
                  loading={false}
                />
              )}
            {orderData?.status === "arriving" &&
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
  },
  scrollcontainer: {
    paddingBottom: 150,
    backgroundColor: Colors.backgroundSecondary,
    padding: 15,
  },
  btncontainer: {
    padding: 10,
  },
});

export default DeliveryMap;
