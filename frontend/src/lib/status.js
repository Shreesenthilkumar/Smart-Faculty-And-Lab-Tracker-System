// Central mapping from backend enum values to the colors/labels the UI
// shows. Keeping this in one place means a new status only needs a new
// entry here, not a hunt through every page.

export const FACULTY_STATUS_META = {
  AVAILABLE: { label: "Available", color: "#2e7d5b", live: true },
  BUSY: { label: "Busy", color: "#c97b2e", live: false },
  IN_CLASS: { label: "In Class", color: "#c97b2e", live: false },
  IN_MEETING: { label: "In Meeting", color: "#c97b2e", live: false },
  ON_LEAVE: { label: "On Leave", color: "#a6402f", live: false },
};

export const LAB_STATUS_META = {
  FREE: { label: "Free", color: "#2e7d5b", live: true },
  OCCUPIED: { label: "Occupied", color: "#c97b2e", live: false },
  MAINTENANCE: { label: "Maintenance", color: "#a6402f", live: false },
};

export const LOCATION_LABELS = {
  CABIN: "Cabin",
  LAB: "Lab",
  CLASSROOM: "Classroom",
  MEETING_HALL: "Meeting Hall",
  OUTSIDE_CAMPUS: "Outside Campus",
};

export function getFacultyStatusMeta(status) {
  return FACULTY_STATUS_META[status] || { label: status || "Unknown", color: "#5b6b82", live: false };
}

export function getLabStatusMeta(status) {
  return LAB_STATUS_META[status] || { label: status || "Unknown", color: "#5b6b82", live: false };
}

export function getLocationLabel(location) {
  return LOCATION_LABELS[location] || location || "—";
}
