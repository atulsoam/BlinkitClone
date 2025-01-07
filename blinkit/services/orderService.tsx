import { AndroidLayerType } from "react-native-webview/lib/WebViewTypes";
import { appAxios } from "./ApiInterceptor";

export const createOrder = async (items: any, totalPrice: number) => {
  //   const { user, setUser } = useAuthStore();

  try {
    const response = await appAxios.post(`/order`, {
      items: items,
      totalPrice: totalPrice,
      branch: "676d750bc2f6fd6e7497b16a",
    });
    return response.data;
  } catch (error) {
    console.log(error, "createOrder");
    return null;
  }
};
export const getOrderByID = async (id: AndroidLayerType) => {
  //   const { user, setUser } = useAuthStore();

  try {
    const response = await appAxios.get(`/getOrderById/${id}`);
    return response.data;
  } catch (error) {
    console.log(error, "getOrderByID");
    return null;
  }
};
