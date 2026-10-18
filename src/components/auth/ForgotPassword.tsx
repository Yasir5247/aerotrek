"use client";

import React, { Fragment, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Breadcrumb from "@/components/layout/breadcrumb/Breadcrumb";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import cogoToast from "cogo-toast";
import { useCountryPath } from "@/hooks/use-country-path";

const ForgotPassword = () => {
  const pathname = usePathname();
  const toCountryPath = useCountryPath();
  const [forgotUserEmail, setForgotUserEmail] = useState("");
  const [sending, setSending] = useState(false);

  async function handleForgotpassword(e) {
    e.preventDefault();
    if (!forgotUserEmail.trim()) {
      cogoToast.error("Enter your email address", { position: "top-center" });
      return;
    }

    setSending(true);
    cogoToast.success("Use the Aiminaabee account recovery flow for password resets.", {
      position: "top-center",
    });
    setSending(false);
    setForgotUserEmail("");
  }

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "Home", path: toCountryPath("/") },
          {
            label: "Login Register",
            path: toCountryPath("/login-register"),
          },
          {
            label: "Forgot Password",
            path: pathname,
          },
        ]}
      />
      <div className="bg-gradient-to-b from-[#f8f9fb] via-[#f3f4f7] to-white pt-[60px] pb-[60px] md:pt-[100px] md:pb-[100px]">
        <div className="mx-auto w-full max-w-2xl px-4">
          <Card className="p-6 md:p-8">
            <h4 className="mb-6 text-center text-xl font-bold tracking-[-0.02em] text-[#111]">
              Forgot Password
            </h4>
            <form onSubmit={handleForgotpassword} className="flex flex-col gap-4">
              <Field label="Email" htmlFor="forgotEmail" compact className="mb-0">
                <Input
                  id="forgotEmail"
                  type="email"
                  variant="review"
                  placeholder="Email"
                  value={forgotUserEmail}
                  onChange={(e) => setForgotUserEmail(e.target.value)}
                  required
                />
              </Field>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href={toCountryPath("/login-register")}
                  className="text-sm font-medium text-[#5a5a5a] hover:underline"
                >
                  Sign In
                </Link>
                <Button variant="pill" type="submit" disabled={sending}>
                  <span>{sending ? "Sending…" : "Forgot Password"}</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Fragment>
  );
};

export default ForgotPassword;
