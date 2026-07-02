import { View, Text, FlatList, useWindowDimensions, ActivityIndicator, RefreshControl } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import OrderItem from "../components/OrderItem";
import MapView, { Marker } from "react-native-maps";
import { BuildingStorefrontIcon } from "react-native-heroicons/solid";
import { getOrders } from "../services/api";

const TATUI_REGION = {
  latitude: -23.3557,
  longitude: -47.8569,
  latitudeDelta: 0.0722,
  longitudeDelta: 0.0721,
};

export default function OrdersScreen() {
  const bottomSheetRef = useRef(null);
  const { height, width } = useWindowDimensions();
  const snapPoints = useMemo(() => ["18%", "95%"], []);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadOrders() {
    try {
      const data = await getOrders();
      const available = data.filter((order) =>
        ["pending", "preparing", "ready"].includes(order.status)
      );
      setOrders(available);
    } catch (error) {
      console.log("Erro ao buscar pedidos:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View className="flex-1">
      <MapView
        initialRegion={TATUI_REGION}
        style={{ height, width }}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {orders.map((order) => (
          <Marker
            key={order.id}
            title={order.storeName || "Adega"}
            description={order.address || "Endereço do cliente"}
            coordinate={TATUI_REGION}
          >
            <View className="bg-green-700 p-2 rounded-full">
              <BuildingStorefrontIcon size={22} color="white" />
            </View>
          </Marker>
        ))}
      </MapView>

      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        <View className="items-center px-4">
          <Text className="text-2xl font-bold mb-2">Você está online</Text>
          <Text className="text-base text-gray-500">Pedidos disponíveis: {orders.length}</Text>
        </View>

        <FlatList
          className="w-full"
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OrderItem order={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadOrders();
              }}
            />
          }
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-8">
              Nenhum pedido disponível agora.
            </Text>
          }
        />
      </BottomSheet>
    </View>
  );
}
