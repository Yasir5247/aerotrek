"use client";

import { useMemo, useState } from "react";
import cogoToast from "cogo-toast";
import { useAuth } from "@/providers/AuthContext";
import {
  addCustomerAddress,
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@lib/data/customer";
import { getCustomerAddresses } from "@/lib/helpers/account-order";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import { FORM_ACTIONS_CLASS } from "@/lib/ui/form";

const emptyForm = {
  id: "",
  address_1: "",
  address_2: "",
  province: "",
  city: "",
  country_code: process.env.NEXT_PUBLIC_DEFAULT_REGION || "mv",
  phone: "",
};

const formWrapperClass = "bg-transparent px-[18px] pb-[18px] pt-3.5";
const formHeaderClass = "mb-4 border-b border-black/[0.06] pb-3.5";
const formTitleClass = "m-0 text-sm font-black tracking-[-0.01em] text-[#111]";
const formSubtitleClass = "mt-1.5 text-[13px] leading-snug text-black/60";

function toForm(address, fallbackPhone) {
  if (!address) return { ...emptyForm, phone: fallbackPhone || "" };
  return {
    id: address.id || "",
    address_1: address.address_1 || "",
    address_2: address.address_2 || "",
    province: address.province || "",
    city: address.city || "",
    country_code: address.country_code || emptyForm.country_code,
    phone: address.phone || fallbackPhone || "",
  };
}

export default function ProfileAddresses({ customer }: { customer?: any }) {
  const { applyCustomer } = useAuth();
  const [addresses, setAddresses] = useState(() => getCustomerAddresses(customer));
  const [form, setForm] = useState(() =>
    toForm(getCustomerAddresses(customer)[0], customer?.phone)
  );
  const [saving, setSaving] = useState(false);

  const editing = Boolean(form.id);
  const customerName = useMemo(() => {
    const [firstName, ...rest] = [customer?.first_name, customer?.last_name].filter(Boolean);
    return {
      first_name: firstName || customer?.first_name || "Customer",
      last_name: rest.join(" ") || customer?.last_name || "",
    };
  }, [customer]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const persistCustomer = (nextCustomer) => {
    if (nextCustomer) {
      applyCustomer?.(nextCustomer);
      setAddresses(getCustomerAddresses(nextCustomer));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...customerName,
      address_1: form.address_1,
      address_2: form.address_2,
      city: form.city,
      province: form.province,
      country_code: String(form.country_code || "mv").toLowerCase(),
      phone: form.phone || customer?.phone || "",
      postal_code: "00000",
      is_default_shipping: true,
      is_default_billing: true,
    };

    const result = editing
      ? await updateCustomerAddress(undefined, form.id, payload)
      : await addCustomerAddress(undefined, payload);

    setSaving(false);

    if (result.success === false) {
      cogoToast.error(result.error || "Could not save address");
      return;
    }

    persistCustomer(result.customer);
    cogoToast.success(editing ? "Address updated" : "Address saved");
    if (!editing && result.customer) {
      const next = getCustomerAddresses(result.customer);
      setForm(toForm(next[next.length - 1] || next[0], customer?.phone));
    }
  };

  const handleDelete = async (addressId) => {
    const result = await deleteCustomerAddress(undefined, addressId);
    if (result.success === false) {
      cogoToast.error(result.error || "Could not delete address");
      return;
    }
    persistCustomer(result.customer);
    setForm(toForm(getCustomerAddresses(result.customer)[0], customer?.phone));
    cogoToast.success("Address deleted");
  };

  return (
    <div>
      {addresses.length > 0 ? (
        <ul className="m-0 mb-[18px] flex list-none flex-col gap-2.5 p-0">
          {addresses.map((address) => (
            <li key={address.id}>
              <Container className="!p-0">
                <div className="flex items-start justify-between gap-3 px-4 py-3.5">
                  <div>
                  <strong>
                    {address.address_1}
                    {address.address_2 ? `, ${address.address_2}` : ""}
                  </strong>
                  <p className="mt-1 text-[13px] text-black/[0.58]">
                    {[address.city, address.province, address.country_code].filter(Boolean).join(", ")}
                  </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    className="border-0 bg-transparent p-0 text-[13px] font-extrabold text-[#5a5a5a]"
                    onClick={() => setForm(toForm(address, customer?.phone))}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="border-0 bg-transparent p-0 text-[13px] font-extrabold text-[#b42318]"
                    onClick={() => handleDelete(address.id)}
                  >
                    Delete
                  </button>
                  </div>
                </div>
              </Container>
            </li>
          ))}
        </ul>
      ) : (
        <Container className="mb-[18px] !p-0">
          <p className="m-0 px-4 py-3.5 text-sm text-black/[0.58]">No saved addresses yet.</p>
        </Container>
      )}

      <Container as="form" className="overflow-hidden !p-0" onSubmit={handleSubmit}>
        <div className={formWrapperClass}>
          <div className={formHeaderClass}>
            <h4 className={formTitleClass}>{editing ? "Edit address" : "Add address"}</h4>
            <h5 className={formSubtitleClass}>Used for deliveries and checkout autofill.</h5>
          </div>
          <div className="grid grid-cols-1 gap-x-4 lg:grid-cols-12">
            <div className="lg:col-span-12">
              <Field label="Address Line 1 (House name, Floor)">
                <Input
                  type="text"
                  value={form.address_1}
                  onChange={(e) => setField("address_1", e.target.value)}
                  required
                />
              </Field>
              <Field label="Address Line 2 (Street name)">
                <Input
                  type="text"
                  value={form.address_2}
                  onChange={(e) => setField("address_2", e.target.value)}
                />
              </Field>
            </div>
            <div className="lg:col-span-6">
              <Field label="Atoll">
                <Input
                  type="text"
                  value={form.province}
                  onChange={(e) => setField("province", e.target.value)}
                />
              </Field>
            </div>
            <div className="lg:col-span-6">
              <Field label="Island">
                <Input
                  type="text"
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                />
              </Field>
            </div>
            <div className="lg:col-span-12">
              <Field label="Country">
                <Input
                  type="text"
                  value={form.country_code}
                  onChange={(e) => setField("country_code", e.target.value)}
                />
              </Field>
            </div>
          </div>
          <div className={FORM_ACTIONS_CLASS}>
            <div className="flex items-center">
              <Button type="submit" variant="accountSubmit" size="account" disabled={saving}>
                {saving ? "Saving…" : editing ? "Update address" : "Save address"}
              </Button>
              {editing ? (
                <button
                  type="button"
                  className="ml-3 border-0 bg-transparent text-xs font-extrabold text-black/55"
                  onClick={() => setForm({ ...emptyForm, phone: customer?.phone || "" })}
                >
                  Add another
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
