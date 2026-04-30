






import React, { useState, useRef, useEffect, useContext } from "react";
import { FiSend, FiMessageCircle, FiX, FiMinus } from "react-icons/fi";
import { Context } from "../main";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(Context);
  const scrollRef = useRef();
  const lastMessageRef = useRef();

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
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
     
      const res = await fetch(`${apiBase}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userInput,
          role: user?.role 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API Error Response:", data);
        const errorMsg = data.message || data.error?.message || "The AI is a bit overwhelmed right now.";
        throw new Error(errorMsg);
      }

      let reply = "I'm sorry, I'm having trouble thinking right now. Please try again in a moment.";

      if (data?.reply && data.reply.response) {
        reply = data.reply.response;
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
    <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 9999, fontFamily: "inherit" }}>
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
        /* Chat Window — fixed height, only messages scroll */
        <div style={{
          width: "380px",
          maxWidth: "calc(100vw - 2rem)",
          height: "calc(100vh - 6rem)",
          maxHeight: "600px",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 25px 70px -12px rgba(0, 0, 0, 0.4)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid rgba(226, 232, 240, 0.5)",
          animation: "slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          backdropFilter: "blur(12px)",
          overscrollBehavior: "contain",
        }}>
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            
            .chat-messages-container::-webkit-scrollbar { width: 8px; }
            .chat-messages-container::-webkit-scrollbar-track { background: #f1f5f9; }
            .chat-messages-container::-webkit-scrollbar-thumb { background: #4f46e5; border-radius: 10px; border: 2px solid #f1f5f9; }
            .chat-messages-container::-webkit-scrollbar-thumb:hover { background: #4338ca; }
          `}</style>

          {/* Header */}
          <div style={{
            padding: "1.25rem",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            flexShrink: 0
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ position: "relative" }}>
                 <div style={{ width: "40px", height: "40px", backgroundColor: "#4f46e5", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>RX</div>
                 <div style={{ 
                    position: "absolute", bottom: "-2px", right: "-2px", 
                    width: "12px", height: "12px", borderRadius: "50%", 
                    backgroundColor: "#10b981", border: "2px solid #0f172a" 
                 }}></div>
              </div>
              <div>
                <span style={{ fontWeight: 800, fontSize: "1rem", display: "block", lineHeight: 1 }}>RecruiteX AI</span>
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Active Now</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button 
                onClick={() => setMessages([])} 
                title="Clear Chat"
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <FiX style={{ fontSize: "1.2rem" }} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <FiMinus style={{ fontSize: "1.2rem" }} />
              </button>
            </div>
          </div>

          {/* Messages Area — only this scrolls */}
          <div
            ref={scrollRef}
            className="chat-messages-container"
            style={{
              flex: 1,
              minHeight: 0,          /* ← critical: lets flex child shrink below content size */
              overflowY: "auto",
              overflowX: "hidden",
              padding: "1.5rem",
              display: "block",
              backgroundColor: "#f8fafc",
              backgroundImage: "radial-gradient(#e2e8f0 0.5px, transparent 0.5px)",
              backgroundSize: "20px 20px",
              scrollBehavior: "smooth",
              overscrollBehavior: "contain"
            }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", padding: "1rem" }}>
                <div style={{ padding: "2rem 1rem", borderRadius: "20px", border: "1px dashed #cbd5e1", backgroundColor: "rgba(255,255,255,0.5)" }}>
                  <FiMessageCircle size={48} style={{ color: "#4f46e5", marginBottom: "1rem", opacity: 0.2 }} />
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.5rem" }}>Hi there! 👋</h3>
                  <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.5 }}>
                    {user?.role === "Employer" 
                      ? "I'm your AI recruitment assistant. Ask me about finding talent, job postings, or hiring trends!"
                      : "I'm your AI career assistant. Ask me about jobs, resume tips, or how to use RecruiteX!"}
                  </p>
                </div>
                
                <div style={{ marginTop: "1.5rem" }}>
                   <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.75rem" }}>Quick Suggestions</p>
                   <div className="no-scrollbar" style={{ 
                     display: "flex", 
                     gap: "0.75rem", 
                     overflowX: "auto", 
                     paddingBottom: "0.5rem",
                     msOverflowStyle: "none",
                     scrollbarWidth: "none"
                   }}>
                     {(user?.role === "Employer" 
                       ? ["Post a Job", "How to find talent?", "Hiring trends", "Candidate screening", "Optimize job ads"]
                       : ["Resume Tips", "How to find jobs?", "Interview prep", "Salary help", "Tech skills"]
                     ).map(text => (
                       <button 
                         key={text}
                         onClick={() => setInput(text)}
                         style={{ 
                           padding: "0.6rem 1rem", 
                           borderRadius: "10px", 
                           border: "1px solid #e2e8f0", 
                           backgroundColor: "white", 
                           fontSize: "0.85rem", 
                           color: "#4f46e5", 
                           fontWeight: 600,
                           cursor: "pointer",
                           transition: "0.2s",
                           whiteSpace: "nowrap",
                           flexShrink: 0,
                           boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                         }}
                         onMouseOver={e => {
                           e.currentTarget.style.borderColor = "#4f46e5";
                           e.currentTarget.style.backgroundColor = "#f5f3ff";
                         }}
                         onMouseOut={e => {
                           e.currentTarget.style.borderColor = "#e2e8f0";
                           e.currentTarget.style.backgroundColor = "white";
                         }}
                       >
                         {text}
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                width: "100%",
                justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                marginBottom: "0.75rem",
                animation: "fadeIn 0.3s ease-out forwards",
                boxSizing: "border-box",
                padding: "0 0.5rem"
              }}>
                <div style={{
                  display: "flex",
                  flexDirection: msg.type === "user" ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: "0.75rem",
                  maxWidth: "92%"
                }}>
                  {/* Avatar Icon */}
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "10px",
                    backgroundColor: msg.type === "user" ? "#4f46e5" : "#1e293b",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 900,
                    flexShrink: 0,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    marginBottom: "1.2rem"
                  }}>
                    {msg.type === "user" ? "U" : "RX"}
                  </div>

                  {/* Message & Timestamp Block */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.type === "user" ? "flex-end" : "flex-start"
                  }}>
                    <div style={{
                      padding: "0.85rem 1.1rem",
                      borderRadius: msg.type === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                      backgroundColor: msg.type === "user" ? "#4f46e5" : "white",
                      color: msg.type === "user" ? "white" : "#1e293b",
                      fontSize: "0.95rem",
                      boxShadow: msg.type === "user" ? "0 4px 15px -3px rgba(79, 70, 229, 0.4)" : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      border: msg.type === "user" ? "none" : "1px solid #f1f5f9",
                      width: "100%"
                    }}>
                      {msg.text}
                    </div>
                    
                    {/* Timestamp */}
                    <span style={{ 
                      fontSize: "0.65rem", 
                      color: "#94a3b8", 
                      marginTop: "0.25rem",
                      fontWeight: 600,
                      opacity: 0.8
                    }}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div style={{ display: "flex", width: "100%", justifyContent: "flex-start", marginBottom: "0.75rem", padding: "0 0.5rem" }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "10px", backgroundColor: "#1e293b", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 900, marginBottom: "0.5rem" }}>RX</div>
                  <div style={{ display: "flex", gap: "4px", padding: "0.75rem 1rem", backgroundColor: "white", borderRadius: "15px 15px 15px 4px", border: "1px solid #f1f5f9" }}>
                    <div style={{ width: "6px", height: "6px", backgroundColor: "#4f46e5", borderRadius: "50%", animation: "bounceChat 0.6s infinite alternate" }}></div>
                    <div style={{ width: "6px", height: "6px", backgroundColor: "#4f46e5", borderRadius: "50%", animation: "bounceChat 0.6s infinite 0.2s alternate" }}></div>
                    <div style={{ width: "6px", height: "6px", backgroundColor: "#4f46e5", borderRadius: "50%", animation: "bounceChat 0.6s infinite 0.4s alternate" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={lastMessageRef} style={{ height: "1px" }} />
          </div>

          {/* Input — always pinned to bottom */}
          <div style={{ padding: "1rem", borderTop: "1px solid #e2e8f0", backgroundColor: "white", flexShrink: 0 }}>
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
                  fontSize: "1rem",
                  backgroundColor: "#f8fafc",
                  transition: "all 0.3s"
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