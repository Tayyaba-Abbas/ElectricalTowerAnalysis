import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sign.css";
import image from "./../assets/image.png";
import { FaGoogle, FaFacebook } from "react-icons/fa";

const Signup = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("Registered User Email:", formData.email); // ✅ Console log
        localStorage.setItem("email", formData.email);          // ✅ Save in localStorage
        localStorage.setItem("user", JSON.stringify({
          name: formData.name,
          email: formData.email,
        }));
        navigate("/dashboard");  // ✅ Direct redirect to dashboard
      } else {
        alert("❌ " + (result.errors?.[0]?.msg || result.msg || "Registration failed"));
      }
    } catch (error) {
      console.error("❌ Registration Error:", error);
      alert("Something went wrong during registration!");
    }
  };
  

  return (
    <div className="signup-container">
      <div className="signup-left">
        <p className="signup-text">“Explore segmented results in 3D, visual insights here.”</p>
        <img src={image} alt="3D Illustration" className="visual-image" />
      </div>

      <div className="signup-right">
        <h2 className="signup-title">Create Account</h2>

        <p className="or-text">- OR -</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            className="input-field"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="input-field"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-field"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="signup-btn">Create Account</button>
        </form>

        <p className="login-text">Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default Signup;