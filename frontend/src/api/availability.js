import api from "./axios";

export async function updateMyAvailability(payload) {
  const response = await api.put("/availability/me", payload);
  return response.data.data;
}

export async function updateAvailabilityByFacultyId(facultyId, payload) {
  const response = await api.put(`/availability/${facultyId}`, payload);
  return response.data.data;
}
