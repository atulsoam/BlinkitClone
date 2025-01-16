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
import { createOrder, getOrderByID } from "@/services/orderService";
import { useRouter } from "expo-router";
import RazorpayCheckout from "react-native-razorpay";

const ProductOrder: FC = () => {
  const router = useRouter();
  const { user, setCurrentOrder, currentOrder } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const { getTotalPrice, cart, clearCart, getPaymentMode } = useCartStore();
  const totalItemPrice = getTotalPrice();
  const paymentModeData = getPaymentMode();
  const selectedAddress = user?.address.find(
    (addr: any) => addr.isSelected === true
  );
  const addressToShow = selectedAddress
    ? selectedAddress.address
    : user?.address[0]?.address;
  // console.log(selectedAddress,"selectedAddress");

  const HandlePayment = async () => {
    const options = {
      description: "Purchase Description",
      // image: "https://your-image-url.com",
      currency: "INR",
      key: "rzp_test_EHQwt0AWXcffIx", // Your Razorpay test key
      amount: (totalItemPrice + 34) * 100, // Amount in paise
      name: "Balaji Foods",
      prefill: {
        contact: user?.phone,
        name: user?.name,
      },
      theme: { color: "#F37254" },
    };
    return RazorpayCheckout.open(options)
      .then((data: any) => {
        // Payment successful
        console.log("Payment Successful", data);
        return { success: true, data };
      })
      .catch((error: any) => {
        // Payment failed
        console.log("Payment Failed", error);
        return { success: false, error };
      });
    // return false
  };
  const HandlePlaceOrder = async () => {
    const paymentStatus = await HandlePayment();
    console.log(paymentStatus, 72);

    if (!paymentStatus.success) {
      Alert.alert("Payment Failed");
      return;
    }
    if (currentOrder !== null) {
      Alert.alert("Let the first order delivered!");
      router.push("/map/LiveTracking");
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

    const data = await createOrder(
      formatedData,
      totalItemPrice,
      selectedAddress._id,
      paymentStatus.data?.razorpay_payment_id
    );
    if (data != null) {
      const updatedData = await getOrderByID(data._id);
      setCurrentOrder(updatedData);
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
                  {addressToShow}
                  {/* Addres will be here */}
                </CustomText>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push("/ChangeAddressModal");
              }}
            >
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
            <TouchableOpacity
              style={{ width: "30%" }}
              onPress={() => {
                // router.push("/PaymentModal");
              }}
            >
              <CustomText
                fontSize={RFValue(8)}
                variant="h5"
                fontFamily={Fonts.SemiBold}
              >
                PAY USING
              </CustomText>
              <CustomText
                variant="h9"
                style={{ marginTop: 2 }}
                fontFamily={Fonts.Regular}
              >
                Select on next screen
              </CustomText>
            </TouchableOpacity>
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
