import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { FC, useEffect } from "react";
import { screenHeight } from "@/utils/Scaling";
import { Colors } from "@/utils/Constants";
import { useMapRefStore } from "@/state/mapStore";
import MapViewComponent from "@/components/map/MapViewComponent";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { handleFitToPath } from "@/components/map/mapUtils";

interface Livemaprpops {
  deliveryPersonLocation: any;
  pickupLocation: any;
  deliveryLocation: any;
  hasPickedUp: any;
  hasAccepted: any;
}

const LiveMap: FC<Livemaprpops> = ({
  deliveryLocation,
  pickupLocation,
  deliveryPersonLocation,
  hasAccepted,
  hasPickedUp,
}) => {
  const { mapRef, setMapRef } = useMapRefStore();

  useEffect(() => {
    if (mapRef) {
      handleFitToPath(
        mapRef,
        deliveryPersonLocation,
        pickupLocation,
        deliveryLocation,
        hasPickedUp,
        hasAccepted
      );
    }
  }, [mapRef, deliveryLocation, hasAccepted, hasPickedUp,deliveryPersonLocation]);
  return (
    <View style={styles.container}>
      <MapViewComponent
        hasAccepted={hasAccepted}
        hasPickedup={hasPickedUp}
        deliverPersonLocation={deliveryPersonLocation}
        deliveryLocation={deliveryLocation}
        pickupLocation={pickupLocation}
        mapRef={mapRef}
        setMapRef={setMapRef}
        // camera={""}
      />
      <TouchableOpacity style={styles.fitButton}
      onPress={()=>{
        handleFitToPath(
          mapRef,
          deliveryPersonLocation,
          pickupLocation,
          deliveryLocation,
          hasPickedUp,
          hasAccepted
        );
      }}
      >
        <Ionicons
          name="locate-outline"
          size={RFValue(14)}
          color={Colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: screenHeight * 0.35,
    width: "100%",
    borderRadius: 15,
    backgroundColor: "#fff",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    position: "relative",
  },
  fitButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    padding: 5,
    backgroundColor: "#fff",
    borderWidth: 0.8,
    borderColor: Colors.border,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowColor: "black",
    elevation: 5,
    borderRadius: 35,
  },
});

export default LiveMap;
