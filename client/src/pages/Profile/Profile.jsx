import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import MyOrders from "./MyOrders";

const ProfileOverview = () => {
  const { user, updateMe } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMe(form);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
      <div>
        <label className="text-xs font-medium text-ink/60">Name</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field mt-1" />
      </div>
      <div>
        <label className="text-xs font-medium text-ink/60">Email</label>
        <input value={user.email} disabled className="input-field mt-1 bg-pine-50 text-ink/50" />
      </div>
      <div>
        <label className="text-xs font-medium text-ink/60">Phone</label>
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field mt-1" />
      </div>
      <button disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save changes"}</button>
    </form>
  );
};

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container-app grid gap-10 py-10 md:grid-cols-4">
      <aside>
        <p className="font-display text-lg text-ink">{user.name}</p>
        <nav className="mt-6 flex flex-col gap-2 text-sm">
          <Link to="/profile" className="text-pine-500 font-medium">Overview</Link>
          <Link to="/profile/orders" className="text-ink/70 hover:text-pine-500">My orders</Link>
        </nav>
      </aside>
      <div className="md:col-span-3">
        <Routes>
          <Route index element={<ProfileOverview />} />
          <Route path="orders" element={<MyOrders />} />
        </Routes>
      </div>
    </div>
  );
};

export default Profile;
