import { hocStyles } from "@/components/global/GlobelStyles";
import CustomText from "@/components/ui/CustomText";
import { SOCKETURL } from "@/services/config";
import { getOrderByID } from "@/services/orderService";
import { useAuthStore } from "@/state/authStore";
import { Colors, Fonts } from "@/utils/Constants";
import { useNavigationState } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { FC, useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import io from "socket.io-client";

const withLiveStatus = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): FC<P> => {
  const WithLiveStatusComponent: FC<P> = (props) => {
    const router = useRouter();
    const { currentOrder, setCurrentOrder } = useAuthStore();
    const routeName = useNavigationState(
      (state) => state.routes[state.index]?.name
    );
    // console.log(routeName, 20);

    const fetchOrderDeails = async () => {
      const data = await getOrderByID(currentOrder?._id as any);
      setCurrentOrder(data);
    };

    useEffect(() => {
      if (currentOrder) {
        const socketInstance = io(SOCKETURL, {
          transports: ["websocket"],
          withCredentials: false,
        });

        socketInstance.emit("joinRoom", currentOrder?._id);
        socketInstance.on("liveTrackingUpdates", (updatedOrder) => {
          fetchOrderDeails();
          // console.log("Receiving live updates");
        });
        socketInstance.on("orderConfirmed", (confirmOrder) => {
          fetchOrderDeails();
          // console.log("Receiving orderConfirmed updates");
        });

        return () => {
          socketInstance.disconnect();
        };
      }
    }, [currentOrder]);

    return (
      <View style={styles.container}>
        <WrappedComponent {...props} />
        {currentOrder && routeName != "map/LiveTracking" && (
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
                  Order is {currentOrder?.status}
                </CustomText>
                <CustomText variant="h9" fontFamily={Fonts.Medium}>
                  {currentOrder?.items![0]?.item.name +
                    (currentOrder?.items?.length - 1 > 0
                      ? `and ${currentOrder?.items?.length - 1} + items`
                      : "")}
                </CustomText>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push("/map/LiveTracking");
              }}
              style={styles.btn}
            >
              <CustomText
                variant="h8"
                style={{ color: Colors.secondary }}
                fontFamily={Fonts.Medium}
              >
                View
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
