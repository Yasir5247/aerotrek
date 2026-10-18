"use client";

import { createContext, useContext } from "react";

const CatalogContext = createContext<{ products: any[] }>({ products: [] });

export function CatalogProvider({ products = [], children }: { products?: any; children?: any }) {
  return (
    <CatalogContext.Provider value={{ products }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  return useContext(CatalogContext);
}
