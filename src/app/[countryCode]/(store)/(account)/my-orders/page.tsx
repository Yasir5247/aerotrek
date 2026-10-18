import { fetchUserOrders } from "@/lib/actions/orderService";
import MyOrders from "@/components/customer/orders/MyOrders";

export const metadata = {
  title: "My Orders",
  description: "Track and review your AeroTrek orders.",
};

export default async function MyOrdersPage() {
  const initialOrders = await fetchUserOrders().catch(() => ({
    orders: [],
    total: 0,
    page: 1,
    pageSize: 15,
  }));

  return <MyOrders initialOrders={initialOrders} />;
}
