export const API_URL = "https://chamabebidas.com.br/api";

export async function getOrders() {
  const res = await fetch(`${API_URL}/orders`);
  if (!res.ok) throw new Error("Erro ao buscar pedidos");
  return res.json();
}

export async function updateOrderStatus(orderId, status) {
  const res = await fetch(`${API_URL}/orders/${orderId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Erro ao atualizar pedido");
  return res.json();
}
