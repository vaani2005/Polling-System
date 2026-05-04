import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../api";
import Swal from "sweetalert2";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const data = await request("/auth/login", "POST", form);

      if (data?.token) {
        localStorage.setItem("token", data.token);

        await Swal.fire({
          icon: "success",
          text: "Login successful",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/polls");
      } else {
        Swal.fire({
          icon: "error",
          text: data?.msg || "Login failed",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Server error. Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Sign in</h2>
        <p className="subtitle">Welcome back, please login to your account</p>

        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <label>Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <span
            className="toggle-eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {errors.password && <p className="error-text">{errors.password}</p>}

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="switch-text">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Create one</span>
        </p>
      </div>
    </div>
  );
}
