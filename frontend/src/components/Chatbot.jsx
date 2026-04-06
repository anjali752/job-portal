

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




import React, { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    console.log("Button clicked");
    console.log("Message:", input);

    const userMsg = { text: input, type: "user" };
    setMessages((prev) => [...prev, userMsg]);

    const userInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/chat-free", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
        }),
      });

      const data = await res.json();

      // 🔍 FULL DEBUG (important)
      console.log("FULL RESPONSE:", JSON.stringify(data, null, 2));

      // ✅ SAFE RESPONSE HANDLE
      let reply = "Reply nahi mila 😢";

      if (data?.choices && data.choices.length > 0) {
        reply = data.choices[0]?.message?.content || reply;
      } else if (data?.error) {
        reply = "API error aa gaya 😢";
      }

      console.log("FINAL REPLY:", reply);

      const botMsg = {
        text: reply,
        type: "bot",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.log("Error:", err);

      setMessages((prev) => [
        ...prev,
        { text: "Server error aa gaya 😢", type: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="chat-header">AI Chatbot 🤖</div>

      <div className="chat-body">
        {messages.length === 0 && (
          <div className="bot">Hello 👋 Ask me anything</div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={msg.type}>
            {msg.text}
          </div>
        ))}

        {loading && <div className="bot">Typing...</div>}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;