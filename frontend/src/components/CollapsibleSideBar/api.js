const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

import makeRequest from "@/services/APIcall";

export const deleteChat = async (chatId) => {
  const url = `${API_BASE_URL}/ai/chat/${chatId}`;
  return makeRequest(url, "DELETE", null);
};

export const renameChat = async (chatId, newName) => {
  const url = `${API_BASE_URL}/ai/chat/${chatId}/rename`;
  const reqBody = {
    name: newName,
  };
  return makeRequest(url, "PATCH", reqBody);
};
