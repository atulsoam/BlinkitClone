import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/utils/Constants";
import { SafeAreaView } from "react-native";
import { useAuthStore } from "@/state/authStore";
import DeliveryHeader from "./DeliveryDashboard/DeliveryHeader";
import TabBar from "./DeliveryDashboard/TabBar";
import { fetchOrder } from "@/services/orderService";
import CustomText from "@/components/ui/CustomText";
import OrderItem from "./DeliveryDashboard/OrderItem";
import * as Location from "expo-location";
import { reverseGeocode } from "@/services/mapService";
import withLiveStatus from "./DeliveryDashboard/WithLiveOrder";

const DeliverDashboard = () => {
  const [selectedTab, setSelectedTab] = useState<"available" | "delivered">(
    "available"
  );
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(true);

  const fetchData = async () => {
    setData([]);
    setRefreshing(true);
    setLoading(true);
    const data = await fetchOrder(selectedTab, user?._id, user?.branch);
    setData(data);
    setRefreshing(false);
    setLoading(false);
  };
  const updateUser = async () => {
    const position = Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const { latitude, longitude } = (await position).coords;
    reverseGeocode(latitude, longitude, setUser);
  };

  useEffect(() => {
    updateUser();
  }, []);

  const renderOrderItems = ({ item, index }: any) => {
    // console.log(item, 53);

    return <OrderItem index={index} item={item} />;
  };
  useEffect(() => {
    fetchData();
  }, [selectedTab]);
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <DeliveryHeader name={user?.name} email={user?.email} />
      </SafeAreaView>
      <View style={styles.subContainer}>
        <TabBar selectedTab={selectedTab} onTabChange={setSelectedTab} />
        <FlatList
          data={data}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => await fetchData()}
            />
          }
          ListEmptyComponent={() => {
            if (loading) {
              return (
                <View style={styles.centerView}>
                  <ActivityIndicator
                    color={Colors.backgroundSecondary}
                    size="small"
                  />
                </View>
              );
            }
            return (
              <View style={styles.centerView}>
                <CustomText variant="h8">No Orders Found</CustomText>
              </View>
            );
          }}
          renderItem={renderOrderItems}
          keyExtractor={(item) => item.orderId}
          contentContainerStyle={styles.FlatListContianer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  subContainer: {
    backgroundColor: Colors.backgroundSecondary,
    flex: 1,
    padding: 6,
  },
  FlatListContianer: {
    padding: 2,
  },
  centerView: {
    flex: 1,
    marginTop: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default DeliverDashboard;
