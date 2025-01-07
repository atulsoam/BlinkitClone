import axios from "axios";
import { BASE_URL } from "./config";
import { RefreshToken } from "./authServices";
import { Alert } from "react-native";
import { tokenStorage } from "@/state/storageMMkv";

export const appAxios = axios.create({
  baseURL: BASE_URL,
});

appAxios.interceptors.request.use(async (config) => {
  const accessToken = await tokenStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

appAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const newAccesToken = await RefreshToken();
        if (newAccesToken) {
          error.config.headers.Authorization = `Bearer ${newAccesToken}`;
          return axios(error.config);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (error.response && error.response.status != 401) {
      const errorMessage =
        error.response.data.message || "Something went wrong";
      Alert.alert(errorMessage);
    }
    return Promise.resolve(error);
  }
);
