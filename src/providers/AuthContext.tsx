"use client";

import { createContext, useEffect, useState, useContext } from "react";
import cogoToast from "cogo-toast";
import {
  loginCustomer,
  registerCustomer,
  retrieveCustomer,
  signOutCustomer,
} from "@lib/data/customer";

const AuthContext = createContext<any>(null);

function customerToSession(customer) {
  if (!customer) return null;

  const fullName = [customer.first_name, customer.last_name].filter(Boolean).join(" ");

  return {
    user: {
      id: customer.id,
      email: customer.email,
      phone: customer.phone,
      customer,
      user_metadata: {
        full_name: fullName,
        name: fullName,
      },
    },
  };
}

export const AuthContextProvider = ({ children }: { children?: any }) => {
  const [session, setSession] = useState<any>(undefined);

  useEffect(() => {
    let isMounted = true;

    retrieveCustomer()
      .then((customer) => {
        if (isMounted) setSession(customerToSession(customer));
      })
      .catch(() => {
        if (isMounted) setSession(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const signUpNewUser = async (email, password, userName) => {
    const [firstName, ...rest] = String(userName || "").trim().split(/\s+/);
    const result = await registerCustomer({
      email,
      password,
      firstName: firstName || userName,
      lastName: rest.join(" "),
    });

    if (result.success === false) {
      cogoToast.error("Sign up error: " + result.error, { position: "top-center" });
      return { success: false, error: result.error };
    }

    if (!result.customer) {
      cogoToast.error("Account created, but your profile could not be loaded.", {
        position: "top-center",
      });
      return { success: false, error: "Customer profile missing" };
    }

    setSession(customerToSession(result.customer));
    return { success: true, data: result.customer };
  };

  const signInUser = async (email, password) => {
    const result = await loginCustomer({
      email,
      password,
    });

    if (result.success === false) {
      cogoToast.error("Login failed: " + result.error, { position: "top-center" });
      return { success: false, error: result.error };
    }

    if (!result.customer) {
      cogoToast.error("Login succeeded but your account profile is missing.", {
        position: "top-center",
      });
      return { success: false, error: "Customer profile missing" };
    }

    setSession(customerToSession(result.customer));
    cogoToast.success("Login successful", { position: "top-center" });
    return { success: true, data: result.customer };
  };

  const refreshSession = async () => {
    const customer = await retrieveCustomer().catch(() => null);
    const next = customerToSession(customer);
    setSession(next);
    return customer;
  };

  const applyCustomer = (customer) => {
    setSession(customerToSession(customer));
  };

  const signOutUser = async () => {
    try {
      await signOutCustomer();
    } catch {
      // Clear local session even if the server sign-out fails.
    } finally {
      setSession(null);
    }

    cogoToast.success("Signed out successfully", { position: "top-center" });

    if (typeof window !== "undefined") {
      const { getLoginPath } = await import("@lib/navigation/country-path");
      window.location.assign(getLoginPath());
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{ session, signUpNewUser, signInUser, signOutUser, refreshSession, applyCustomer }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
