import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";
import "./App.css";

import PatientForm from "./Components/Patients/PatientForm";

import PatientBilling from "./Components/Patients/PatientBilling";

// Wrapper for the main content to shift it to the right of the sidebar
const ContentWrapper = styled.div`
  margin-top: 15px;
  padding: 20px;
  margin-left: 260px;

  @media (max-width: 1024px) {
    margin-left: 200px;
  }

  @media (max-width: 768px) {
    margin-left: 100px;
  }

  @media (max-width: 480px) {
    margin-left: 20px;
  }
`;

function App() {
  const location = useLocation();
  const [role, setRole] = useState(null); // use state for role

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  // Paths where the sidebar should be hidden
  const hideSidebarRoutes = ["/"];

  return (
          <Routes>
            {/* Define all routes here */}
            <Route path="/PatientForm" element={<PatientForm />} />
            <Route path="/PatientBilling" element={<PatientBilling />} />
          </Routes>
        
  );
}

export default function AppWrapper() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <App />
    </Router>
  );
}