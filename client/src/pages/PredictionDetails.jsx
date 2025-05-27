// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const PredictionDetails = () => {
//   // Step 1: Get the prediction ID from the URL
//   const { id } = useParams();

//   // Step 2: Set up state for prediction data and error
//   const [prediction, setPrediction] = useState(null);
//   const [error, setError] = useState(null);

//   // Step 3: Hook to navigate back to the dashboard
//   const navigate = useNavigate();

//   // Step 4: Fetch prediction details from API when component loads
//   useEffect(() => {
//     axios.get(`http://localhost:3000/api/records/prediction/${id}`)
//       .then((res) => {
//         setPrediction(res.data);     // Store the response data
//         setError(null);              // Clear any previous errors
//       })
//       .catch((err) => {
//         console.error('Error fetching prediction details:', err);
//         setError('Failed to load prediction data. Please try again later.');
//       });
//   }, [id]);

//   // Step 5: Show loading or error messages if needed
//   if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
//   if (!prediction) return <div style={{ padding: '20px' }}>Loading...</div>;

//   // Step 6: Optional image styling
//   const imageStyle = {
//     maxWidth: '100%',
//     maxHeight: '400px',
//     border: '1px solid #ccc',
//     marginBottom: '15px'
//   };

//   // Step 7: Render the prediction details
//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Prediction Details</h2>

//       {/* Show timestamp */}
//       <p><strong>Date:</strong> {new Date(prediction.timestamp).toLocaleString()}</p>

//       {/* Show description or default one */}
//       <p><strong>Description:</strong> {prediction.description || "Tower inspection image - Auto generated"}</p>

//       {/* Display original image if available */}
//       {prediction.originalImage && (
//         <div>
//           <h4>Original Image:</h4>
//           <img
//             src={`data:image/jpeg;base64,${prediction.originalImage}`}
//             alt="Original"
//             style={imageStyle}
//           />
//         </div>
//       )}

//       {/* Display annotated image if available */}
//       {prediction.annotatedImage && (
//         <div>
//           <h4>Annotated Image:</h4>
//           <img
//             src={`data:image/jpeg;base64,${prediction.annotatedImage}`}
//             alt="Annotated"
//             style={imageStyle}
//           />
//         </div>
//       )}

//       {/* Display component dimensions if available */}
//       {prediction.components && (
//         <div>
//           <h4>Component Dimensions:</h4>
//           <ul>
//             {Object.entries(prediction.components).map(([name, value]) => (
//               <li key={name}><strong>{name}</strong>: {value} cm</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Back button */}
//       <button
//         onClick={() => navigate('/dashboard')}
//         style={{
//           marginTop: '20px',
//           padding: '10px 20px',
//           backgroundColor: '#1976d2',
//           color: 'white',
//           border: 'none',
//           borderRadius: '5px',
//           cursor: 'pointer'
//         }}
//       >
//         Back to Dashboard
//       </button>
//     </div>
//   );
// };

// export default PredictionDetails;




// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import './PredictionResult.css';

// const PredictionDetails = () => {
//   const { id } = useParams();
//   const [prediction, setPrediction] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axios.get(`http://localhost:3000/api/records/prediction/${id}`)
//       .then((res) => setPrediction(res.data))
//       .catch(() => setError('Failed to load prediction data.'));
//   }, [id]);

//   if (error) return <div className="prediction-container" style={{ color: 'red', padding: '20px' }}>{error}</div>;
//   if (!prediction) return <div className="prediction-container" style={{ padding: '20px' }}>Loading prediction data...</div>;

//   return (
//     <div className="prediction-container">
//       <div className="top-section">
//         <h1>Electrical Tower Analysis</h1>
//         <p>Optimizing Electricity Distribution with AI-Driven Insights</p>
//       </div>

//       <div className="prediction-section">
//         <h2>Prediction Details</h2>
//         <p><strong>Date:</strong> {new Date(prediction.timestamp).toLocaleString()}</p>
//         <p><strong>Description:</strong> {prediction.description || "Tower inspection image - Auto generated"}</p>

//         <div className="images-row">
//           {prediction.originalImage && (
//             <div className="image-column">
//               <h3>Original Image</h3>
//               <div className="image-block">
//                 <img src={`data:image/jpeg;base64,${prediction.originalImage}`} alt="Original" />
//               </div>
//             </div>
//           )}

//           {prediction.annotatedImage && (
//             <div className="image-column">
//               <h3>Annotated Image</h3>
//               <div className="image-block">
//                 <img src={`data:image/jpeg;base64,${prediction.annotatedImage}`} alt="Annotated" />
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="tower-info">
//           {/* Example tower info if any */}
//         </div>

//         <div className="dimensions-table-container">
//           <h2>Component Dimensions</h2>
//           <table className="dimensions-table">
//             <thead>
//               <tr>
//                 <th>Component</th>
//                 <th>Height (cm)</th>
//                 <th>Width (cm)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {prediction.dimensions && Object.entries(prediction.dimensions).map(([comp, size], idx) => (
//                 <tr key={idx}>
//                   <td>{comp}</td>
//                   <td>{size.height || '-'}</td>
//                   <td>{size.width || '-'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//       </div>

//       <footer className="footer">
//         <p>© 2025 Electric Tower Analysis | All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default PredictionDetails;




import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PopupMenu from './PopupMenu';
import { exportCSV, exportJSON, exportPDF } from '../utils/exportUtils';
import axios from 'axios';
import './PredictionResult.css'; // CSS same use kar sakte ho

const PredictionDetails = () => {
  const { id } = useParams();
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/records/prediction/${id}`)
      .then(res => {
        console.log("Fetched prediction data:", res.data);
        setPrediction(res.data);
        setError(null);
      })
      .catch(err => {
        setError('Failed to load prediction details.');
        console.error(err);
      });
  }, [id]);

  const handleDownload = (format) => {
    if (!prediction) return;

    const fileName = `Report_of_${id}`;
    const data = {
      predictionCount: prediction.predictionCount,
      insulatorHeightPx: prediction.insulatorHeightPx,
      insulatorWidthPx: prediction.insulatorWidthPx,
      components: prediction.dimensions,
      originalImage: prediction.originalImage,
      annotatedImage: prediction.annotatedImage
    };

    if (format === 'csv') exportCSV(data, fileName);
    else if (format === 'json') exportJSON(data, fileName);
    else if (format === 'pdf') exportPDF(data, fileName);

    setShowPopup(false);
  };

  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  if (!prediction) return <div style={{ padding: '20px' }}>Loading prediction details...</div>;

  return (
    <div className="prediction-container">
      <div className="top-section">
        <h1>Electrical Tower Analysis</h1>
        <p>Optimizing Electricity Distribution with AI-Driven Insights</p>
      </div>

      <div className="prediction-section">
        <h2>Prediction Details</h2>

        <div className="images-row">
          <div className="image-column">
            <h3>Original Image</h3>
            <div className="image-block">
              {prediction.original_image ? (
                <img
                src={`data:image/jpeg;base64,${prediction.original_image}`}
                alt="Original Upload"
              />
              ) : <p>No original image available.</p>}
            </div>
          </div>

          <div className="image-column">
            <h3>Annotated Image</h3>
            <div className="image-block">
              {prediction.annotated_image
 ? (
                <img
                src={`data:image/jpeg;base64,${prediction.annotated_image
                }`}
                alt="Annotated"
              />
              ) : <p>No annotated image available.</p>}
            </div>
          </div>
        </div>

        <div className="tower-info">
          <p><strong>Date:</strong> {new Date(prediction.timestamp).toLocaleString()}</p>
          <p><strong>Description:</strong> Tower inspection image - Auto generated</p>
          <p><strong>Insulator Height for Mapping:</strong> {prediction.insulator_height_px} pixels</p>
          <p><strong>Insulator Width for Mapping:</strong> {prediction.insulator_width_px} pixels</p>
          <p><strong>Number of 'Cross Pattern' Predictions:</strong> {prediction.cross_pattern_count}</p>
        </div>

        <div className="dimensions-table-container">
          <h2>Component Dimensions</h2>
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
              {prediction.dimensions && prediction.dimensions.length > 0 ? (
                prediction.dimensions.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item["Component"]}</td>
                    <td>{Number(item["Height (pixels)"]).toFixed(2)}</td>
                    <td>{item["Width (pixels)"] !== undefined ? Number(item["Width (pixels)"]).toFixed(2) : '-'}</td>
                    <td>{Number(item["Mapped Height (cm)"]).toFixed(2)}</td>
                    <td>{item["Mapped Width (cm)"] !== undefined ? Number(item["Mapped Width (cm)"]).toFixed(2) : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5">No component dimension data available.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="download-btn-container">
          <button className="download-btn" onClick={() => setShowPopup(true)}>Download Report</button>
          {showPopup && (
            <PopupMenu onClose={() => setShowPopup(false)} onSelect={handleDownload} />
          )}
        </div>
      </div>

      <footer className="footer">
        <p>© 2025 Electric Tower Analysis | All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PredictionDetails;
