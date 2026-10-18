export default function PageSpinner() {
  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#f7f7f7]">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
