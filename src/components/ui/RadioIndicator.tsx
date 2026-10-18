import clsx from "clsx";

export default function RadioIndicator({ checked }: { checked: boolean }) {
  return (
    <span
      className={clsx(
        "mt-0.5 inline-flex h-4 w-4 shrink-0 rounded-full border transition",
        checked
          ? "border-zinc-900 bg-zinc-900 shadow-[inset_0_0_0_3px_#fafafa]"
          : "border-zinc-300 bg-white"
      )}
      aria-hidden="true"
    />
  );
}

export function selectionCardClass(active: boolean, disabled?: boolean) {
  if (disabled) {
    return "flex w-full cursor-not-allowed items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left opacity-50";
  }

  return clsx(
    "flex w-full items-start justify-between gap-3 rounded-xl border px-4 py-3 text-left transition",
    active
      ? "border-zinc-900 bg-zinc-50"
      : "border-zinc-200 bg-white hover:border-zinc-300"
  );
}
