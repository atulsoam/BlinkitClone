import {
  View,
  Text,
  Animated as RNAnimated,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import NotificationAnimation from "./dashboard/NotificationAnimation";
import { NoticeHeight, screenHeight } from "@/utils/Scaling";
import Visual from "./dashboard/Visual";
import {
  CollapsibleContainer,
  CollapsibleHeaderContainer,
  CollapsibleScrollView,
  useCollapsibleContext,
  withCollapsibleContext,
} from "@r0b0t3d/react-native-collapsible";
import AnimatedHeader from "./dashboard/AnimatedHeader";
import StickSearchBar from "./dashboard/StickSearchBar";
import ContentContainer from "./dashboard/ContentContainer";
import CustomText from "@/components/ui/CustomText";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors, Fonts } from "@/utils/Constants";
import Animated, {
  useAnimatedStyle,
  withTiming,
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import withCart from "./cart/WithCart";
import { useAuthStore } from "@/state/authStore";
import withLiveStatus from "./map/WithLiveStatus";
import { getAllMainCategories } from "@/services/ProductService";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const NOTICE_HEIGHT = -(NoticeHeight + 12);

const ProductDashboard: FC = () => {
  const [mainCategory, setMainCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  const { scrollY, expand } = useCollapsibleContext();
  const previousScroll = useRef<number>(0);
  const backToTopStyles = useAnimatedStyle(() => {
    const isScrollingUp =
      scrollY.value < previousScroll.current && scrollY.value > 180;
    const opacity = withTiming(isScrollingUp ? 1 : 0, { duration: 300 });
    const translateY = withTiming(isScrollingUp ? 0 : 10, { duration: 300 });
    previousScroll.current = scrollY.value;
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const noticPosition = useRef(new RNAnimated.Value(NOTICE_HEIGHT)).current;

  const slideUp = () => {
    RNAnimated.timing(noticPosition, {
      toValue: NOTICE_HEIGHT,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  };

  const slideDown = () => {
    RNAnimated.timing(noticPosition, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    slideDown();

    const timeout = setTimeout(() => {
      slideUp();
    }, 3500);

    return () => clearTimeout(timeout);
  }, []);

  const FetchMainCategory = async () => {
    setLoading(true); // Set loading to true while fetching
    try {
      console.log("fetching main categories...");
      const data = await getAllMainCategories();
      setMainCategory(data); // Set the fetched categories to state
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching is done
    }
  };

  // Fetch categories when the component mounts
  useEffect(() => {
    FetchMainCategory();
  }, []);

  return (
    <NotificationAnimation noticePosition={noticPosition}>
      <>
        <Visual />

        <SafeAreaView style={{ flex: 1 }}>
          <Animated.View style={[styles.backToTopButton, backToTopStyles]}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
              onPress={() => {
                scrollY.value = 0;
                expand();
              }}
            >
              <Ionicons
                name="arrow-up-circle-outline"
                color="white"
                size={RFValue(20)}
              />
              <CustomText
                variant="h9"
                style={{ color: "white" }}
                fontFamily={Fonts.SemiBold}
              >
                Scroll To Top
              </CustomText>
            </TouchableOpacity>
          </Animated.View>

          <CollapsibleContainer style={styles.panelContainer}>
            <CollapsibleHeaderContainer containerStyle={styles.transparant}>
              <AnimatedHeader
                showNotice={() => {
                  slideDown();
                  const timeout = setTimeout(() => {
                    slideUp();
                  }, 3500);
                  return () => clearTimeout(timeout);
                }}
              />
              <StickSearchBar />
            </CollapsibleHeaderContainer>

            <CollapsibleScrollView
              nestedScrollEnabled={true}
              style={styles.panelContainer}
              showsVerticalScrollIndicator={false}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.text} />
              ) : (
                // Render categories once fetched
                <ContentContainer mainCatogery={mainCategory} />
              )}

              <View style={{ backgroundColor: "F8F8F8", padding: 20 }}>
                <CustomText
                  variant="h1"
                  fontSize={RFValue(32)}
                  fontFamily={Fonts.Bold}
                  style={{ opacity: 0.2 }}
                >
                  India's Last Minute App
                </CustomText>
                <CustomText
                  variant="h8"
                  fontFamily={Fonts.Bold}
                  style={{ opacity: 0.2, marginTop: 10, paddingBottom: 100 }}
                >
                  Developed By Thakur Atul Soam
                </CustomText>
              </View>
            </CollapsibleScrollView>
          </CollapsibleContainer>
        </SafeAreaView>
      </>
    </NotificationAnimation>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    flex: 1,
  },
  transparant: {
    backgroundColor: "transparent",
  },
  backToTopButton: {
    position: "absolute",
    alignSelf: "center",
    top: Platform.OS === "ios" ? screenHeight * 0.18 : 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "black",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: 999,
  },
});

export default withLiveStatus(
  withCart(withCollapsibleContext(ProductDashboard))
);
