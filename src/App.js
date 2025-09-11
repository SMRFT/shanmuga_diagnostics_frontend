import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import Sidebar from "./Components/Navbar/Sidebar";
import PatientForm from "./Components/Patients/PatientForm";
import PatientBilling from "./Components/Patients/PatientBilling";
import BarcodeGeneration from "./Components/Barcode/BarcodeGeneration";
import BarcodeTestDetails from "./Components/Barcode/BarcodeTestDetails";
import SampleStatus from "./Components/Sample/SampleStatus";
import SampleStatusUpdate from "./Components/Sample/SampleStatusUpdate";
import PatientDetails from "./Components/Test/PatientDetails";
import TestDetails from "./Components/Test/TestDetails";
import PatientList from "./Components/TestApproval/PatientList";
import DoctorForm from "./Components/TestApproval/DoctorForm";
import Dashboard from "./Components/Report/Dashboard";
import TestSorting from "./Components/Report/TestSorting";
import PatientOverview from "./Components/Report/PatientOverview";
import PatientOverallReport from "./Components/Finance/PatientOverallReport";
import FranchiseOverview from "./Components/Report/FranchiseOverview";
import FranchiseBatchApproval from "./Components/Sample/FranchiseBatchApproval";
import FranchiseTestSorting from "./Components/Report/FranchiseTestSorting";
import HMSTestSorting from "./Components/HMSReport/HMSTestSorting";
import HMSPatientOverview from "./Components/HMSReport/HMSPatientOverview";
import MIS from "./Components/MIS/MIS";
import ShanmugaMIS from "./Components/MIS/ShanmugaMIS";
import FranchiseMIS from "./Components/MIS/FranchiseMIS";

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
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNavigatedToRole, setHasNavigatedToRole] = useState(false);

  // Function to navigate based on role (copied from your Login.js)
  const navigateRole = (userRole) => {
    switch (userRole) {
      case "Admin":
        navigate("/Dashboard");
        break;
      case "HR":
        navigate("/LogisticsMap");
        break;
      case "Receptionist":
        navigate("/PatientForm");
        break;
      case "General Manager":
        navigate("/Dashboard");
        break;
      case "Technician":
        navigate("/SampleStatusUpdate");
        break;
      case "Doctor":
        navigate("/PatientList");
        break;
      case "Sales Person":
        navigate("/SalesVisitLog");
        break;
      case "Sample Collector":
        navigate("/LogisticManagementApproval");
        break;
      case "Accounts":
        navigate("/Invoice");
        break;
      case "Front Office":
        navigate("/PatientBilling");
        break;
      default:
        navigate("/PatientForm"); // Default fallback
    }
  };

  // Check token and navigate based on role
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const token = localStorage.getItem("access_token");

    console.log("App.js - User data loaded:", {
      storedRole,
      hasToken: !!token,
      currentPath: location.pathname,
    });

    if (storedRole && token) {
      setRole(storedRole);

      // Only navigate to role-specific page if we're on the root path
      // and haven't navigated yet
      if (location.pathname === "/" && !hasNavigatedToRole) {
        console.log("Navigating based on role:", storedRole);
        navigateRole(storedRole);
        setHasNavigatedToRole(true);
      }
    }

    setIsLoading(false);
  }, [location.pathname, navigate, hasNavigatedToRole]);

  // Reset navigation flag when location changes (for manual navigation)
  useEffect(() => {
    if (location.pathname !== "/") {
      setHasNavigatedToRole(true);
    }
  }, [location.pathname]);

  // Paths where the sidebar should be hidden
  const hideSidebarRoutes = ["/"];

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  // If no role is set, something went wrong
  if (!role) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "red",
        }}
      >
        Authentication error. Please refresh the page.
      </div>
    );
  }

  return (
    <div>
      {/* Conditionally render the Sidebar based on the route */}
      {!hideSidebarRoutes.includes(location.pathname) && role && (
        <Sidebar role={role} />
      )}

      {/* Only apply ContentWrapper on non-root routes */}
      {hideSidebarRoutes.includes(location.pathname) ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontSize: "18px",
          }}
        >
          Redirecting based on your role...
        </div>
      ) : (
        <ContentWrapper>
          <Routes>
            {/* Define all routes here */}
            <Route path="/PatientForm" element={<PatientForm />} />
            <Route path="/PatientBilling" element={<PatientBilling />} />
            {/* Barcode */}
            <Route path="/BarcodeGeneration" element={<BarcodeGeneration />} />
            <Route
              path="/BarcodeTestDetails"
              element={<BarcodeTestDetails />}
            />
            {/* Sample Status */}
            <Route path="/SampleStatus" element={<SampleStatus />} />
            <Route
              path="/SampleStatusUpdate"
              element={<SampleStatusUpdate />}
            />           
            {/* Test Values */}
            <Route path="/PatientDetails" element={<PatientDetails />} />
            <Route path="/TestDetails" element={<TestDetails />} />

            {/* Test Approval */}
            <Route path="/PatientList" element={<PatientList />} />
            <Route path="/DoctorForm" element={<DoctorForm />} />

            {/* Diagnostics Report */}
            <Route path="/Dashboard" element={<Dashboard />} />           
            <Route path="/TestSorting" element={<TestSorting />} />
            <Route path="/PatientOverview" element={<PatientOverview />} />

            {/* HMS Report */}          
            <Route path="/HMSTestSorting" element={<HMSTestSorting />} />
            <Route path="/HMSPatientOverview" element={<HMSPatientOverview />} />
            <Route
              path="/PatientOverallReport"
              element={<PatientOverallReport />}
            />
          {/* Franchise Report */}            
            <Route path="/FranchiseBatchApproval" element={<FranchiseBatchApproval />} />
            <Route path="/FranchiseOverview" element={<FranchiseOverview />} />
            <Route path="/FranchiseTestSorting" element={<FranchiseTestSorting />} />
          {/* MIS */}
            <Route path="/MIS" element={<MIS/>} />
            <Route path="/ShanmugaMIS" element={<ShanmugaMIS/>} />
            <Route path="/FranchiseMIS" element={<FranchiseMIS/>} />
          </Routes>
        </ContentWrapper>
      )}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <App />
    </Router>
  );
}