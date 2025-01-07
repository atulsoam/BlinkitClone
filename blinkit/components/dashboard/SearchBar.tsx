import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "@/utils/Constants";
import { RFValue } from "react-native-responsive-fontsize";
import RollingBar from "react-native-rolling-bar";
import CustomText from "../ui/CustomText";

const SearchBar:FC = () => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
      <Ionicons name="search" size={RFValue(20)} color={Colors.text} />
      <RollingBar
        interval={3000}
        defaultStyle={false}
        customStyle={styles.rollingBar}
      >
        <CustomText variant="h6" fontFamily={Fonts.Medium}>
          Search for products, and more...
        </CustomText>
        <CustomText variant="h6" fontFamily={Fonts.Medium}>
          Search "Sweets"
        </CustomText>
        <CustomText variant="h6" fontFamily={Fonts.Medium}>
          Search "Cakes"
        </CustomText>
        <CustomText variant="h6" fontFamily={Fonts.Medium}>
          Search "Bakery"
        </CustomText>
        <CustomText variant="h6" fontFamily={Fonts.Medium}>
          Search "Chips"
        </CustomText>
      </RollingBar>
      <View style={styles.divider} />
      <Ionicons name="mic" color={Colors.text} size={RFValue(20)} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3F4F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    borderWidth: 0.6,
    borderColor: Colors.border,
    marginTop: 15,
    overflow: "hidden",
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  rollingBar: {
    width: "90%",
    paddingLeft: 10,
    height: 50,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#dddd",
    marginHorizontal: 10,
  },
});

export default SearchBar;
