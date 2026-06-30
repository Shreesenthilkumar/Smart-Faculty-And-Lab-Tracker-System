import api from "./axios";

export async function getLabs(searchName = "") {
  const response = await api.get("/labs", {
    params: searchName ? { name: searchName } : {},
  });
  return response.data.data;
}

export async function getLabById(id) {
  const response = await api.get(`/labs/${id}`);
  return response.data.data;
}

export async function createLab(payload) {
  const response = await api.post("/labs", payload);
  return response.data.data;
}

export async function updateLab(id, payload) {
  const response = await api.put(`/labs/${id}`, payload);
  return response.data.data;
}

export async function deleteLab(id) {
  await api.delete(`/labs/${id}`);
}

export async function updateLabStatus(id, payload) {
  const response = await api.put(`/labs/${id}/status`, payload);
  return response.data.data;
}
