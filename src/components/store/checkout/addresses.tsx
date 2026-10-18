"use client";

import { useActionState, useMemo, useState } from "react";
import { HttpTypes } from "@aiminaabeejs/types";
import { setAddresses } from "@lib/data/cart";
import { getCustomerAddresses } from "@/lib/helpers/account-order";
import { getStoreCode } from "@lib/store-code";
import ErrorMessage from "./error-message";
import { SubmitButton } from "./submit-button";
import { inputVariants } from "@/lib/ui/input";
import { labelVariants } from "@/lib/ui/form";

const fieldClass = inputVariants({ variant: "checkout" });
const labelClass = labelVariants({ variant: "checkout" });

type CountryOption = { iso_2?: string | null; display_name?: string | null };

type AddressSource =
  | Partial<HttpTypes.StoreCartAddress>
  | Partial<HttpTypes.StoreCustomerAddress>;

function addressMatchesCart(
  saved: AddressSource,
  cartAddress?: HttpTypes.StoreCartAddress | null
) {
  if (!cartAddress) return false;
  return (
    String(saved.address_1 || "") === String(cartAddress.address_1 || "") &&
    String(saved.address_2 || "") === String(cartAddress.address_2 || "") &&
    String(saved.city || "") === String(cartAddress.city || "") &&
    String(saved.province || "") === String(cartAddress.province || "") &&
    String(saved.postal_code || "") === String(cartAddress.postal_code || "") &&
    String(saved.country_code || "").toLowerCase() ===
      String(cartAddress.country_code || "").toLowerCase()
  );
}

function formatAddressSummary(address: AddressSource) {
  const lines = [
    [address.first_name, address.last_name].filter(Boolean).join(" "),
    address.company,
    address.address_1,
    address.address_2,
    [address.city, address.province].filter(Boolean).join(", "),
    [address.postal_code, address.country_code?.toUpperCase()]
      .filter(Boolean)
      .join(" "),
  ].filter(Boolean);

  return lines as string[];
}

function HiddenAddressFields({
  prefix,
  address,
  customer,
  defaultCountry,
}: {
  prefix: "shipping_address" | "billing_address";
  address: AddressSource;
  customer?: HttpTypes.StoreCustomer | null;
  defaultCountry: string;
}) {
  const firstName =
    address.first_name ||
    (prefix === "shipping_address" ? customer?.first_name : "") ||
    "";
  const lastName =
    address.last_name ||
    (prefix === "shipping_address" ? customer?.last_name : "") ||
    "";
  const phone =
    address.phone ||
    (prefix === "shipping_address" ? customer?.phone : "") ||
    "";

  return (
    <>
      <input type="hidden" name={`${prefix}.first_name`} value={firstName} />
      <input type="hidden" name={`${prefix}.last_name`} value={lastName} />
      <input
        type="hidden"
        name={`${prefix}.address_1`}
        value={address.address_1 || ""}
      />
      <input
        type="hidden"
        name={`${prefix}.address_2`}
        value={address.address_2 || ""}
      />
      <input
        type="hidden"
        name={`${prefix}.company`}
        value={address.company || ""}
      />
      <input type="hidden" name={`${prefix}.city`} value={address.city || ""} />
      <input
        type="hidden"
        name={`${prefix}.province`}
        value={address.province || ""}
      />
      <input
        type="hidden"
        name={`${prefix}.postal_code`}
        value={
          address.postal_code &&
          String(address.postal_code).toLowerCase() !== "nan"
            ? String(address.postal_code)
            : "00000"
        }
      />
      <input
        type="hidden"
        name={`${prefix}.country_code`}
        value={String(address.country_code || defaultCountry).toLowerCase()}
      />
      <input type="hidden" name={`${prefix}.phone`} value={phone} />
    </>
  );
}

function AddressFields({
  prefix,
  address,
  customer,
  defaultCountry,
  countries,
}: {
  prefix: "shipping_address" | "billing_address";
  address?: AddressSource | null;
  customer?: HttpTypes.StoreCustomer | null;
  defaultCountry: string;
  countries: CountryOption[];
}) {
  const countryValue = address?.country_code || defaultCountry;

  return (
    <>
      <label className="block">
        <span className={labelClass}>First name</span>
        <input
          required
          name={`${prefix}.first_name`}
          autoComplete="given-name"
          defaultValue={
            address?.first_name ||
            (prefix === "shipping_address" ? customer?.first_name : "") ||
            ""
          }
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className={labelClass}>Last name</span>
        <input
          required
          name={`${prefix}.last_name`}
          autoComplete="family-name"
          defaultValue={
            address?.last_name ||
            (prefix === "shipping_address" ? customer?.last_name : "") ||
            ""
          }
          className={fieldClass}
        />
      </label>
      <label className="block sm:col-span-2">
        <span className={labelClass}>Address line 1 (house name, floor)</span>
        <input
          required
          name={`${prefix}.address_1`}
          autoComplete="address-line1"
          defaultValue={address?.address_1 || ""}
          className={fieldClass}
        />
      </label>
      <label className="block sm:col-span-2">
        <span className={labelClass}>Address line 2 (street name)</span>
        <input
          name={`${prefix}.address_2`}
          autoComplete="address-line2"
          defaultValue={address?.address_2 || ""}
          className={fieldClass}
        />
      </label>
      <label className="block sm:col-span-2">
        <span className={labelClass}>Company</span>
        <input
          name={`${prefix}.company`}
          autoComplete="organization"
          defaultValue={address?.company || ""}
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className={labelClass}>Island</span>
        <input
          required
          name={`${prefix}.city`}
          autoComplete="address-level2"
          defaultValue={address?.city || ""}
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className={labelClass}>Atoll</span>
        <input
          name={`${prefix}.province`}
          autoComplete="address-level1"
          defaultValue={address?.province || ""}
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className={labelClass}>Postal code</span>
        <input
          name={`${prefix}.postal_code`}
          autoComplete="postal-code"
          defaultValue={
            address?.postal_code &&
            String(address.postal_code).toLowerCase() !== "nan"
              ? String(address.postal_code)
              : "00000"
          }
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className={labelClass}>Country</span>
        {countries.length > 0 ? (
          <select
            required
            name={`${prefix}.country_code`}
            autoComplete="country"
            defaultValue={countryValue}
            className={fieldClass}
          >
            {countries.map((country) => {
              const code = String(country.iso_2 || "").toLowerCase();
              if (!code) return null;
              return (
                <option key={code} value={code}>
                  {country.display_name || code.toUpperCase()}
                </option>
              );
            })}
          </select>
        ) : (
          <input
            required
            name={`${prefix}.country_code`}
            autoComplete="country"
            defaultValue={countryValue}
            className={fieldClass}
          />
        )}
      </label>
      <label className="block sm:col-span-2">
        <span className={labelClass}>Phone</span>
        <input
          required
          name={`${prefix}.phone`}
          type="tel"
          autoComplete="tel"
          defaultValue={
            address?.phone ||
            (prefix === "shipping_address" ? customer?.phone : "") ||
            ""
          }
          className={fieldClass}
        />
      </label>
    </>
  );
}

export default function Addresses({
  cart,
  customer,
  countryCode,
}: {
  cart: HttpTypes.StoreCart | null;
  customer: HttpTypes.StoreCustomer | null;
  countryCode: string;
}) {
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const shipping = cart?.shipping_address;
  const billing = cart?.billing_address;
  const defaultCountry = String(
    shipping?.country_code ||
      countryCode ||
      process.env.NEXT_PUBLIC_DEFAULT_REGION ||
      "mv"
  ).toLowerCase();

  const countries = useMemo(
    () => cart?.region?.countries || [],
    [cart?.region?.countries]
  );

  const savedAddresses = useMemo(() => {
    const list = getCustomerAddresses(customer) as HttpTypes.StoreCustomerAddress[];
    const regionCodes = countries
      .map((c) => String(c.iso_2 || "").toLowerCase())
      .filter(Boolean);

    if (!regionCodes.length) return list;

    return list.filter((address) => {
      const code = String(address.country_code || "").toLowerCase();
      return !code || regionCodes.includes(code);
    });
  }, [customer, countries]);

  const [selectedId, setSelectedId] = useState<string>(() => {
    if (!savedAddresses.length) return "new";
    const matched = savedAddresses.find((address) =>
      addressMatchesCart(address, shipping)
    );
    return matched?.id || savedAddresses[0]?.id || "new";
  });

  const selectedSaved =
    selectedId === "new"
      ? null
      : savedAddresses.find((address) => address.id === selectedId) || null;
  const useNewAddress = selectedId === "new" || !savedAddresses.length;

  const [message, formAction] = useActionState(
    (prev: unknown, formData: FormData) =>
      setAddresses(getStoreCode(), prev, formData),
    null
  );

  return (
    <section className="flex flex-col gap-8 rounded-[10px] border border-black/[0.07] bg-white/[0.92] p-4 shadow-[0_4px_18px_rgba(0,0,0,0.04)] md:p-6">
      <div>
        <h2 className="m-0 text-lg font-extrabold text-zinc-900">
          Shipping address
        </h2>
        <p className="m-0 mt-1 text-sm text-zinc-500">
          Enter where you would like your order delivered.
        </p>
      </div>

      <form action={formAction} className="grid gap-3 sm:grid-cols-2">
        <input
          type="hidden"
          name="checkout_country_code"
          value={countryCode.toLowerCase()}
        />

        {savedAddresses.length > 0 ? (
          <fieldset className="m-0 grid gap-2 border-0 p-0 sm:col-span-2">
            <legend className={`${labelClass} mb-1 px-0`}>
              Choose a saved address
            </legend>
            {savedAddresses.map((address) => {
              const checked = selectedId === address.id;
              const lines = formatAddressSummary({
                ...address,
                first_name: address.first_name || customer?.first_name,
                last_name: address.last_name || customer?.last_name,
              });

              return (
                <label
                  key={address.id}
                  className={`flex cursor-pointer gap-3 rounded-xl border px-3.5 py-3 transition ${
                    checked
                      ? "border-zinc-900 bg-zinc-50"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="saved_address_choice"
                    className="mt-1"
                    checked={checked}
                    onChange={() => setSelectedId(address.id)}
                  />
                  <span className="min-w-0 text-sm leading-relaxed text-zinc-600">
                    {lines.map((line) => (
                      <span key={line} className="block text-zinc-900">
                        {line}
                      </span>
                    ))}
                    {address.phone ? (
                      <span className="mt-1 block text-zinc-500">
                        {address.phone}
                      </span>
                    ) : null}
                  </span>
                </label>
              );
            })}
            <label
              className={`flex cursor-pointer gap-3 rounded-xl border px-3.5 py-3 transition ${
                useNewAddress
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <input
                type="radio"
                name="saved_address_choice"
                className="mt-1"
                checked={useNewAddress}
                onChange={() => setSelectedId("new")}
              />
              <span className="text-sm font-semibold text-zinc-900">
                Use a new address
              </span>
            </label>
          </fieldset>
        ) : null}

        {useNewAddress ? (
          <AddressFields
            key="shipping-new"
            prefix="shipping_address"
            address={shipping}
            customer={customer}
            defaultCountry={defaultCountry}
            countries={countries}
          />
        ) : selectedSaved ? (
          <HiddenAddressFields
            prefix="shipping_address"
            address={selectedSaved}
            customer={customer}
            defaultCountry={defaultCountry}
          />
        ) : null}

        <label className="block sm:col-span-2">
          <span className={labelClass}>Email</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            defaultValue={cart?.email || customer?.email || ""}
            className={fieldClass}
          />
        </label>

        <label className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            name="same_as_billing"
            checked={sameAsBilling}
            onChange={(e) => setSameAsBilling(e.target.checked)}
            value="on"
          />
          <span className="text-sm text-zinc-600">
            Billing address same as shipping
          </span>
        </label>

        {!sameAsBilling ? (
          <>
            <h3 className="m-0 sm:col-span-2 pt-2 text-base font-extrabold text-zinc-900">
              Billing address
            </h3>
            <AddressFields
              key="billing-new"
              prefix="billing_address"
              address={billing}
              defaultCountry={defaultCountry}
              countries={countries}
            />
          </>
        ) : null}

        <div className="sm:col-span-2">
          <ErrorMessage error={typeof message === "string" ? message : null} />
          <SubmitButton>Continue to delivery</SubmitButton>
        </div>
      </form>
    </section>
  );
}
