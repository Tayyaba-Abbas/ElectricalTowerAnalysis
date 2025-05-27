import React from "react";
import "../../styles/sidebar.css"; // Go up one level from ui to src, then go into styles
import myPic from "../../assets/annotated.png";  // Import your image
import { FaEnvelope, FaFilter, FaCloudUploadAlt, FaChartLine, FaFileAlt, FaCog, FaSignOutAlt, FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const handleLogout = () => {
    // Example: Clear token and redirect to login
    localStorage.removeItem("token");
    window.location.href = "/login"; // or use `navigate("/login")` if using `useNavigate`
  };
  

  return (
    <div className="sidebar">
      {/* Top Section - Profile and Title */}
      <div className="sidebar-top">
        <img 
          src={myPic}  // Use the imported image here
          alt="Profile" 
          className="profile-image"
        />
        <h1>Electrical Tower Analysis</h1>
      </div>

      {/* Menu Items */}
      <div className="sidebar-menu">
        <ul>
          <li><FaFilter style={{ marginRight: '4px'}} />
          <Link to="/dashboard/overview">Overview</Link></li>
          <li><FaCloudUploadAlt style={{ marginRight: '4px'}}/> 
          <Link to="/dashboard/UploadImage">Upload Image</Link></li>
        
          <li><FaEnvelope style={{ marginRight: '4px'}} />
          <Link to="/dashboard/ContactUs">Contact Us</Link></li>
   
        </ul>
      </div>

      {/* Bottom Section - Settings and Logout */}
      <div className="bottom-menu">
  <ul>
    <li onClick={handleLogout} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      <FaSignOutAlt style={{ marginRight: '12px' }} />
      Logout
    </li>
  </ul>
</div>

    </div>
  );
};

export default Sidebar;