const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const fetchSuggestions = async (
  setLoading,
  setError,
  setSuggestions,
  type,
  query,
  setForceStopSuggestionContainer,
) => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(
      `${API_BASE_URL}/search/${type}/autocomplete?query=${query}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch suggestions");
    }

    const data = await response.json();
    if (data.length > 0) setSuggestions(data || []);
    setForceStopSuggestionContainer(false);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

export { fetchSuggestions };
