// export const getToken = () => localStorage.getItem("token");

// export const request = async (url, method = "GET", body) => {
//   const token = getToken();

//   const res = await fetch("https://0nxl8t2r-5000.inc1.devtunnels.ms" + url, {
//     method,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//     body: body ? JSON.stringify(body) : null,
//   });

//   const data = await res.json();
//   if (res.status === 401) {
//     localStorage.removeItem("token");

//     alert(
//       data.msg === "No token"
//         ? "Please login to continue"
//         : "Session expired. Please login again",
//     );
//     Navigate("/login");
//     return;
//   }
//   return data;
// };
// frontent live : https://polling-system-frontend-ro67.onrender.com
// backend live : https://polling-system-backend-v4n5.onrender.com
// local host : http://localhost:5000

export const request = async (url, method = "GET", body) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("https://0nxl8t2r-5000.inc1.devtunnels.ms" + url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: body ? JSON.stringify(body) : null,
    });

    const data = await res.json();

    if (res.status === 401) {
      localStorage.removeItem("token");

      alert(
        data.msg === "No token"
          ? "Please login to continue"
          : "Session expired. Please login again",
      );

      window.location.href = "/login"; // ✅ fixed
      return;
    }

    return data;
  } catch (err) {
    console.error("API error:", err);
    alert("Server not reachable");
  }
};
