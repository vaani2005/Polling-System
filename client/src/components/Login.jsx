import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email.includes("@")) return alert("Invalid email");
    if (!form.password) return alert("Password required");

    setLoading(true);

    try {
      const data = await request("/auth/login", "POST", form);

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/polls");
      } else {
        alert(data.msg || "Login failed");
      }
    } catch (err) {
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <input
        placeholder="Enter email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Enter password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <p onClick={() => navigate("/register")}>
        Don't have an account? Register
      </p>
    </div>
  );
}
