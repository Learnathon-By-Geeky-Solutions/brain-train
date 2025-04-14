const fetchSuggestions = async (setLoading,setError,setSuggestions,type,query) => {
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
        if (query.trim() === ""){
            return;
        }
        setSuggestions(data || []);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

export {fetchSuggestions};