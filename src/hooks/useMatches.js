import { useCallback, useEffect, useState } from "react";
import { POLL_INTERVAL_MS } from "../constants/config";
import { fetchGroups, fetchMatches } from "../services/matchesApi";

export function useMatches() {
  const [matches, setMatches] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [{ matches: nextMatches, source: nextSource }, nextGroups] = await Promise.all([
        fetchMatches(),
        fetchGroups(),
      ]);
      setMatches(nextMatches);
      setGroups(nextGroups);
      setSource(nextSource);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message ?? "Failed to load matches");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(() => refresh(true), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return { matches, groups, loading, error, source, lastUpdated, refresh };
}
