import { useCallback, useEffect, useState } from "react";
import { getFaculty } from "../api/faculty";
import { subscribeToTopic } from "../api/websocket";

/**
 * Loads the faculty list and keeps it live: when anyone updates a status
 * (via "My Status" or the Admin panel), the backend broadcasts on
 * /topic/faculty-status and this hook merges the change in place — no
 * polling, no manual refresh needed for it to show up.
 */
export default function useFacultyData(searchName = "") {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFaculty(searchName);
      setFaculty(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load faculty.");
    } finally {
      setLoading(false);
    }
  }, [searchName]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const unsubscribe = subscribeToTopic("/topic/faculty-status", (update) => {
      setFaculty((current) =>
        current.map((member) =>
          member.facultyId === update.facultyId
            ? { ...member, status: update.status, location: update.location, updatedTime: update.updatedTime }
            : member
        )
      );
    });
    return unsubscribe;
  }, []);

  return { faculty, loading, error, refresh };
}
