import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { FC } from "react";
import { Colors, Fonts } from "@/utils/Constants";
import CustomText from "@/components/ui/CustomText";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

const ArrowButton: FC<{
  title: string;
  onPress?: () => void;
  price?: number;
  loading?: boolean;
}> = ({ title, onPress, loading, price }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={loading}
      onPress={onPress}
      style={[
        styles.btn,
        { justifyContent: price != 0 ? "space-between" : "center" },
      ]}
    >
      {price != 0 && price && (
        <View>
          <CustomText
            variant="h7"
            style={{ color: "white" }}
            fontFamily={Fonts.Medium}
          >
            ₹{price + 34}.0
          </CustomText>
          <CustomText
            variant="h9"
            style={{ color: "white" }}
            fontFamily={Fonts.Medium}
          >
            Total
          </CustomText>
        </View>
      )}

      <View style={styles.flexRow}>
        <CustomText
          variant="h6"
          fontFamily={Fonts.Medium}
          style={{ color: "#fff" }}
        >
          {title}
        </CustomText>
        {loading ? (
          <ActivityIndicator
            size="small"
            style={{ marginHorizontal: 5 }}
            color="white"
          />
        ) : (
          <Ionicons
            name="caret-forward-outline"
            color="#fff"
            size={RFValue(20)}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.secondary,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 15,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ArrowButton;
