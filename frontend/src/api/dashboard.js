import api from "./axios";

export async function getDashboardSummary() {
  const response = await api.get("/dashboard");
  return response.data.data;
}
