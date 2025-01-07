import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { useCartStore } from "@/state/cartStore";
import CustomText from "@/components/ui/CustomText";
import { Colors, Fonts } from "@/utils/Constants";
import OrderItems from "./OrderItems";

const OrderList = () => {
  const cartItems = useCartStore((state) => state.cart);
  const totalItems = cartItems.reduce((total, item) => total + item.count, 0);
  return (
    <View style={styles.container}>
      <View style={styles.flexRow}>
        <View style={styles.imgcontainer}>
          <Image
            source={require("../../assets/icons/clock.png")}
            style={styles.img}
          />
        </View>
        <View>
          <CustomText variant="h5" fontFamily={Fonts.SemiBold}>
            Delivery in 9 Minutes
          </CustomText>
          <CustomText
            variant="h5"
            style={{ opacity: 0.5 }}
            fontFamily={Fonts.SemiBold}
          >
            Shipment of {totalItems} Items
          </CustomText>
        </View>
      </View>
      {cartItems?.map((item)=>{
        return(
            <OrderItems key={item._id} item={item}/>
        )
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
  },
  flexRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  imgcontainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    borderRadius: 15,
  },
  img: {
    width: 30,
    height: 30,
  },
});

export default OrderList;
