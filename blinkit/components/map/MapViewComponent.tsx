import { View, Text, StyleSheet, Alert } from "react-native";
import React, { FC, useEffect } from "react";
import MapView, { Polyline } from "react-native-maps";
import { customMapStyle } from "@/utils/CustomMap";
import MapViewDirections from "react-native-maps-directions";
import { GOOGleMapsApiKey } from "@/services/config";
import Markers from "./Markers";
import { Colors } from "@/utils/Constants";
import { getPoints } from "./getPoints.js";

const MapViewComponent = ({
  mapRef,
  hasAccepted,
  setMapRef,
  camera,
  deliverPersonLocation,
  pickupLocation,
  deliveryLocation,
  hasPickedup,
}: any) => {
  // Using the provided mapRef directly, no need for a separate mapViewRef
  useEffect(() => {
    if (setMapRef) {
      setMapRef(mapRef);
    }
  }, [setMapRef, mapRef]);



  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      // camera={camera}
      // provider="google"
      mapType="standard"
      customMapStyle={customMapStyle}
      showsUserLocation={true}
      userLocationCalloutEnabled={true}
      userLocationPriority="high"
      showsTraffic={false}
      pitchEnabled={false}
      followsUserLocation={true}
      showsCompass={true}
      showsBuildings={false}
      showsIndoors={false}
      showsScale={false}
      showsIndoorLevelPicker={false}
      
    >
      {deliverPersonLocation && (hasPickedup || hasAccepted) && (
        <MapViewDirections
          origin={deliverPersonLocation}
          destination={hasAccepted ? pickupLocation : deliveryLocation}
          precision="high"
          apikey={GOOGleMapsApiKey}
          strokeColor="#2871F2"
          strokeWidth={5}
          onError={(err) => {
            // Improved error handling: log or show an alert to user
            console.error("MapViewDirections error: ", err);
            Alert.alert(
              "There was an issue loading the directions. Please try again."
            );
          }}
        />
      )}
      <Markers
        deliverPersonLocation={deliverPersonLocation}
        deliveryLocation={deliveryLocation}
        pickupLocation={pickupLocation}
      />
      {!hasPickedup && !hasAccepted && deliveryLocation && pickupLocation && (
        <Polyline
          coordinates={getPoints([pickupLocation, deliveryLocation])}
          strokeColor={Colors.text}
          strokeWidth={2}
          geodesic={true}
          lineDashPattern={[12, 10]}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({});

export default MapViewComponent;
