// frontent live : https://polling-system-frontend-ro67.onrender.com
// backend live : https://polling-system-backend-v4n5.onrender.com
// local host : http://localhost:5000
import Swal from "sweetalert2";
export const getToken = () => localStorage.getItem("token");
const BASE_URL = "https://polling-system-backend-v4n5.onrender.com";

export const request = async (url, method = "GET", body) => {
  try {
    const token = getToken();

    const res = await fetch(BASE_URL + url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: body ? JSON.stringify(body) : null,
    });

    const data = await res.json();

    // 🔴 Unauthorized
    if (res.status === 401) {
      localStorage.removeItem("token");

      await Swal.fire({
        icon: "warning",
        text:
          data.msg === "No token"
            ? "Please login to continue"
            : "Session expired. Please login again",
      });

      window.location.href = "/login";
      return null;
    }

    // 🔴 Other errors
    if (!res.ok) {
      Swal.fire({
        icon: "error",
        text: data.msg || "Something went wrong",
      });
      return null;
    }

    // 🟢 Success (only for non-GET)
    if (method !== "GET" && data.msg) {
      Swal.fire({
        icon: "success",
        text: data.msg,
      });
    }

    return data;
  } catch (err) {
    console.error("API error:", err);

    Swal.fire({
      icon: "error",
      text: "Server not reachable",
    });
  }
};
