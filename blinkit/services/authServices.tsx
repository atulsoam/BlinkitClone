import { View, Text, Alert } from "react-native";
import React from "react";

import { BASE_URL } from "./config";
import axios from "axios";
import { appAxios } from "./ApiInterceptor";
import { tokenStorage } from "@/state/storageMMkv";
import { useAuthStore } from "@/state/authStore";
// console.log(BASE_URL);

export const CustomerLogin = async (
  phone: string,
  setUser: (user: any) => void
) => {
  // const { setUser } = useAuthStore();
  try {
    const response = await axios.post(`${BASE_URL}/customer/login`, { phone });
    const { accessToken, refreshToken, customer } = await response.data;
    // console.log(customer, "customer");
    // console.log(accessToken, "acces");
    // console.log(refreshToken, "refresh");
    await tokenStorage.setItem("accessToken", accessToken);
    await tokenStorage.setItem("refreshToken", refreshToken);
    setUser(customer);
  } catch (error) {
    console.log(error, "authServices");
  }
};

export const DeliveryPartnerLogin = async (
  email: string,
  password: string,
  setUser: (user: any) => void
) => {
  try {
    const response = await axios.post(`${BASE_URL}/deliveryPartner/login`, {
      email,
      password,
    });
    // console.log(response.data);

    const { accessToken, refreshToken, deliveryPartner } = await response.data;

    tokenStorage.setItem("accessToken", accessToken);
    tokenStorage.setItem("refreshToken", refreshToken);
    setUser(deliveryPartner);
  } catch (error) {
    console.log(error, "authServices");
    Alert.alert("Login Failed");
  }
};

export const RefreshToken = async () => {
  try {
    const AlreadyStoredRefreshToken = tokenStorage.getItem("refreshToken");

    const response = await axios.post(`${BASE_URL}/refreshToken`, {
      AlreadyStoredRefreshToken,
    });
    const { accesToken, newRefreshToken } = await response.data;
    // console.log(accesToken, "acces");
    // console.log(newRefreshToken, "refresh");
    tokenStorage.setItem("accessToken", accesToken);
    tokenStorage.setItem("refreshToken", newRefreshToken);
    return accesToken;
  } catch (error) {
    console.log(error, "RefreshToken");
  }
};

export const RefetchUser = async (setUser: any) => {
  console.log("started fetching user");

  try {
    const response = await appAxios.get(`/fetchuser`);
    console.log(response.data.user, 76);

    setUser(response.data.user);
    return response.data;
  } catch (error) {
    console.log(error, "RefetchUser");
  }
};

export const updateUserLocation = async (liveLocation: any,setUser:any) => {
  // console.log(liveLocation,83);

  try {
    const response = await appAxios.patch(`/updateUser`, {
      updatedData: liveLocation,
    });
    // console.log(response.data,87);
    // const { setUser } = useAuthStore();

    await RefetchUser(setUser);
    // console.log(refectchdata, "from updateUserLocation");

    // return true;
  } catch (error) {
    console.log(error, "updateUserLocation");
  }
};
