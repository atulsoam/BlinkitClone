import CustomText from "@/components/ui/CustomText";
import { updateUserLocation, RefetchUser } from "@/services/authServices";
import { useAuthStore } from "@/state/authStore";
import { Colors, Fonts } from "@/utils/Constants";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import * as Location from "expo-location";
import { reverseGeocode } from "@/services/mapService";
import { useRouter } from "expo-router";

const ChangeAddressModal = () => {
  const { user, setUser } = useAuthStore();

  const [selectedAddress, setSelectedAddress] = useState<any>();
  const addresses = user?.address;
  // console.log(addresses);

  const router = useRouter();

  const handleChooseCurrentLocation = async () => {
    Location.requestForegroundPermissionsAsync();
    const position = await Location.getCurrentPositionAsync();
    const { latitude, longitude } = position.coords;
    const response = await reverseGeocode(latitude, longitude, setUser,true);
    const address = response.results[0].formatted_address;
    setSelectedAddress(address);
    router.back();
  };

  const handleAddNewAddress = async (item: any) => {
    // console.log(item, 400000000);
    if (item) {
      await updateUserLocation(
        {
          address: {
            id: item.id,
            address: item.address,
            isSelected: true,
          },
        },
        setUser
      );

      // await RefetchUser();
    }
    router.back();
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => {
        handleAddNewAddress(item);
      }}
      style={styles.addressItem}
    >
      <Text>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.locationButton}
        onPress={handleChooseCurrentLocation}
      >
        <Ionicons name="location-sharp" size={24} />

        <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
          Select Current Location
        </CustomText>
      </TouchableOpacity>
      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        style={styles.addressList}
      />
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" color="#fff" size={RFValue(20)} />
        <CustomText
          variant="h8"
          fontFamily={Fonts.SemiBold}
          style={styles.addButtonText}
        >
          Add New Address
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addressList: {
    marginVertical: 20,
  },
  addressItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  addButton: {
    backgroundColor: Colors.secondary,
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 100,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  addButtonText: {
    color: "#fff",
  },
  locationButton: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    alignItems: "center",
  },
});

export default ChangeAddressModal;
