import {
  uploadToFirebase
} from '../../../libraries/services/firebase.js';

import { ChatFactory } from '../../../libraries/services/chat-service/chatFactory.js';

import { appendMessagesToChat, saveNewChat ,getChatById} from '../db.js';

import {
  convertToGeminiFormat,
  
} from './geminiFormatter.js'

export const getDefaultChatName = () => {
    const now = new Date();
  
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const day = `${now.getDate()}`.padStart(2, '0');
    const hours = `${now.getHours()}`.padStart(2, '0');
    const minutes = `${now.getMinutes()}`.padStart(2, '0');
  
    return `Chat - ${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // Helper to create and upload user message
export const handleUserMessage = (req, uid) => {
  const { text, chatId } = req.body;
  const filePromise = req.file
    ? uploadToFirebase(req.file).then(url => [url])
    : Promise.resolve([]);

  return filePromise.then((fileUrls) => ({
    chatId,
    userMessage: { role: 'user', text, files: fileUrls },
    uid
  }));
};

// Helper to call Gemini and get assistant response
export const generateAssistantResponse = async (chatId,userMessage) => {
  const llm = ChatFactory.create('gemini');
  const recentMessages = await loadRecentMessagesForContext(chatId, 20);
  
  const content = await convertToGeminiFormat([...recentMessages,userMessage]);
  
  return llm.sendMessage(content).then(responseText => ({
    assistantMessage: { role: 'assistant', text: responseText, files: [] }
  }));
};

// Helper to update or create chat in DB
export const saveChatAndRespond = (res, chatId, uid, userMessage, assistantMessage) => {
  const dbAction = chatId
    ? appendMessagesToChat(chatId, userMessage, assistantMessage)
    : saveNewChat(uid, getDefaultChatName(), userMessage, assistantMessage);

  return dbAction.then(chat => {
    if (!chat) throw new Error('Chat not found or failed to save');
    res.status(200).json({ chatId: chat._id, messages: [assistantMessage] });
  });
};

/**
 * Loads and formats recent messages for Gemini context.
 * @param {string} chatId - Chat document ID.
 * @param {number} limit - Number of past messages to retrieve.
 * @returns {Promise<Array<{ role: string, parts: Array }>>}
 */
export const loadRecentMessagesForContext = async (chatId, limit = 6) => {
  if (!chatId) return [];

  const chat = await getChatById(chatId);
  return chat?.messages?.slice(-limit) || [];

   
};