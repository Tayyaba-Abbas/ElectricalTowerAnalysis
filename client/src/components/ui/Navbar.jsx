// import React from "react";
// import "../../styles/navbar.css";
// import { Link } from "react-router-dom";
// import myPic from "../../assets/my pic.jpg";  // Import your image

// const Navbar = () => {
//   return (
//     <>
//       {/* Navbar Section */}
//       <nav className="navbar">
//         {/* Profile Section */}
//         <div className="profile">
//           <Link to="/profile" className="profile-link"> 
//             <img 
//               src={myPic}  // Use the imported image here
//               alt="Profile" 
//               className="profile-image"
//             />
//             <span className="profile-name">Tayyaba Abbas</span>
//           </Link>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Navbar;




import React, { useEffect, useState } from "react";
import "../../styles/navbar.css";
import { Link } from "react-router-dom";
import myPic from "../../assets/my pic.jpg";  // Import your image

const Navbar = () => {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser.email || "User");
      } catch (err) {
        console.error("Error parsing user data from localStorage", err);
      }
    }
  }, []);

  return (
    <>
      {/* Navbar Section */}
      <nav className="navbar">
        {/* Profile Section */}
        <div className="profile">
          <Link to="/profile" className="profile-link"> 
            {/* <img 
              src={myPic}  // Use the imported image here
              alt="Profile" 
              className="profile-image"
            /> */}
            <span className="profile-name">{userName}</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
