import {
  BadgeCheck,
  CircleDot,
  ClipboardList,
  Link2,
  Package,
  PackageCheck,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

const EVENT_META = {
  ORDER_SUBMITTED: {
    title: "Order placed",
    customerTitle: "Order placed",
    tone: "info",
    Icon: ShoppingBag,
  },
  ORDER_CREATED_ADMIN: {
    title: "Created from admin",
    customerTitle: "Order confirmed",
    tone: "info",
    Icon: ClipboardList,
  },
  PAYMENT_APPROVED: {
    title: "Payment approved",
    customerTitle: "Payment confirmed",
    tone: "success",
    Icon: BadgeCheck,
  },
  PAYMENT_REJECTED: {
    title: "Payment rejected",
    customerTitle: "Payment needs attention",
    tone: "danger",
    Icon: XCircle,
  },
  FULFILLMENT_PROCESSING: {
    title: "Processing",
    customerTitle: "Being prepared",
    tone: "info",
    Icon: Package,
  },
  FULFILLMENT_READY_TO_SHIP: {
    title: "Ready to ship",
    customerTitle: "Ready to ship",
    tone: "info",
    Icon: Package,
  },
  FULFILLMENT_SHIPPED: {
    title: "Shipped",
    customerTitle: "On the way",
    tone: "success",
    Icon: Truck,
  },
  FULFILLMENT_DELIVERED: {
    title: "Delivered",
    customerTitle: "Delivered",
    tone: "success",
    Icon: PackageCheck,
  },
  FULFILLMENT_CANCELLED: {
    title: "Fulfillment cancelled",
    customerTitle: "Cancelled",
    tone: "danger",
    Icon: XCircle,
  },
  FULFILLMENT_RETURNED: {
    title: "Returned",
    customerTitle: "Returned",
    tone: "warn",
    Icon: Package,
  },
  CUSTOMER_LINKED: {
    title: "Customer linked",
    customerTitle: null, // hide from customers
    tone: "info",
    Icon: Link2,
    adminOnly: true,
  },
};

function humanizeType(type?: any) {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * @param {object} ev
 * @param {{ audience?: 'admin' | 'customer' }} [options]
 */
export function describeOrderEvent(ev?: any, { audience = "admin" }: any = {}) {
  const type = String(ev.event_type || ev.type || "").toUpperCase();
  const meta = EVENT_META[type];

  if (meta?.adminOnly && audience === "customer") {
    return null;
  }

  const title = meta
    ? audience === "customer"
      ? meta.customerTitle || meta.title
      : meta.title
    : type
      ? humanizeType(type)
      : "Update";

  if (!title) return null;

  const Icon = meta?.Icon || CircleDot;
  const tone = meta?.tone || "neutral";
  const message = ev.note || ev.message || "";
  const redundant =
    !message ||
    message === type ||
    message.toUpperCase() === type ||
    message.toLowerCase() === title.toLowerCase() ||
    (meta && message.toLowerCase() === meta.title.toLowerCase());

  return {
    title,
    message: redundant ? null : message,
    tone,
    Icon,
    type,
  };
}

export function sortOrderEvents(events: any[] = []) {
  return [...events].sort(
    (a, b) => +new Date(a.created_at) - +new Date(b.created_at)
  );
}

export function buildFallbackOrderTimeline(order?: any) {
  const items: any[] = [];
  if (order?.created_at) {
    items.push({
      id: "fallback-created",
      event_type:
        order.created_via === "ADMIN" ? "ORDER_CREATED_ADMIN" : "ORDER_SUBMITTED",
      message:
        order.created_via === "ADMIN"
          ? "Order created from admin"
          : "Order submitted",
      created_at: order.created_at,
    });
  }
  if (order?.payment_verified_at) {
    items.push({
      id: "fallback-paid",
      event_type: "PAYMENT_APPROVED",
      message: "Payment verified",
      created_at: order.payment_verified_at,
    });
  }
  if (order?.shipped_at) {
    items.push({
      id: "fallback-shipped",
      event_type: "FULFILLMENT_SHIPPED",
      message: "Shipped",
      created_at: order.shipped_at,
    });
  }
  if (order?.delivered_at) {
    items.push({
      id: "fallback-delivered",
      event_type: "FULFILLMENT_DELIVERED",
      message: "Delivered",
      created_at: order.delivered_at,
    });
  }
  return items;
}

export function getOrderTimelineEvents(order?: any, { audience = "admin" }: any = {}) {
  const raw = order?.events || order?.order_events || [];
  const source = raw.length ? sortOrderEvents(raw) : buildFallbackOrderTimeline(order);
  return source
    .map((ev) => {
      const described = describeOrderEvent(ev, { audience });
      if (!described) return null;
      return { ...ev, ...described };
    })
    .filter(Boolean);
}
