import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { FC, useEffect, useRef } from "react";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import CustomText from "@/components/ui/CustomText";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "@/utils/Constants";

interface SideBarProps {
  selectedCategory: any;
  categories: any[];
  onCategoryPress: (category: any) => void;
}

const SideBar: FC<SideBarProps> = ({
  selectedCategory,
  categories,
  onCategoryPress,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const indicaterPosition = useSharedValue(0);
  const animatedValue = categories?.map(() => useSharedValue(0));

  const indecatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: indicaterPosition.value }],
  }));

  useEffect(() => {
    let target = -1;
    categories?.forEach((category: any, index: number) => {
      const isSelected = selectedCategory?._id === category._id;
      animatedValue[index].value = withTiming(isSelected ? 2 : -15, {
        duration: 500,
      });
      if (isSelected) {
        target = index;
      }
    });

    if (target !== -1) {
      indicaterPosition.value = withTiming(100 * target, {
        duration: 500,
      });
      runOnJS(() => {
        scrollViewRef.current?.scrollTo({
          y: 100 * target,
          animated: true,
        });
      });
    }
  }, [selectedCategory]);

  return (
    <View style={styles.sidebar}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.indicator, indecatorStyle]} />
        <Animated.View>
          {categories.map((category: any, index: number) => {
            const animatedStyle = useAnimatedStyle(() => ({
              bottom: animatedValue[index].value,
            }));
            return (
              <TouchableOpacity
                onPress={() => onCategoryPress(category)}
                key={index}
                activeOpacity={1}
                style={styles.categoryButton}
              >
                <View
                  style={[
                    styles.imageContainer,
                    selectedCategory?._id === category._id &&
                      styles.selectedImageContainer,
                  ]}
                >
                  <Animated.Image
                    source={{ uri: category.image }}
                    style={[styles.image, animatedStyle]}
                  />
                </View>
                <CustomText
                  fontSize={RFValue(7)}
                  variant="h8"
                  style={{ textAlign: "center" }}
                >
                  {category.name}
                </CustomText>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: "20%",
    backgroundColor: "#fff",
    borderRightWidth: 0.8,
    borderRightColor: "#eee",
    position: "relative",
  },
  categoryButton: {
    padding: 10,
    height: 100,
    paddingVertical: 0,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  imageContainer: {
    borderRadius: 100,
    height: "50%",
    marginBottom: 10,
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F7", // Corrected the color format
    overflow: "hidden",
  },
  image: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  selectedImageContainer: {
    backgroundColor: "#CFFFDB",
  },
  indicator: {
    position: "absolute",
    right: 0,
    width: 4,
    height: 80,
    top: 10,
    alignItems: "center",
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
});

export default SideBar;
