import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Linking,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import {
  saveAccessToken,
  saveRefreshToken,
  getAccessToken,
  getRefreshToken,
} from "../state/storage"; // Import functions from storage.ts
import { Colors } from "../utils/Constants";
import { screenHeight, screenWidth } from "../utils/Scaling";
import { jwtDecode } from "jwt-decode";
import { RefetchUser, RefreshToken } from "@/services/authServices";
import { useFonts } from "expo-font";
import * as SplashScreens from "expo-splash-screen";
import { useAuthStore } from "@/state/authStore";
import { tokenStorage } from "@/state/storageMMkv";

// Function to request location permissions and start location updates
// const configureLocation = async (): Promise<void> => {
//   // Request foreground permission for precise location
//   const { status } = await Location.requestForegroundPermissionsAsync();
//   if (status !== "granted") {
//     console.log("Permission to access location was denied");
//     return;
//   }
// };

const SplashScreen = () => {
  const { user, setUser } = useAuthStore();
  // console.log(user, 65);

  const [loaded, error] = useFonts({
    "Okra-Regular": require("../assets/fonts/Okra-Regular.ttf"),
    "Okra-Medium": require("../assets/fonts/Okra-Medium.ttf"),
    "Okra-MediumLight": require("../assets/fonts/Okra-MediumLight.ttf"),
    "Okra-Bold": require("../assets/fonts/Okra-Bold.ttf"),
    "Okra-ExtraBold": require("../assets/fonts/Okra-ExtraBold.ttf"),
  });

  const [locationPermission, setLocationPermission] = useState<
    "granted" | "denied" | "undetermined"
  >("undetermined");
  const router = useRouter(); // Use Expo Router

  // Handle the button click to request location permission
  const handleRequestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status); // Update the state based on the new status

    if (status === "granted") {
      // console.log("Location granted, starting updates...");
      // configureLocation(); // Start the location updates if permission granted
      // Save the tokens and navigate to the CustomerLogin page
      await saveTokensAndRedirect();
    } else {
      console.log("Permission denied, guide user to settings");
      // Optionally guide the user to the app settings to enable location permissions manually
      // Linking.openURL("app-settings:"); // Opens the app settings screen
    }
  };

  interface DecodeToken {
    exp: number;
  }

  // Save the tokens and navigate to CustomerLogin
  const saveTokensAndRedirect = async () => {
    try {
      const accessToken = await tokenStorage.getItem("accessToken"); // Replace with your actual access token
      const refreshToken = await tokenStorage.getItem("refreshToken");
      // console.log(accessToken);
      // console.log(refreshToken, 138);

      // Save tokens securely using functions from storage.ts
      if (accessToken && refreshToken) {
        const decodedAccessToken = jwtDecode<DecodeToken>(accessToken || "");
        const decodedRefreshToken = jwtDecode<DecodeToken>(refreshToken || "");
        const currentTime = Date.now() / 1000;
        if (decodedRefreshToken?.exp < currentTime) {
          router.push("/customerLogin"); // Navigate to the CustomerLogin screen using Expo Router
          Alert.alert("Session Expired");
          return false;
        }
        if (decodedAccessToken?.exp < currentTime) {
          try {
            await RefreshToken();
            await RefetchUser(setUser);
          } catch (error) {
            Alert.alert("Error occured while access Token");
            console.log(error, "saveTokensAndRedirect");
          }
        }
        // console.log(userData?.role);

        if (user?.role === "Customer") {
          router.push("/ProductDashboard");
        } else {
          router.push("/DeliverDashboard");
        }
      } else {
        router.push("/customerLogin"); // Navigate to the CustomerLogin screen using Expo Router
      }

      // After saving tokens, navigate to the CustomerLogin page
    } catch (error) {
      console.error("Error saving tokens", error);
    }
  };

  // Automatically request permission if it's undetermined (first time launch)
  useEffect(() => {
    const fetchuserLocation = async () => {
      if (locationPermission === "undetermined") {
        handleRequestLocationPermission(); // Request permission automatically when the app starts
      }
    };

    const timeout = setTimeout(fetchuserLocation, 2000);
    return () => clearTimeout(timeout);
  }, [locationPermission]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/splash_logo.jpeg")}
        style={styles.logo}
      />
      {locationPermission === "denied" && (
        <View>
          <Text style={styles.text}>
            We need location access to proceed. Please enable location
            permissions.
          </Text>
          <Button
            title="Grant Permission"
            onPress={handleRequestLocationPermission}
          />
        </View>
      )}
      {locationPermission === "granted" && (
        <Text style={styles.text}>
          Location Permission Granted. Updates Started!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: screenHeight * 0.7,
    width: screenWidth * 0.7,
    resizeMode: "contain",
  },
  text: {
    marginTop: 20,
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});

export default SplashScreen;
