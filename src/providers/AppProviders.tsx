"use client";

import { Provider } from "react-redux";
import { AuthContextProvider } from "@/providers/AuthContext";
import { CartDrawerProvider } from "@/providers/cart-drawer-provider";
import PersistProvider from "@/store/providers/persist-provider";
import { store } from "@/store/store";
import "@/lib/i18n";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistProvider>
        <AuthContextProvider>
          <CartDrawerProvider>{children}</CartDrawerProvider>
        </AuthContextProvider>
      </PersistProvider>
    </Provider>
  );
}
