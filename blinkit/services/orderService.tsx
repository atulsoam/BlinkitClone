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
export const getAllOrders = async (id: any) => {
  //   const { user, setUser } = useAuthStore();

  try {
    const response = await appAxios.post(`/getAllOrder`, {
      customerId: id,
    });
    return response.data;
  } catch (error) {
    console.log(error, "getOrderByID");
    return null;
  }
};
export const fetchOrder = async (selectedTab: any, id: any, branch: any) => {
  //   const { user, setUser } = useAuthStore();
  let query =
    selectedTab == "available"
      ? { status: selectedTab, branchId: branch }
      : {  branchId: branch, deliveryPartnerId: id };
  try {
    const response = await appAxios.post(`/getAllOrder`, query);
    return response.data;
  } catch (error) {
    console.log(error, "fetchOrder");
    return null;
  }
};

export const sendLiveOrderUpdates = async (
  location: any,
  id: string,
  status: any
) => {
  //   const { user, setUser } = useAuthStore();
  try {
    const response = await appAxios.patch(`/updateOrder/${id}`, {
      status: status,
      deliveryPersonLocation: location,
    });
    return response.data;
  } catch (error) {
    console.log(error, "fetchOrder");
    return null;
  }
};

export const confirmOrder = async (location: any, id: string) => {
  //   const { user, setUser } = useAuthStore();
  console.log(location,"in confrmorder");
  
  try {
    const response = await appAxios.post(`/confirm/${id}`, {
      deliveryPersonLocation: location,
    });
    return response.data;
  } catch (error) {
    console.log(error, "confirmOrder");
    return null;
  }
};
