import { listOrders } from "@lib/data/orders";
import { retrieveCustomer } from "@lib/data/customer";
import { ProfileDashboard } from "@/components/customer/profile";

export const metadata = {
  title: "My Account",
  description: "Overview of your AeroTrek account.",
};

export default async function MyAccountPage({ searchParams }: { searchParams?: any }) {
  const params = await searchParams;
  const [customer, orderResult] = await Promise.all([
    retrieveCustomer(),
    listOrders(undefined, 5, 0, {
      fields: "*items,*shipping_address",
    }).catch(() => ({ orders: [], total: 0 })),
  ]);

  return (
    <ProfileDashboard
      customer={customer}
      orders={orderResult.orders || []}
      orderTotal={orderResult.total || 0}
      initialTab={params?.tab}
    />
  );
}
