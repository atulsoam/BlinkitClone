import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // headerTintColor: "#fff",
        // headerTitleStyle: {
        //   fontWeight: "bold",
        // },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        options={{
          animation: "fade",
        }}
        name="CustomerLogin"
      />
      <Stack.Screen
        options={{
          animation: "fade",
        }}
        name="DeliveryLogin"
      />
      <Stack.Screen
        name="CartitemsModal"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="ChangeAddressModal"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="PaymentModal"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
