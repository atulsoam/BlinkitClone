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
import CustomHeader from "@/components/ui/CustomHeader";
import { Colors, Fonts } from "@/utils/Constants";
import OrderList from "./order/OrderList";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "@/components/ui/CustomText";
import { useCartStore } from "@/state/cartStore";
import BillDetails from "./order/BillDetails";
import { hocStyles } from "@/components/global/GlobelStyles";
import ArrowButton from "./order/ArrowButton";
import { useAuthStore } from "@/state/authStore";
import { createOrder } from "@/services/orderService";
import { useRouter } from "expo-router";

const ProductOrder: FC = () => {
  const router = useRouter();
  const { user, setCurrentOrder, currentOrder, logout } = useAuthStore();
  // console.log(currentOrder, 29);

  // setCurrentOrder(null)
  // logout()
  // if (currentOrder != null){
  //   router.push("/map/LiveTracking")
  // }

  const [loading, setLoading] = useState(false);
  const { getTotalPrice, cart, clearCart } = useCartStore();
  const totalItemPrice = getTotalPrice();
  const HandlePlaceOrder = async () => {
    if (currentOrder !== null) {
      Alert.alert("Let the first order delivered!");
      router.push("/map/LiveTracking")
      return;
    }
    const formatedData = cart.map((item) => ({
      id: item._id,
      item: item._id,
      count: item.count,
    }));
    if (formatedData.length == 0) {
      Alert.alert("Add items to cart to place order.");
      return;
    }
    setLoading(true);

    const data = await createOrder(formatedData, totalItemPrice);
    if (data != null) {
      setCurrentOrder(data);
      clearCart();
      // console.log("navigate to succes order");
      router.push("/order/OrderSuccessScreen");
    } else {
      Alert.alert("Add items to cart to place order.");
      // return;
    }

    setLoading(false);
  };
  return (
    <View style={styles.container}>
      <CustomHeader title="Checkout" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <OrderList />
        <View style={styles.flexRowButton}>
          <View style={styles.flexRow}>
            <Image
              source={require("../assets/icons/coupon.png")}
              style={{ width: 25, height: 25 }}
            />
            <CustomText variant="h6" fontFamily={Fonts.SemiBold}>
              Use Coupons
            </CustomText>
          </View>
          <Ionicons
            name="chevron-forward-outline"
            size={RFValue(16)}
            color={Colors.text}
          />
        </View>
        <BillDetails totalItemPrice={totalItemPrice} />

        <View style={styles.flexRowButton}>
          <View>
            <CustomText
              variant="h8"
              fontFamily={Fonts.SemiBold}
              //   style={styles.cancelText}
            >
              Cancellation Policy
            </CustomText>
            <CustomText
              variant="h9"
              fontFamily={Fonts.SemiBold}
              style={styles.cancelText}
            >
              Order cannot be cancelled once packed for Delivery, In case of
              unexpected delays, a refund will get initated
            </CustomText>
          </View>
        </View>
      </ScrollView>
      <View style={hocStyles.cartContainer}>
        <View style={styles.abscontainer}>
          <View style={styles.addressContainer}>
            <View style={styles.flexRow}>
              <Image
                source={require("../assets/icons/home.png")}
                style={{ width: 20, height: 20 }}
              />
              <View style={{ width: "75%" }}>
                <CustomText variant="h8" fontFamily={Fonts.Medium}>
                  Deliverying to Home
                </CustomText>
                <CustomText
                  variant="h9"
                  numberOfLines={2}
                  style={{ opacity: 0.6 }}
                >
                  {user?.address}
                  {/* Addres will be here */}
                </CustomText>
              </View>
            </View>
            <TouchableOpacity>
              <CustomText
                variant="h8"
                style={{ color: Colors.secondary }}
                fontFamily={Fonts.Medium}
              >
                Change
              </CustomText>
            </TouchableOpacity>
          </View>
          <View style={styles.paymentGatway}>
            <View style={{ width: "30%" }}>
              <CustomText
                fontSize={RFValue(6)}
                variant="h8"
                fontFamily={Fonts.Regular}
              >
                PAY USING
              </CustomText>
              <CustomText
                variant="h9"
                style={{ marginTop: 2 }}
                fontFamily={Fonts.Regular}
              >
                Cash On Delivery
              </CustomText>
            </View>
            <View style={{ width: "70%" }}>
              <ArrowButton
                loading={loading}
                price={totalItemPrice}
                title="Place Order"
                onPress={async () => {
                  await HandlePlaceOrder();
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

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

export default ProductOrder;
