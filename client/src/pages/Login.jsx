import React, { useState } from "react";
import "./Login.css";
import image from "../assets/image.png";
import { FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = {
        email,
        password
      };

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        // ✅ Save email to localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem("email", email);
        localStorage.setItem("user", JSON.stringify({
            name: formData.name,
            email: formData.email,
            // optionally add other fields you want to store
          }));
        console.log("Logged in user email:", formData.email); // ✅ Console log email

        navigate("/dashboard"); // ✅ Redirect after successful login
      } else {
        setErrorMessage(result.errors?.[0]?.msg || result.msg || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Something went wrong during login!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h2 className="login-title">Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        


        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">
            Login Account
          </button>
        </form>

        <p className="signup-text">
          Don’t have an account? <a href="/">Signup</a>
        </p>
      </div>

      <div className="login-right">
        <p className="login-text">
          “Explore segmented results in 3D, visual insights here.”
        </p>
        <img src={image} alt="3D Illustration" className="visual-image" />
      </div>
    </div>
  );
};

export default Login;