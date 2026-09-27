import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
} from "../../services/productService";
import { CURRENCY, CATEGORIES } from "../../utils/constants";
import Loader from "../../components/common/Loader";

const emptyForm = { name: "", price: "", discountPrice: "", category: "men", stock: "", description: "", images: "" };

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => {
    setLoading(true);
    fetchProducts({ limit: 48 }).then((data) => setProducts(data.products)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: Number(form.discountPrice) || 0,
      stock: Number(form.stock),
      images: form.images ? form.images.split(",").map((s) => s.trim()) : [],
    };
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product created");
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      price: p.price,
      discountPrice: p.discountPrice,
      category: p.category,
      stock: p.stock,
      description: p.description,
      images: (p.images || []).join(", "),
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    toast.success("Product deleted");
    load();
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const urls = await uploadProductImages(files);
      const existing = form.images ? form.images.split(",").map((s) => s.trim()).filter(Boolean) : [];
      setForm({ ...form, images: [...existing, ...urls].join(", ") });
      toast.success(`Uploaded ${urls.length} image${urls.length > 1 ? "s" : ""}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/60">{products.length} products</p>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary !px-4 !py-2 text-sm">
          + New product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-lg border border-pine-100 bg-white p-6 sm:grid-cols-2">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
            {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <input required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
          <input type="number" placeholder="Discount price (optional)" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field" />
          <input required type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" />

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-ink/60">Product images</label>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
                className="text-sm text-ink/70 file:mr-3 file:rounded-md file:border-0 file:bg-pine-500 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-linen hover:file:bg-pine-600"
              />
              {uploading && <span className="text-xs text-pine-500">Uploading…</span>}
            </div>
            {form.images && (
              <div className="mt-3 flex flex-wrap gap-2">
                {form.images.split(",").map((s) => s.trim()).filter(Boolean).map((url, i) => (
                  <img key={i} src={url} alt="" className="h-16 w-16 rounded-md border border-pine-100 object-cover" />
                ))}
              </div>
            )}
            <input
              placeholder="Or paste image URLs, comma separated"
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              className="input-field mt-2"
            />
          </div>
          <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field sm:col-span-2" rows={3} />
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" className="btn-primary">{editingId ? "Save changes" : "Create product"}</button>
            <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="mt-8">
        {loading ? <Loader /> : (
          <div className="overflow-x-auto rounded-lg border border-pine-100 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-pine-100 text-xs uppercase text-ink/50">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-pine-50 last:border-0">
                    <td className="p-4 font-medium text-ink">{p.name}</td>
                    <td className="p-4 capitalize text-ink/70">{p.category}</td>
                    <td className="p-4 text-ink/70">{CURRENCY}{p.discountPrice || p.price}</td>
                    <td className="p-4 text-ink/70">{p.stock}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleEdit(p)} className="mr-3 text-pine-500 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="text-coral-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;