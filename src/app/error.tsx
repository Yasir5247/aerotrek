"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const btnBase =
    "inline-flex min-h-[46px] min-w-[170px] items-center justify-center rounded-xl border border-black/10 bg-white px-5 text-[13px] font-extrabold uppercase tracking-[0.06em] text-[#111] transition duration-200 ease-out hover:-translate-y-px hover:border-[rgba(90,90,90,0.35)] hover:text-[#5a5a5a] max-md:h-11 max-md:w-full max-md:min-w-0 max-md:text-xs";

  return (
    <div className="bg-gradient-to-b from-[#f8f9fb] to-white pt-[60px] pb-[30px] md:pb-[100px]">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex justify-center">
          <div className="w-full text-center xl:max-w-[66.666%] lg:max-w-[75%]">
            <div className="mt-2 rounded-[20px] border border-black/[0.08] bg-white p-[clamp(26px,5vw,44px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_22px_62px_rgba(0,0,0,0.06)] max-md:rounded-[14px] max-md:p-[26px_16px]">
              <h1 className="mb-2.5 mt-0 text-[clamp(2rem,4.2vw,3rem)] font-black leading-[1.08] tracking-[-0.02em] text-[#111] max-md:my-[14px_8px] max-md:mb-2 max-md:mt-3.5">
                Something went wrong
              </h1>
              <p className="mx-auto max-w-[38rem] text-base leading-[1.7] text-black/55 max-md:text-sm max-md:leading-[1.6]">
                {error?.message || "An unexpected error occurred."}
              </p>
              <div className="mt-[22px] flex flex-wrap items-center justify-center gap-2.5 max-md:mt-[18px] max-md:gap-2">
                <button
                  type="button"
                  className={`${btnBase} border-[#111] bg-[#111] text-white hover:border-[#5a5a5a] hover:bg-[#5a5a5a] hover:text-white`}
                  onClick={() => reset()}
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
