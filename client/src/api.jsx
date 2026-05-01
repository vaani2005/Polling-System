export const getToken = () => localStorage.getItem("token");

export const request = async (url, method = "GET", body) => {
  const token = getToken();

  const res = await fetch("http://localhost:5000" + url, {
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
    Navigate("/login");
    return;
  }
  return data;
};
// frontent live : https://polling-system-frontend-ro67.onrender.com
// backend live : https://polling-system-backend-v4n5.onrender.com
// local host : http://localhost:5000
