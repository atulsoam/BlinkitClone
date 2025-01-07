import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { screenHeight, screenWidth } from "@/utils/Scaling";
import { Colors, Fonts } from "@/utils/Constants";
import CustomText from "@/components/ui/CustomText";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useRouter } from "expo-router";

const CartSummary: FC<{ cartCount: number; cartImage?: string }> = ({
  cartCount,
  cartImage,
}) => {

    const router =  useRouter()
  return (
    <View style={styles.container}>
      <View style={styles.flexRowGap}>
        <Image
          source={
            cartImage === null
              ? require("../../assets/icons/bucket.png")
              : { uri: cartImage }
          }
          style={styles.image}
        />
        <CustomText fontFamily={Fonts.SemiBold} variant="h7">
          {cartCount} Item{cartCount > 1 ? "s" : ""}
        </CustomText>
        <Ionicons
          name="caret-up-outline"
          color={Colors.secondary}
          size={RFValue(25)}
        />
      </View>

      <TouchableOpacity
        style={styles.btn}
        activeOpacity={0.7}
        onPress={() => {
          router.push("/ProductOrder")
        }}
      >
        <CustomText
          variant="h8"
          style={styles.btnText}
          fontFamily={Fonts.Medium}
        >
          Next
        </CustomText>
        <Ionicons
          name="caret-forward-outline"
          color="#fff"
          size={RFValue(20)}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: screenWidth * 0.05,
    paddingBottom: screenHeight * 0.03,
    paddingTop: screenHeight * 0.014,
  },
  flexRowGap: {
    alignItems: "center",
    flexDirection: "row",
    gap: screenWidth * 0.03,
  },
  image: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    borderRadius: screenWidth * 0.025,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: screenHeight * 0.01,
    borderRadius: screenWidth * 0.025,
    backgroundColor: Colors.secondary,
    paddingHorizontal: screenWidth * 0.1,
  },
  btnText: {
    marginLeft: screenWidth * 0.02,
    color: "#fff",
  },
});

export default CartSummary;
