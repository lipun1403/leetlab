const chatHistory = new Map();

export const getHistory = (userId) => {
  return chatHistory.get(userId) || [];
};

export const addToHistory = (userId, message) => {
  if (!message || typeof message.content !== "string") return;

  const history = chatHistory.get(userId) || [];

  history.push({
    role: message.role,
    content: message.content,
  });

  const trimmed = history.slice(-10);
  chatHistory.set(userId, trimmed);
};