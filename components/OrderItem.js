import { Text, View, Pressable } from "react-native";
import React from "react";
import { CheckIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";

export default function OrderItem({ order }) {
  const navigation = useNavigation();
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <Pressable
      className="flex-row justify-between border rounded-md min-h-[140px] border-green-400 m-3 bg-white"
      onPress={() => navigation.navigate("OrderDelivery", { id: order.id })}
    >
      <View className="flex-1 p-3">
        <Text className="text-lg font-bold leading-6">
          {order.storeName || "Adega"}
        </Text>
        <Text className="text-gray-500 mt-1">Cliente: {order.customerName || "Cliente"}</Text>
        <Text className="text-gray-500">Endereço: {order.address || "Não informado"}</Text>
        <Text className="font-semibold pt-2">Itens:</Text>
        <Text className="text-gray-500" numberOfLines={2}>
          {items.map((item) => `${item.quantity}x ${item.name}`).join(" • ") || "Itens não informados"}
        </Text>
        <Text className="font-bold mt-2">Total: R$ {Number(order.total || 0).toFixed(2)}</Text>
      </View>

      <View className="bg-green-500 rounded-r-sm justify-center px-3 overflow-hidden">
        <CheckIcon size={24} color="white" />
      </View>
    </Pressable>
  );
}
