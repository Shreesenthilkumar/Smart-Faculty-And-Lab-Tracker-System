import api from "./axios";

export async function getFaculty(searchName = "") {
  const response = await api.get("/faculty", {
    params: searchName ? { name: searchName } : {},
  });
  return response.data.data;
}

export async function getFacultyById(id) {
  const response = await api.get(`/faculty/${id}`);
  return response.data.data;
}

export async function createFaculty(payload) {
  const response = await api.post("/faculty", payload);
  return response.data.data;
}

export async function updateFaculty(id, payload) {
  const response = await api.put(`/faculty/${id}`, payload);
  return response.data.data;
}

export async function deleteFaculty(id) {
  await api.delete(`/faculty/${id}`);
}
