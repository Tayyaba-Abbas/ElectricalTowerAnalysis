// import React from "react";
// import { Link } from "react-router-dom";
// import defaultPic from "../assets/my pic.jpg";
// import {
//   MdEmail,
//   MdPhone,
//   MdLocationOn,
//   MdCalendarToday,
//   MdHistory
// } from "react-icons/md";
// import "./Profile.css";

// const Profile = () => {
//   const user = {
//     name: "Tayyaba Abbas",
//     email: "tayyaba@example.com",
//     phone: "+123 456 7890",
//     address: "123 Main St, City, Country",
//     profilePic: defaultPic,
//     role: "Data Scientist",
//     bio: "Passionate about AI, computer vision, and building impactful solutions.",
//     joined: "January 15, 2023",
//     LastAnalysis: "March 30, 2025"
//   };

//   return (
//     <div className="profile-container">
//       <div className="profile-header">
//         <h1>User Profile</h1>
//         <Link to="/EditProfile" className="edit-profile-link">
//           <i className="fa fa-edit"></i> Edit Profile
//         </Link>
//       </div>

//       <div className="profile-card">
//         <div className="profile-pic-wrapper">
//           <img src={user.profilePic} alt="Profile" className="profile-pic" />
//         </div>

//         <div className="profile-details">
//           <h2>{user.name}</h2>
//           <span className="user-role">{user.role}</span>
//           <p className="bio">{user.bio}</p>

//           <div className="contact-info">
//             <p><MdEmail /> {user.email}</p>
//             <p><MdPhone /> {user.phone}</p>
//             <p><MdLocationOn /> {user.address}</p>
//             <p><MdCalendarToday /> Joined: {user.joined}</p>
//             <p><MdHistory /> Last Analysis: {user.LastAnalysis}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultPic from "../assets/my pic.jpg";
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdCalendarToday,
  MdHistory
} from "react-icons/md";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } else {
        navigate("/login"); // Redirect to login if not found
      }
    } catch (err) {
      console.error("Invalid user data in localStorage", err);
      localStorage.removeItem("user"); // Optional: cleanup
      navigate("/login"); // Redirect to login
    }
  }, [navigate]);

  if (!user) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        <Link to="/EditProfile" className="edit-profile-link">
          <i className="fa fa-edit"></i> Edit Profile
        </Link>
      </div>

      <div className="profile-card">
        <div className="profile-pic-wrapper">
          <img src={user.profilePic || defaultPic} alt="Profile" className="profile-pic" />
        </div>

        <div className="profile-details">
          <h2>{user.name || "Anonymous User"}</h2>
          <span className="user-role">{user.role || "User"}</span>
          <p className="bio">{user.bio || "No bio added."}</p>

          <div className="contact-info">
            <p><MdEmail /> {user.email || "Not provided"}</p>
            <p><MdPhone /> {user.phone || "N/A"}</p>
            <p><MdLocationOn /> {user.address || "Not provided"}</p>
            {/* <p><MdCalendarToday /> Joined: {user.joined || "N/A"}</p>
            <p><MdHistory /> Last Analysis: {user.LastAnalysis || "N/A"}</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
