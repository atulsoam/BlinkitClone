import { hocStyles } from "@/components/global/GlobelStyles";
import CustomText from "@/components/ui/CustomText";
import { SOCKETURL } from "@/services/config";
import { getOrderByID, sendLiveOrderUpdates } from "@/services/orderService";
import { useAuthStore } from "@/state/authStore";
import { Colors, Fonts } from "@/utils/Constants";
import { useNavigationState } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { FC, useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import io from "socket.io-client";

import * as Location from "expo-location";

const withLiveStatus = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): FC<P> => {
  const WithLiveStatusComponent: FC<P> = (props) => {
    const router = useRouter();
    const { currentOrder, setCurrentOrder, user } = useAuthStore();
    const routeName = useNavigationState(
      (state) => state.routes[state.index]?.name
    );
    const [mylocation, setMylocation] = useState<any>(null);

    // console.log(routeName, 20);

    const fetchOrderDeails = async () => {
      const data = await getOrderByID(currentOrder?._id as any);
      setCurrentOrder(data);
    };

    const configureLocation = async (): Promise<void> => {
      // Request foreground permission for precise location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
    };

    useEffect(() => {
      if (currentOrder) {
        configureLocation();
        const watchID = Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10,
          },
          async (position) => {
            const { latitude, longitude } = position.coords;

            setMylocation({ latitude, longitude });
          }
        );
      }
      // return()=>watchID.remove();
    }, [currentOrder]);

    useEffect(() => {
      async function sendLiveUpdates() {
        if (
          currentOrder?.deliveryPartner?._id == user?._id &&
          currentOrder?.status != "delivered" &&
          currentOrder?.status != "cancelled"
        ) {
          await sendLiveOrderUpdates(
            mylocation,
            currentOrder?._id,
            currentOrder?.status
          );
          fetchOrderDeails();
        }
      }
      sendLiveUpdates();
    }, [mylocation]);

    return (
      <View style={styles.container}>
        <WrappedComponent {...props} />
        {currentOrder && (
          <View
            style={[
              hocStyles.cartContainer,
              { flexDirection: "row", alignItems: "center" },
            ]}
          >
            <View style={styles.flexRow}>
              <View style={styles.img}>
                <Image
                  source={require("../../assets/icons/bucket.png")}
                  style={{ width: 20, height: 20 }}
                />
              </View>
              <View style={{ width: "68%" }}>
                <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
                  #{currentOrder?.orderId}
                </CustomText>
                <CustomText variant="h9" fontFamily={Fonts.Medium}>
                  {currentOrder?.deliveryLocation?.address}
                </CustomText>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/DeliveryMap",
                  params: { item: JSON.stringify(currentOrder) },
                });
              }}
              style={styles.btn}
            >
              <CustomText
                variant="h8"
                style={{ color: Colors.secondary }}
                fontFamily={Fonts.Medium}
              >
                Continue
              </CustomText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  return WithLiveStatusComponent;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 15,
    marginBottom: 15,
    paddingVertical: 10,
    padding: 10,
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 0.7,
    borderColor: Colors.secondary,
    borderRadius: 5,
  },
  img: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 100,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default withLiveStatus;
