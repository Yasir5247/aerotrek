"use client";

import PropTypes from "prop-types";
import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/actions/newsletterService";

const CustomForm = (_props: any) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const nextEmail = email.trim();

    if (nextEmail.indexOf("@") < 0) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const result = await subscribeToNewsletter(nextEmail, { source: "footer" });

      if (result.status === "exists") {
        setStatus("success");
        setMessage("You're already subscribed. Thanks for staying with us.");
      } else {
        setStatus("success");
        setMessage("Thanks for subscribing. We'll keep you updated.");
      }
      setEmail("");
    } catch (error: any) {
      setStatus("error");
      setMessage(error?.message || "We couldn't subscribe you right now. Please try again.");
    }
  };

  return (
    <div>
      <div className="mx-auto flex max-w-[360px] flex-col gap-2.5 sm:max-w-[420px] sm:flex-row sm:items-stretch lg:mx-0 lg:grid lg:max-w-none lg:gap-3">
        <div className="min-w-0 flex-1">
          <input
            id="mc-form-email"
            className="h-[46px] w-full rounded-[10px] border border-stone-900/20 bg-white px-3.5 text-center text-stone-900 placeholder:text-stone-900/50 transition-[border-color,box-shadow] duration-[240ms] focus:border-[#5a5a5a]/65 focus:shadow-[0_0_0_3px_rgba(90,90,90,0.14)] focus:outline-none sm:text-left lg:h-[45px] lg:rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email address..."
          />
        </div>
        <div className="flex shrink-0 justify-stretch sm:justify-start">
          <button
            className="h-11 w-full min-w-0 rounded-[10px] border border-stone-900 bg-stone-900 px-4 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-colors duration-[240ms] hover:border-[#5a5a5a] hover:bg-[#5a5a5a] disabled:opacity-60 sm:w-auto sm:min-w-[118px] sm:px-4 lg:h-[38px] lg:min-w-[122px] lg:rounded-full lg:tracking-[0.12em]"
            onClick={submit}
            disabled={status === "sending"}
            type="button"
          >
            SUBSCRIBE
          </button>
        </div>
      </div>

      {status === "sending" && (
        <div className="mt-2 text-xs text-[#3498db]">sending...</div>
      )}
      {status === "error" && (
        <div className="mt-2 text-xs text-[#e74c3c]">{message}</div>
      )}
      {status === "success" && (
        <div className="mt-2 text-xs text-[#2ecc71]">{message}</div>
      )}
    </div>
  );
};

const SubscribeEmail = (_props: any) => <CustomForm />;

SubscribeEmail.propTypes = {
  mailchimpUrl: PropTypes.string,
};

export default SubscribeEmail;
