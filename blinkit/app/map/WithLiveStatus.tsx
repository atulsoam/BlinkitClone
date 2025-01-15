import { hocStyles } from "@/components/global/GlobelStyles";
import CustomText from "@/components/ui/CustomText";
import { getSocketInstance } from "@/services/socket";
import { useAuthStore } from "@/state/authStore";
import { Colors, Fonts } from "@/utils/Constants";
import { useNavigationState } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { FC, useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

const withLiveStatus = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): FC<P> => {
  const WithLiveStatusComponent: FC<P> = (props) => {
    const router = useRouter();
    const { currentOrder, setCurrentOrder } = useAuthStore();
    const routeName = useNavigationState(
      (state) => state.routes[state.index]?.name
    );

    const socket = getSocketInstance(); // Get the singleton socket instance
    useEffect(() => {
      if (currentOrder) {
        if (currentOrder?.status == "delivered") {
          setCurrentOrder(null);
        }
      }
    }, [currentOrder]);
    useEffect(() => {
      if (currentOrder) {
        socket.emit("joinRoom", currentOrder._id); // Join the room only once

        // Event listeners to handle updates
        socket.on("liveTrackingUpdates", (updatedOrder: any) => {
          setCurrentOrder(updatedOrder); // Update the order state with live tracking updates
        });

        socket.on("orderConfirmed", (confirmOrder: any) => {
          setCurrentOrder(confirmOrder); // Handle order confirmation
        });

        socket.on("orderUpdates", (updatedOrder: any) => {
          setCurrentOrder(updatedOrder); // Handle order updates
        });

        // Cleanup listeners when the component unmounts or when currentOrder changes
        return () => {
          socket.off("liveTrackingUpdates");
          socket.off("orderConfirmed");
          socket.off("orderUpdates");
          socket.off("joinRoom");
        };
      }
    }, [currentOrder, socket]); // Only re-run when currentOrder changes

    return (
      <View style={styles.container}>
        <WrappedComponent {...props} />
        {currentOrder && routeName !== "map/LiveTracking" && (
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
                  {currentOrder?.items[0]?.item.name +
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
