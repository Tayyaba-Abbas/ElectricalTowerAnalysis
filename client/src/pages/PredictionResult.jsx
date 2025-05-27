// import React, { useState } from 'react';
// import PopupMenu from './PopupMenu';
// import { exportCSV, exportJSON, exportPDF } from '../utils/exportUtils';
// import { useLocation } from 'react-router-dom';
// import './PredictionResult.css';

// const PredictionResult = () => {
//   const location = useLocation();
//   const {
//     original,
//     prediction,
//     height,
//     width,
//     count,
//     dimensions
//   } = location.state || {};
  

//   console.log('📦 Full location state:', location.state);
  
//   const [showPopup, setShowPopup] = useState(false);

//   const handleDownload = (format) => {
//     console.log("📥 Download format selected:", format); 
//     const fileName = `Report_of_${imageName}`;
//     console.log("🔍 dimensions", dimensions);

//     const data = {
//       predictionCount: count,
//       components: dimensions?.map(item => ({
//         component: item["Component"],
//         mappedHeightCm: item["Mapped Height (cm)"],
//         mappedWidthCm: item["Mapped Width (cm)"]
//       }))
//     };

//     if (format === 'csv') exportCSV(data, fileName);
//     else if (format === 'json') exportJSON(data, fileName);
//     else if (format === 'pdf') exportPDF(data, fileName);

//     // Close popup after download
//     setShowPopup(false);
//   };
//   const imageName = original ? original.split('/').pop().split('.')[0] : 'image';


//   return (
//     <div className="prediction-container">
//       {/* Top Section */}
//       <div className="top-section">
//         <h1>Electrical Tower Analysis</h1>
//         <p>Optimizing Electricity Distribution with AI-Driven Insights</p>
//       </div>

//       {/* Prediction Result Section */}
//       <div className="prediction-section">
//         <h2>Prediction Results</h2>

//         <div className="images-row">
//           <div className="image-column">
//             <h3>Original Image</h3>
//             <div className="image-block">
//               {original && <img src={original} alt="Original Upload" />}
//             </div>
//           </div>

//           <div className="image-column">
//             <h3>Annotated Image</h3>
//             <div className="image-block">
//               {prediction && <img src={prediction} alt="Predicted" />}
//             </div>
//           </div>
//         </div>

//         {/* Tower Info Details Section */}
//         <div className="tower-info">
//           <p><strong>Insulator Height for Mapping:</strong> {height} pixels</p>
//           <p><strong>Insulator Width for Mapping:</strong> {width} pixels</p>
//           <p><strong>Number of 'Cross Pattern' Predictions:</strong> {count}</p>
//         </div>

//         <div className="dimensions-table-container">
//           <h2>Dimensions Table</h2>
//           <table className="dimensions-table">
//             <thead>
//               <tr>
//                 <th>Component</th>
//                 <th>Height (pixels)</th>
//                 <th>Width (pixels)</th>
//                 <th>Mapped Height (cm)</th>
//                 <th>Mapped Width (cm)</th>
//               </tr>
//             </thead>
//             <tbody>
//             {dimensions && dimensions.map((item, index) => (
//               <tr key={index}>
//                 <td>{item["Component"]}</td>
//                 <td>{item["Height (pixels)"]}</td>
//                 <td>{item["Width (pixels)"] || '-'}</td>
//                 <td>{item["Mapped Height (cm)"]}</td>
//                 <td>{item["Mapped Width (cm)"] || '-'}</td>
//               </tr>
//             ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Download Button */}
//         <div className="download-btn-container">
//           <button className="download-btn" onClick={() => setShowPopup(true)}>Download Report</button>
//           {showPopup && (
//             <PopupMenu
//               onClose={() => setShowPopup(false)}
//               onSelect={handleDownload}
//             />
//           )}
          
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="footer">
//         <p>© 2025 Electric Tower Analysis | All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default PredictionResult;




import React, { useState } from 'react';
import PopupMenu from './PopupMenu';
import { exportCSV, exportJSON, exportPDF } from '../utils/exportUtils';
import { useLocation, useNavigate } from 'react-router-dom';
import './PredictionResult.css';

const PredictionResult = () => {
  const location = useLocation();
  const {
    original,
    prediction,
    height,
    width,
    count,
    dimensions
  } = location.state || {};

  const [showPopup, setShowPopup] = useState(false);
  const imageName = original ? original.split('/').pop().split('.')[0] : 'image';
  const navigate = useNavigate();


  // 🔧 Helper: Convert image URL to base64
  const imageToBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = function (e) {
        reject("Failed to load image: " + e);
      };
      img.src = url;
    });
  };

  // 📥 Download handler
  const handleDownload = async (format) => {
    const fileName = `Report_of_${imageName}`;

    const originalBase64 = await imageToBase64(original);
    const predictionBase64 = await imageToBase64(prediction);

    const data = {
      predictionCount: count,
      insulatorHeightPx: height,
      insulatorWidthPx: width,
      components: dimensions?.map(item => ({
        component: item["Component"],
        heightPixels: item["Height (pixels)"],
        widthPixels: item["Width (pixels)"],
        mappedHeightCm: item["Mapped Height (cm)"],
        mappedWidthCm: item["Mapped Width (cm)"]
      })),
      originalImage: originalBase64,
      annotatedImage: predictionBase64
    };

    if (format === 'csv') exportCSV(data, fileName);
    else if (format === 'json') exportJSON(data, fileName);
    else if (format === 'pdf') exportPDF(data, fileName);

    setShowPopup(false);
  };

  return (
    <div className="prediction-container">
      <div className="top-section">
        <h1>Electrical Tower Analysis</h1>
        <p>Optimizing Electricity Distribution with AI-Driven Insights</p>
      </div>

      <div className="prediction-section">
        <h2>Prediction Results</h2>

        <div className="images-row">
          <div className="image-column">
            <h3>Original Image</h3>
            <div className="image-block">
              {original && <img src={original} alt="Original Upload" />}
            </div>
          </div>

          <div className="image-column">
            <h3>Annotated Image</h3>
            <div className="image-block">
              {prediction && <img src={prediction} alt="Predicted" />}
            </div>
          </div>
        </div>

        <div className="tower-info">
          <p><strong>Insulator Height for Mapping:</strong> {height} pixels</p>
          <p><strong>Insulator Width for Mapping:</strong> {width} pixels</p>
          <p><strong>Number of 'Cross Pattern' Predictions:</strong> {count}</p>
        </div>

        <div className="dimensions-table-container">
          <h2>Dimensions Table</h2>
          <table className="dimensions-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Height (pixels)</th>
                <th>Width (pixels)</th>
                <th>Mapped Height (cm)</th>
                <th>Mapped Width (cm)</th>
              </tr>
            </thead>
            <tbody>
              {dimensions && dimensions.map((item, index) => (
                <tr key={index}>
                  <td>{item["Component"]}</td>
                  <td>{Number(item["Height (pixels)"]).toFixed(2)}</td>
                  <td>{item["Width (pixels)"] !== undefined ? Number(item["Width (pixels)"]).toFixed(2) : '-'}</td>
                  <td>{Number(item["Mapped Height (cm)"]).toFixed(2)}</td>
                  <td>{item["Mapped Width (cm)"] !== undefined ? Number(item["Mapped Width (cm)"]).toFixed(2) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="download-btn-container">
          <button className="download-btn" onClick={() => setShowPopup(true)}>Download Report</button>
          {showPopup && (
            <PopupMenu
              onClose={() => setShowPopup(false)}
              onSelect={handleDownload}
            />
          )}
        </div>
        <button
    className="download-btn"
    onClick={() => navigate('/dashboard')}
  >
    Go to Dashboard
  </button>
      </div>

      <footer className="footer">
        <p>© 2025 Electric Tower Analysis | All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PredictionResult;
