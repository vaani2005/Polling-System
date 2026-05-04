import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../api";
import Swal from "sweetalert2";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(
        form.password,
      )
    ) {
      newErrors.password =
        "Min 6 chars, include upper, lower, number & special char";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await request("/auth/register", "POST", form);

      if (res?.msg) {
        await Swal.fire({
          icon: "success",
          text: res.msg,
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/login");
      } else {
        Swal.fire({
          icon: "error",
          text: res?.msg || "Registration failed",
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
        <h2>Register Now</h2>
        <p className="subtitle">Welcome, please create your account</p>

        {/* Email */}
        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        {/* Password */}
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

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="switch-text">
          If you have an account?{" "}
          <span onClick={() => navigate("/login")}>Login to your account</span>
        </p>
      </div>
    </div>
  );
}
