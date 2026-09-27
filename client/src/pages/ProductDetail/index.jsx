import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProduct } from "../../services/productService";
import { useCart } from "../../hooks/useCart";
import { CURRENCY } from "../../utils/constants";
import Loader from "../../components/common/Loader";

const ProductDetailPage = () => {
  const { idOrSlug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetchProduct(idOrSlug)
      .then((data) => {
        setProduct(data.product);
        setSize(data.product.sizes?.[0] || "");
        setColor(data.product.colors?.[0] || "");
      })
      .finally(() => setLoading(false));
  }, [idOrSlug]);

  if (loading) return <Loader />;
  if (!product) return <p className="container-app py-16 text-center">Product not found.</p>;

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

  return (
    <div className="container-app py-10">
      <Link to={`/shop/${product.category}`} className="text-sm text-pine-500 hover:underline">
        ← Back to {product.category}
      </Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="aspect-[4/5] overflow-hidden rounded-xl bg-pine-50">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-pine-300">
              <span className="font-display text-lg">{product.name}</span>
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xl font-semibold text-pine-500">
              {CURRENCY}{hasDiscount ? product.discountPrice : product.price}
            </span>
            {hasDiscount && <span className="text-sm text-ink/40 line-through">{CURRENCY}{product.price}</span>}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-ink/70">{product.description}</p>

          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-ink">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-md border px-3 py-2 text-xs font-medium ${
                      size === s ? "border-pine-500 bg-pine-500 text-linen" : "border-pine-100 text-ink/70"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-medium text-ink">Color</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`rounded-md border px-3 py-2 text-xs font-medium ${
                      color === c ? "border-pine-500 bg-pine-500 text-linen" : "border-pine-100 text-ink/70"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-md border border-pine-100">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-pine-500">−</button>
              <span className="px-3 text-sm">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2 text-pine-500">+</button>
            </div>
            <span className="text-xs text-ink/50">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <button
            onClick={() => addToCart(product._id, quantity, size, color)}
            disabled={product.stock === 0}
            className="btn-primary mt-6 w-full md:w-auto"
          >
            Add to bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
