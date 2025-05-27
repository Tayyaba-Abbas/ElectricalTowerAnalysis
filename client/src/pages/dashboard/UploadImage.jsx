import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadImage.css';
import uploadIcon from '../../assets/upload-svgrepo-com.svg';
import tickIcon from '../../assets/success-filled-svgrepo-com.svg'; 
import failedIcon from "../../assets/error-svgrepo-com (2).svg";
import Dashboard from '../Dashboard';


export default function UploadImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setErrorMessage('No image uploaded yet. Please upload an image to continue.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

const email = localStorage.getItem('email');
if (email) {
  console.log("📧 Sending email with prediction:", email);  // for debug
  formData.append('email', email);
}

    //  localStorage.setItem("email", user.email);
    //   formData.append('email', userEmail);
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        const originalUrl = `http://localhost:5000${data.original_image}`;
        const predictionUrl = `http://localhost:5000${data.annotated_image}`;

        setTimeout(() => {
          setIsLoading(false);
          navigate('/prediction-result', {
            state: {
              original: originalUrl,
              prediction: predictionUrl,
              height: data.insulator_height,
              width: data.insulator_width,
              count: data.pattern_count,
              dimensions: data.dimensions
            }
          });
        }, 8000);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsLoading(false);
      setErrorMessage('Failed to upload image. Please try again.');
    }
  };

  return(
    <>
    {<Dashboard />} 
    <div className="upload-container">
      {/* Background Overlay with Blur */}
      <div className="upload-background"/>
      
      {isLoading ? (
        <div className="loader-card">
          <h2>Loading Segmentation Results</h2>
          <div className="progress-bar-container">
            <div className="progress-bar"></div>
          </div>
        </div>
      ) : (
        <div className="upload-card">
          <h2>Upload an Image from Device</h2>
          <label htmlFor="image-upload" className="upload-icon-box">
            <input
              type="file"
              accept="image/*"
              id="image-upload"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <img
              src={errorMessage ? failedIcon : (selectedFile ? tickIcon : uploadIcon)}
              alt="Upload status"
              className="upload-svg-icon"
            />
          </label>

          {selectedFile && (
            <p className="upload-success-msg">Image uploaded successfully!</p>
          )}
          {errorMessage && (
            <p className="upload-error-msg">{errorMessage}</p>
          )}

          <button onClick={handleSubmit} className="run-analysis-btn">
            Run Analysis
          </button>
        </div>
      )}
    </div>
    </>
  );
}
