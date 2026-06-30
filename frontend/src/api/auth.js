import api from "./axios";

export async function login(email, password) {
  const response = await api.post("/auth/login", { email, password });
  return response.data.data; // { token, userId, name, email, role }
}

/** Admin-only: provision a new login. */
export async function registerUser(payload) {
  const response = await api.post("/auth/register", payload);
  return response.data.data;
}
