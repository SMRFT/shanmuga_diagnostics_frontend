import { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { NavLink } from "react-router-dom";
import {
  User,
  CreditCard,
  ScanBarcode,
  TestTube2,
  Truck,
  Building2,
  LayoutDashboard,
  FileText,
  DollarSign,
  Briefcase,
  FileBarChart,
  Send,
  BarChart3,
  TrendingUp,
  Receipt,
  PieChart,
  MapPin,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Timer,
  Wallet,
  ClipboardList,
  Stethoscope,
  Activity,
  FileSpreadsheet
} from "lucide-react";

const slideIn = keyframes`
 from { transform: translateX(-20px); opacity: 0; }
 to { transform: translateX(0); opacity: 1; }
`;

const gradientAnimation = keyframes`
 0% { background-position: 0% 50%; }
 50% { background-position: 100% 50%; }
 100% { background-position: 0% 50%; }
`;

const glassEffect = css`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const SidebarContainer = styled.div`
  background: linear-gradient(135deg, #6e8efb, #a777e3, #e56f8f);
  background-size: 300% 300%;
  animation: ${gradientAnimation} 15s ease infinite;
  color: white;
  height: 100vh;
  width: 280px;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  z-index: 1000;
  transform: ${({ isOpen }) =>
    isOpen ? "translateX(0)" : "translateX(-100%)"};
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  box-shadow: 4px 0 25px rgba(0, 0, 0, 0.15);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  @media (min-width: 769px) {
    transform: translateX(0);
  }
`;

const SignOutWrapper = styled.div`
  margin-top: auto;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const LogoContainer = styled.div`
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;

  h1 {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const SidebarToggle = styled.button`
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1100;
  background-color: rgba(110, 142, 251, 0.9);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background-color: rgba(167, 119, 227, 0.9);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const SidebarContent = styled.div`
  padding: 0 15px 20px;
`;

const SectionDivider = styled.div`
  margin: 15px 0;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.5),
    transparent
  );
`;

const SidebarNavLink = styled(NavLink)`
  color: white;
  display: flex;
  align-items: center;
  padding: 14px 18px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  border-radius: 12px;
  margin-bottom: 5px;
  white-space: nowrap;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    transition: width 0.3s ease;
    z-index: -1;
  }

  &:hover {
    transform: translateX(5px);

    &:before {
      width: 100%;
    }
  }

  &.active {
    ${glassEffect}
    font-weight: 600;
    transform: translateX(5px);
  }
`;

const DropdownHeader = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 12px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    ${glassEffect}
    transform: translateX(5px);
  }

  ${(props) =>
    props.isOpen &&
    css`
      ${glassEffect}
      transform: translateX(5px);
    `}
`;

const DropdownContent = styled.div`
  overflow: hidden;
  max-height: ${(props) => (props.isOpen ? "500px" : "0")};
  transition: max-height 0.4s ease-in-out;
  margin-left: 10px;

  & > * {
    animation: ${slideIn} 0.3s ease forwards;
  }
`;

const SubLink = styled(NavLink)`
  color: white;
  padding: 12px 18px 12px 30px;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  border-radius: 12px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    left: 15px;
    top: 50%;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: translateY(-50%);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }

  &.active {
    background: rgba(255, 255, 255, 0.15);
    font-weight: 600;
  }
`;

const IconWrapper = styled.span`
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const ChevronIcon = styled(ChevronDown)`
  transition: transform 0.3s ease;
  transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0)")};
  width: 18px;
  height: 18px;
`;

const MENU_CONFIG = {
  "Sample Collector": [
    {
      type: "dropdown",
      id: "patientDetails",
      title: "Patient Details",
      icon: <User size={18} />,
      items: [
        { title: "Appointment Booking", path: "/AppointmentBooking" },
        { title: "Registration", path: "/PatientForm" },
        { title: "Bill Estimate", path: "/Estimate" },
      ],
    },
    {
      type: "dropdown",
      id: "billingDetails",
      title: "Billing",
      icon: <CreditCard size={18} />,
      items: [
        { title: "Diagnostics Billing", path: "/PatientBilling" },
        { title: "HMS Billing", path: "/HmsBilling" },
        { title: "Patient Overview", path: "/PrintBill" },
      ],
    },
    {
      type: "dropdown",
      id: "barcodeDetails",
      title: "Barcode",
      icon: <ScanBarcode size={18} />,
      items: [
        {
          title: "Diagnostics Barcode Generation",
          path: "/BarcodeGeneration",
        },
        { title: "HMS Barcode Generation", path: "/HMSBarcodeGeneration" },
      ],
    },
    {
      type: "dropdown",
      id: "sampleDetails",
      title: "Sample",
      icon: <TestTube2 size={18} />,
      items: [
        { title: "Diagnostics Sample Collection", path: "/SampleStatus" },
        { title: "HMS Sample Collection", path: "/Hmssamplestatus" },
        { title: "Home Collection Report", path: "/HomeCollectionReport" },
      ],
    },
    {
      type: "dropdown",
      id: "logisticsDetails",
      title: "Logistics",
      icon: <Truck size={18} />,
      items: [{ title: "Logistics Approval", path: "/LogisticManagementApproval" }],
    },
    {
      type: "link",
      title: "B2B Master",
      path: "/B2B",
      icon: <Building2 size={18} />,
    },
    {
      type: "link",
      title: "Report Dashboard",
      path: "/PatientOverview",
      icon: <LayoutDashboard size={18} />,
    },
  ],
  "Lab Receptionist": [
    {
      type: "dropdown",
      id: "patientDetails",
      title: "Patient Details",
      icon: <User size={18} />,
      items: [
        { title: "Diagnostics Billing", path: "/PatientBilling" },
        { title: "Patient Overview", path: "/PrintBill" },
        { title: "Bill Estimate", path: "/Estimate" },
      ],
    },
    {
      type: "link",
      title: "Patient Summary",
      path: "/PatientTAT",
      icon: <Timer size={18} />,
    },
    {
      type: "link",
      title: "Payment Dashboard",
      path: "/PaymentDashboard",
      icon: <Wallet size={18} />,
    },
    {
      type: "link",
      title: "Billing Dashboard",
      path: "/RegisterDashboard",
      icon: <Activity size={18} />,
    },
    {
      type: "link",
      title: "Report Dashboard",
      path: "/PatientOverview",
      icon: <LayoutDashboard size={18} />,
    },
  ],
  "Lab Technician": [
    {
      type: "dropdown",
      id: "billingDetails",
      title: "Billing",
      icon: <CreditCard size={18} />,
      items: [
        { title: "Diagnostics Billing", path: "/PatientBilling" },
        { title: "HMS Billing", path: "/HmsBilling" },
        { title: "Patient Overview", path: "/PrintBill" },
      ],
    },
    {
      type: "dropdown",
      id: "barcodeDetails",
      title: "Barcode",
      icon: <ScanBarcode size={18} />,
      items: [
        {
          title: "Diagnostics Barcode Generation",
          path: "/BarcodeGeneration",
        },
        { title: "HMS Barcode Generation", path: "/HMSBarcodeGeneration" },
      ],
    },
    {
      type: "dropdown",
      id: "sampleDetails",
      title: "Sample",
      icon: <TestTube2 size={18} />,
      items: [
        { title: "Diagnostics Sample Accessioning", path: "/SampleStatusUpdate" },
        { title: "HMS Sample Collection", path: "/Hmssamplestatus" },
        { title: "HMS Sample Accessioning", path: "/HmsSampleStatusUpdate" },
        { title: "Rejected Samples", path: "/RejectedSamples" },
        { title: "Outsourced Samples", path: "/OutsourcedSamples" },
        { title: "Home Collection Report", path: "/HomeCollectionReport" },
        { title: "corporate Batch Approval", path: "/CorporateBatchApproval" },
        { title: "Franchise Batch Approval", path: "/FranchiseBatchApproval" },
      ],
    },
    {
      type: "dropdown",
      id: "reportDetails",
      title: "Report",
      icon: <FileText size={18} />,
      items: [
        { title: "Report Generation", path: "/PatientDetails" },
        { title: "O/S Report Generation", path: "/OutSourceDetails" },
      ],
    },
    {
      type: "link",
      title: "Test Edit",
      path: "/TestEdit",
      icon: <FileSpreadsheet size={18} />,
    },
    {
      type: "link",
      title: "Report Dashboard",
      path: "/PatientOverview",
      icon: <LayoutDashboard size={18} />,
    },
    {
      type: "link",
      title: "Sent Logs",
      path: "/CommunicationLogs",
      icon: <Send size={18} />,
    },
    {
      type: "link",
      title: "MIS Report",
      path: "/MIS",
      icon: <BarChart3 size={18} />,
    },
  ],
  "Sales Person": [
    {
      type: "dropdown",
      id: "patientDetails",
      title: "Patient Details",
      icon: <User size={18} />,
      items: [
        { title: "Appointment Booking", path: "/AppointmentBooking" },
        { title: "Registration", path: "/PatientForm" },
        { title: "Bill Estimate", path: "/Estimate" },
      ],
    },
    {
      type: "dropdown",
      id: "billingDetails",
      title: "Billing",
      icon: <CreditCard size={18} />,
      items: [
        { title: "Diagnostics Billing", path: "/PatientBilling" },
        { title: "HMS Billing", path: "/HmsBilling" },
        { title: "Patient Overview", path: "/PrintBill" },
      ],
    },
    {
      type: "dropdown",
      id: "barcodeDetails",
      title: "Barcode",
      icon: <ScanBarcode size={18} />,
      items: [
        {
          title: "Diagnostics Barcode Generation",
          path: "/BarcodeGeneration",
        },
        { title: "HMS Barcode Generation", path: "/HMSBarcodeGeneration" },
      ],
    },
    {
      type: "dropdown",
      id: "sampleDetails",
      title: "Sample",
      icon: <TestTube2 size={18} />,
      items: [
        { title: "Diagnostics Sample Collection", path: "/SampleStatus" },
        { title: "HMS Sample Collection", path: "/Hmssamplestatus" },
      ],
    },
    {
      type: "dropdown",
      id: "salesDetails",
      title: "Sales",
      icon: <Briefcase size={18} />,
      items: [
        { title: "Sales Visit Form", path: "/SalesVisit" },
        { title: "Sales Report", path: "/SalesindividualReport" },
      ],
    },
    {
      type: "link",
      title: "B2B Master",
      path: "/B2B",
      icon: <Building2 size={18} />,
    },
    {
      type: "link",
      title: "Report Dashboard",
      path: "/PatientOverview",
      icon: <LayoutDashboard size={18} />,
    },
  ],
  Accounts: [
    {
      type: "dropdown",
      id: "financeDetails",
      title: "Finance",
      icon: <Receipt size={18} />,
      items: [
        { title: "Invoice", path: "/Invoice" },
        { title: "Cash Tally", path: "/CashTally" },
        { title: "Refund", path: "/Refund" },
        { title: "Cancellation", path: "/Cancellation" },
        { title: "Refund And Cancellation Log", path: "/RefundAndCancellationLog" },
        { title: "Payment Dashboard", path: "/PaymentDashboard" },

      ],
    },
    {
      type: "link",
      title: "Patient Summary",
      path: "/PatientTAT",
      icon: <Timer size={18} />,
    },
  ],
  Admin: [
    {
      type: "link",
      title: "Dashboard",
      path: "/MDashboard",
      icon: <PieChart size={18} />,
    },
    {
      type: "link",
      title: "Billing Dashboard",
      path: "/RegisterDashboard",
      icon: <Activity size={18} />,
    },
    {
      type: "dropdown",
      id: "b2bDetails",
      title: "B2B Details",
      icon: <Building2 size={18} />,
      items: [
        { title: "B2B", path: "/B2B" },
        { title: "B2B Report", path: "/B2BReport" },
        { title: "B2B Approval", path: "/B2BApproval" },
        { title: "B2B Package", path: "/B2BPackage" },
      ],
    },
    { type: "divider" },
    {
      type: "dropdown",
      id: "patientDetails",
      title: "Patient Details",
      icon: <User size={18} />,
      items: [
        { title: "Registration", path: "/PatientForm" },
      ],
    },
    {
      type: "dropdown",
      id: "billingDetails",
      title: "Billing",
      icon: <CreditCard size={18} />,
      items: [
        { title: "Bill Estimate", path: "/Estimate" },
        { title: "Diagnostics Billing", path: "/PatientBilling" },
        { title: "HMS Billing", path: "/HmsBilling" },
        { title: "Patient Overview", path: "/PrintBill" },
      ],
    },
    {
      type: "dropdown",
      id: "barcodeDetails",
      title: "Barcode",
      icon: <ScanBarcode size={18} />,
      items: [
        {
          title: "Diagnostics Barcode Generation",
          path: "/BarcodeGeneration",
        },
        { title: "HMS Barcode Generation", path: "/HMSBarcodeGeneration" },
      ],
    },
    {
      type: "dropdown",
      id: "sampleDetails",
      title: "Sample",
      icon: <TestTube2 size={18} />,
      items: [
        { title: "Diagnostics Sample Collection", path: "/SampleStatus" },
        { title: "HMS Sample Collection", path: "/Hmssamplestatus" },
        { title: "Diagnostics Sample Accessioning", path: "/SampleStatusUpdate" },
        { title: "HMS Sample Accessioning", path: "/HmsSampleStatusUpdate" },
        { title: "corporate Batch Approval", path: "/CorporateBatchApproval" },
        { title: "Franchise Batch Approval", path: "/FranchiseBatchApproval" },
      ],
    },
    {
      type: "dropdown",
      id: "reportDetails",
      title: "Report",
      icon: <FileText size={18} />,
      items: [
        { title: "Report Generation", path: "/PatientDetails" },
        { title: "Report Authorization", path: "/PatientList" },
      ],
    },
    {
      type: "dropdown",
      id: "osreportDetails",
      title: "Out Source Management",
      icon: <FileText size={18} />,
      items: [{ title: "O/S Report Generation", path: "/OutSourceDetails" }],
    },
    {
      type: "dropdown",
      id: "logisticsDetails",
      title: "Logistics",
      icon: <Truck size={18} />,
      items: [
        { title: "Logistics Task Assigning", path: "/LogisticManagementAdmin" },
        { title: "Logistics Approval", path: "/LogisticManagementApproval" },
        { title: "Logistics Dashboard", path: "/LogisticsDashboard" },
        { title: "Logistics Tracking", path: "/LogisticMap" },
      ],
    },
    {
      type: "dropdown",
      id: "salesDetails",
      title: "Sales",
      icon: <Briefcase size={18} />,
      items: [
        { title: "Sales Visit Form", path: "/SalesVisit" },
        { title: "Sales Visit Report", path: "/SalesVisitLogReport" },
        { title: "Sales Visit Dashboard", path: "/SalesDashboard" },
        { title: "Sales Visit Edit", path: "/SalesDetailsEdit" },
      ],
    },
    {
      type: "dropdown",
      id: "financeDetails",
      title: "Finance",
      icon: <Receipt size={18} />,
      items: [
        { title: "Invoice", path: "/Invoice" },
        { title: "Cash Tally", path: "/CashTally" },
        { title: "Refund", path: "/Refund" },
        { title: "Cancellation", path: "/Cancellation" },
      ],
    },
    { type: "divider" },
    {
      type: "link",
      title: "Report Dashboard",
      path: "/PatientOverview",
      icon: <LayoutDashboard size={18} />,
    },
    {
      type: "link",
      title: "Corporate Report Approval",
      path: "/CHCReport",
      icon: <Briefcase size={18} />,
    },
    {
      type: "link",
      title: "Test Edit",
      path: "/TestEdit",
      icon: <FileSpreadsheet size={18} />,
    },
    {
      type: "link",
      title: "Test Count",
      path: "/Testcount",
      icon: <LayoutDashboard size={18} />,
    },
    {
      type: "dropdown",
      id: "misDetails",
      title: "MIS",
      icon: <BarChart3 size={18} />,
      items: [
        { title: "Patient Summary", path: "/PatientTAT" },
        { title: "Overall TAT", path: "/MIS" },
        { title: "Logistics TAT", path: "/LogisticsTAT" },
      ],
    },
  ],
  "Diagnostics General Manager": [
    {
      type: "link",
      title: "Dashboard",
      path: "/MDashboard",
      icon: <PieChart size={18} />,
    },
    {
      type: "link",
      title: "Billing Dashboard",
      path: "/RegisterDashboard",
      icon: <Activity size={18} />,
    },
    {
      type: "dropdown",
      id: "b2bDetails",
      title: "B2B Details",
      icon: <Building2 size={18} />,
      items: [
        { title: "B2B", path: "/B2B" },
        { title: "B2B Report", path: "/B2BReport" },
      ],
    },
    { type: "divider" },
    {
      type: "dropdown",
      id: "patientDetails",
      title: "Patient Details",
      icon: <User size={18} />,
      items: [
        { title: "Appointment Booking", path: "/AppointmentBooking" },
        { title: "Registration", path: "/PatientForm" },
        { title: "Bill Estimate", path: "/Estimate" },
      ],
    },
    {
      type: "dropdown",
      id: "billingDetails",
      title: "Billing",
      icon: <CreditCard size={18} />,
      items: [
        { title: "Diagnostics Billing", path: "/PatientBilling" },
        { title: "HMS Billing", path: "/HmsBilling" },
        { title: "Patient Overview", path: "/PrintBill" },
      ],
    },
    {
      type: "dropdown",
      id: "barcodeDetails",
      title: "Barcode",
      icon: <ScanBarcode size={18} />,
      items: [
        {
          title: "Diagnostics Barcode Generation",
          path: "/BarcodeGeneration",
        },
        { title: "HMS Barcode Generation", path: "/HMSBarcodeGeneration" },
      ],
    },
    {
      type: "dropdown",
      id: "sampleDetails",
      title: "Sample",
      icon: <TestTube2 size={18} />,
      items: [
        { title: "Diagnostics Sample Collection", path: "/SampleStatus" },
        { title: "HMS Sample Collection", path: "/Hmssamplestatus" },
      ],
    },
    {
      type: "dropdown",
      id: "logisticsDetails",
      title: "Logistics",
      icon: <Truck size={18} />,
      items: [
        { title: "Logistics Task Assigning", path: "/LogisticManagementAdmin" },
        { title: "Logistics Dashboard", path: "/LogisticsDashboard" },
        { title: "Logistics Tracking", path: "/LogisticMap" },
      ],
    },
    {
      type: "dropdown",
      id: "salesDetails",
      title: "Sales",
      icon: <Briefcase size={18} />,
      items: [
        { title: "Sales Visit Report", path: "/SalesVisitLogReport" },
        { title: "Sales Visit Dashboard", path: "/SalesDashboard" },
        { title: "Sales Visit Edit", path: "/SalesDetailsEdit" },
      ],
    },
    {
      type: "dropdown",
      id: "financeDetails",
      title: "Finance",
      icon: <Receipt size={18} />,
      items: [
        { title: "Invoice", path: "/Invoice" },
        { title: "Cash Tally", path: "/CashTally" },
        { title: "Ledger Balance", path: "/Ledgerbalance" },
        { title: "Refund", path: "/Refund" },
        { title: "Cancellation", path: "/Cancellation" },
        { title: "Payment Dashboard", path: "/PaymentDashboard" },
      ],
    },
    { type: "divider" },
    {
      type: "link",
      title: "Report Dashboard",
      path: "/PatientOverview",
      icon: <LayoutDashboard size={18} />,
    },
    {
      type: "link",
      title: "Test Edit",
      path: "/TestEdit",
      icon: <FileSpreadsheet size={18} />,
    },
    {
      type: "link",
      title: "Test Count",
      path: "/Testcount",
      icon: <LayoutDashboard size={18} />,
    },
    {
      type: "dropdown",
      id: "misDetails",
      title: "MIS",
      icon: <BarChart3 size={18} />,
      items: [
        { title: "Patient Summary", path: "/PatientTAT" },
        { title: "Overall TAT", path: "/MIS" },
        { title: "Logistics TAT", path: "/LogisticsTAT" },
        { title: "Rejected Samples", path: "/RejectedSamples" },
        { title: "Test Count", path: "/Testcount" },
        { title: "Communication Logs", path: "/CommunicationLogs" },
        { title: "Home Collection Report", path: "/HomeCollectionReport" },
        { title: "Outsourced Samples", path: "/OutsourcedSamples" },
      ],
    },
  ],
  Doctor: [
    {
      type: "dropdown",
      id: "patientDetails",
      title: "Patient Details",
      icon: <User size={18} />,
      items: [{ title: "Registration", path: "/PatientForm" }],
    },
    {
      type: "dropdown",
      id: "billingDetails",
      title: "Billing",
      icon: <CreditCard size={18} />,
      items: [
        { title: "Diagnostics Billing", path: "/PatientBilling" },
        { title: "HMS Billing", path: "/HmsBilling" },
        { title: "Patient Overview", path: "/PrintBill" },
      ],
    },
    {
      type: "dropdown",
      id: "barcodeDetails",
      title: "Barcode",
      icon: <ScanBarcode size={18} />,
      items: [
        {
          title: "Diagnostics Barcode Generation",
          path: "/BarcodeGeneration",
        },
        { title: "HMS Barcode Generation", path: "/HMSBarcodeGeneration" },
      ],
    },
    {
      type: "dropdown",
      id: "sampleDetails",
      title: "Sample",
      icon: <TestTube2 size={18} />,
      items: [
        { title: "Diagnostics Sample Accessioning", path: "/SampleStatusUpdate" },
        { title: "HMS Sample Accessioning", path: "/HmsSampleStatusUpdate" },
        { title: "corporate Batch Approval", path: "/CorporateBatchApproval" },
        { title: "Franchise Batch Approval", path: "/FranchiseBatchApproval" },
      ],
    },
    {
      type: "dropdown",
      id: "reportDetails",
      title: "Report",
      icon: <FileText size={18} />,
      items: [
        { title: "Report Generation", path: "/PatientDetails" },
        { title: "Report Authorization", path: "/PatientList" },
        { title: "O/S Report Generation", path: "/OutSourceDetails" },
      ],
    },
    {
      type: "link",
      title: "Test Edit",
      path: "/TestEdit", // Preserving original messy link structure per request/analysis
      icon: <FileSpreadsheet size={18} />,
    },
    {
      type: "link",
      title: "Test Count",
      path: "/Testcount",
      icon: <LayoutDashboard size={18} />,
    },
    {
      type: "link",
      title: "Report Dashboard",
      path: "/PatientOverview",
      icon: <LayoutDashboard size={18} />,
    },
    {
      type: "link",
      title: "MIS Report",
      path: "/MIS",
      icon: <BarChart3 size={18} />,
    },
  ],
  CEO: [
    {
      type: "dropdown",
      id: "b2bDetails",
      title: "B2B Details",
      icon: <Building2 size={18} />,
      items: [
        { title: "B2B Approval", path: "/B2BApproval" },
      ],
    },
    {
      type: "dropdown",
      id: "reportDetails",
      title: "Report",
      icon: <FileText size={18} />,
      items: [
        { title: "Report Generation", path: "/PatientDetails" },
        { title: "Report Authorization", path: "/PatientList" },
      ],
    },
    {
      type: "link",
      title: "Report Dashboard",
      path: "/PatientOverview",
      icon: <LayoutDashboard size={18} />,
    },
    {
      type: "link",
      title: "Corporate Report Approval",
      path: "/CHCReport",
      icon: <Briefcase size={18} />,
    },
    {
      type: "link",
      title: "MIS Report",
      path: "/MIS",
      icon: <BarChart3 size={18} />,
    },
  ],
  HR: [
    {
      type: "link",
      title: "Logistics Tracking",
      path: "/LiveTrackingDashboard",
      icon: <MapPin size={18} />,
    },
  ],
};

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [dropdowns, setDropdowns] = useState({});

  const toggleDropdown = (id) => {
    setDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const userName = localStorage.getItem("name");

    setRole(userRole || "");
    setName(userName || "");
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderMenuItems = () => {
    const items = MENU_CONFIG[role];
    if (!items) return null;

    return items.map((item, index) => {
      if (item.type === "divider") {
        return <SectionDivider key={`divider-${index}`} />;
      }

      if (item.type === "dropdown") {
        return (
          <div key={item.id}>
            <DropdownHeader
              isOpen={dropdowns[item.id]}
              onClick={() => toggleDropdown(item.id)}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <IconWrapper>{item.icon}</IconWrapper>
                {item.title}
              </div>
              <ChevronIcon isOpen={dropdowns[item.id]} />
            </DropdownHeader>
            <DropdownContent isOpen={dropdowns[item.id]}>
              {item.items.map((subItem, subIndex) => (
                <SubLink
                  key={subIndex}
                  to={subItem.path}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {subItem.title}
                </SubLink>
              ))}
            </DropdownContent>
          </div>
        );
      }

      if (item.type === "link") {
        return (
          <SidebarNavLink
            key={index}
            to={item.path}
            onClick={() => setIsSidebarOpen(false)}
          >
            <IconWrapper>{item.icon}</IconWrapper>
            {item.title}
          </SidebarNavLink>
        );
      }

      return null;
    });
  };

  return (
    <>
      <SidebarToggle onClick={toggleSidebar}>
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </SidebarToggle>

      <SidebarContainer isOpen={isSidebarOpen}>
        <LogoContainer>
          <h1>Shanmuga Diagnostics</h1>
        </LogoContainer>

        <SidebarContent>{renderMenuItems()}</SidebarContent>
        <SignOutWrapper>
          <SidebarNavLink
            to="#"
            onClick={() => {
              setIsSidebarOpen(false);
              window.location.href = "/Login";
            }}
          >
            <IconWrapper>
              <LogOut size={18} />
            </IconWrapper>
            Sign Out
          </SidebarNavLink>
        </SignOutWrapper>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;

