import React, { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../../main";
import axios from "axios";
import { FiSend, FiUser, FiSearch, FiMoreVertical, FiPaperclip } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const Messages = () => {
  const { user } = useContext(Context);
  const [searchParams] = useSearchParams();
  const initialParticipantId = searchParams.get("user");

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/message/chats`, { withCredentials: true });
      setChats(data.chatList);
      
      // If we clicked "Send Message" from profile, find that chat or show it as pending
      if (initialParticipantId && !activeChat) {
         const existingChat = data.chatList.find(c => c._id === initialParticipantId);
         if (existingChat) {
            setActiveChat(existingChat);
         } else {
            // Fetch the user info if they haven't chatted before
            try {
              const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/user/search?query=${initialParticipantId}`, { withCredentials: true });
              const target = userRes.data.candidates.find(u => u._id === initialParticipantId);
              if (target) {
                setActiveChat(target);
              }
            } catch (e) { console.error(e); }
         }
      }
    } catch (error) {
      console.error("Fetch chats error:", error);
    }
  };

  const fetchMessages = async (participantId) => {
    if (!participantId) return;
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/message/all/${participantId}`, { withCredentials: true });
      setMessages(data.messages);
    } catch (error) {
      console.error("Fetch messages error:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat._id);
      // Poll for new messages every 5 seconds
      const interval = setInterval(() => fetchMessages(activeChat._id), 5000);
      return () => clearInterval(interval);
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/message/send`,
        { receiverId: activeChat._id, content: newMessage },
        { withCredentials: true }
      );
      setMessages([...messages, data.data]);
      setNewMessage("");
      fetchChats(); // Refresh chat list to show top position
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 100px)", backgroundColor: "white", borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
      {/* Sidebar - Chat List */}
      <div style={{ width: "350px", borderRight: "1px solid #f1f5f9", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #f1f5f9" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem" }}>Messages</h2>
          <div style={{ display: "flex", alignItems: "center", backgroundColor: "#f8fafc", padding: "0.5rem 1rem", borderRadius: "12px" }}>
            <FiSearch color="#94a3b8" />
            <input type="text" placeholder="Search chats..." style={{ border: "none", background: "none", padding: "0.5rem", width: "100%", outline: "none", fontSize: "0.9rem" }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {chats.map(chat => (
            <div 
              key={chat._id} 
              onClick={() => setActiveChat(chat)}
              style={{ 
                padding: "1.25rem", 
                display: "flex", 
                gap: "1rem", 
                alignItems: "center", 
                cursor: "pointer",
                backgroundColor: activeChat?._id === chat._id ? "#eff6ff" : "transparent",
                borderLeft: activeChat?._id === chat._id ? "4px solid var(--primary)" : "4px solid transparent",
                transition: "0.2s"
              }}
            >
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "var(--primary)" }}>
                {chat.avatar?.url ? <img src={chat.avatar.url} style={{ width: "100%", height: "100%", borderRadius: "14px", objectFit: "cover" }} /> : chat.name.charAt(0)}
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>{chat.name}</span>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{new Date(chat.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))}
          {chats.length === 0 && !activeChat && (
            <div style={{ textAlign: "center", padding: "3rem 1.5rem", color: "#94a3b8" }}>
              <p>No conversations yet. Start a chat from the Talent Search page!</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" }}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div style={{ padding: "1rem 2rem", backgroundColor: "white", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "var(--primary)" }}>
                  {activeChat.avatar?.url ? <img src={activeChat.avatar.url} style={{ width: "100%", height: "100%", borderRadius: "12px", objectFit: "cover" }} /> : activeChat.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 800, color: "#0f172a" }}>{activeChat.name}</h4>
                  <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700 }}>• Online</span>
                </div>
              </div>
              <FiMoreVertical color="#94a3b8" style={{ cursor: "pointer" }} />
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, padding: "2rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {messages.map((msg, i) => {
                const isMe = msg.sender === user._id;
                return (
                  <div key={i} style={{ 
                    alignSelf: isMe ? "flex-end" : "flex-start",
                    maxWidth: "70%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMe ? "flex-end" : "flex-start"
                  }}>
                    <div style={{ 
                      padding: "0.75rem 1.25rem", 
                      borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      backgroundColor: isMe ? "var(--primary)" : "white",
                      color: isMe ? "white" : "#1e293b",
                      boxShadow: isMe ? "0 4px 10px rgba(79, 70, 229, 0.2)" : "0 4px 10px rgba(0,0,0,0.03)",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      lineHeight: 1.5
                    }}>
                      {msg.message}
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.4rem" }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} style={{ padding: "1.5rem 2rem", backgroundColor: "white", borderTop: "1px solid #f1f5f9", display: "flex", gap: "1rem", alignItems: "center" }}>
              <div style={{ flex: 1, backgroundColor: "#f1f5f9", borderRadius: "16px", padding: "0.5rem 1rem", display: "flex", alignItems: "center" }}>
                <FiPaperclip color="#94a3b8" style={{ marginRight: "0.75rem", cursor: "pointer" }} />
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..." 
                  style={{ flex: 1, border: "none", background: "none", outline: "none", padding: "0.5rem", fontSize: "0.95rem" }} 
                />
              </div>
              <button 
                type="submit"
                style={{ width: "45px", height: "45px", borderRadius: "14px", backgroundColor: "var(--primary)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)" }}
              >
                <FiSend color="white" />
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
             <div style={{ width: "80px", height: "80px", borderRadius: "30px", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}>
                <FiSend size={32} color="var(--primary)" />
             </div>
             <h3 style={{ color: "#0f172a", marginBottom: "0.5rem" }}>Your Messages</h3>
             <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
