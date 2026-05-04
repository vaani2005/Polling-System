import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!form.email.includes("@")) return alert("Invalid email");
    if (form.password.length < 6) return alert("Password too short");
    const res = await request("/auth/register", "POST", form);

    alert(res.msg);
    window.location.href = "/login";
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Register Now</h2>
        <p className="subtitle">Welcome, please create your account</p>

        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Password</label>

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <span
            className="toggle-eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <button onClick={handleRegister}>Register</button>

        <p className="switch-text">
          If you have an account?{" "}
          <span onClick={() => navigate("/login")}>Login to your account</span>
        </p>
      </div>
    </div>
  );
}
