import { useCallback, useEffect, useState } from "react";
import { getLabs } from "../api/labs";
import { subscribeToTopic } from "../api/websocket";

/**
 * Loads the lab list and keeps occupancy live via /topic/lab-status, the
 * same pattern as useFacultyData.
 */
export default function useLabData(searchName = "") {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLabs(searchName);
      setLabs(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load labs.");
    } finally {
      setLoading(false);
    }
  }, [searchName]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const unsubscribe = subscribeToTopic("/topic/lab-status", (update) => {
      setLabs((current) =>
        current.map((lab) =>
          lab.labId === update.labId
            ? { ...lab, status: update.status, occupiedCount: update.occupiedCount, updatedTime: update.updatedTime }
            : lab
        )
      );
    });
    return unsubscribe;
  }, []);

  return { labs, loading, error, refresh };
}
