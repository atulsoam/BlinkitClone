import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { useAuthStore } from "@/state/authStore";
import { Colors, Fonts } from "@/utils/Constants";
import CustomText from "@/components/ui/CustomText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Storage, tokenStorage } from "@/state/storageMMkv";

const DeliveryHeader: FC<{ name: string; email: string }> = ({
  name,
  email,
}) => {
  const { logout } = useAuthStore();
  const router = useRouter();
  return (
    <View style={styles.flexRow}>
      <View style={styles.imgcontainer}>
        <Image
          style={styles.img}
          source={require("../../assets/images/delivery_boy.png")}
        />
      </View>
      <View style={styles.infoContainer}>
        <CustomText variant="h4" fontFamily={Fonts.SemiBold}>
          Hello {name}
        </CustomText>
        <CustomText variant="h8" fontFamily={Fonts.Medium}>
          {email}
        </CustomText>
      </View>
      <TouchableOpacity
        onPress={() => {
          logout();
          router.dismissAll();
          router.push("/customerLogin");
          tokenStorage.clearAll();
          Storage.clearAll();
        }}
      >
        <Ionicons name="log-out-outline" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  flexRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  imgcontainer: {
    padding: 4,
    borderRadius: 100,
    height: 60,
    width: 60,
    overflow: "hidden",
    backgroundColor: Colors.backgroundSecondary,
  },
  img: {
    width: "100%",
    height: "100%",
    bottom: -8,
    resizeMode: "contain",
  },
  infoContainer: {
    width: "70%",
  },
});

export default DeliveryHeader;
