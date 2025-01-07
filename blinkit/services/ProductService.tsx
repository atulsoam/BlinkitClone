import { View, Text, Alert } from "react-native";
import React from "react";

import { BASE_URL } from "./config";
import axios from "axios";
import { appAxios } from "./ApiInterceptor";
// console.log(BASE_URL);

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getAllCatagories`);
    return response.data;
  } catch (error) {
    console.log(error, "getAllCategories");
    return [];
  }
};

export const getProductByCategoryId = async (categoryId:any) => {
    try {
      const response = await axios.get(`${BASE_URL}/getProductByCategory/${categoryId}`);
      return response.data;
    } catch (error) {
      console.log(error, "getProductByCategoryId");
      return [];
    }
  };

