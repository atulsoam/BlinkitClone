import axios from "axios";
import { GOOGleMapsApiKey } from "./config";
import { updateUserLocation } from "./authServices";

export const reverseGeocode = async (
  latitude: number,
  longitude: number,
  setUser: any,
  isCustomer: boolean
) => {
  // console.log(
  //   `https://maps.googleapis.com/maps/api/json?latlng=${latitude},${longitude}&key=${GOOGleMapsApiKey}`
  // );

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGleMapsApiKey}`
    );

    // console.log(response.data, 14);

    if (response.data.status == "OK") {
      const address = response.data.results[0].formatted_address;
      // console.log(address);
      if (isCustomer) {
        await updateUserLocation(
          {
            liveLocation: { latitude, longitude },
            address: { id: address, address: address, isSelected: true },
          },
          setUser
        );
      } else {
        await updateUserLocation(
          {
            liveLocation: { latitude, longitude },
            address: address,
          },
          setUser
        );
      }
    } else {
      console.log(response.data, "geocode Failed");
    }
    return response.data;
    // return null;
  } catch (error) {
    console.log(error, "fetchOrder");
    return null;
  }
};

export const GetCurrentAddressLocation = async (
  latitude: number,
  longitude: number
) => {
  // console.log(
  //   `https://maps.googleapis.com/maps/api/json?latlng=${latitude},${longitude}&key=${GOOGleMapsApiKey}`
  // );

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGleMapsApiKey}`
    );

    // console.log(response.data, 14);

    if (response.data.status == "OK") {
      const address = response.data.results[0].formatted_address;
      // console.log(address);
      return address;
    } else {
      console.log(response.data, "geocode Failed");
    }
    return response.data;
    // return null;
  } catch (error) {
    console.log(error, "fetchOrder");
    return null;
  }
};

// 'https://maps.gomaps.pro/maps/api/geocode/json?address=1600%20Amphitheatre%2BParkway%2C%20Mountain%20View%2C%20CA&bounds=35%2C-100&bounds=40%2C-110&components=street_number%3A1600%7Croute%3AAmphitheatre%2BParkway%7Clocality%3AMountain%2BView%7Cadministrative_area_level_1%3ACA%7Ccountry%3AUS&latlng=40%2C-110&location_type=%3Cstring%3E%7C%3Cstring%3E&place_id=ChIJN1t_tDeuEmsRUsoyG83frY4&result_type=%3Cstring%3E%7C%3Cstring%3E&language=en&region=en&key=%3CAPI%20Key%3E'
