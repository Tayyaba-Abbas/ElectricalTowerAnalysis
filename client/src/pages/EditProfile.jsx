import React, { useRef, useState } from "react";
import { MdEdit, MdCameraAlt } from "react-icons/md";
import defaultPic from "../assets/my pic.jpg"; // Your image
import { AlignCenter } from "lucide-react";

const EditProfile = () => {
  const [user, setUser] = useState({
    name: "Tayyaba Abbas",
    email: "tayyaba@example.com",
    phone: "+123 456 7890",
    address: "123 Main St, City, Country",
    role: "Data Scientist",
    bio: "Passionate about AI, computer vision, and building impactful solutions.",
    profilePic: defaultPic,
  });

  const inputRefs = {
    name: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    address: useRef(null),
    role: useRef(null),
    bio: useRef(null),
  };

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser((prev) => ({
        ...prev,
        profilePic: URL.createObjectURL(file),
      }));
    }
  };

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const renderField = (label, field) => (
    <div style={styles.fieldGroup} key={field}>
      <label style={styles.label}>{label}</label>
      <div style={styles.singleLine}>
        <input
          ref={inputRefs[field]}
          type="text"
          value={user[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          style={styles.input}
        />
        <MdEdit
          style={styles.editIcon}
          onClick={() => inputRefs[field].current.focus()}
        />
      </div>
      <div style={styles.underline}></div>
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Edit Profile</h2>

      <div style={styles.imageSection}>
        <img src={user.profilePic} alt="Profile" style={styles.image} />
        <div style={styles.cameraOverlay} onClick={() => fileInputRef.current.click()}>
          <MdCameraAlt style={styles.cameraIcon} />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>

      {renderField("Full Name", "name")}
      {renderField("Email", "email")}
      {renderField("Phone", "phone")}
      {renderField("Address", "address")}
      {renderField("Role", "role")}
      {renderField("Bio", "bio")}
      <div style={styles.buttonWrapper}>
         <button style={styles.saveButton}>Save Changes</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    borderRadius: "16px",
    fontFamily: "'Roboto', sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
  },
  imageSection: {
    position: "relative",
    width: "140px",
    height: "140px",
    margin: "0 auto 40px auto",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
    border: "4px solid #007bff",
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007bff",
    padding: "8px",
    borderRadius: "50%",
    cursor: "pointer",
  },
  cameraIcon: {
    color: "white",
    fontSize: "1.1rem",
  },
  fieldGroup: {
    marginBottom: "28px",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#444",
    fontSize: "0.95rem",
    display: "block",
  },
  singleLine: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "1rem",
    backgroundColor: "transparent",
    color: "#333",
  },
  editIcon: {
    fontSize: "1.2rem",
    color: "#007bff",
    cursor: "pointer",
    marginLeft: "10px",
  },
  underline: {
    height: "1.2px",
    backgroundColor: "#ccc",
    marginTop: "5px",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  
  saveButton: {
    width: "40%",
    marginTop: "30px",
    padding: "12px 0",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",    
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    

  },
};

export default EditProfile;
