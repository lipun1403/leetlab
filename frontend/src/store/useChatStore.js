import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  messages: [],
  isChatOpen: false,
  isSending: false,

  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  clearMessages: () => set({ messages: [] }),

  sendMessage: async (text) => {
    try {
      set({ isSending: true });

      const userMessage = { role: "user", text, type: "user-query" };

      set((state) => ({
        messages: [...state.messages, userMessage],
      }));

      const res = await axiosInstance.post("/chat", {
        message: text,
      });

      set((state) => ({
        messages: [
          ...state.messages,
          { role: "bot", text: res.data.reply, type: "answer" },
        ],
      }));
    } catch (error) {
      console.error("Error sending Ai message:", error);
      toast.error("Failed to send message");
    } finally {
      set({ isSending: false });
    }
  },
}));