import { notFound } from "next/navigation";
import { retrieveOrder } from "@lib/data/orders";
import OrderDetail from "@/components/customer/orders/OrderDetail";

export const metadata = {
  title: "Order details",
  description: "View an AeroTrek order.",
};

export default async function OrderDetailPage({ params }: { params?: any }) {
  const { id } = await params;
  const order = await retrieveOrder(undefined, id);

  if (!order) {
    notFound();
  }

  return <OrderDetail order={order} />;
}
