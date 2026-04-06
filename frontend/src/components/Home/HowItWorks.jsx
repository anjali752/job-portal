// import React from "react";
// import { FaUserPlus } from "react-icons/fa";
// import { MdFindInPage } from "react-icons/md";
// import { IoMdSend } from "react-icons/io";

// const HowItWorks = () => {
//   return (
//     <>
//       <div className="howitworks">
//         <div className="container">
//           <h3>How Career Connect Works !</h3>
//           <div className="banner">
//             <div className="card">
//               <FaUserPlus />
//               <p>Create Account</p>
//               <p>
//                 Lorem, ipsum dolor sit amet consectetur adipisicing elit.
//                 Consequuntur, culpa.
//               </p>
//             </div>
//             <div className="card">
//               <MdFindInPage />
//               <p>Find a Job/Post a Job</p>
//               <p>
//                 Lorem, ipsum dolor sit amet consectetur adipisicing elit.
//                 Consequuntur, culpa.
//               </p>
//             </div>
//             <div className="card">
//               <IoMdSend />
//               <p>Apply For Job/Recruit Suitable Candidates</p>
//               <p>
//                 Lorem, ipsum dolor sit amet consectetur adipisicing elit.
//                 Consequuntur, culpa.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default HowItWorks;





import React from "react";
import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { Link } from "react-router-dom"; // 👈 ADD

const HowItWorks = () => {
  return (
    <>
      <div className="howitworks">
        <div className="container">
          <h3>How Career Connect Works !</h3>

          <div className="banner">
            <div className="card">
              <FaUserPlus />
              <p>Create Account</p>
              <p>
                Create your account easily and start your journey with us.
              </p>
            </div>

            <div className="card">
              <MdFindInPage />
              <p>Find a Job/Post a Job</p>
              <p>
                Search jobs or post openings to find the best candidates.
              </p>
            </div>

            <div className="card">
              <IoMdSend />
              <p>Apply / Recruit</p>
              <p>
                Apply for jobs or recruit suitable candidates quickly.
              </p>
            </div>
          </div>

          {/* 🔥 GET STARTED BUTTON */}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link to="/job/getall" className="get-started-btn">
              Get Started 🚀
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorks;
