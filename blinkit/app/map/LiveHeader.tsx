import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import React, { FC } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/state/authStore";
import { RFValue } from "react-native-responsive-fontsize";
import { useRouter } from "expo-router";
import CustomText from "@/components/ui/CustomText";
import { Fonts } from "@/utils/Constants";

const LiveHeader: FC<{ type: any; title: string; secondTitle: string }> = ({
  title,
  type,
  secondTitle,
}) => {
  const isCustomer = type === "Customer";
  const router = useRouter();
  const { currentOrder, setCurrentOrder } = useAuthStore();

  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            if (isCustomer) {
              router.push("/ProductDashboard");
              if (currentOrder?.status === "delivered") {
                setCurrentOrder(null);
              }
              return;
            }
            router.push("/DeliverDashboard");
          }}
        >
          <Ionicons
            name="chevron-back"
            size={RFValue(16)}
            color={isCustomer ? "white" : "#000"}
          />
        </Pressable>
        <CustomText
          variant="h8"
          fontFamily={Fonts.Medium}
          style={isCustomer ? styles.titleTextWhite : styles.titleTextBlack}
        >
          {title}
        </CustomText>
        <CustomText
          style={isCustomer ? styles.titleTextWhite : styles.titleTextBlack}
          variant="h4"
          fontFamily={Fonts.SemiBold}
        >
          {secondTitle}
        </CustomText>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: "center",
    paddingVertical: 10,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
  },
  titleTextBlack: {
    color: "black",
  },
  titleTextWhite: {
    color: "white",
  },
});

export default LiveHeader;