import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import CustomText from "../ui/CustomText";
import { Fonts } from "@/utils/Constants";
import { RFValue } from "react-native-responsive-fontsize";
import { getUserData } from "../../state/authStore";
import { Ionicons } from "@expo/vector-icons";

const Header: FC<{ showNotice: () => void }> = ({ showNotice }) => {
  const [userData, setUserData] = useState<any>(null);
  console.log(userData);
  

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData();
      setUserData(data);
    };
    fetchUserData();
  }, []);
  return (
    <View style={styles.subContainer}>
      <TouchableOpacity activeOpacity={0.8}>
        <CustomText fontFamily={Fonts.Bold} variant="h8" style={styles.text}>
          Delivery in
        </CustomText>
        <View style={styles.flexGroup}>
          <CustomText
            fontFamily={Fonts.SemiBold}
            variant="h2"
            style={styles.text}
          >
            10 Minutes
          </CustomText>
          <TouchableOpacity style={styles.noticeBTN} onPress={showNotice}>
            <CustomText
              fontSize={RFValue(5)}
              variant="h2"
              fontFamily={Fonts.SemiBold}
              style={{ color: "#3B4886" }}
            >
              🌦️ Rain
            </CustomText>
          </TouchableOpacity>
        </View>

        <View style={styles.flexRow}>
          <CustomText
            variant="h8"
            numberOfLines={1}
            fontFamily={Fonts.Medium}
            style={styles.text2}
          >
            {userData?.address || "Knowwhere, SomeWhere Street"}
          </CustomText>
          <Ionicons
            name="arrow-down"
            color="#fff"
            size={RFValue(10)}
            style={{ bottom: -1 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons
          name="person-circle-outline"
          size={RFValue(36)}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#fff",
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "android" ? 10 : 5,
    justifyContent: "space-between",
  },
  flexGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  noticeBTN: {
    backgroundColor: "#E8EAF5",
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 2,
    bottom: -2,
  },
  flexRow: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
    width: "70%",
  },
  text2: {
    color: "#fff",
    width: "90%",
    textAlign: "center",
  },
});

export default Header;
