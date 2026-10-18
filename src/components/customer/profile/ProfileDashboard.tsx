"use client";

import { useEffect, useState } from "react";
import ProfileNav from "./profile-nav";
import { useCountryPath } from "@/hooks/use-country-path";
import ProfileOverview from "./ProfileOverview";
import ProfileForm from "./ProfileForm";
import ProfileAddresses from "./ProfileAddresses";

const TABS = ["overview", "profile", "addresses"];

function normalizeTab(value) {
  return TABS.includes(value) ? value : "overview";
}

export default function ProfileDashboard({ customer,
  orders = [],
  orderTotal = 0,
  initialTab = "overview", }: { customer?: any; orders?: any; orderTotal?: any; initialTab?: any }) {
  const toCountryPath = useCountryPath();
  const [tab, setTab] = useState(() => normalizeTab(initialTab));

  useEffect(() => {
    setTab(normalizeTab(initialTab));
  }, [initialTab]);

  const selectTab = (next) => {
    const key = normalizeTab(next);
    setTab(key);
    const url =
      key === "overview"
        ? toCountryPath("/my-account")
        : toCountryPath(`/my-account?tab=${key}`);
    window.history.replaceState(null, "", url);
  };

  return (
    <div className="grid items-start gap-[18px] lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
      <ProfileNav activeTab={tab} onSelect={selectTab} />
      <div className="min-w-0">
        {tab === "overview" ? (
          <ProfileOverview
            customer={customer}
            orders={orders}
            orderTotal={orderTotal}
            onOpenTab={selectTab}
          />
        ) : null}
        {tab === "profile" ? <ProfileForm customer={customer} /> : null}
        {tab === "addresses" ? <ProfileAddresses customer={customer} /> : null}
      </div>
    </div>
  );
}
