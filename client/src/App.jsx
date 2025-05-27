import React from 'react';
import { Routes, Route } from "react-router-dom";

import UploadImage from "./pages/dashboard/UploadImage";
import PredictionResult from './pages/PredictionResult';
import Login from "./pages/Login";
import Sign from "./pages/Sign";
import Dashboard from './pages/Dashboard';
import RecentUploads from './pages/dashboard/recent';
import AllPredictions from './pages/dashboard/AllPredictions';
import PredictionDetails from "./pages/PredictionDetails";
// src/index.js or src/App.js

import Overview from './pages/dashboard/Overview';
import ContactUs from './pages/dashboard/ContactUs';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Sign />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/recent" element={<RecentUploads />} />
        <Route path="/dashboard/AllPredictions" element={<AllPredictions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/dashboard/uploadImage" element={<UploadImage />} />
        <Route path="/dashboard/overview" element={<Overview />} />
        <Route path="/dashboard/contactus" element={<ContactUs />} />
        <Route path="/prediction-result" element={<PredictionResult />} />
        <Route path="/dashboard/prediction/:id" element={<PredictionDetails />} />

    </Routes>

  );
}

export default App;
