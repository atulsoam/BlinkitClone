import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  SafeAreaView,
  Keyboard,
  Alert,
} from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import CustomSafeAreaView from "@/components/global/CustomSafeAreaView";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import ProductSlider from "@/components/login/ProductSlider";
import { useRouter } from "expo-router";
import CustomText from "@/components/ui/CustomText";
import { Colors, Fonts, lightColors } from "@/utils/Constants";
import CustomInput from "@/components/ui/CustomInput";
import CustomButton from "@/components/ui/CustomButton";
import UseKeyBoardOffsetHeight from "@/utils/useKeyBoardOffsetHeight";
import { RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import { CustomerLogin } from "@/services/authServices";
import { useAuthStore } from "@/state/authStore";

const bottomColors: any = [...lightColors].reverse();
const customerLogin: FC = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const router = useRouter(); // Use Expo Router
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [geasuteSequance, setGeastureSequanc] = useState<string[]>([]);
  const keyboardOffsetHeight = UseKeyBoardOffsetHeight();

  const animatedvalue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (keyboardOffsetHeight == 0) {
      Animated.timing(animatedvalue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedvalue, {
        toValue: -keyboardOffsetHeight * 0.84,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [keyboardOffsetHeight]);
  const handleGeasture = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.END) {
      const { translationX, translationY } = nativeEvent;
      let direction = "";
      if (Math.abs(translationX) > Math.abs(translationY)) {
        direction = translationX > 0 ? "right" : "left";
      } else {
        direction = translationY > 0 ? "down" : "up";
      }
      console.log(translationX, translationY, direction);

      const newSequance = [...geasuteSequance, direction].slice(-5);
      setGeastureSequanc(newSequance);
      if (newSequance.join(" ") === "up up down left right") {
        setGeastureSequanc([]);
        router.push("/DeliveryLogin");
      }
    }
  };
  const handleAuth = async () => {
    console.log("clicked");
    Keyboard.dismiss();
    setLoading(true);
    try {
      await CustomerLogin(phoneNumber, setUser);
      router.push("/ProductDashboard");
      setLoading(false);
    } catch (error) {
      console.log(error);

      Alert.alert("Login Failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <GestureHandlerRootView style={styles.container}>
      <CustomSafeAreaView>
        <ProductSlider />
        <PanGestureHandler onHandlerStateChange={handleGeasture}>
          <Animated.ScrollView
            bounces={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.subContainer}
            style={{ transform: [{ translateY: animatedvalue }] }}
          >
            <LinearGradient colors={bottomColors} style={styles.gradient} />
            <View style={styles.content}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
              />
              <CustomText variant="h2" fontFamily={Fonts.Bold}>
                India's Last Minute App
              </CustomText>
              <CustomText
                variant="h5"
                fontFamily={Fonts.SemiBold}
                style={styles.text}
              >
                Login or Signup
              </CustomText>
              <CustomInput
                onChangeText={(text) => setPhoneNumber(text.slice(0, 10))}
                onClear={() => setPhoneNumber("")}
                left={
                  <CustomText
                    style={styles.phoneText}
                    variant="h6"
                    fontFamily={Fonts.SemiBold}
                  >
                    +91
                  </CustomText>
                }
                placeholder="Enter Mobile Number"
                inputMode="numeric"
                right={false}
              />
              <CustomButton
                disabled={phoneNumber?.length != 10}
                onPress={() => handleAuth()}
                loading={loading}
                title="Continue"
              />
            </View>
          </Animated.ScrollView>
        </PanGestureHandler>
      </CustomSafeAreaView>
      <View style={styles.footer}>
        <SafeAreaView>
          <CustomText fontSize={RFValue(6)}>
            By Continuing, you will agree to our Terms and Condition
          </CustomText>
        </SafeAreaView>
      </View>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    height: 50,
    width: 50,
    borderRadius: 20,
    marginVertical: 10,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  text: {
    marginTop: 2,
    marginBottom: 25,
    opacity: 0.8,
  },
  phoneText: {
    marginRight: 15,
  },
  footer: {
    borderTopWidth: 0.8,
    borderColor: Colors.border,
    paddingBottom: 10,
    zIndex: 22,
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f8f9fc",
    width: "100%",
  },
  gradient: {
    paddingTop: 60,
    width: "100%",
  },
});

export default customerLogin;