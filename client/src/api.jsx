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

  return res.json();
};
