import * as SecureStore from "expo-secure-store";

// Function to save the access token
export const saveAccessToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync("access_token", token);
    // console.log("Access token saved successfully");
  } catch (error) {
    console.error("Error saving access token", error);
  }
};

// Function to get the access token
export const getAccessToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync("access_token");
    return token;
  } catch (error) {
    console.error("Error retrieving access token", error);
    return null;
  }
};

// Function to save the refresh token
export const saveRefreshToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync("refresh_token", token);
    console.log("Refresh token saved successfully");
  } catch (error) {
    console.error("Error saving refresh token", error);
  }
};

// Function to get the refresh token
export const getRefreshToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("refresh_token");
    return token;
  } catch (error) {
    console.error("Error retrieving refresh token", error);
    return null;
  }
};
