// import React, { useContext, useEffect } from "react";
// import "./App.css";
// import { Context } from "./main";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Login from "./components/Auth/Login";
// import Register from "./components/Auth/Register";
// import { Toaster } from "react-hot-toast";
// import axios from "axios";
// import Navbar from "./components/Layout/Navbar";
// import Footer from "./components/Layout/Footer";
// import Home from "./components/Home/Home";
// import Jobs from "./components/Job/Jobs";
// import JobDetails from "./components/Job/JobDetails";
// import Application from "./components/Application/Application";
// import MyApplications from "./components/Application/MyApplications";
// import PostJob from "./components/Job/PostJob";
// import NotFound from "./components/NotFound/NotFound";
// import MyJobs from "./components/Job/MyJobs";
// import ChatPage from "./pages/ChatPage";
// import ResumeAnalyzer from "./components/ResumeAnalyzer";

// const App = () => {
//   const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_API_URL}/user/getuser`,
//           {
//             withCredentials: true,
//           }
//         );
//         setUser(response.data.user);
//         setIsAuthorized(true);
//       } catch (error) {
//         setIsAuthorized(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   return (
//     <>
//       <BrowserRouter>
//         <Navbar />
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/" element={<Home />} />
//           <Route path="/job/getall" element={<Jobs />} />
//           <Route path="/job/:id" element={<JobDetails />} />
//           <Route path="/application/:id" element={<Application />} />
//           <Route path="/applications/me" element={<MyApplications />} />
//           <Route path="/job/post" element={<PostJob />} />
//           <Route path="/job/me" element={<MyJobs />} />
//           <Route path="*" element={<NotFound />} />
//           <Route path="/chat" element={<ChatPage />} />
//           <Route path="/resume" element={<ResumeAnalyzer />} />
//         </Routes>
//         <Footer />
//         <Toaster />
//       </BrowserRouter>
//     </>
//   );
// };

// export default App;




import React, { useContext, useEffect } from "react";
import "./App.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import NotFound from "./components/NotFound/NotFound";
import MyJobs from "./components/Job/MyJobs";
import ChatPage from "./pages/ChatPage";
import ResumeAnalyzer from "./components/ResumeAnalyzer";

/* 👇 NEW Layout Component */
const AppLayout = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  const location = useLocation(); // 👈 IMPORTANT

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/getuser`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/job/getall" element={<Jobs />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/application/:id" element={<Application />} />
        <Route path="/applications/me" element={<MyApplications />} />
        <Route path="/job/post" element={<PostJob />} />
        <Route path="/job/me" element={<MyJobs />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/resume" element={<ResumeAnalyzer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* 👇 FOOTER HIDE */}
      {/* {location.pathname !== "/resume" && <Footer />} */}

      {!["/resume", "/chat","/application","/job/getall","/applications/me"].includes(location.pathname) && <Footer />}

      <Toaster />
    </>
  );
};

/* 👇 MAIN APP */
const App = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;