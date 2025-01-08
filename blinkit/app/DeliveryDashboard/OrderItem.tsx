import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { Colors, Fonts } from "@/utils/Constants";
import CustomText from "@/components/ui/CustomText";
import { RFValue } from "react-native-responsive-fontsize";
import { formatISOToCustom } from "@/utils/DateUtil";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface CartItem {
  _id: string | number;
  item: any;
  count: number;
}

interface Order {
  orderId: string;
  items: CartItem[];
  deliveryLocation: any;
  totalPrice: number;
  createdAt: string;
  status: "Confirmed" | "Completed";
}
const OrderItem: FC<{ index: number; item: Order }> = ({ index, item }) => {
    const router =  useRouter()
  const getStatusColor = (status: string) => {
    switch (status.toLocaleLowerCase()) {
      case "available":
        return "#28a745";
      case "confirmed":
        return "#007bff";
      case "delivered":
        return "#17a2b8";
      case "cancelled":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.flexRowBetween}>
        <CustomText variant="h8" fontFamily={Fonts.Medium}>
          #{item.orderId}
        </CustomText>
        <View style={[styles.statusContainer]}>
          <CustomText
            variant="h8"
            fontFamily={Fonts.SemiBold}
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status}
          </CustomText>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        {item.items.slice(0, 2).map((i, idx) => {
          return (
            <CustomText variant="h8" numberOfLines={1} key={idx}>
              {i.count}x {i.item.name}
            </CustomText>
          );
        })}
      </View>
      <View style={[styles.flexRowBetween, styles.addressContainer]}>
        <View style={styles.addressTextcontainer}>
          <CustomText variant="h8" numberOfLines={1}>
            {item?.deliveryLocation?.address}
          </CustomText>
          <CustomText style={styles.dateText} variant="h8" numberOfLines={1}>
            {formatISOToCustom(item.createdAt)}
          </CustomText>
        </View>
        <TouchableOpacity style={styles.iconContainer}
        onPress={()=>{
            router.push({
                pathname:"/DeliveryMap",
                params:{item:JSON.stringify(item)}
            })

        }}
        >
            <Ionicons name="arrow-forward-circle-outline" size={RFValue(24)} color={Colors.primary}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.7,
    paddingVertical: 15,
    padding: 10,
    borderRadius: 10,
    borderColor: Colors.border,
    marginVertical: 10,
    backgroundColor: "white",
  },
  flexRowBetween: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  statusContainer: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusText: {
    textTransform: "capitalize",
    color: "White",
  },
  itemsContainer: {
    width: "50%",
    marginTop: 10,
  },
  addressContainer: {
    marginTop: 10,
  },
  addressTextcontainer: {
    width: "70%",
  },
  dateText: {
    marginTop: 2,
    fontSize: RFValue(8),
  },
  iconContainer: {
    alignItems: "flex-end",
  },
});

export default OrderItem;
