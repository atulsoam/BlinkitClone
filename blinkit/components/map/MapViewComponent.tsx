import { View, Text, StyleSheet } from "react-native";
import React, { FC } from "react";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
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
  // console.log(getPoints([pickupLocation,deliveryLocation]),32)
  // console.log(hasAccepted, hasPickedup);

  return (
    <MapView
      ref={setMapRef}
      style={{ flex: 1 }}
      // provider={PROVIDER_GOOGLE}
      camera={camera}
      // customMapStyle={customMapStyle}
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
          onError={(err) => console.log(err, "directionapi")}
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
