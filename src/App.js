import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Sidebar from "./Components/Navbar/Sidebar";
import PatientForm from "./Components/Patients/PatientForm";
import EditPatient from "./Components/Patients/EditPatient";
import PatientRecordView from "./Components/Patients/PatientRecordView";
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

import MDashboard from "./Components/Report/MDashboard";
import TestSorting from "./Components/Report/TestSorting";
import PatientOverview from "./Components/Report/PatientOverview";
import CommunicationLogs from "./Components/Report/CommunicationLogs";
import PatientOverallReport from "./Components/Finance/PatientOverallReport";
import FranchiseOverview from "./Components/Franchise/FranchiseOverview";
import FranchiseBatchApproval from "./Components/Sample/FranchiseBatchApproval";
import FranchiseTestSorting from "./Components/Franchise/FranchiseTestSorting";
import HMSTestSorting from "./Components/HMSReport/HMSTestSorting";
import HMSPatientOverview from "./Components/HMSReport/HMSPatientOverview";
import HMSTestCount from "./Components/HMSReport/HMSTestCount";
import Invoice from "./Components/Finance/Invoice";
import CashTally from "./Components/Finance/CashTally";
import LedgerBalance from "./Components/Finance/LedgerBalance";
import SalesVisitLog from "./Components/Sales/Salesvisitlog";
import ShanmugaMIS from "./Components/Mis/ShanmugaMIS";
import MIS from "./Components/Mis/MIS";
import FranchiseMIS from "./Components/Mis/FranchiseMIS";
import CorporateOverview from "./Components/Corparate/CorporatePatientOverview";
import CorporateTestSorting from "./Components/Corparate/CorporateTestSorting";
import CorporateCreditBilling from "./Components/Corporate/CorporateCreditBilling";
import Testcount from "./Components/Report/Testcount";
import HmsBilling from "./Components/HMS/HmsBilling";
import Hmssamplestatus from "./Components/HMS/Hmssamplestatus";
import HmsSampleStatusUpdate from "./Components/HMS/HmsSampleStatusUpdate";
import HMSBarcodeGeneration from "./Components/HMS/HMSBarcodeGeneration";
import HMSBarcodeTestDetails from "./Components/HMS/HMSBarcodeTestDetails";
import PrintBill from "./Components/Patients/PrintBill";
import CHCReport from "./Components/Report/CHCReport";
import CHCApproval from "./Components/Report/CHCApproval";
import TestEdit from "./Components/Forms/TestEdit";
import SalesDashboard from "./Components/Sales/SalesDashboard";
import SalesDetailsEdit from "./Components/Sales/SalesDetailsEdit";
import SalesVisitLogReport from "./Components/Sales/SalesVisitLogReport";
import SalesindividualReport from "./Components/Sales/SalesindividualReport";
import AppointmentBooking from "./Components/Patients/AppointmentBooking";
import AppointmentList from "./Components/Patients/AppointmentList";
import B2B from "./Components/Lab/B2B";
import B2BApproval from "./Components/Lab/B2BApproval";
import B2BFinalApproval from "./Components/Lab/B2BFinalApproval";
import B2BReport from "./Components/Lab/B2BReport";
import PaymentDashboard from "./Components/Patients/PaymentDashboard";
import RegisterDashboard from "./Components/Patients/RegisterDashboard";
import Refund from "./Components/Refund/Refund";
import Cancellation from "./Components/Refund/Cancellation";
import RefundAndCancellationLog from "./Components/Refund/RefundAndCancellationLog";
import PatientDataTable from "./Components/Mis/PatientTAT";
import CorporateBatchApproval from "./Components/Sample/CorparateBatchapproval";
import OSTestDetails from "./Components/OSManangement/OSTestDetails";
import OutSourceDetails from "./Components/OSManangement/OutSourceDetails";
import RejectedSamples from "./Components/Lab/RejectedSamples";
import OutsourcedSamples from "./Components/Lab/OutsourcedSamples";
import HomeCollectionReport from "./Components/Report/HomeCollectionReport";
import MBPatientDetails from "./Components/Microbiology/MBPatientDetails";
import MBTestDetails from "./Components/Microbiology/MBTestDetails";
import MBPatientList from "./Components/Microbiology/MBPatientList";
import MBDoctorForm from "./Components/Microbiology/MBDoctorForm";
import MBTestSorting from "./Components/Report/MBTestSorting";
import HMSMBTestSorting from "./Components/HMSReport/HMSMBTestSorting";
import PreethamDashboard from "./Components/PreethamHospital/PreethamDashboard";
import PreethamPatientOverview from "./Components/PreethamHospital/PreethamPatientOverview";
import FranchiseMBTestSorting from "./Components/Franchise/FranchiseMBTestSorting";
import LogisticsTaskAssign from "./Components/Logistics/LogisticsTaskAssign";
import LogisticsTaskManagement from "./Components/Logistics/LogisticsTaskManagement";
import LogisticsDashboard from "./Components/Logistics/LogisticsDashboard";
import LogisticsTAT from "./Components/Mis/LogisticsTAT";
import LogisticsTracking from "./Components/Logistics/LogisticsTracking";
import TrackingHistory from "./Components/Logistics/TrackingHistory";
import PreethamHospitalLedger from "./Components/PreethamHospital/PreethamLedgerBalance";
import WorkList from "./Components/Test/WorkList";
import ApprovedList from "./Components/TestApproval/ApprovedList";
import EditForm from "./Components/TestApproval/EditForm";
import RouteSetup from "./Components/Logistics/RouteSetup";
import RouteAnalysis from "./Components/Logistics/RouteAnalysis";
import RouteAnalysisDashboard from "./Components/Logistics/RouteAnalysisDashboard";
import B2BPackage from "./Components/Lab/B2BPackage";
import B2BPackageApproval from "./Components/Lab/B2BPackageApproval";
import B2BPackageList from "./Components/Lab/B2BPackageList";

import Busfare from "./Components/Busfare/Busfare";
import CustomerComplaints from "./Components/Complaints/Customercomplaints";
import Salesplan from "./Components/Sales/Salesplan";

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
        navigate("/MDashboard");
        break;
      case "Lab Receptionist":
        navigate("/PatientBilling");
        break;
      case "Sample Collector":
        navigate("/PatientForm");
        break;
      case "Lab Technician":
        navigate("/PatientDetails");
        break;
      case "Doctor":
        navigate("/PatientList");
        break;
      case "Sales Executive":
        navigate("/SalesVisitLog");
        break;
      case "HR":
        navigate("/LogisticsTracking");
        break;
      case "CEO":
        navigate("/CHCreport");
        break;
      case "Accounts":
        navigate("/Invoice");
        break;
      case "PH":
        navigate("/PreethamPatientOverview");
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

  // Dynamic Document Title
  useEffect(() => {
    const routeTitles = {
      "/AppointmentBooking": "Appointment Booking",
      "/AppointmentList": "Appointment List",
      "/PatientForm": "Patient Registration",
      "/PatientBilling": "Patient Billing",
      "/PaymentDashboard": "Payment Dashboard",
      "/RegisterDashboard": "Register Dashboard",
      "/PrintBill": "Print Bill",
      "/Estimate": "Estimate",
      "/BarcodeGeneration": "Barcode Generation",
      "/BarcodeTestDetails": "Barcode Test Details",
      "/SampleStatus": "Sample Status",
      "/SampleStatusUpdate": "Sample Status Update",
      "/TestEdit": "Test Edit",
      "/PatientDetails": "Patient Details",
      "/TestDetails": "Test Details",
      "/WorkList": "Work List",
      "/MBPatientDetails": "Microbiology Patient Details",
      "/MBTestDetails": "Microbiology Test Details",
      "/OutSourceDetails": "Outsource Details",
      "/OSTestDetails": "Outsource Test Details",
      "/CashTally": "Cash Tally",
      "/Invoice": "Invoice",
      "/LedgerBalance": "Ledger Balance",
      "/Refund": "Refund",
      "/Cancellation": "Cancellation",
      "/RefundAndCancellationLog": "Refund & Cancellation Log",
      "/RejectedSamples": "Rejected Samples",
      "/OutsourcedSamples": "Outsourced Samples",
      "/HomeCollectionReport": "Home Collection Report",
      "/PatientList": "Patient List",
      "/DoctorForm": "Doctor Form",
      "/MBPatientList": "Microbiology Patient List",
      "/MBDoctorForm": "Microbiology Doctor Form",
      "/SalesVisit": "Sales Visit Log",
      "/SalesDashboard": "Sales Dashboard",
      "/SalesDetailsEdit": "Sales Details Edit",
      "/SalesVisitLogReport": "Sales Visit Log Report",
      "/SalesindividualReport": "Sales Individual Report",
      "/B2B": "B2B",
      "/B2BApproval": "B2B Approval",
      "/B2BFinalApproval": "B2B Final Approval",
      "/B2BReport": "B2B Report",
      "/B2BPackage": "B2B Package",
      "/B2BPackageApproval": "B2B Package Approval",
      "/B2BPackageList": "B2B Package List",
      "/MDashboard": "MDashboard",
      "/Testcount": "Test Count",
      "/TestSorting": "Test Sorting",
      "/MBTestSorting": "Microbiology Test Sorting",
      "/PatientOverview": "Patient Overview",
      "/CommunicationLogs": "Communication Logs",
      "/FranchiseBatchApproval": "Franchise Batch Approval",
      "/CorporateBatchApproval": "Corporate Batch Approval",
      "/FranchiseOverview": "Franchise Overview",
      "/FranchiseTestSorting": "Franchise Test Sorting",
      "/FranchiseMBTestSorting": "Franchise MB Test Sorting",
      "/CorporateOverview": "Corporate Overview",
      "/CHCReport": "CHC Report",
      "/CHCApproval": "CHC Approval",
      "/CorporateTestSorting": "Corporate Test Sorting",
      "/CorporateCreditBilling": "Corporate Credit Billing",
      "/MIS": "MIS",
      "/PatientTAT": "Patient TAT",
      "/ShanmugaMIS": "Shanmuga MIS",
      "/FranchiseMIS": "Franchise MIS",
      "/LogisticsTaskAssign": "Logistic Task Assign",
      "/LogisticsManagement": "Logistic Management",
      "/LogisticsDashboard": "Logistics Dashboard",
      "/LogisticsTracking": "Logistics Tracking",
      "/TrackingHistory": "Tracking History",
      "/RouteSetup": "Route Setup",
      "/RouteAnalysis": "Route Analysis",
      "/LogisticsTAT": "Logistics TAT",
      "/HmsBilling": "HMS Billing",
      "/Hmssamplestatus": "HMS Sample Status",
      "/HmsSampleStatusUpdate": "HMS Sample Status Update",
      "/HMSBarcodeGeneration": "HMS Barcode Generation",
      "/HMSBarcodeTestDetails": "HMS Barcode Test Details",
      "/HMSTestSorting": "HMS Test Sorting",
      "/HMSMBTestSorting": "HMS Microbiology Test Sorting",
      "/HMSPatientOverview": "HMS Patient Overview",
      "/PatientOverallReport": "Patient Overall Report",
      "/PreethamDashboard": "Preetham Dashboard",
      "/PreethamPatientOverview": "Preetham Patient Overview",
    };

    const path = location.pathname;
    const title = routeTitles[path] || "Shanmuga Diagnostics";
    document.title = title;
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
      <ToastContainer />
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
            <Route path="/salesindividual_report" element={<SalesindividualReport />} />
            <Route path="/AppointmentBooking" element={<AppointmentBooking />} />
            <Route path="/AppointmentList" element={<AppointmentList />} />
            <Route path="/clinical_name" element={<B2B />} />
            <Route path="/PatientForm" element={<PatientForm />} />
            <Route path="/EditPatient" element={<EditPatient />} />
            <Route path="/PatientRecordView" element={<PatientRecordView />} />
            <Route path="/PatientBilling" element={<PatientBilling />} />
            <Route path="/PaymentDashboard" element={<PaymentDashboard />} />
            <Route path="/RegisterDashboard" element={<RegisterDashboard />} />
            <Route path="/PrintBill" element={<PrintBill />} />
            <Route path="/Estimate" element={<Estimate />} />

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

            {/* Test Edit */}
            <Route path="/TestEdit" element={<TestEdit />} />

            {/* Test Values */}
            <Route path="/PatientDetails" element={<PatientDetails />} />
            <Route path="/TestDetails" element={<TestDetails />} />
            <Route path="/WorkList" element={<WorkList />} />
            <Route path="/MBPatientDetails" element={<MBPatientDetails />} />
            <Route path="/MBTestDetails" element={<MBTestDetails />} />
            <Route path="/OutSourceDetails" element={<OutSourceDetails />} />
            <Route path="/OSTestDetails" element={<OSTestDetails />} />

            {/* Finance */}
            <Route path="/CashTally" element={<CashTally />} />
            <Route path="/Invoice" element={<Invoice />} />
            <Route path="/LedgerBalance" element={<LedgerBalance />} />
            <Route path="/Refund" element={<Refund />} />
            <Route path="/Cancellation" element={<Cancellation />} />
            <Route
              path="/RefundAndCancellationLog"
              element={<RefundAndCancellationLog />}
            />

            {/* Lab */}
            <Route path="/RejectedSamples" element={<RejectedSamples />} />
            <Route path="/OutsourcedSamples" element={<OutsourcedSamples />} />
            <Route
              path="/HomeCollectionReport"
              element={<HomeCollectionReport />}
            />

            {/* Test Approval */}
            <Route path="/PatientList" element={<PatientList />} />
            <Route path="/DoctorForm" element={<DoctorForm />} />
            <Route path="/ApprovedList" element={<ApprovedList />} />
            <Route path="/EditForm" element={<EditForm />} />
            <Route path="/MBPatientList" element={<MBPatientList />} />
            <Route path="/MBDoctorForm" element={<MBDoctorForm />} />

            {/* Sales */}
            <Route path="/SalesVisit" element={<SalesVisitLog />} />
            <Route path="/SalesDashboard" element={<SalesDashboard />} />
            <Route path="/SalesDetailsEdit" element={<SalesDetailsEdit />} />
            <Route
              path="/SalesVisitLogReport"
              element={<SalesVisitLogReport />}
            />
            <Route
              path="/SalesindividualReport"
              element={<SalesindividualReport />}
            />

            <Route path="/B2B" element={<B2B />} />
            <Route path="/B2BApproval" element={<B2BApproval />} />
            <Route path="/B2BFinalApproval" element={<B2BFinalApproval />} />
            <Route path="/B2BReport" element={<B2BReport />} />
            <Route path="/B2BPackage" element={<B2BPackage />} />
            <Route path="/B2BPackageApproval" element={<B2BPackageApproval />} />
            <Route path="/B2BPackageList" element={<B2BPackageList />} />

            {/* Diagnostics Report */}
            <Route path="/MDashboard" element={<MDashboard />} />
            <Route path="/Testcount" element={<Testcount />} />
            <Route path="/TestSorting" element={<TestSorting />} />
            <Route path="/MBTestSorting" element={<MBTestSorting />} />
            <Route path="/PatientOverview" element={<PatientOverview />} />
            <Route path="/CommunicationLogs" element={<CommunicationLogs />} />

            {/* Franchise Report */}
            <Route
              path="/FranchiseBatchApproval"
              element={<FranchiseBatchApproval />}
            />
            <Route
              path="/CorporateBatchApproval"
              element={<CorporateBatchApproval />}
            />
            <Route path="/FranchiseOverview" element={<FranchiseOverview />} />
            <Route
              path="/FranchiseTestSorting"
              element={<FranchiseTestSorting />}
            />
            <Route
              path="/FranchiseMBTestSorting"
              element={<FranchiseMBTestSorting />}
            />

            {/* Corporate Report */}
            <Route path="/CorporateOverview" element={<CorporateOverview />} />
            <Route path="/CHCReport" element={<CHCReport />} />
            <Route path="/CHCApproval" element={<CHCApproval />} />
            <Route
              path="/CorporateTestSorting"
              element={<CorporateTestSorting />}
            />
            <Route path="/EditPatient" element={<EditPatient />} />
            <Route
              path="/CorporateCreditBilling"
              element={<CorporateCreditBilling />}
            />

            {/* MIS */}
            <Route path="/MIS" element={<MIS />} />
            <Route path="/PatientTAT" element={<PatientDataTable />} />
            <Route path="/ShanmugaMIS" element={<ShanmugaMIS />} />
            <Route path="/FranchiseMIS" element={<FranchiseMIS />} />

            {/* Logistics */}
            <Route
              path="/LogisticsTaskAssign"
              element={<LogisticsTaskAssign />}
            />
            <Route
              path="/LogisticsTaskManagement"
              element={<LogisticsTaskManagement />}
            />
            <Route
              path="/LogisticsDashboard"
              element={<LogisticsDashboard />}
            />
            <Route path="/LogisticsTAT" element={<LogisticsTAT />} />
            <Route path="/LogisticsTracking" element={<LogisticsTracking />} />
            <Route path="/TrackingHistory" element={<TrackingHistory />} />

            <Route path="/RouteSetup" element={<RouteSetup />} />
            <Route path="/RouteAnalysis" element={<RouteAnalysis />} />
            <Route path="/RouteAnalysisDashboard" element={<RouteAnalysisDashboard />} />

            {/*HMS */}
            <Route path="/HmsBilling" element={<HmsBilling />} />
            <Route path="/Hmssamplestatus" element={<Hmssamplestatus />} />
            <Route
              path="/HmsSampleStatusUpdate"
              element={<HmsSampleStatusUpdate />}
            />
            <Route
              path="/HMSBarcodeGeneration"
              element={<HMSBarcodeGeneration />}
            />
            <Route
              path="/HMSBarcodeTestDetails"
              element={<HMSBarcodeTestDetails />}
            />
            {/* HMS Report */}
            <Route path="/HMSTestSorting" element={<HMSTestSorting />} />
            <Route path="/HMSMBTestSorting" element={<HMSMBTestSorting />} />
            <Route
              path="/HMSPatientOverview"
              element={<HMSPatientOverview />}
            />
            <Route path="/HMSTestCount" element={<HMSTestCount />} />
            <Route
              path="/PatientOverallReport"
              element={<PatientOverallReport />}
            />

            <Route path="/PreethamDashboard" element={<PreethamDashboard />} />
            <Route
              path="/PreethamPatientOverview"
              element={<PreethamPatientOverview />}
            />
            <Route
              path="/PreethamHospitalLedger"
              element={<PreethamHospitalLedger />}
            />


            <Route
              path="/Busfare"
              element={<Busfare />}
            />


            <Route
              path="/CustomerComplaints"
              element={<CustomerComplaints />}
            />


            <Route
              path="/Salesplan"
              element={<Salesplan />}
            />

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
