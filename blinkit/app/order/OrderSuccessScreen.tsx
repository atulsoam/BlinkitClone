import { View, Text, StyleSheet } from "react-native";
import React, { FC, useEffect } from "react";
import { screenWidth } from "@/utils/Scaling";
import { Colors, Fonts } from "@/utils/Constants";
import LottieView from "lottie-react-native";
import CustomText from "@/components/ui/CustomText";
import { useAuthStore } from "@/state/authStore";
import { useRouter } from "expo-router";

const OrderSuccessScreen: FC = () => {
  const { user } = useAuthStore();
  const router =  useRouter();
  useEffect(() => {
    const timeout = setTimeout(() => {
      // console.log("Moving to live tracking screen");
      router.push("/map/LiveTracking")
    }, 2300);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <View style={styles.conatiner}>
      <LottieView
        source={require("../../assets/animations/confirm.json")}
        autoPlay
        duration={2000}
        loop={false}
        speed={1}
        style={styles.lottieView}
        enableMergePathsAndroidForKitKatAndAbove
        hardwareAccelerationAndroid
      />
      <CustomText
        variant="h8"
        fontFamily={Fonts.SemiBold}
        style={styles.orderPlaceText}
      >
        ORDER PLACED
      </CustomText>
      <View style={styles.deliveryContainer}>
        <CustomText
          variant="h4"
          fontFamily={Fonts.SemiBold}
          style={styles.deliverText}
        >
          Deliverying to Home
        </CustomText>
      </View>
      <CustomText
        variant="h8"
        style={styles.addresText}
        fontFamily={Fonts.Medium}
      >
        {user?.address || "Somewhere or No where"}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    justifyContent: "center",
    alignItems: "center",

    flex: 1,
  },
  lottieView: {
    width: screenWidth * 0.6,
    height: 150,
  },
  orderPlaceText: {
    opacity: 0.4,
  },
  deliveryContainer: {
    borderBottomWidth: 2,
    paddingBottom: 4,
    marginBottom: 5,
    borderColor: Colors.secondary,
  },
  deliverText: {
    marginTop: 15,
    borderColor: Colors.secondary,
  },
  addresText: {
    opacity: 0.8,
    width: "80%",
    textAlign: "center",
    marginTop: 10,
  },
});

export default OrderSuccessScreen;
