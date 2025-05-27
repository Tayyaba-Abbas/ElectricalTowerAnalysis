import { useEffect, useState } from 'react';
import "../PredictionResult.css";

export default function RecentUploads() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchUploads = async () => {
      const userEmail = localStorage.getItem("email");
      console.log("🔍 [Debug] localStorage keys:", Object.keys(localStorage));
      console.log("📧 [Debug] Retrieved userEmail from localStorage:", userEmail);
  
      if (!userEmail) {
        console.warn("⚠ [Warning] No userEmail found in localStorage!");
        setErrorMsg("❌ User email not found. Please login.");
        setLoading(false);
        return;
      }
  
      const apiUrl = `http://localhost:3000/api/records/recent?email=${encodeURIComponent(userEmail)}`;
      console.log("🌐 [Debug] Fetching data from API URL:", apiUrl);
  
      try {
        const res = await fetch(apiUrl);
        console.log("✅ [Debug] Fetch response status:", res.status);
  
        if (!res.ok) {
          const errData = await res.json();
          console.error("❌ [Error] API responded with:", errData);
          setErrorMsg(errData.message || 'Failed to fetch uploads');
          setUploads([]);
          setLoading(false);
          return;
        }
  
        const data = await res.json();
        console.log("📦 [Debug] API Response Data:", data);
  
        if (Array.isArray(data) && data.length === 0) {
          console.log("ℹ [Info] No records found for this user.");
          setErrorMsg("No records found for this email.");
        } else {
          setUploads(data);
        //  localStorage.setItem("recentCount", data.length); // ✅ Store count here
          setErrorMsg('');
        }
      } catch (err) {
        console.error("🔥 [Exception] Error during fetch:", err);
        setErrorMsg("Error fetching uploads. Please try again later.");
        setUploads([]);
      } finally {
        setLoading(false);
        console.log("🔚 [Debug] Fetch operation complete.");
      }
    };
  
    fetchUploads();
  }, []);
  

  if (loading) {
    return (
      <div className="prediction-container">
        <div className="top-section">
          <h1>Recent Uploads</h1>
          <p>Previously Analyzed Electrical Tower Images</p>
        </div>
        <p className="no-data">Loading...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="prediction-container">
        <div className="top-section">
          <h1>Recent Uploads</h1>
          <p>Previously Analyzed Electrical Tower Images</p>
        </div>
        <p className="no-data">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="prediction-container">
      <div className="top-section">
        <h1>Recent Uploads</h1>
        <p>Previously Analyzed Electrical Tower Images</p>
      </div>

      <div className="prediction-section">
        {uploads.map((upload, idx) => (
          <div key={upload._id || idx} className="upload-block">
            <h2>Upload #{idx + 1}</h2>
            <p><strong>Timestamp:</strong> {new Date(upload.timestamp).toLocaleString()}</p>

            <div className="images-row">
              <div className="image-column">
                <h3>Original Image</h3>
                <div className="image-block">
                  {upload.original_image ? (
                    <img src={`data:image/jpeg;base64,${upload.original_image}`} alt="Original" />
                  ) : (
                    <span>No original image</span>
                  )}
                </div>
              </div>

              <div className="image-column">
                <h3>Annotated Image</h3>
                <div className="image-block">
                  {upload.annotated_image ? (
                    <img src={`data:image/jpeg;base64,${upload.annotated_image}`} alt="Annotated" />
                  ) : (
                    <span>No annotated image</span>
                  )}
                </div>
              </div>
            </div>

            <div className="dimensions-table-container">
              <h2>Component Dimensions</h2>
              {upload.dimensions && typeof upload.dimensions === 'object' ? (
                <table className="dimensions-table">
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th>Height (cm)</th>
                      <th>Width (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(upload.dimensions).map(([key, comp]) => {
                      const heightVal = Number(comp["Mapped Height (cm)"] ?? comp.height_cm);
                      const widthVal = Number(comp["Mapped Width (cm)"] ?? comp.width_cm);

                      return (
                        <tr key={key}>
                          <td>{comp.Component || key}</td>
                          <td>{!isNaN(heightVal) ? heightVal.toFixed(2) : 'N/A'}</td>
                          <td>{!isNaN(widthVal) ? widthVal.toFixed(2) : 'N/A'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p>No dimensions available</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <footer className="footer">
        <p>© 2025 Electric Tower Analysis | All rights reserved.</p>
      </footer>
    </div>
  );
}