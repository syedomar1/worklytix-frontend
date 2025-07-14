"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { SendHorizonal } from "lucide-react";
import Image from "next/image";

const placeholderImages = [
  "/insights/chart1.jpg",
  "/insights/chart2.jpg",
  "/insights/chart3.jpg",
  "/insights/chart4.jpg",
];

export default function Insights() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const chatRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    const botResponse = {
      sender: "bot",
      text: `📊 Placeholder insight based on: "${input}"`,
    };

    setChat((prev) => [...prev, userMessage, botResponse]);
    setInput("");
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div className="min-h-screen pt-20 bg-[#f5faff] text-[#1a1a1a] font-sans px-4 md:px-8">
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-5rem)]">
        {/* Chat Section */}
        <div className="lg:w-[30%] w-full bg-white rounded-2xl shadow-lg flex flex-col p-5">
          <h2 className="text-xl font-bold mb-4 text-[#0071ce] text-center">💬 Ask Assistant</h2>

          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto space-y-3 border border-gray-200 rounded-md bg-[#f9f9f9] p-3"
          >
            {chat.length === 0 ? (
              <p className="text-sm text-gray-500 text-center mt-6">
                Start asking about any insight on the right ➡️
              </p>
            ) : (
              chat.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`px-4 py-2 rounded-lg text-sm max-w-[90%] ${
                    msg.sender === "user"
                      ? "bg-[#d6eaff] self-end ml-auto"
                      : "bg-[#ececec] self-start mr-auto"
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-sm"
            />
            <button
              onClick={handleSend}
              className="p-3 bg-[#0071ce] hover:bg-[#005bb5] text-white rounded-full transition"
              aria-label="Send"
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>

        {/* Insights Section */}
        <div className="lg:w-[70%] w-full grid grid-cols-1 sm:grid-cols-2 gap-5 overflow-y-auto pr-2">
          {placeholderImages.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center"
            >
              <div className="w-full h-auto aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={src}
                  alt={`Insight ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-3 text-sm text-gray-600 text-center">
                Insight Chart {index + 1}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}