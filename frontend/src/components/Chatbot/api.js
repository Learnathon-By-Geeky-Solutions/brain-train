const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

import makeRequest from "@/services/APIcall";

export const fetchAIResponse = async (message,chatId,image=[]) => {
  const url = `${API_BASE_URL}/ai/chat`;
  const reqBody = new FormData();
  reqBody.append("text", message);
  if(chatId){
    reqBody.append("chatId", chatId);
  }
  if( image.length > 0 ){
    reqBody.append("image", image[0]);
  }
  return makeRequest(url, "POST", reqBody);
};
