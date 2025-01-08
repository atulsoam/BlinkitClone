import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { useAuthStore } from "@/state/authStore";
import { useCartStore } from "@/state/cartStore";
import { getAllOrders } from "@/services/orderService";
import CustomHeader from "@/components/ui/CustomHeader";
import CustomText from "@/components/ui/CustomText";
import { Fonts } from "@/utils/Constants";
import WalletSection from "./WalletSection";
import ActionButton from "./ActionButton";
import OrderedItem from "./OrderedItem";
import { Storage, tokenStorage } from "@/state/storageMMkv";
import { useRouter } from "expo-router";

const Profile: FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  const { logout, user } = useAuthStore();

  const { clearCart } = useCartStore();

  const fetchOrders = async () => {
    const data = await getAllOrders(user?._id);
    setOrders(data);
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  const renderHeader = () => {
    return (
      <View>
        <CustomText variant="h3" fontFamily={Fonts.SemiBold}>
          Your account
        </CustomText>
        <CustomText variant="h7" fontFamily={Fonts.Medium}>
          {user?.phone}
        </CustomText>
        <WalletSection />
        <CustomText variant="h8" style={styles.informativeText}>
          Your Infromation
        </CustomText>
        <ActionButton icon="book" label="Address Book" />
        <ActionButton icon="help-circle-outline" label="About Us" />
        <ActionButton
          icon="log-out-outline"
          label="Logout"
          onPress={() => {
            clearCart();
            logout();
            tokenStorage.clearAll();
            Storage.clearAll();
            router.dismissAll();
            router.push("/customerLogin");
          }}
        />

        <CustomText
          variant="h8"
          fontFamily={Fonts.Medium}
          style={styles.pastText}
        >
          Past Orders
        </CustomText>
      </View>
    );
  };

  const renderOrders = ({ item }: any) => {
    return <OrderedItem item={item} index={0} />;
  };
  return (
    <View style={styles.container}>
      <CustomHeader title="Profile" />
      <FlatList
        data={orders}
        ListHeaderComponent={renderHeader}
        renderItem={renderOrders}
        keyExtractor={(item: any) => item?.orderId}
        contentContainerStyle={styles.scrollviewContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollviewContent: {
    padding: 10,
    paddingTop: 20,
    paddingBottom: 100,
  },
  informativeText: {
    opacity: 0.7,
    marginBottom: 20,
  },
  pastText: {
    marginVertical: 20,
    opacity: 0.7,
  },
});

export default Profile;
