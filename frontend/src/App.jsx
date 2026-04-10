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
import "./responsive.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
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
import SavedJobs from "./components/Job/SavedJobs";

import SeekerLayout from "./components/Layout/SeekerLayout";
import RecruiterLayout from "./components/Layout/RecruiterLayout";

import SeekerDashboard from "./components/Home/SeekerDashboard";
import RecruiterDashboard from "./components/Home/RecruiterDashboard";

import TalentSearch from "./components/Home/TalentSearch";
import Profile from "./components/Home/Profile";
import Chatbot from "./components/Chatbot";
import ApplicationDetail from "./components/Application/ApplicationDetail";
import RecruiterAnalytics from "./components/Home/RecruiterAnalytics";

const AppLayout = () => {
  const { isAuthorized, setIsAuthorized, setUser, user } = useContext(Context);
  const location = useLocation();

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

  // Determine if we are on a dashboard route
  const isDashboardRoute = location.pathname.startsWith('/seeker') || location.pathname.startsWith('/recruiter');

  return (
    <>
      {/* Show regular Navbar if not on dashboard */}
      {!isDashboardRoute && <Navbar />}

      <main className={(!isDashboardRoute && location.pathname !== "/") ? "main-content-with-nav" : ""}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          {/* Legacy routes mappings if accessed directly */}
          <Route path="/job/getall" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/application/:id" element={<Application />} />
          
          {/* SEEKER PORTAL */}
          <Route path="/seeker" element={
            isAuthorized && user?.role === "Job Seeker" ? <SeekerLayout /> : <Navigate to="/login" />
          }>
            <Route path="dashboard" element={<SeekerDashboard />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="application/:id" element={<ApplicationDetail />} />
            <Route path="saved" element={<SavedJobs />} />
            <Route path="resume" element={<ResumeAnalyzer />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* RECRUITER PORTAL */}
          <Route path="/recruiter" element={
            isAuthorized && user?.role === "Employer" ? <RecruiterLayout /> : <Navigate to="/login" />
          }>
            <Route path="dashboard" element={<RecruiterDashboard />} />
            <Route path="jobs/post" element={<PostJob />} />
            <Route path="jobs/manage" element={<MyJobs />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="application/:id" element={<ApplicationDetail />} />
            <Route path="analytics" element={<RecruiterAnalytics />} />
            <Route path="search" element={<TalentSearch />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* FOOTER HIDE logic for certain pages */}
      {(!isDashboardRoute && !["/resume", "/chat","/application","/job/getall","/applications/me"].includes(location.pathname)) && <Footer />}

      {/* Show Chatbot only when user is logged in */}
      {isAuthorized && <Chatbot />}
      <Toaster />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;