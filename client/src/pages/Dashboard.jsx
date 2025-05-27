// import React from "react";
// import Sidebar from '../components/ui/Sidebar';  // Change 'Sidebar.jsx' → 'sidebar'
// import "../styles/Cardsection.css";  
// import "../styles/recentactivity.css"; // Change 'RecentActivity.css' → 'recentactivity.css'
// import AnalysisIcon from '../assets/analysis-left-svgrepo-com.svg';
// import RecentUploads from '../assets/upload-svgrepo-com (1).svg';
// import "./Dashboard.css";
// import Navbar from "../components/ui/Navbar";  // Import Navbar
// import { useNavigate } from "react-router-dom";


// const Dashboard = () => {
//   const navigate = useNavigate();

//   const handleRecentClick = () => {
//     navigate('/dashboard/recent');
//   };

//   const handleViewCardClick = () => {
//     navigate("/dashboard/AllPredictions");
//   };
//   const handleViewClick = () => {
//     navigate(`/dashboard/prediction/${id}`);
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column" }}>
//       {/* Navbar */}
//       <Navbar /> {/* Place Navbar at the top of the page */}

//       {/* Main content container */}
//       <div style={{ display: "flex", marginTop: "60px" }}> {/* Adjust margin-top to avoid overlap with Navbar */}
//         {/* Sidebar only on Dashboard */}
//         <Sidebar />
        
//         {/* Main content */}
//         <div style={{ flex: 1, paddingLeft: "290px", paddingTop: "60px" }}>
//           <div className="dashboard-content">
//             {/* Cards Section */}
//             <div className="analytics-container">
//               <div className="analytics-header">
//                 <h1>Analytics</h1>
//               </div>

//               <div className="analytics-cards">
//                 <div className="analytics-card"
//                    style={{ cursor: "pointer" }}
//                    onClick={handleViewCardClick}
//                 >
//                   <div className="card-content">
//                     <div className="card-icon-title">
//                       <img src={AnalysisIcon} alt="icon" className="card-icon" />
//                       <span>Total Analysis</span>
//                     </div>
//                     <div className="card-count">46</div>
//                   </div>
//                 </div>

//                 <div className="analytics-card"
//                  style={{ cursor: "pointer" }}
//                  onClick={handleRecentClick}
//                  >
//                   <div className="card-content">
//                     <div className="card-icon-title">
//                       <img src={RecentUploads} alt="icon" className="card-icon" />
//                       <span>Recent Uploads</span>
//                     </div>
//                     <div className="card-count">6</div>
//                   </div>
//                 </div>
//              </div>
//             </div>

           
//             <div className="recent-uploads-container">
//               <h2 className="recent-uploads-title">Recent Uploads</h2>
//               <div className="uploads-table-scroll">
//                   <table className="recent-uploads-table">
//                     <thead>
//                       <tr>
//                        <th>Date</th>
//                        <th>Description</th>
//                        <th>View</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//   {recentData.map((item) => (
//     <tr key={item._id}>
//       <td>{new Date(item.timestamp).toLocaleString()}</td>
//       <td>{item.description || "Tower inspection image - Auto generated"}</td>
//       <td>
//         <i
//           className="fa fa-eye view-icon"
//           style={{ cursor: "pointer" }}
//           onClick={() => handleViewClick(item._id)}
//         ></i>
//       </td>
//     </tr>
//   ))}
// </tbody>
//                   </table>
//                 </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from "react";
import Sidebar from '../components/ui/sidebar';
import "../styles/Cardsection.css";
import "../styles/recentactivity.css";
import AnalysisIcon from '../assets/analysis-left-svgrepo-com.svg';
import RecentUploads from '../assets/upload-svgrepo-com (1).svg';
import "./Dashboard.css";
import Navbar from "../components/ui/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentData, setRecentData] = useState([]);
  const [summary, setSummary] = useState({ totalCount: 0, recentCount: 0 });

  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      console.error("User email not found in localStorage.");
      return;
    }

    // 1. Fetch Recent Predictions
    axios.get(`http://localhost:3000/api/records/recent?email=${userEmail}`)
      .then((res) => {
        setRecentData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching recent data:", err);
      });

    // 2. Fetch Prediction Summary
    console.log("📤 Fetching prediction summary...");
  axios.get(`http://localhost:3000/api/records/summary?email=${userEmail}`)
    .then((res) => {
      console.log("✅ Summary response:", res.data);

      const { totalPredictions, recentPredictions } = res.data;

      // Store in localStorage
      localStorage.setItem("predictionCount", totalPredictions);
      localStorage.setItem("recentCount", recentPredictions);

      console.log("💾 Saved to localStorage -> predictionCount:", totalPredictions, "recentCount:", recentPredictions);

      setSummary({ totalCount: totalPredictions, recentCount: recentPredictions });
      console.log("📊 Summary state updated:", { totalCount: totalPredictions, recentCount: recentPredictions });
    })
    .catch((err) => {
      console.error("❌ Error fetching prediction summary:", err);
    });
}, []);

  const handleRecentClick = () => {
    navigate('/dashboard/recent');
  };

  const handleViewCardClick = () => {
    navigate("/dashboard/AllPredictions");
  };

  const handleViewClick = (id) => {
    navigate(`/dashboard/prediction/${id}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ display: "flex", marginTop: "60px" }}>
        <Sidebar />
        <div style={{ flex: 1, paddingLeft: "290px", paddingTop: "60px" }}>
          <div className="dashboard-content">
            <div className="analytics-container">
              <div className="analytics-header">
                <h1>Analytics</h1>
              </div>
              <div className="analytics-cards">
                <div className="analytics-card"
                   style={{ cursor: "pointer" }}
                   onClick={handleViewCardClick}
                >
                  <div className="card-content">
                    <div className="card-icon-title">
                      <img src={AnalysisIcon} alt="icon" className="card-icon" />
                      <span>Total Analysis</span>
                    </div>
                    <div className="card-count">
                      {summary.totalCount ?? "Loading..."}
                    </div>
                  </div>
                </div>

                <div className="analytics-card"
                 style={{ cursor: "pointer" }}
                 onClick={handleRecentClick}
                 >
                  <div className="card-content">
                    <div className="card-icon-title">
                      <img src={RecentUploads} alt="icon" className="card-icon" />
                      <span>Recent Uploads</span>
                    </div>
                    <div className="card-count">
                      {summary.recentCount ?? "Loading..."}
                    </div>
                  </div>
                </div>
             </div>
            </div>

            <div className="recent-uploads-container">
              <h2 className="recent-uploads-title">Recent Uploads</h2>
              <div className="uploads-table-scroll">
                  <table className="recent-uploads-table">
                    <thead>
                      <tr>
                       <th>Date</th>
                       <th>Description</th>
                       <th>View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentData.map((item) => (
                        <tr key={item._id}>
                          <td>{new Date(item.timestamp).toLocaleString()}</td>
                          <td>{item.description || "Tower inspection image - Auto generated"}</td>
                          <td>
                            <i
                              className="fa fa-eye view-icon"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleViewClick(item._id)}
                            ></i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;