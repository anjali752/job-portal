import React from "react";
import { useContext } from "react";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import PopularCategories from "./PopularCategories";
import PopularCompanies from "./PopularCompanies";

const Home = () => {
  const { isAuthorized, user } = useContext(Context);
  
  if (isAuthorized && user?.role) {
    if (user.role === "Job Seeker") return <Navigate to={"/seeker/dashboard"} />;
    if (user.role === "Employer") return <Navigate to={"/recruiter/dashboard"} />;
  }

  return (
    <section className="homePage page">
      <HeroSection />
      <div id="howitworks">
        <HowItWorks />
      </div>
      <div id="categories">
        <PopularCategories />
      </div>
      <PopularCompanies />
    </section>
  );
};

export default Home;
