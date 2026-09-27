const SORT_OPTIONS = [
  { value: "", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

const ProductFilter = ({ filters, onChange }) => {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap items-center gap-3 border-y border-pine-100 py-4">
      <input
        type="search"
        placeholder="Search products…"
        value={filters.search || ""}
        onChange={(e) => update("search", e.target.value)}
        className="input-field max-w-xs"
      />
      <select
        value={filters.sort || ""}
        onChange={(e) => update("sort", e.target.value)}
        className="input-field w-auto"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Min ₹"
        value={filters.minPrice || ""}
        onChange={(e) => update("minPrice", e.target.value)}
        className="input-field w-28"
      />
      <input
        type="number"
        placeholder="Max ₹"
        value={filters.maxPrice || ""}
        onChange={(e) => update("maxPrice", e.target.value)}
        className="input-field w-28"
      />
    </div>
  );
};

export default ProductFilter;
