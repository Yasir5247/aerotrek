"use client";

import { useEffect, useState } from "react";
import cogoToast from "cogo-toast";
import { useAuth } from "@/providers/AuthContext";
import { updateCustomer } from "@lib/data/customer";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import { FORM_ACTIONS_CLASS } from "@/lib/ui/form";

const summaryClass =
  "relative cursor-pointer list-none bg-transparent px-[18px] py-[18px] text-xs font-black uppercase tracking-[0.14em] text-black/82 transition-colors hover:text-[#5a5a5a] [&::-webkit-details-marker]:hidden";

const formWrapperClass = "bg-transparent px-[18px] pb-[18px] pt-3.5";

const formHeaderClass = "mb-4 border-b border-black/[0.06] pb-3.5";

const formTitleClass = "m-0 text-sm font-black tracking-[-0.01em] text-[#111]";

const formSubtitleClass = "mt-1.5 text-[13px] leading-snug text-black/60";

export default function ProfileForm({ customer }: { customer?: any }) {
  const { applyCustomer } = useAuth();
  const [userName, setUserName] = useState(
    [customer?.first_name, customer?.last_name].filter(Boolean).join(" ")
  );
  const [userEmail, setUserEmail] = useState(customer?.email || "");
  const [mobile, setMobile] = useState(customer?.phone || "");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  useEffect(() => {
    if (!customer) return;
    setUserName([customer.first_name, customer.last_name].filter(Boolean).join(" "));
    setUserEmail(customer.email || "");
    setMobile(customer.phone || "");
  }, [customer]);

  const handlePersonalInformationUpdate = async (e) => {
    e.preventDefault();
    const [firstName, ...rest] = userName.trim().split(/\s+/);
    const result = await updateCustomer(undefined, {
      first_name: firstName || userName,
      last_name: rest.join(" "),
      phone: mobile,
    } as any);

    if (result.success === false) {
      cogoToast.error(result.error || "Could not update profile");
      return;
    }

    if (result.customer) applyCustomer?.(result.customer);
    cogoToast.success("Profile updated successfully");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (password1 !== password2) {
      cogoToast.error("Passwords do not match");
      return;
    }
    cogoToast.error("Password changes are handled by Aiminaabee account recovery.");
    setPassword1("");
    setPassword2("");
  };

  return (
    <div>
      <Container as="details" className="group mb-5 overflow-hidden !p-0" open>
        <summary className={summaryClass}>Profile</summary>
        <form onSubmit={handlePersonalInformationUpdate}>
          <div className={formWrapperClass}>
            <div className={formHeaderClass}>
              <h4 className={formTitleClass}>Your details</h4>
              <h5 className={formSubtitleClass}>Keep your info up to date.</h5>
            </div>
            <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
              <Field label="Full Name">
                <Input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Field>
              <Field label="Mobile number">
                <Input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </Field>
              <Field label="Email Address" className="md:col-span-2">
                <Input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </Field>
            </div>
            <div className={FORM_ACTIONS_CLASS}>
              <Button type="submit" variant="accountSubmit" size="account">
                Save changes
              </Button>
            </div>
          </div>
        </form>
      </Container>

      <Container as="details" className="group mb-5 overflow-hidden !p-0">
        <summary className={summaryClass}>Security</summary>
        <form onSubmit={handlePasswordChange}>
          <div className={formWrapperClass}>
            <div className={formHeaderClass}>
              <h4 className={formTitleClass}>Password</h4>
              <h5 className={formSubtitleClass}>Choose a strong password you don’t reuse.</h5>
            </div>
            <div className="grid grid-cols-1 gap-0">
              <Field label="Password">
                <Input
                  type="password"
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                />
              </Field>
              <Field label="Password Confirm">
                <Input
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                />
              </Field>
            </div>
            <div className={FORM_ACTIONS_CLASS}>
              <Button type="submit" variant="accountSubmit" size="account">
                Update password
              </Button>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
