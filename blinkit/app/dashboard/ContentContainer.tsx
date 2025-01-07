import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { adData, categories } from "@/utils/dummyData";
import AdCrousel from "./AdCrousel";
import CustomText from "@/components/ui/CustomText";
import { Fonts } from "@/utils/Constants";
import CatogeryContainer from "./CatogeryContainer";

const ContentContainer = () => {
  console.log("Rendering ContentContainer", adData);

  return (
    <View style={styles.container}>
      <AdCrousel adData={adData} />
      <CustomText variant="h5" fontFamily={Fonts.SemiBold}>
        Grocery & Kitchen
      </CustomText>
      <CatogeryContainer data={categories} />
      <CustomText variant="h5" fontFamily={Fonts.SemiBold}>
        Best seller
      </CustomText>
      <CatogeryContainer data={categories} />
      <CustomText variant="h5" fontFamily={Fonts.SemiBold}>
        Snacks & Drinks
      </CustomText>
      <CatogeryContainer data={categories} />
      <CustomText variant="h5" fontFamily={Fonts.SemiBold}>
        Home & Cleaning
      </CustomText>
      <CatogeryContainer data={categories} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
});
export default ContentContainer;
