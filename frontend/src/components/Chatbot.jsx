

// import React, { useState } from "react";

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     console.log("Button clicked");
//     console.log("Message:", input);

//     const userMsg = { text: input, type: "user" };
//     setMessages((prev) => [...prev, userMsg]);

//     const userInput = input;
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:4000/chat-free", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: userInput,
//         }),
//       });

//       const data = await res.json();
//       console.log("AI Response:", data);

//       // ✅ OpenRouter response handle
//       const reply =
//         data?.choices?.[0]?.message?.content ||
//         "Reply nahi mila 😢";

//       const botMsg = {
//         text: reply,
//         type: "bot",
//       };

//       setMessages((prev) => [...prev, botMsg]);
//     } catch (err) {
//       console.log("Error:", err);

//       setMessages((prev) => [
//         ...prev,
//         { text: "Server error aa gaya 😢", type: "bot" },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="chatbot">
//       <div className="chat-header">AI Chatbot 🤖</div>

//       <div className="chat-body">
//         {messages.length === 0 && (
//           <div className="bot">Hello 👋 Ask me anything</div>
//         )}

//         {messages.map((msg, i) => (
//           <div key={i} className={msg.type}>
//             {msg.text}
//           </div>
//         ))}

//         {loading && <div className="bot">Typing...</div>}
//       </div>

//       <div className="chat-input">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask something..."
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />

//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;




import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiMessageCircle, FiX, FiMinus } from "react-icons/fi";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, type: "user" };
    setMessages((prev) => [...prev, userMsg]);

    const userInput = input;
    setInput("");
    setLoading(true);

    try {
      const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1").replace("/api/v1", "");
     
      const res = await fetch(`${apiBase}/chat-free`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API Error Response:", data);
        const errorMsg = data.message || data.error?.message || "The AI is a bit overwhelmed right now.";
        throw new Error(errorMsg);
      }

      let reply = "I'm sorry, I'm having trouble thinking right now. Please try again in a moment.";

      // Handle OpenRouter specific response format
      if (data?.choices && data.choices.length > 0) {
        reply = data.choices[0]?.message?.content || reply;
      }

      setMessages((prev) => [...prev, { text: reply, type: "bot" }]);
    } catch (err) {
      console.error("Chatbot Error:", err);
      // Show cleaner error message to user
      let displayMessage = "Connection error. Please ensure the backend is running.";
      if (err.message && !err.message.includes("fetch")) {
        displayMessage = `AI Assistant: ${err.message}`;
      }
      setMessages((prev) => [...prev, { text: displayMessage, type: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 9999, fontFamily: "inherit" }}>
      {/* Toggle Button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.75rem",
            boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          className="chat-toggle-btn"
        >
          <FiMessageCircle />
          <style>{`
            .chat-toggle-btn:hover { transform: scale(1.1) rotate(5deg); }
          `}</style>
        </button>
      ) : (
        /* Chat Window */
        <div style={{
          width: "380px",
          height: "550px",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          animation: "slideUp 0.3s ease-out"
        }}>
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>

          {/* Header */}
          <div style={{
            padding: "1.25rem",
            backgroundColor: "#0f172a",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10b981" }}></div>
              <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>AI Assistant</span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "1.2rem" }}><FiMinus /></button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              backgroundColor: "#f8fafc"
            }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <FiMessageCircle size={40} style={{ color: "#e2e8f0", marginBottom: "1rem" }} />
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Hello! How can I help you with your job search today?</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
                padding: "0.75rem 1rem",
                borderRadius: msg.type === "user" ? "15px 15px 0 15px" : "15px 15px 15px 0",
                backgroundColor: msg.type === "user" ? "#4f46e5" : "white",
                color: msg.type === "user" ? "white" : "#1e293b",
                fontSize: "0.9rem",
                boxShadow: msg.type === "user" ? "0 4px 6px -1px rgba(79, 70, 229, 0.2)" : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                lineHeight: 1.5
              }}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: "flex-start", padding: "0.5rem 1rem", color: "#64748b", fontSize: "0.85rem", fontStyle: "italic" }}>
                AI is thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: "1rem", borderTop: "1px solid #e2e8f0", backgroundColor: "white" }}>
            <div style={{ position: "relative", display: "flex", gap: "0.5rem" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  outline: "none",
                  fontSize: "0.9rem",
                  backgroundColor: "#f1f5f9"
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  backgroundColor: "#4f46e5",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;