import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import React, { FC } from "react";
import { screenWidth } from "@/utils/Scaling";
import Carousel from "react-native-reanimated-carousel";
import ScalePress from "@/components/ui/ScalePress";

const AdCrousel: FC<{ adData: ImageSourcePropType[] }> = ({ adData }) => {
  const baseOptions = {
    vertical: false,
    width: screenWidth,
    height: screenWidth * 0.5,
  };

  // if (!adData || !Array.isArray(adData)) {
  //   console.error("adData is not a valid array of image sources");
  //   return (
  //     <View style={styles.errorContainer}>
  //       <Text>Error: adData is not a valid array of image sources</Text>
  //     </View>
  //   );
  // }

  // console.log("Rendering AdCrousel with adData:", adData);

  return (
    <View style={{left:-20, marginVertical: 20 }}>
      <Carousel
        {...baseOptions}
        data={adData}
        loop={true}
        pagingEnabled={true}
        autoPlay={true}
        // mode="parallax"
        // mode="flat"
        renderItem={({ item }) => (
          <ScalePress style={styles.imageContainr}>
            {/* <View style={styles.imageContainr}> */}
            <Image source={item} style={styles.image} />
            {/* </View> */}
          </ScalePress>
        )}
      ></Carousel>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainr: { width: "100%", height: "100%" },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 20,
    padding: 10,
  },
});

export default AdCrousel;
