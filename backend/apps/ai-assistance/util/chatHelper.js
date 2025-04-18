import {
  uploadToFirebase
} from '../../../libraries/services/firebase.js';

import { ChatFactory } from '../../../libraries/services/chat-service/chatFactory.js';

import { appendMessagesToChat, saveNewChat } from '../db.js';

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
export const generateAssistantResponse = (userMessage) => {
  const llm = ChatFactory.create('gemini');
  return llm.sendMessage([userMessage]).then(responseText => ({
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
    res.status(200).json({ chatId: chat._id, messages: chat.messages });
  });
};