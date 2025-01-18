import { View, Text, StyleSheet, Image } from "react-native";
import React, { FC } from "react";
import ScalePress from "@/components/ui/ScalePress";
import CustomText from "@/components/ui/CustomText";
import { Fonts } from "@/utils/Constants";
import { useRouter } from "expo-router";

const CatogeryContainer: FC<{ data: any }> = ({ data }) => {
  const router = useRouter();
  const renderItems = (items: any[]) => {
    return (
      <>
        {items.map((item, index) => {
          return (
            <ScalePress
              onPress={() =>
                router.push({
                  pathname: "/ProductCategories",
                  params: { catagoryId: item._id },
                })
              }
              key={index}
              style={styles.scalepress}
            >
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
              </View>
              <CustomText
                variant="h8"
                style={styles.text}
                fontFamily={Fonts.Medium}
                // fontSize={10}
                // numberOfLines={1}
              >
                {item.name}
              </CustomText>
            </ScalePress>
          );
        })}
      </>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.row}>{renderItems(data?.slice(0, 4))}</View>
      {/* <View style={styles.row}>{renderItems(data?.slice(4))}</View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    //   alignItems: "baseline",
    marginBottom: 25,
  },
  scalepress: {
    width: "22%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    //   gap:10,
    padding: 6,
    backgroundColor: "#E5F3F3", // Corrected the color format
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  text: {
    textAlign: "center",
  },
});

export default CatogeryContainer;
