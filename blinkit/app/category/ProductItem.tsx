import { View, Text, StyleSheet, Image } from "react-native";
import React, { FC } from "react";
import { Colors, Fonts } from "@/utils/Constants";
import { screenHeight } from "@/utils/Scaling";
import CustomText from "@/components/ui/CustomText";
import { RFValue } from "react-native-responsive-fontsize";
import UniversalAdd from "../../components/ui/universalAdd";

const ProductItem: FC<{ item: any; index: number }> = ({ item, index }) => {
    // console.log(item,10);
    
  const isSecondColumn = index % 2 !== 0;
  return (
    <View style={[styles.container, { marginRight: isSecondColumn ? 10 : 0 }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>
      <View style={styles.content}>
        <View style={styles.flexrow}>
          <Image
            source={require("../../assets/icons/clock.png")}
            style={styles.icon}
          />
          <CustomText
            fontSize={RFValue(6)}
            fontFamily={Fonts.Medium}
            variant="h8"
          >
            8 Mins
          </CustomText>
        </View>
        <CustomText
          variant="h8"
          fontFamily={Fonts.Medium}
          numberOfLines={2}
          style={{ marginVertical: 4 }}
        >
          {item.name}
        </CustomText>
        <View style={styles.priceContainer}>
          <View>
            <CustomText
              variant="h8"
              fontFamily={Fonts.Medium}
              //   style={{ color: Colors.primary }}
            >
              $ {item?.price}
            </CustomText>
            <CustomText
              variant="h8"
              fontFamily={Fonts.Medium}
              style={{ opacity: 0.8, textDecorationLine: "line-through" }}
            >
              $ {item?.discountPrice}
            </CustomText>
          </View>
          <UniversalAdd item={item} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "45%",
    backgroundColor: "#fff",
    marginBottom: 10,
    marginLeft: 10,
    overflow: "hidden",
    borderRadius: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    aspectRatio: 1 / 1,
    resizeMode: "contain",
  },
  imageContainer: {
    height: screenHeight * 0.14,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  icon: {
    height: 15,
    width: 15,
  },
  flexrow: {
    flexDirection: "row",
    padding: 2,
    borderRadius: 4,
    gap: 2,
    backgroundColor: Colors.backgroundSecondary,

    alignSelf: "flex-start",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    paddingVertical: 10,
  },
});

export default ProductItem;
