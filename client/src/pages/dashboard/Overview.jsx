import React from "react";
import "./Overview.css";

const Overview = () => {
  return (
    <div className="overview-container">
      {/* Top Header Section */}
      <div className="top-section">
        <h1>Overview</h1>
      </div>

      {/* Project Name & Purpose */}
      <div className="project-info">
        
        <p>
          A smart solution that leverages AI to automate transmission tower modeling.
          Just upload a tower image, and get an editable 3D structure — cutting down hours of manual work.
        </p>
      </div>

      {/* Key Capabilities Card */}
      <div className="overview-card">
        <h3>🧠 Key Capabilities</h3>
        <ul>
          <li><strong>Image-Based Recognition:</strong> Detects segments, bracing, height, and geometry.</li>
          <li><strong>Auto Model Generation:</strong> Builds a tower model with ~80% accuracy.</li>
          <li><strong>Editable Output:</strong> Lets users refine or customize the structure.</li>
        </ul>
      </div>

      {/* Benefits Card */}
      <div className="overview-card">
        <h3>🚀 Benefits</h3>
        <ul>
          <li>Reduces manual modeling time.</li>
          <li>Speeds up design for reference towers.</li>
          <li>Enables modeling from site photos/visuals.</li>
        </ul>
      </div>

      {/* Technical Section */}
      <div className="overview-card" style={{ background: "#434971" }}>
        <h3>🔍 Technical Insight</h3>
        <p>
          This feature utilizes computer vision and pattern recognition to bring intelligent automation into transmission tower design workflows.
        </p>
      </div>
    </div>
  );
};

export default Overview;
