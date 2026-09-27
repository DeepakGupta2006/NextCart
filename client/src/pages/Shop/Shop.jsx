import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProducts } from "../../services/productService";
import ProductGrid from "../../components/product/ProductGrid";
import ProductFilter from "../../components/product/ProductFilter";
import Loader from "../../components/common/Loader";

const TITLES = { men: "Men", women: "Women", kids: "Kids", accessories: "Accessories" };

const Shop = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", sort: "", minPrice: "", maxPrice: "" });

  useEffect(() => {
    setLoading(true);
    const params = { category, ...filters };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    fetchProducts(params)
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, [category, filters]);

  return (
    <div className="container-app py-10">
      <h1 className="text-2xl font-semibold text-ink">{TITLES[category] || "Shop"}</h1>
      <p className="mt-1 text-sm text-ink/60">
        {loading ? "Loading products…" : `${products.length} products`}
      </p>
      <div className="mt-6">
        <ProductFilter filters={filters} onChange={setFilters} />
      </div>
      <div className="mt-8">{loading ? <Loader /> : <ProductGrid products={products} />}</div>
    </div>
  );
};

export default Shop;
