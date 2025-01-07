import { View, Text, StyleSheet } from "react-native";
import React, { FC } from "react";
import CustomText from "@/components/ui/CustomText";
import { Colors, Fonts } from "@/utils/Constants";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

const ReportItems: FC<{
  iconName: any;
  underLine?: boolean;
  title: string;
  price: number;
}> = ({ iconName, underLine, title, price }) => {
  return (
    <View style={[styles.flexRowBetween, { marginBottom: 10 }]}>
      <View style={styles.flexRow}>
        <Ionicons name={iconName} size={RFValue(12)} color={Colors.text} />
        <CustomText
          variant="h8"
          fontFamily={Fonts.SemiBold}
          style={{
            textDecorationLine: underLine ? "underline" : "none",
            textDecorationStyle: "dashed",
          }}
        >
          {title}
        </CustomText>
      </View>
      <CustomText variant="h8" fontFamily={Fonts.SemiBold}>
        ₹{price}
      </CustomText>
    </View>
  );
};

const BillDetails: FC<{ totalItemPrice: number }> = ({ totalItemPrice }) => {
  return (
    <View style={styles.container}>
      <CustomText variant="h4" style={styles.text} fontFamily={Fonts.SemiBold}>
        Bill Details
      </CustomText>
      <View style={styles.billContainer}>
        <ReportItems
          iconName="newspaper-outline"
          title="Item total"
          price={totalItemPrice}
        />
        <ReportItems
          iconName="bicycle-outline"
          title="Delivery Charges"
          price={29}
        />
        <ReportItems
          iconName="bag-handle-outline"
          title="Handleing charges"
          price={2}
        />
        <ReportItems iconName="rainy-outline" title="surge Charges" price={3} />
      </View>
      <View style={[styles.flexRowBetween, { marginBottom: 15 }]}>
        <CustomText
          variant="h7"
          fontFamily={Fonts.SemiBold}
          style={styles.text}
        >
          Grand Total
        </CustomText>
        <CustomText
          variant="h7"
          fontFamily={Fonts.SemiBold}
          style={styles.text}
        >
          ₹ {totalItemPrice + 34}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginVertical: 15,
  },
  text: {
    marginHorizontal: 10,
    marginTop: 15,
  },
  billContainer: {
    padding: 10,
    paddingBottom: 0,
    borderBottomColor: Colors.border,
    borderBottomWidth: 0.7,
  },
  flexRowBetween: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});

export default BillDetails;
