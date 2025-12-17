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
import Estimate from "./Components/Patients/Estimate";
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
import Invoice from "./Components/Finance/Invoice";
import CashTally from "./Components/Finance/CashTally";
import SalesVisitLog from "./Components/Sales/Salesvisitlog";
import ShanmugaMIS from "./Components/Mis/ShanmugaMIS";
import MIS from "./Components/Mis/MIS";
import FranchiseMIS from "./Components/Mis/FranchiseMIS";
import CorporateOverview from "./Components/Corparate/CorporatePatientOverview";
import CorporateTestSorting from "./Components/Corparate/CorporateTestSorting";
import Testcount from "./Components/Report/Testcount";
import HmsBilling from "./Components/HMS/HmsBilling";
import Hmssamplestatus from "./Components/HMS/Hmssamplestatus";
import HmsSampleStatusUpdate from "./Components/HMS/HmsSampleStatusUpdate";
import HMSBarcodeGeneration from "./Components/HMS/HMSBarcodeGeneration";
import HMSBarcodeTestDetails from "./Components/HMS/HMSBarcodeTestDetails";
import HMSPatientDetails from "./Components/HMS/HMSPatientDetails";
import HmsTestDetails from "./Components/HMS/HmsTestDetails";
import PrintBill from "./Components/Patients/PrintBill";
import Logisticsmap from "./Components/Logistics/Logisticsmap";
import LogisticManagementApproval from "./Components/Logistics/LogisticManagementApproval";
import LogisticManagementAdmin from "./Components/Logistics/LogisticManagementAdmin";
import CorporateBatchApproval from "./Components/Report/CorparateBatchapproval";
import CHCReport from "./Components/Report/CHCReport";
import CHCApproval from "./Components/Report/CHCApproval";
import PreethamHospitalReport from "./Components/Report/PreethamHospitalReport";
import TestEdit from "./Components/Forms/TestEdit";
import SalesDashboard from "./Components/Sales/SalesDashboard";
import SalesDetailsEdit from "./Components/Sales/SalesDetailsEdit";
import SalesVisitLogReport from "./Components/Sales/SalesVisitLogReport";
import SalesindividualReport from "./Components/Sales/SalesindividualReport";
import AppointmentBooking from "./Components/Patients/AppointmentBooking";
import B2B from "./Components/Lab/B2B";
import B2BApproval from "./Components/Lab/B2BApproval";
import B2BFinalApproval from "./Components/Lab/B2BFinalApproval";
import B2BReport from "./Components/Lab/B2BReport";
import LogisticsTAT from "./Components/Mis/LogisticsTAT";
import PaymentDashboard from "./Components/Patients/PaymentDashboard";
import RegisterDashboard from "./Components/Patients/RegisterDashboard";
import Refund from "./Components/Refund/Refund";
import Cancellation from "./Components/Refund/Cancellation";
import RefundAndCancellationLog from "./Components/Refund/RefundAndCancellationLog";
import PatientDataTable from "./Components/Mis/PatientTAT";

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
      case "Diagnostics General Manager":
        navigate("/Dashboard");
        break;
      case "Lab Receptionist":
        navigate("/PatientBilling");
        break;
      case "Sample Collector":
        navigate("/PatientForm");
        break;
      case "Lab Technician":
        navigate("/SampleStatusUpdate");
        break;
      case "Doctor":
        navigate("/PatientList");
        break;
      case "Sales Person":
        navigate("/SalesVisitLog");
        break;
      case "HR":
        navigate("/LogisticMap");
        break;
      case "CEO":
        navigate("/CHCreport");
        break;
      case "Accounts":
        navigate("/Invoice");
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
            <Route path="/AppointmentBooking" element={<AppointmentBooking />} />
            <Route path="/PatientForm" element={<PatientForm />} />
            <Route path="/PatientBilling" element={<PatientBilling />} />
            <Route path="/PaymentDashboard" element={<PaymentDashboard />} />
            <Route path="/RegisterDashboard" element={<RegisterDashboard />} />
            <Route path="/PrintBill" element={<PrintBill />} />
            <Route path="/Estimate" element={<Estimate />} />

            {/* Barcode */}
            <Route path="/BarcodeGeneration" element={<BarcodeGeneration />} />
            <Route path="/BarcodeTestDetails" element={<BarcodeTestDetails />} />

            {/* Sample Status */}
            <Route path="/SampleStatus" element={<SampleStatus />} />
            <Route path="/SampleStatusUpdate" element={<SampleStatusUpdate />} />  

            {/* Test Edit */}      
            <Route path="/TestEdit" element={<TestEdit />} />      

            {/* Test Values */}
            <Route path="/PatientDetails" element={<PatientDetails />} />
            <Route path="/TestDetails" element={<TestDetails />} />

            {/* Finance */}
            <Route path="/CashTally" element={<CashTally />} />
            <Route path="/Invoice" element={<Invoice />} />
            <Route path="/Refund" element={<Refund />} />
            <Route path="/Cancellation" element={<Cancellation />} />
            <Route path="/RefundAndCancellationLog" element={<RefundAndCancellationLog />} />
            

            {/* Test Approval */}
            <Route path="/PatientList" element={<PatientList />} />
            <Route path="/DoctorForm" element={<DoctorForm />} />
            
            {/* Sales */}
            <Route path="/SalesVisit" element={<SalesVisitLog />} />
            <Route path="/SalesDashboard" element={<SalesDashboard />} />
            <Route path="/SalesDetailsEdit" element={<SalesDetailsEdit />} />
            <Route path="/SalesVisitLogReport" element={<SalesVisitLogReport />} />
            <Route path="/SalesindividualReport" element={<SalesindividualReport />} />

            <Route path="/B2B" element={<B2B />} />
            <Route path="/B2BApproval" element={<B2BApproval />} />
            <Route path="/B2BFinalApproval" element={<B2BFinalApproval />} />
            <Route path="/B2BReport" element={<B2BReport />} />


            {/* Diagnostics Report */}
            <Route path="/Dashboard" element={<Dashboard />} />      
            <Route path="/Testcount" element={<Testcount />} />     
            <Route path="/TestSorting" element={<TestSorting />} />
            <Route path="/PatientOverview" element={<PatientOverview />} />

          {/* Franchise Report */}
            <Route path="/FranchiseBatchApproval" element={<FranchiseBatchApproval />} />
            <Route path="/CorporateBatchApproval" element={<CorporateBatchApproval />} />
            <Route path="/FranchiseOverview" element={<FranchiseOverview />} />
            <Route path="/FranchiseTestSorting" element={<FranchiseTestSorting />} />

          {/* Corporate Report */}
            <Route path="/CorporateOverview" element={<CorporateOverview />} />
            <Route path="/CHCReport" element={<CHCReport />} />
            <Route path="/CHCApproval" element={<CHCApproval/>} />
            <Route path="/CorporateTestSorting" element={<CorporateTestSorting />} />

          {/* MIS */}
            <Route path="/MIS" element={<MIS/>} />
            <Route path="/PatientTAT" element={<PatientDataTable/>} />
            <Route path="/ShanmugaMIS" element={<ShanmugaMIS/>} />
            <Route path="/FranchiseMIS" element={<FranchiseMIS/>} />

          {/* Logistics */}
            <Route path="/LogisticManagementApproval" element={<LogisticManagementApproval/>} />
            <Route path="/LogisticManagementAdmin" element={<LogisticManagementAdmin/>} />  
            <Route path="/LogisticMap" element={<Logisticsmap/>} />
            <Route path="/LogisticsTAT" element={<LogisticsTAT/>} />  

          {/*HMS */}
            <Route path="/HmsBilling" element={<HmsBilling/>} />
            <Route path="/Hmssamplestatus" element={<Hmssamplestatus/>} />
            <Route path="/HmsSampleStatusUpdate" element={<HmsSampleStatusUpdate/>} />
            <Route path="/HMSBarcodeGeneration" element={<HMSBarcodeGeneration/>} />
            <Route path="/HMSBarcodeTestDetails" element={<HMSBarcodeTestDetails/>} />
            <Route path="/HMSPatientDetails" element={<HMSPatientDetails/>} />
            <Route path="/HmsTestDetails" element={<HmsTestDetails/>} />

          {/* HMS Report */}          
            <Route path="/HMSTestSorting" element={<HMSTestSorting />} />
            <Route path="/HMSPatientOverview" element={<HMSPatientOverview />} />
            <Route path="/PatientOverallReport" element={<PatientOverallReport />}  />

            <Route path="/PreethamHospitalReport" element={<PreethamHospitalReport />} />

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