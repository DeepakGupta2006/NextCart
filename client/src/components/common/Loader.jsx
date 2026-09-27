const Loader = ({ label = "Loading" }) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-pine-100 border-t-pine-500" />
    <p className="text-sm text-pine-300">{label}…</p>
  </div>
);

export default Loader;
