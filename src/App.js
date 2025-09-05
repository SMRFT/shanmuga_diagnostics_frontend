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
import FranchiseSampleUpdate from "./Components/Sample/FranchiseSampleUpdate";
import FranchiseBatchApproval from "./Components/Sample/FranchiseBatchApproval";
import PatientDetails from "./Components/Test/PatientDetails";
import TestDetails from "./Components/Test/TestDetails";
import PatientList from "./Components/TestApproval/PatientList";
import DoctorForm from "./Components/TestApproval/DoctorForm";
import Dashboard from "./Components/Report/Dashboard";
import FranchiseOverview from "./Components/Report/FranchiseOverview";
import FranchiseTestSorting from "./Components/Report/FranchiseTestSorting";
import PaymentDashboard from "./Components/Report/PaymentDashboard";
import RegisterDashboard from "./Components/Report/RegisterDashboard";
import TestSorting from "./Components/Report/TestSorting";
import PatientOverview from "./Components/Report/PatientOverview";
import PatientOverallReport from "./Components/Finance/PatientOverallReport";

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
            <Route
              path="/FranchiseSampleUpdate"
              element={<FranchiseSampleUpdate />}
            />
            <Route
              path="/FranchiseBatchApproval"
              element={<FranchiseBatchApproval />}
            />
            {/* Test Values */}
            <Route path="/PatientDetails" element={<PatientDetails />} />
            <Route path="/TestDetails" element={<TestDetails />} />

            {/* Test Approval */}
            <Route path="/PatientList" element={<PatientList />} />
            <Route path="/DoctorForm" element={<DoctorForm />} />

            {/* Report */}
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/FranchiseOverview" element={<FranchiseOverview />} />
            <Route
              path="/FranchiseTestSorting"
              element={<FranchiseTestSorting />}
            />
            <Route path="/PaymentDashboard" element={<PaymentDashboard />} />
            <Route path="/RegisterDashboard" element={<RegisterDashboard />} />
            <Route path="/TestSorting" element={<TestSorting />} />
            <Route path="/PatientOverview" element={<PatientOverview />} />
            <Route
              path="/PatientOverallReport"
              element={<PatientOverallReport />}
            />

            {/* Uncomment and add all your other routes as needed */}
            {/* 
            
            
            <Route path="/SalesVisitLog" element={<SalesVisitLog />} />
            <Route path="/LogisticManagementApproval" element={<LogisticManagementApproval />} />
            <Route path="/Invoice" element={<Invoicemain />} />
            <Route path="/LogisticsMap" element={<LogisticsMap />} /> */}

            {/* Add all other routes from your original App.js */}
            {/* <Route path="/SampleCollectorForm" element={<SampleCollectorForm />} />
            <Route path="/ClinicalName" element={<ClinicalName />} />
            <Route path="/RefBy" element={<RefBy />} />
            <Route path="/TestForm" element={<TestForm />} />
            <Route path="/PrintBill" element={<PrintBill />} />            
            
            
            <Route path="/TestEdit" element={<TestEdit />} />
            
            <Route path="/CashTally" element={<CashTally />} />
            
            <Route path="/SalesVisitDashboard" element={<SalesVisitDashboard />} />
            <Route path="/SalesVisitLogReport" element={<SalesVisitLogReport />} />
            <Route path="/SalesReport" element={<SalesReport />} />
            <Route path="/LogisticManagementAdmin" element={<LogisticManagementAdmin />} />
            <Route path="/PatientEditForm" element={<PatientEditForm />} />
            <Route path="/MIS" element={<MIS />} />
            <Route path="/Invoicemain" element={<Invoicemain />} />
            <Route path="/SalesDashboard" element={<SalesDashboard />} />
            <Route path="/LogisticsDashboard" element={<LogisticsDashboard />} />
            <Route path="/LogisticsTAT" element={<LogisticsTAT />} />
            <Route path="/Refund" element={<Refund />} />
            <Route path="/Cancellation" element={<Cancellation />} />
            <Route path="/B2B" element={<B2B />} />
            <Route path="/B2BApproval" element={<B2BApproval />} />
            <Route path="/B2BFinalApproval" element={<B2BFinalApproval />} />
            <Route path="/PatientTAT" element={<PatientTAT />} />
            <Route path="/RefundAndCancellationLog" element={<RefundAndCancellationLog />} />
            
            <Route path="/SalesDetailsEdit" element={<SalesDetailsEdit />} />
            <Route path="/B2BReport" element={<B2BReport />} />
            <Route path="/B2BPackage" element={<B2BPackage />} />
            <Route path="/B2BPackageApproval" element={<B2BPackageApproval />} />
            <Route path="/LiveTrackingDashboard" element={<LiveTrackingDashboard />} />
            <Route path="/Estimate" element={<Estimate />} />
            
             */}
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
