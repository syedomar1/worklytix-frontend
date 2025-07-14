"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizonal } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const placeholderImages = [
  "/insights/chart1.jpg",
  "/insights/chart2.jpg",
  "/insights/chart3.jpg",
  "/insights/chart4.jpg",
];

const TABS = [
  { label: "Warehouse", value: "warehouse" },
  { label: "Store", value: "store" },
];

export default function ChatInterface({ defaultEndpoint, role }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataset, setDataset] = useState("warehouse");
  const [activeEndpoint, setActiveEndpoint] = useState(defaultEndpoint);
  const chatRef = useRef(null);

  useEffect(() => {
    if (role === "Supply Chain Manager") {
      setActiveEndpoint(`${backendUrl}/query/${dataset}`);
    }
  }, [dataset, backendUrl, role]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setChat((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(activeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();

      const status = data?.status || "unknown";
      const answer = data?.response?.answer || data?.response || "⚠️ No answer provided.";
      const result = data?.response?.result;
      const agent = data?.agent_used || "Unknown Agent";

      const botMessage = {
        sender: "bot",
        status,
        answer,
        agent,
        result,
      };

      setChat((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error:", err);
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Failed to connect to server.", status: "error" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";
      case "error":
        return "bg-red-100 text-red-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">
      {/* Chat Section */}
      <div className="lg:w-[35%] w-full bg-white rounded-2xl shadow-lg flex flex-col p-5">
        <h2 className="text-xl font-bold mb-4 text-[#0071ce] text-center">
          💬 {role} Assistant
        </h2>

        {/* Toggle for Supply Chain Manager */}
        {role === "Supply Chain Manager" && (
          <div className="flex justify-center gap-2 mb-4">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setDataset(tab.value);
                  setChat([]); // reset chat
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                  dataset === tab.value
                    ? "bg-[#0071ce] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Chat Messages */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto space-y-3 border border-gray-200 rounded-md bg-[#f9f9f9] p-3"
          style={{ minHeight: "300px", maxHeight: "500px" }}
        >
          {chat.length === 0 ? (
            <p className="text-sm text-gray-500 text-center mt-6">
              Start asking about your insights ⬅️
            </p>
          ) : (
            chat.map((msg, i) => {
              const isUser = msg.sender === "user";
              const statusColor = getStatusColor(msg.status);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`whitespace-pre-wrap px-4 py-2 rounded-lg text-sm max-w-[90%] ${
                    isUser
                      ? "bg-[#d6eaff] self-end ml-auto"
                      : `self-start mr-auto ${statusColor}`
                  }`}
                >
                  {isUser ? (
                    msg.text
                  ) : (
                    <>
                      <p className="font-semibold mb-1">
                        🤖 Agent: <span className="text-[#0071ce]">{msg.agent}</span>
                      </p>
                      <p className="mb-1">💬 {msg.answer}</p>

                      {msg.result && typeof msg.result === "object" && (
                        <div className="mt-2 border border-gray-300 rounded-md p-2 bg-white text-gray-800">
                          {Array.isArray(msg.result) ? (
                            msg.result.map((row, idx) => (
                              <div key={idx} className="mb-2 border-b pb-1 last:border-0">
                                {Object.entries(row).map(([key, value]) => (
                                  <div key={key} className="text-xs">
                                    <strong>{key}:</strong> {value}
                                  </div>
                                ))}
                              </div>
                            ))
                          ) : (
                            Object.entries(msg.result).map(([key, value]) => (
                              <div key={key} className="text-xs">
                                <strong>{key}:</strong> {value}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        {/* Chat Input */}
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
            disabled={loading}
            aria-label="Send"
          >
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>

      {/* Image Insights */}
      <div className="lg:w-[65%] w-full grid grid-cols-1 sm:grid-cols-2 gap-5 overflow-y-auto pr-2">
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
  );
}
