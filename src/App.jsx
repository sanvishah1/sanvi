import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Today from "./pages/Today";
import HabitTracker from "./pages/HabitTracker";
import AcademicDashboard from "./AcademicDashboard";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/habit-tracker" element={<HabitTracker />} />
        <Route path="/academics" element={<AcademicDashboard />} />
      </Routes>
    </Layout>
  );
};

export default App;
