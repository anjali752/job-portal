// import React from "react";
// import Chatbot from "../components/Chatbot";

// const ChatPage = () => {
//   return (
//     <div style={{ height: "100vh" }}>
//   <Chatbot />
// </div>
      
//   );
// };

// export default ChatPage;




import React from "react";
import Chatbot from "../components/Chatbot";

const ChatPage = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      {/* 👇 wrapper add kiya */}
      <div
        style={{
          width: "400px",
          height: "600px",
        }}
      >
        <Chatbot />
      </div>
    </div>
  );
};

export default ChatPage;