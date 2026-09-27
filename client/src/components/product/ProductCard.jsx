import { Link } from "react-router-dom";
import { CURRENCY } from "../../utils/constants";

const ProductCard = ({ product }) => {
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-pine-50">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pine-100 to-pine-50 text-pine-300">
            <span className="font-display text-sm">{product.name}</span>
          </div>
        )}
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded bg-coral-500 px-2 py-1 text-[11px] font-bold text-white">
            {Math.round(100 - (product.discountPrice / product.price) * 100)}% OFF
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-sm font-medium text-ink">{product.name}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-pine-500">
            {CURRENCY}{hasDiscount ? product.discountPrice : product.price}
          </span>
          {hasDiscount && (
            <span className="text-xs text-ink/40 line-through">{CURRENCY}{product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
