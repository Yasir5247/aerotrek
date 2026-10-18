"use client";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import { useAuth } from "@/providers/AuthContext";
import cogoToast from "cogo-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import useAuthSideGsap from "../../hooks/use-auth-side-gsap";
import { useCountryPath } from "@/hooks/use-country-path";

const LoginRegister = ({ redirectTo = "/my-account" }: { redirectTo?: any }) => {
  const router = useRouter();
  const toCountryPath = useCountryPath();
  const { signInUser, signUpNewUser } = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");
  const [registerBusy, setRegisterBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const authSide = useAuthSideGsap();

  async function handleLogin(e) {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      cogoToast.error("Email or password missing");
      return;
    }

    const { success, error } = await signInUser(loginEmail, loginPassword);

    if (success) {
      cogoToast.success("Logged in successfully");
      router.push(toCountryPath(redirectTo || "/my-account"));
      router.refresh();
    } else {
      console.error(error);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (!registerEmail || !registerPassword || !registerName || !registerPasswordConfirm) {
      cogoToast.error("All fields are required");
      return;
    }

    if (registerPassword.length < 6) {
      cogoToast.error("Password must be at least 6 characters");
      return;
    }

    if (registerPassword !== registerPasswordConfirm) {
      cogoToast.error("Passwords do not match");
      return;
    }

    setRegisterBusy(true);
    try {
      const result = await signUpNewUser(
        registerEmail.trim(),
        registerPassword,
        registerName.trim()
      );

      if (result.success === false) {
        cogoToast.error(result.error || "Registration failed");
        return;
      }

      cogoToast.success("Registration successful.");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterPasswordConfirm("");
      setRegisterName("");
      router.push(toCountryPath(redirectTo || "/my-account"));
      router.refresh();
    } finally {
      setRegisterBusy(false);
    }
  }

  const tabBtn = (key: "login" | "register", label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={activeTab === key}
      onClick={() => setActiveTab(key)}
      className={
        activeTab === key
          ? "flex flex-1 cursor-pointer items-center justify-center rounded-xl border border-black/[0.08] bg-white px-2.5 py-[11px] shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-[background,border-color,box-shadow] duration-200"
          : "flex flex-1 cursor-pointer items-center justify-center rounded-xl border border-transparent bg-transparent px-2.5 py-[11px] transition-[background,border-color,box-shadow] duration-200"
      }
    >
      <span
        className={
          activeTab === key
            ? "text-xs font-black uppercase tracking-[0.12em] text-[#111]"
            : "text-xs font-black uppercase tracking-[0.12em] text-black/60"
        }
      >
        {label}
      </span>
    </button>
  );

  return (
    <Fragment>
      <div className="w-full py-4 md:py-6">
          <div className="grid grid-cols-1 items-start gap-4 md:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-7">
            <div className="hidden lg:block" aria-hidden="true" ref={authSide.ref}>
              <div className="relative flex min-h-[460px] flex-col justify-end overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0a0a0a] via-[#161616] to-[#0f0f0f] p-9 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_32px_80px_rgba(0,0,0,0.32)] md:min-h-0 md:rounded-[18px] md:p-7">
                <div className="pointer-events-none absolute h-[320px] w-[320px] -left-[60px] -top-[80px] rounded-full bg-[radial-gradient(circle,rgba(90,90,90,0.6)_0%,transparent_70%)] blur-[70px] will-change-[transform,opacity] max-md:h-[180px] max-md:w-[180px] max-md:-left-[30px] max-md:-top-[40px] max-md:blur-[50px]" />
                <div className="pointer-events-none absolute right-[-50px] top-[20%] h-[240px] w-[240px] rounded-full bg-[radial-gradient(circle,rgba(90,90,90,0.4)_0%,transparent_70%)] blur-[70px] will-change-[transform,opacity] max-md:right-[-20px] max-md:h-[140px] max-md:w-[140px] max-md:blur-[50px]" />
                <div className="pointer-events-none absolute bottom-[-30px] left-1/4 h-[200px] w-[200px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,transparent_70%)] blur-[70px] will-change-[transform,opacity] max-md:left-[20%] max-md:h-[120px] max-md:w-[120px] max-md:blur-[50px]" />
                <div className="pointer-events-none absolute left-[40%] top-[10%] h-[180px] w-[180px] rounded-full bg-[radial-gradient(circle,rgba(90,90,90,0.3)_0%,transparent_70%)] blur-[70px] will-change-[transform,opacity] max-md:h-[100px] max-md:w-[100px] max-md:blur-[50px]" />
                <div className="pointer-events-none absolute bottom-[10%] right-[10%] h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(90,90,90,0.2)_0%,transparent_70%)] blur-[70px] will-change-[transform,opacity] max-md:h-[140px] max-md:w-[140px] max-md:blur-[50px]" />

                <div className="relative z-[1]">
                  <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-[7px] text-[10px] font-black uppercase tracking-[0.14em] text-white/70 backdrop-blur-sm">
                    AeroTrek
                  </div>
                  <h1 className="my-[18px] mb-2.5 text-[clamp(1.6rem,2.6vw,2.25rem)] font-black leading-[1.08] tracking-[-0.025em] text-white max-md:my-3.5 max-md:mb-2 max-md:text-[1.4rem]">
                    Welcome back.
                  </h1>
                  <p className="mb-5 max-w-sm text-sm leading-[1.65] text-white/50 max-md:mb-3.5 max-md:text-[13px]">
                    Sign in to track orders, save favorites, and get faster checkout.
                  </p>
                  <div className="grid gap-2 max-md:gap-1.5 md:max-lg:grid-cols-3 md:max-lg:gap-2.5">
                    <div className="flex items-center gap-3 rounded-[14px] border border-white/[0.08] bg-white/[0.04] px-3.5 py-3 backdrop-blur-sm transition-[background,border-color] duration-[250ms] max-md:flex-row max-md:gap-2.5 max-md:px-3 max-md:py-2.5 md:max-lg:flex-col md:max-lg:gap-2 md:max-lg:px-2.5 md:max-lg:py-3.5 md:max-lg:text-center">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(90,90,90,0.15)] text-[#5a5a5a] max-md:h-7 max-md:w-7 max-md:rounded-lg [&_svg]:max-md:h-[15px] [&_svg]:max-md:w-[15px]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </span>
                      <span className="text-[13px] font-bold text-white/70 max-md:text-xs">Secure account access</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-[14px] border border-white/[0.08] bg-white/[0.04] px-3.5 py-3 backdrop-blur-sm transition-[background,border-color] duration-[250ms] max-md:flex-row max-md:gap-2.5 max-md:px-3 max-md:py-2.5 md:max-lg:flex-col md:max-lg:gap-2 md:max-lg:px-2.5 md:max-lg:py-3.5 md:max-lg:text-center">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(90,90,90,0.15)] text-[#5a5a5a] max-md:h-7 max-md:w-7 max-md:rounded-lg [&_svg]:max-md:h-[15px] [&_svg]:max-md:w-[15px]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </span>
                      <span className="text-[13px] font-bold text-white/70 max-md:text-xs">Address saved for quick checkout</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-[14px] border border-white/[0.08] bg-white/[0.04] px-3.5 py-3 backdrop-blur-sm transition-[background,border-color] duration-[250ms] max-md:flex-row max-md:gap-2.5 max-md:px-3 max-md:py-2.5 md:max-lg:flex-col md:max-lg:gap-2 md:max-lg:px-2.5 md:max-lg:py-3.5 md:max-lg:text-center">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(90,90,90,0.15)] text-[#5a5a5a] max-md:h-7 max-md:w-7 max-md:rounded-lg [&_svg]:max-md:h-[15px] [&_svg]:max-md:w-[15px]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                      </span>
                      <span className="text-[13px] font-bold text-white/70 max-md:text-xs">Order updates in one place</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0">
              <Container className="overflow-hidden">
                <div className="pb-3.5">
                  <div className="mb-3.5 flex justify-between gap-1.5 rounded-2xl bg-black/[0.04] p-1.5" role="tablist">
                    {tabBtn("login", "Sign in")}
                    {tabBtn("register", "Create account")}
                  </div>

                  <div className="px-0.5 pt-0.5">
                    {activeTab === "login" ? (
                      <Fragment>
                        <div className="mb-1 text-lg font-black tracking-[-0.02em] text-[#111]">Sign in</div>
                        <div className="text-[13px] font-bold leading-[1.45] text-black/[0.52]">
                          Use your email and password to continue.
                        </div>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <div className="mb-1 text-lg font-black tracking-[-0.02em] text-[#111]">Create your account</div>
                        <div className="text-[13px] font-bold leading-[1.45] text-black/[0.52]">
                          It takes under a minute.
                        </div>
                      </Fragment>
                    )}
                  </div>
                </div>

                {activeTab === "login" ? (
                  <div role="tabpanel">
                    <form onSubmit={handleLogin}>
                      <Field label="Email" htmlFor="loginEmail" labelVariant="auth" compact>
                        <Input
                          id="loginEmail"
                          type="email"
                          variant="auth"
                          placeholder="you@example.com"
                          autoComplete="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                      </Field>

                      <Field label="Password" htmlFor="loginPassword" labelVariant="auth" compact>
                        <Input
                          id="loginPassword"
                          type="password"
                          variant="auth"
                          placeholder="Your password"
                          autoComplete="current-password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                      </Field>

                      <div>
                        <div className="flex items-center justify-between gap-2.5 py-1 pb-[18px]">
                          <label className="inline-flex select-none items-center gap-2.5">
                            <input type="checkbox" className="relative top-0 h-[18px] w-[18px]" />
                            <span className="text-[13px] font-bold text-black/[0.62]">Remember me</span>
                          </label>
                          <Link
                            className="text-[15px] font-extrabold text-[#242424] transition-colors hover:text-[#5a5a5a] max-md:text-sm"
                            href={toCountryPath("/forgot-password")}
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <Button variant="auth" type="submit" fullWidth>
                          <span>Sign in</span>
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div role="tabpanel">
                    <form onSubmit={handleRegister}>
                      <Field label="Full name" htmlFor="registerName" labelVariant="auth" compact>
                        <Input
                          id="registerName"
                          type="text"
                          variant="auth"
                          placeholder="Your name"
                          autoComplete="name"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                        />
                      </Field>

                      <Field label="Email" htmlFor="registerEmail" labelVariant="auth" compact>
                        <Input
                          id="registerEmail"
                          type="email"
                          variant="auth"
                          placeholder="you@example.com"
                          autoComplete="email"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                        />
                      </Field>

                      <Field label="Password" htmlFor="registerPassword" labelVariant="auth" compact>
                        <Input
                          id="registerPassword"
                          type="password"
                          variant="auth"
                          placeholder="Create a password"
                          autoComplete="new-password"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                        />
                      </Field>

                      <Field label="Re-enter password" htmlFor="registerPasswordConfirm" labelVariant="auth" compact>
                        <Input
                          id="registerPasswordConfirm"
                          type="password"
                          variant="auth"
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                          value={registerPasswordConfirm}
                          onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                        />
                      </Field>

                      <div>
                        <Button variant="auth" type="submit" fullWidth disabled={registerBusy}>
                          <span>{registerBusy ? "Creating account…" : "Create account"}</span>
                        </Button>
                        <div className="mt-3 text-xs leading-normal text-black/50">
                          By creating an account, you agree to our terms and privacy policy.
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </Container>
            </div>
          </div>
      </div>
    </Fragment>
  );
};

export default LoginRegister;
