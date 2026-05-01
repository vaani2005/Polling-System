import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleRegister = async () => {
    if (!form.email.includes("@")) return alert("Invalid email");
    if (form.password.length < 6) return alert("Password too short");
    const res = await request("/auth/register", "POST", form);

    alert(res.msg);
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
