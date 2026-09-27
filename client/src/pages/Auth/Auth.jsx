import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
        toast.success("Welcome back");
      } else {
        await register(form);
        toast.success("Account created");
      }
      navigate(location.state?.from || "/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-app flex min-h-[70vh] items-center justify-center py-14">
      <div className="w-full max-w-sm rounded-lg border border-pine-100 bg-white p-8">
        <h1 className="font-display text-2xl font-semibold text-ink">
          {mode === "login" ? "Sign in" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          {mode === "login" ? "Welcome back to NextCart." : "Join NextCart in a few seconds."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "register" && (
            <input required name="name" placeholder="Full name" value={form.name} onChange={handleChange} className="input-field" />
          )}
          <input required type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="input-field" />
          <input required type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="input-field" minLength={6} />
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-5 w-full text-center text-sm text-pine-500 hover:underline"
        >
          {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
