import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../services/productService";
import ProductGrid from "../../components/product/ProductGrid";
import Loader from "../../components/common/Loader";
import { CATEGORIES } from "../../utils/constants";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ featured: "true", limit: 8 })
      .then((data) => setFeatured(data.products))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="border-b border-pine-100 bg-pine-500">
        <div className="container-app grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-500">New season</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-linen md:text-5xl">
              Clothes built for the days you actually have.
            </h1>
            <p className="mt-5 max-w-md text-pine-100">
              Durable fabrics, honest pricing, and a fit that works whether you're commuting, coaching
              soccer practice, or just making dinner.
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="/shop/men" className="btn-accent">Shop men</Link>
              <Link to="/shop/women" className="btn-secondary !border-linen !text-linen hover:!bg-pine-600">
                Shop women
              </Link>
            </div>
          </div>
                            <div className="hidden md:block">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-amber-300 to-coral-300 shadow-soft">
              <img
                src="/hero.png"
                alt="NextCart new season"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container-app py-14">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              to={`/shop/${c.key}`}
              className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-pine-100 bg-white transition-colors hover:border-pine-500"
            >
              <span className="font-display text-lg text-pine-500 group-hover:text-amber-600">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-app py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-ink">Featured picks</h2>
          <Link to="/shop/men" className="text-sm font-medium text-pine-500 hover:underline">
            View all
          </Link>
        </div>
        {loading ? <Loader /> : <ProductGrid products={featured} />}
      </section>

      <section className="bg-amber-50 py-14">
        <div className="container-app grid gap-8 md:grid-cols-3">
          {[
            { title: "Free shipping over ₹999", body: "Everything else ships for a flat ₹79." },
            { title: "Easy 15-day returns", body: "Didn't fit right? Send it back, no questions asked." },
            { title: "Secure checkout", body: "Cards, UPI, and cash on delivery, all protected." },
          ].map((b) => (
            <div key={b.title}>
              <p className="font-display text-lg text-pine-500">{b.title}</p>
              <p className="mt-2 text-sm text-ink/70">{b.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
