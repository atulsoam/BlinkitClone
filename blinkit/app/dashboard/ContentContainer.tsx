import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { adData } from "@/utils/dummyData"; // Assuming adData is a mock
import AdCrousel from "./AdCrousel";
import CustomText from "@/components/ui/CustomText";
import { Fonts } from "@/utils/Constants";
import CatogeryContainer from "./CatogeryContainer";

// This function now expects mainCatogery to be passed directly, not wrapped in an object.
const ContentContainer = ({ mainCatogery }: { mainCatogery: any[] }) => {
  return (
    <View style={styles.container}>
      <AdCrousel adData={adData} />

      {mainCatogery?.map(({ name, subCategory, _id }: any) => {
        return (
          <View key={_id}>
            <CustomText variant="h5" fontFamily={Fonts.SemiBold}>
              {name}
            </CustomText>
            {/* Pass the subCategory data to CatogeryContainer */}
            <CatogeryContainer data={subCategory} />
          </View>
        );
      })}

      {/* Optional: Additional categories if you want to render more */}
      {/* Uncomment and adapt the following code if needed */}
      {/* 
      <CustomText variant="h5" fontFamily={Fonts.SemiBold}>
        Best seller
      </CustomText>
      <CatogeryContainer data={categories} />
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
});

export default ContentContainer;
