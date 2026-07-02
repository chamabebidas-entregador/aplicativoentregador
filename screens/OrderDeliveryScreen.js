import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Alert, Pressable, ScrollView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getOrders, updateOrderStatus } from "../services/api";

export default function OrderDeliveryScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const [order, setOrder] = useState(null);
  const [pickupCode, setPickupCode] = useState("");
  const [deliveryCode, setDeliveryCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    try {
      const orders = await getOrders();
      const found = orders.find((o) => o.id === id);
      if (!found) {
        Alert.alert("Erro", "Pedido não encontrado");
        navigation.goBack();
        return;
      }
      setOrder(found);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o pedido");
    } finally {
      setLoading(false);
    }
  }

  async function acceptOrder() {
    try {
      const updated = await updateOrderStatus(order.id, "driver_accepted");
      Alert.alert("Sucesso", "Entrega aceita");
      setOrder(updated);
    } catch (error) {
      Alert.alert("Erro", "Falha ao aceitar entrega");
    }
  }

  async function confirmPickup() {
    if (pickupCode.trim() !== String(order.pinRetirada || "")) {
      Alert.alert("Código inválido", "Código de retirada incorreto");
      return;
    }

    try {
      const updated = await updateOrderStatus(order.id, "picked_up");
      Alert.alert("Sucesso", "Produto retirado na adega");
      setOrder(updated);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar");
    }
  }

  async function confirmDelivery() {
    if (deliveryCode.trim() !== String(order.deliveryCode || "")) {
      Alert.alert("Código inválido", "Código do cliente incorreto");
      return;
    }

    try {
      await updateOrderStatus(order.id, "delivered");
      Alert.alert("Entrega finalizada", "Pedido entregue com sucesso");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível finalizar");
    }
  }

  if (loading || !order) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Carregando...</Text>
      </View>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <ScrollView className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold mb-4">{order.storeName || "Adega"}</Text>
      <Text className="text-lg mb-2">Cliente: {order.customerName || "Cliente"}</Text>
      <Text className="text-lg mb-2">Endereço: {order.address || "Não informado"}</Text>
      <Text className="text-lg mb-2">Total: R$ {Number(order.total || 0).toFixed(2)}</Text>
      <Text className="text-lg mb-4">Status: {order.status}</Text>

      <Text className="font-bold mb-2">Itens</Text>
      {items.map((item, index) => (
        <Text key={`${item.productId || item.name}-${index}`} className="text-gray-700 mb-1">
          {item.quantity}x {item.name} - R$ {Number(item.price || 0).toFixed(2)}
        </Text>
      ))}

      {order.status === "pending" || order.status === "preparing" || order.status === "ready" ? (
        <Pressable className="bg-green-600 p-4 rounded-xl mt-6 mb-4" onPress={acceptOrder}>
          <Text className="text-white text-center font-bold">Aceitar Entrega</Text>
        </Pressable>
      ) : null}

      {order.status === "driver_accepted" && (
        <>
          <Text className="font-bold mt-5 mb-2">Código da Adega</Text>
          <TextInput
            value={pickupCode}
            onChangeText={setPickupCode}
            keyboardType="numeric"
            placeholder="Digite o PIN de retirada"
            className="border rounded-xl p-3 mb-4"
          />
          <Pressable className="bg-orange-500 p-4 rounded-xl" onPress={confirmPickup}>
            <Text className="text-white text-center font-bold">Confirmar Retirada</Text>
          </Pressable>
        </>
      )}

      {order.status === "picked_up" && (
        <>
          <Text className="font-bold mt-5 mb-2">Código do Cliente</Text>
          <TextInput
            value={deliveryCode}
            onChangeText={setDeliveryCode}
            keyboardType="numeric"
            placeholder="Digite o código do cliente"
            className="border rounded-xl p-3 mb-4"
          />
          <Pressable className="bg-blue-600 p-4 rounded-xl" onPress={confirmDelivery}>
            <Text className="text-white text-center font-bold">Finalizar Entrega</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}
