import { View, Text, Alert, ScrollView, StyleSheet } from "react-native";
import React, { FC, useState } from "react";
import { useRouter } from "expo-router";
import { DeliveryPartnerLogin } from "@/services/authServices";
import CustomSafeAreaView from "@/components/global/CustomSafeAreaView";
import { screenHeight } from "@/utils/Scaling";
import LottieView from "lottie-react-native";
import CustomText from "@/components/ui/CustomText";
import { Fonts } from "@/utils/Constants";
import CustomInput from "@/components/ui/CustomInput";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomButton from "@/components/ui/CustomButton";

const DeliveryLogin: FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await DeliveryPartnerLogin(email, password);
      router.push("/DeliverDashboard");
    } catch (error) {
      console.log(error, "handle deliveryLogin");
      Alert.alert("Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <CustomSafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.container}>
          <View style={styles.lottieContainer}>
            <LottieView
              autoPlay
              loop
              style={styles.lottie}
              source={require("../assets/animations/delivery_man.json")}
            />
          </View>
          <CustomText variant="h3" fontFamily={Fonts.SemiBold}>
            Delivery Partner Portal
          </CustomText>
          <CustomText
            variant="h6"
            style={styles.text}
            fontFamily={Fonts.SemiBold}
          >
            Faster than flash
          </CustomText>
          <CustomInput
            onChangeText={setEmail}
            value={email}
            left={
              <Ionicons
                name="mail"
                color="#F8890E"
                style={{ marginRight: 15 }}
                size={RFValue(18)}
              />
            }
            placeholder="Email"
            inputMode="email"
            right={false}
          />
          <CustomInput
            onChangeText={setpassword}
            value={password}
            left={
              <Ionicons
                name="key-sharp"
                color="#F8890E"
                style={{ marginRight: 15 }}
                size={RFValue(18)}
              />
            }
            placeholder="Password"
            secureTextEntry
            right={false}
          />
          <CustomButton
            disabled={email.length == 0 || password.length < 4}
            onPress={handleLogin}
            loading={loading}
            title="Login"
          />
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  lottie: {
    height: "100%",
    width: "100%",
  },
  lottieContainer: {
    height: screenHeight * 0.12,
    width: "100%",
  },
  text: {
    marginTop: 2,
    marginBottom: 25,
    opacity: 0.8,
  },
});

export default DeliveryLogin;
