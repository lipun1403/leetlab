import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import AIMessage from "./AIMessage";
import { Loader2, Copy, Check, BotIcon } from "lucide-react";

const ChatWidget = () => {
  const { authUser } = useAuthStore();
  const {
    messages,
    isChatOpen,
    toggleChat,
    sendMessage,
    isSending,
    setMessages,
  } = useChatStore();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);

      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  useEffect(() => {
    if (isChatOpen && messages?.length === 0) {
      setMessages([
        {
          role: "bot",
          text: `Hi ${authUser?.name || "there"}! I can help you with hints and approaches.`,
          type: "greeting",
        },
      ]);
    }
  }, [isChatOpen, messages.length, authUser, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 rounded-full p-[2px] 
             bg-gradient-to-r from-white via-grey-500 to-blue-500 
             hover:scale-110 transition"
      >
        <div className="flex gap-2 items-center bg-black text-white px-4 py-3 rounded-full">
          <span>Leetbot AI</span>
          <BotIcon className="h-5 w-5" />
        </div>
      </button>

      {isChatOpen && (
        <div className="fixed bottom-20 right-6 w-[380px] md:w-[420px] h-[500px]  bg-black shadow-2xl rounded-xl flex flex-col z-50 backdrop-blur-md border-t  border-white/20">
          <div className="p-3 text-white bg-base-500 border-b border-white/30 font-semibold">
            Chat With LeetBot 🤖
          </div>

          <div className="flex-1 overflow-y-auto  space-y-3 p-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "bot" && (
                  <div className="w-7 h-7 min-w-[28px] flex items-center justify-center rounded-full bg-primary text-white text-xs">
                    🤖
                  </div>
                )}

                {/* Message + Copy */}
                <div className="flex flex-col max-w-[70%] ">
                  <div
                    className={`px-3 py-2 rounded-lg text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-white"
                        : "bg-base-200 text-base-content"
                    }`}
                  >
                    <AIMessage text={msg.text} />
                  </div>

                  {msg.role === "bot" &&
                    msg.text !== "Typing..." &&
                    msg.type === "answer" && (
                      <button
                        onClick={() => handleCopy(msg.text, i)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition mt-2 ml-2"
                      >
                        {copiedIndex === i ? (
                          <>
                            <Check size={14} className="text-green-400" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copy
                          </>
                        )}
                      </button>
                    )}
                </div>

                {msg.role === "user" && (
                  <div className="w-7 h-7 min-w-[28px] rounded-full overflow-hidden border border-white/20">
                    <img
                      src={
                        "../../man.png" ||
                        "https://avatar.iran.liara.run/public/boy"
                      }
                      alt="user"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-primary text-white text-xs">
                  🤖
                </div>
                <div className="bg-base-200 px-3 py-2 rounded-lg text-sm animate-pulse">
                  typing...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-2 flex gap-2 border-t border-base-300">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for hints..."
              className="input input-bordered w-full text-sm"
            />
            <button
              onClick={handleSend}
              disabled={isSending}
              className="btn btn-primary btn-sm"
            >
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;