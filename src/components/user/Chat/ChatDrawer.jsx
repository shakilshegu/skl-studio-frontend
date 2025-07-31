import React, { useState } from "react";
import { X, Smile, Send } from "lucide-react";

export default function ChatWidget({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi Brainly", time: "01:30", sent: true },
        { id: 2, text: "I'm Nick from India", time: "01:30", sent: true },
        {
            id: 3,
            text: "I'd like to invite you to our college's annual function 🎉. Would you like to attend? 🤔",
            time: "01:30",
            sent: true,
        },
        { id: 4, text: "Hi Nick", time: "01:31", sent: false },
        {
            id: 5,
            text: "I'd love to attend annual functions.",
            time: "01:31",
            sent: false,
        },
    ]);
    const [input, setInput] = useState("");

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const newMessage = {
            id: Date.now(),
            text: input,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            sent: true,
        };
        setMessages([...messages, newMessage]);
        setInput("");
    };

    return (
        <>
          <div
            className={`fixed top-0 right-0 h-screen w-full sm:w-[400px] bg-white shadow-xl transition-transform duration-300 ease-in-out z-50 ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{
              backgroundImage: `url('https://i.pinimg.com/736x/5e/e9/49/5ee949216508a9df4e75b7a1c1f72f10.jpg')`,
              backgroundSize: "cover",
            }}
          >
            {/* Entire Chat: Make it a column layout */}
            <div className="flex flex-col h-screen">
      
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-white/80">
                <div className="flex items-center gap-2">
                  <img
                    src="https://i.pravatar.cc/40"
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-semibold">Liyana Logan</span>
                </div>
                <button onClick={onClose}>
                  <X className="w-5 h-5" />
                </button>
              </div>
      
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-xl text-sm shadow ${
                        msg.sent
                          ? "bg-[#892580] text-white rounded-br-none"
                          : "bg-white text-gray-900 border rounded-bl-none"
                      }`}
                    >
                      <div>{msg.text}</div>
                      <div className="text-xs text-right mt-1 opacity-70">{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>
      
              {/* Input */}
              <form
                onSubmit={handleSend}
                className="flex items-center w-full px-4 py-3 border-t bg-white gap-2"
              >
                <Smile className="text-gray-500" />
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type message"
                  className="flex-1 border rounded-full px-4 py-2 bg-gray-100 text-sm focus:outline-none"
                />
                <button type="submit" className="text-purple-600">
                  <Send />
                </button>
              </form>
            </div>
          </div>
        </>
      );
      
}
