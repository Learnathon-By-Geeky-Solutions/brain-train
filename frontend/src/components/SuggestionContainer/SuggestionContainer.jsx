import {
    Box,
    VStack,
    Spinner,
    Text,
    List,
  } from "@chakra-ui/react";
  
import PropTypes from 'prop-types';
import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const SuggestionContainer = ({ type, query, handleClick, keyHandler, containerClosed, setContainerClosed }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [ingContainerClosed, setIngContainerClosed] = useState(false);

    if(type === "ingredients") {
      containerClosed = ingContainerClosed;
      setContainerClosed = setIngContainerClosed;
    }

    useEffect(() => {
        if (query.trim() === "") {
            setSuggestions([]);
            setContainerClosed(false);
            return;
        }
        
        const fetchSuggestions = async () => {
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

        const debounceFetch = setTimeout(() => {
        fetchSuggestions();
        }, 300); // Debounce API call

        return () => clearTimeout(debounceFetch);
    }, [query]);

    useEffect(() => {
      if (keyHandler === null) return;
      if (suggestions.length === 0) return;
      if (selectedIndex === -2) return;
      if (keyHandler.key === "ArrowDown") {
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (keyHandler.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (keyHandler.key === "Enter" && selectedIndex !== -1) {
        handleClick(suggestions[selectedIndex][`${property}`]);
        setSelectedIndex(-2);
        setContainerClosed(true);
      } else if (keyHandler.key === "Escape") {
        setContainerClosed(true);
      }

    }, [keyHandler]);

    const property = type === "title" ? "title" : "name";
    

    return (
        <Box width="full" mx="auto">
          {loading && (
            <Box textAlign="center">
              <Spinner size="sm" />
            </Box>
          )}
          {error && (
            <Box p={4} textAlign="center">
                <Text>An error occured</Text>
            </Box>
          )}
          <VStack
            align="stretch"
            spacing={1}
            overflowY="auto"
            maxHeight="200px"
            bg="none"
          >
            {suggestions.length > 0 && query.trim() && !containerClosed ? (
              <List.Root spacing={1} p={2} variant="plain">
                {suggestions.map((suggestion,index) => (
                  <List.Item
                    key={suggestion.id}
                    p={2}
                    borderRadius="md"
                    bg={selectedIndex === index ? "gray.400" : "none"}
                    _hover={{ bg: "gray.400", cursor: "pointer" }}
                    onClick={() => {
                        handleClick(suggestion[`${property}`]);
                        setContainerClosed(true);
                        setSelectedIndex(-2);
                      }
                    }
                  >
                    {suggestion[`${property}`]}
                  </List.Item>
                ))}
              </List.Root>
            ) : (
              !loading && !containerClosed &&
              query.trim() && (
                <Box p={4} textAlign="center">
                  <Text>No suggestions found</Text>
                </Box>
              )
            )}
          </VStack>
        </Box>
    )
}

SuggestionContainer.propTypes = {
  type: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  keyHandler: PropTypes.object,
  containerClosed: PropTypes.bool.isRequired,
  setContainerClosed: PropTypes.func.isRequired
};

export default SuggestionContainer;