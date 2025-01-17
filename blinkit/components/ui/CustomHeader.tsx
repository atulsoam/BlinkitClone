import { View, Text, SafeAreaView, StyleSheet, Pressable } from "react-native";
import React, { FC } from "react";
import { Colors, Fonts } from "@/utils/Constants";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useRouter } from "expo-router";
import CustomText from "./CustomText";
const CustomHeader: FC<{ title: string; search?: boolean }> = ({
  title,
  search,
}) => {
  const router = useRouter();
  return (
    <SafeAreaView>
      <View style={styles.flexRow}>
        <Pressable onPress={() => router.back()}>
          <Ionicons
            name="chevron-back"
            color={Colors.text}
            size={RFValue(16)}
          />
        </Pressable>
        <CustomText
          variant="h5"
          style={styles.text}
          fontFamily={Fonts.SemiBold}
        >
          {title}
        </CustomText>
        <View>
          {search && (
            <Ionicons
              name="search"
              color={Colors.text}
              size={RFValue(16)}
              onPress={() => {
                router.navigate("/dashboard/SearchPage");
              }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderBottomWidth: 0.6,
    borderColor: Colors.border,
    height: 60,
    // width: "100%",
  },
  text: {
    textAlign: "center",
  },
});

export default CustomHeader;
