"use client";

import {
  FaUser,
  FaBars,
  FaTimes,
  FaWpforms,
  FaEdit,
  FaChartPie,
  FaFileInvoiceDollar,
  FaCreditCard,
  FaBarcode,
  FaVial,
  FaFileAlt,
  FaSignOutAlt,
  FaDollarSign,
  FaMap,
  FaTruck,
  FaRoute,
  FaChartLine,
  FaNotesMedical,
  FaMoneyBillWave,
  FaFileMedicalAlt,
  FaBuilding,
  FaCalculator,
  FaVials,
  FaHandHoldingUsd,
  FaCoins,
  FaCheckDouble,
  FaMapMarkedAlt,
  FaHistory,
  FaBook
} from "react-icons/fa";
import { PiTestTubeDuotone } from "react-icons/pi";
import { GrOverview } from "react-icons/gr";
import { TbReport } from "react-icons/tb";
import {
  FaClinicMedical
} from "react-icons/fa";
import {
  FaMapMarkerAlt
} from "react-icons/fa";
import { DollarSign } from "lucide-react";

import useSidebarData from "./useSidebarData";
import {
  styles,
  SidebarContainer,
  SignOutWrapper,
  LogoContainer,
  UserInfoContainer,
  UserDetails,
  UserName,
  UserRole,
  EmployeeId,
  SidebarToggle,
  SidebarContent,
  SectionDivider,
  SidebarNavLink,
  DropdownHeader,
  DropdownContent,
  SubLink,
  IconWrapper,
  ChevronIcon,
} from "./styles";

const Sidebar = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar,
    role,
    name,
    employeeId,
    dropdowns,
    toggleDropdown,
  } = useSidebarData();

  return (
    <>
      <SidebarToggle onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </SidebarToggle>

      <SidebarContainer isOpen={isSidebarOpen}>
        <LogoContainer>
          <h1>Shanmuga</h1>
          <h1>Diagnostics</h1>
        </LogoContainer>

        <UserInfoContainer>
          <UserDetails>
            <UserName>{name}</UserName>
            <EmployeeId>ID : {employeeId}</EmployeeId>
            <UserRole>Role : {role}</UserRole>
          </UserDetails>
        </UserInfoContainer>

        <SidebarContent>
          {role === "Sample Collector" && (
            <>
              <DropdownHeader
                isOpen={dropdowns.b2bDetails}
                onClick={() => toggleDropdown("b2bDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaClinicMedical />
                  </IconWrapper>
                  B2B Details
                </div>
                <ChevronIcon isOpen={dropdowns.b2bDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.b2bDetails}>
                <SubLink to="/B2B" onClick={() => setIsSidebarOpen(false)}>
                  B2B Master
                </SubLink>
                <SubLink
                  to="/B2BPackage"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Package
                </SubLink>
                <SubLink
                  to="/B2BPackageList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Package List
                </SubLink>
              </DropdownContent>

              <SectionDivider />

              <DropdownHeader
                isOpen={dropdowns.patientDetails}
                onClick={() => toggleDropdown("patientDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  Patient Details
                </div>
                <ChevronIcon isOpen={dropdowns.patientDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.patientDetails}>
                <SubLink
                  to="/AppointmentBooking"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Appointment Booking
                </SubLink>
                <SubLink
                  to="/PatientForm"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Registration
                </SubLink>
                <SubLink
                  to="/EditPatient"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Edit Patient
                </SubLink>
                <SubLink to="/Estimate" onClick={() => setIsSidebarOpen(false)}>
                  Bill Estimate
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.billingDetails}
                onClick={() => toggleDropdown("billingDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaCreditCard />
                  </IconWrapper>
                  Billing
                </div>
                <ChevronIcon isOpen={dropdowns.billingDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.billingDetails}>
                <SubLink
                  to="/PatientBilling"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Billing
                </SubLink>
                <SubLink
                  to="/PrintBill"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Overview
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.barcodeDetails}
                onClick={() => toggleDropdown("barcodeDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaBarcode />
                  </IconWrapper>
                  Barcode
                </div>
                <ChevronIcon isOpen={dropdowns.barcodeDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.barcodeDetails}>
                <SubLink
                  to="/BarcodeGeneration"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Barcode Generation
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.sampleDetails}
                onClick={() => toggleDropdown("sampleDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaVial />
                  </IconWrapper>
                  Sample
                </div>
                <ChevronIcon isOpen={dropdowns.sampleDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.sampleDetails}>
                <SubLink
                  to="/SampleStatus"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Sample Collection
                </SubLink>
                <SubLink
                  to="/SampleStatusUpdate"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Sample Accessioning and Distribution
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.logisticsDetails}
                onClick={() => toggleDropdown("logisticsDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaTruck />
                  </IconWrapper>
                  Logistics
                </div>
                <ChevronIcon isOpen={dropdowns.logisticsDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.logisticsDetails}>
                <SubLink
                  to="/LogisticsTaskManagement"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Logistics Approval
                </SubLink>
              </DropdownContent>


              <DropdownContent isOpen={dropdowns.logisticsDetails}>
                <SubLink
                  to="/Busfare"
                  onClick={() => setIsSidebarOpen(false)}
                >
                 Bus Sample Summary
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.routeDetails}
                onClick={() => toggleDropdown("routeDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaRoute />
                  </IconWrapper>
                  Route Master
                </div>
                <ChevronIcon isOpen={dropdowns.routeDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.routeDetails}>
                <SubLink
                  to="/RouteAnalysis"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Route Analysis
                </SubLink>
              </DropdownContent>

              <SidebarNavLink
                to="/PatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaChartLine />
                </IconWrapper>
                Report Dashboard
              </SidebarNavLink>

              <SidebarNavLink
                to="/CustomerComplaints"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaChartLine />
                </IconWrapper>
                Customer Complaints
              </SidebarNavLink>
            </>
          )}

          {role === "Lab Receptionist" && (
            <>
              <DropdownHeader
                isOpen={dropdowns.patientDetails}
                onClick={() => toggleDropdown("patientDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  Patient Details
                </div>
                <ChevronIcon isOpen={dropdowns.patientDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.patientDetails}>
                <SubLink
                  to="/PatientBilling"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Billing
                </SubLink>
                <SubLink
                  to="/PrintBill"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Overview
                </SubLink>
                <SubLink to="/Estimate" onClick={() => setIsSidebarOpen(false)}>
                  Bill Estimate
                </SubLink>
              </DropdownContent>

              <SidebarNavLink
                to="/PatientTAT"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaNotesMedical />
                </IconWrapper>
                Patient Summary
              </SidebarNavLink>
              <SidebarNavLink
                to="/PaymentDashboard"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaMoneyBillWave />
                </IconWrapper>
                Payment Dashboard
              </SidebarNavLink>
              <SidebarNavLink
                to="/RegisterDashboard"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaFileInvoiceDollar />
                </IconWrapper>
                Billing Dashboard
              </SidebarNavLink>

              <SidebarNavLink
                to="/HMSPatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaChartLine />
                </IconWrapper>
                Report Dashboard
              </SidebarNavLink>
            </>
          )}

          {role === "Lab Technician" && (
            <>
              <DropdownHeader
                isOpen={dropdowns.billingDetails}
                onClick={() => toggleDropdown("billingDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaCreditCard />
                  </IconWrapper>
                  Billing
                </div>
                <ChevronIcon isOpen={dropdowns.billingDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.billingDetails}>
                <SubLink
                  to="/HmsBilling"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  HMS Billing
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.barcodeDetails}
                onClick={() => toggleDropdown("barcodeDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaBarcode />
                  </IconWrapper>
                  Barcode
                </div>
                <ChevronIcon isOpen={dropdowns.barcodeDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.barcodeDetails}>
                <SubLink
                  to="/HMSBarcodeGeneration"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  HMS Barcode Generation
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.sampleDetails}
                onClick={() => toggleDropdown("sampleDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <PiTestTubeDuotone />
                  </IconWrapper>
                  Sample
                </div>
                <ChevronIcon isOpen={dropdowns.sampleDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.sampleDetails}>
                <SubLink
                  to="/SampleStatusUpdate"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Sample Accessioning and Distribution
                </SubLink>
                <SubLink
                  to="/Hmssamplestatus"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  HMS Sample Collection
                </SubLink>
                <SubLink
                  to="/HmsSampleStatusUpdate"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  HMS Sample Accessioning and Distribution
                </SubLink>
                <SubLink
                  to="/CorporateBatchApproval"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Corporate Batch Approval and Distribution
                </SubLink>
                <SubLink
                  to="/FranchiseBatchApproval"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Franchise Batch Approval and Distribution
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.reportDetails}
                onClick={() => toggleDropdown("reportDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaFileAlt />
                  </IconWrapper>
                  Report
                </div>
                <ChevronIcon isOpen={dropdowns.reportDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.reportDetails}>
                <SubLink
                  to="/PatientDetails"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Report Generation
                </SubLink>
                <SubLink
                  to="/OutSourceDetails"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  O/S Report Generation
                </SubLink>
                <SubLink
                  to="/MBPatientDetails"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  M/B Report Generation
                </SubLink>
                <SubLink
                  to="/PatientList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Rerun Sample
                </SubLink>
                <SubLink to="/WorkList" onClick={() => setIsSidebarOpen(false)}>
                  Work List
                </SubLink>
              </DropdownContent>

              <SidebarNavLink
                to="/TestEdit"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaEdit />
                </IconWrapper>
                Test Edit
              </SidebarNavLink>

              <SidebarNavLink
                to="/HMSPatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaChartLine />
                </IconWrapper>
                Report Dashboard
              </SidebarNavLink>

              <SidebarNavLink
                to="/ShanmugaMIS"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaFileMedicalAlt />
                </IconWrapper>
                MIS Report
              </SidebarNavLink>
            </>
          )}

          {role === "Doctor" && (
            <>
              <DropdownHeader
                isOpen={dropdowns.patientDetails}
                onClick={() => toggleDropdown("patientDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  Patient Details
                </div>
                <ChevronIcon isOpen={dropdowns.patientDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.patientDetails}>
                <SubLink
                  to="/PatientForm"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Registration
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.billingDetails}
                onClick={() => toggleDropdown("billingDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaCreditCard />
                  </IconWrapper>
                  Billing
                </div>
                <ChevronIcon isOpen={dropdowns.billingDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.billingDetails}>
                <SubLink
                  to="/PatientBilling"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Billing
                </SubLink>
                <SubLink
                  to="/HmsBilling"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  HMS Billing
                </SubLink>
                <SubLink
                  to="/PrintBill"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Overview
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.barcodeDetails}
                onClick={() => toggleDropdown("barcodeDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaBarcode />
                  </IconWrapper>
                  Barcode
                </div>
                <ChevronIcon isOpen={dropdowns.barcodeDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.barcodeDetails}>
                <SubLink
                  to="/BarcodeGeneration"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Barcode Generation
                </SubLink>
                <SubLink
                  to="/HMSBarcodeGeneration"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  HMS Barcode Generation
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.sampleDetails}
                onClick={() => toggleDropdown("sampleDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <PiTestTubeDuotone />
                  </IconWrapper>
                  Sample
                </div>
                <ChevronIcon isOpen={dropdowns.sampleDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.sampleDetails}>
                <SubLink
                  to="/SampleStatusUpdate"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Sample Accessioning and Distribution
                </SubLink>
                <SubLink
                  to="/HmsSampleStatusUpdate"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  HMS Sample Accessioning and Distribution
                </SubLink>
                <SubLink
                  to="/CorporateBatchApproval"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Corporate Batch Approval
                </SubLink>
                <SubLink
                  to="/FranchiseBatchApproval"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Franchise Batch Approval
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.reportDetails}
                onClick={() => toggleDropdown("reportDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaFileAlt />
                  </IconWrapper>
                  Report
                </div>
                <ChevronIcon isOpen={dropdowns.reportDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.reportDetails}>
                <SubLink
                  to="/PatientDetails"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Report Generation
                </SubLink>
                <SubLink
                  to="/OutSourceDetails"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  O/S Report Generation
                </SubLink>
                <SubLink
                  to="/MBPatientDetails"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  M/B Report Generation
                </SubLink>
                <SubLink
                  to="/PatientList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Report Authorization
                </SubLink>
                <SubLink
                  to="/ApprovedList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Report Edit
                </SubLink>
                <SubLink
                  to="/MBPatientList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  M/B Report Authorization
                </SubLink>
                <SubLink to="/WorkList" onClick={() => setIsSidebarOpen(false)}>
                  Work List
                </SubLink>
              </DropdownContent>

              <SidebarNavLink
                to="/HMSPatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaChartLine />
                </IconWrapper>
                Report Dashboard
              </SidebarNavLink>

              <SidebarNavLink
                to="/TestEdit"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaEdit />
                </IconWrapper>
                Test Edit
              </SidebarNavLink>

              <SidebarNavLink
                to="/Testcount"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaVials />
                </IconWrapper>
                B2B Test Count
              </SidebarNavLink>

              <SidebarNavLink
                to="/ShanmugaMIS"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaFileMedicalAlt />
                </IconWrapper>
                MIS Report
              </SidebarNavLink>
              <SidebarNavLink
                to="/HMSTestCount"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaVials />
                </IconWrapper>
                HMS Test Count
              </SidebarNavLink>

               <SidebarNavLink
                to="/CustomerComplaints"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaChartLine />
                </IconWrapper>
                Customer Complaints
              </SidebarNavLink>
            </>
          )}

          {role === "Sales Executive" && (
            <>
              <DropdownHeader
                isOpen={dropdowns.patientDetails}
                onClick={() => toggleDropdown("patientDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  Patient Details
                </div>
                <ChevronIcon isOpen={dropdowns.patientDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.patientDetails}>
                <SubLink
                  to="/AppointmentBooking"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Appointment Booking
                </SubLink>
                <SubLink
                  to="/AppointmentList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Appointment List
                </SubLink>
                <SubLink
                  to="/PatientForm"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Registration
                </SubLink>
                <SubLink
                  to="/EditPatient"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Edit Patient
                </SubLink>
                <SubLink to="/Estimate" onClick={() => setIsSidebarOpen(false)}>
                  Bill Estimate
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.billingDetails}
                onClick={() => toggleDropdown("billingDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaCreditCard />
                  </IconWrapper>
                  Billing
                </div>
                <ChevronIcon isOpen={dropdowns.billingDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.billingDetails}>
                <SubLink
                  to="/PatientBilling"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Billing
                </SubLink>
                <SubLink
                  to="/HmsBilling"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  HMS Billing
                </SubLink>
                <SubLink
                  to="/PrintBill"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Overview
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.barcodeDetails}
                onClick={() => toggleDropdown("barcodeDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaBarcode />
                  </IconWrapper>
                  Barcode
                </div>
                <ChevronIcon isOpen={dropdowns.barcodeDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.barcodeDetails}>
                <SubLink
                  to="/BarcodeGeneration"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Barcode Generation
                </SubLink>
                <SubLink
                  to="/HMSBarcodeGeneration"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  HMS Barcode Generation
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.sampleDetails}
                onClick={() => toggleDropdown("sampleDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaVial />
                  </IconWrapper>
                  Sample
                </div>
                <ChevronIcon isOpen={dropdowns.sampleDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.sampleDetails}>
                <SubLink
                  to="/SampleStatus"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Sample Collection
                </SubLink>
                <SubLink
                  to="/Hmssamplestatus"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  HMS Sample Collection
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.salesDetails}
                onClick={() => toggleDropdown("salesDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaHandHoldingUsd />
                  </IconWrapper>
                  Sales
                </div>
                <ChevronIcon isOpen={dropdowns.salesDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.salesDetails}>
                <SubLink
                  to="/SalesVisit"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sales Visit Form
                </SubLink>
                <SubLink
                  to="/SalesindividualReport"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sales Report
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.logisticsDetails}
                onClick={() => toggleDropdown("logisticsDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaTruck />
                  </IconWrapper>
                  Logistics
                </div>
                <ChevronIcon isOpen={dropdowns.logisticsDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.logisticsDetails}>
                <SubLink
                  to="/Busfare"
                  onClick={() => setIsSidebarOpen(false)}
                >
                 Bus Sample Summary
                </SubLink>
              </DropdownContent>

              <SidebarNavLink to="/B2B" onClick={() => setIsSidebarOpen(false)}>
                <IconWrapper>
                  <FaBuilding />
                </IconWrapper>
                B2B Master
              </SidebarNavLink>

              <SidebarNavLink
                to="/HMSPatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaChartLine />
                </IconWrapper>
                Report Dashboard
              </SidebarNavLink>


               <SidebarNavLink
                to="/CustomerComplaints"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaChartLine />
                </IconWrapper>
                Customer Complaints
              </SidebarNavLink>
            </>
          )}

          {role === "Accounts" && (
            <>
              <DropdownHeader
                isOpen={dropdowns.financeDetails}
                onClick={() => toggleDropdown("financeDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaCoins />
                  </IconWrapper>
                  Finance
                </div>
                <ChevronIcon isOpen={dropdowns.financeDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.financeDetails}>
                <SubLink to="/Invoice" onClick={() => setIsSidebarOpen(false)}>
                  Invoice
                </SubLink>
                <SubLink to="/Corporatecreditbilling" onClick={() => setIsSidebarOpen(false)}>
                  Corporate Invoice
                </SubLink>
                <SubLink
                  to="/CashTally"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Cash Tally
                </SubLink>
                <SubLink to="/Refund" onClick={() => setIsSidebarOpen(false)}>
                  Refund
                </SubLink>
                <SubLink
                  to="/Cancellation"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Cancellation
                </SubLink>
                <SubLink
                  to="/RefundAndCancellationLog"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Refund And Cancellation Log
                </SubLink>
                <SubLink
                  to="/LedgerBalance"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Ledger Balance
                </SubLink>
              </DropdownContent>

              <SidebarNavLink
                to="/PatientTAT"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <GrOverview />
                </IconWrapper>
                Patient Summary
              </SidebarNavLink>
            </>
          )}

          {role === "Admin" && (
            <>
              <SidebarNavLink
                to="/MDashboard"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaChartPie />
                </IconWrapper>
                Dashboard
              </SidebarNavLink>

              <SidebarNavLink
                to="/RegisterDashboard"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaFileInvoiceDollar />
                </IconWrapper>
                Billing Dashboard
              </SidebarNavLink>

              <DropdownHeader
                isOpen={dropdowns.b2bDetails}
                onClick={() => toggleDropdown("b2bDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaClinicMedical />
                  </IconWrapper>
                  B2B Details
                </div>
                <ChevronIcon isOpen={dropdowns.b2bDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.b2bDetails}>
                <SubLink to="/B2B" onClick={() => setIsSidebarOpen(false)}>
                  B2B Master
                </SubLink>
                <SubLink
                  to="/B2BReport"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Report
                </SubLink>
                <SubLink
                  to="/B2BApproval"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Approval
                </SubLink>
                <SubLink
                  to="/B2BPackage"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Package
                </SubLink>
                <SubLink
                  to="/B2BPackageApproval"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Package Approval
                </SubLink>
                <SubLink
                  to="/B2BPackageList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Package List
                </SubLink>
              </DropdownContent>

              <SectionDivider />
              <DropdownHeader
                isOpen={dropdowns.patientDetails}
                onClick={() => toggleDropdown("patientDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  Patient Details
                </div>
                <ChevronIcon isOpen={dropdowns.patientDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.patientDetails}>
                <SubLink
                  to="/PatientForm"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Registration
                </SubLink>
                <SubLink
                  to="/EditPatient"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Edit Patient
                </SubLink>
                <SubLink
                  to="/PatientRecordView"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Record
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.BillingDetails}
                onClick={() => toggleDropdown("BillingDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaCreditCard />
                  </IconWrapper>
                  Billing
                </div>
                <ChevronIcon isOpen={dropdowns.BillingDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.BillingDetails}>
                <SubLink to="/Estimate" onClick={() => setIsSidebarOpen(false)}>
                  Bill Estimate
                </SubLink>
                <SubLink
                  to="/PatientBilling"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Billing
                </SubLink>
                <SubLink
                  to="/HmsBilling"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  HMS Billing
                </SubLink>
                <SubLink
                  to="/PrintBill"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Overview
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.barcodeDetails}
                onClick={() => toggleDropdown("barcodeDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaBarcode />
                  </IconWrapper>
                  Barcode
                </div>
                <ChevronIcon isOpen={dropdowns.barcodeDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.barcodeDetails}>
                <SubLink
                  to="/BarcodeGeneration"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Barcode Generation
                </SubLink>
                <SubLink
                  to="/HMSBarcodeGeneration"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  HMS Barcode Generation
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.sampleDetails}
                onClick={() => toggleDropdown("sampleDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <PiTestTubeDuotone />
                  </IconWrapper>
                  Sample
                </div>
                <ChevronIcon isOpen={dropdowns.sampleDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.sampleDetails}>
                <SubLink
                  to="/SampleStatus"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Sample Collection
                </SubLink>
                <SubLink
                  to="/Hmssamplestatus"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  HMS Sample Collection
                </SubLink>
                <SubLink
                  to="/SampleStatusUpdate"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Sample Accessioning and Distribution
                </SubLink>
                <SubLink
                  to="/HmsSampleStatusUpdate"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  HMS Sample Accessioning and Distribution
                </SubLink>
                <SubLink
                  to="/CorporateBatchApproval"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Corporate Batch Approval
                </SubLink>
                <SubLink
                  to="/FranchiseBatchApproval"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Franchise Batch Approval
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.reportDetails}
                onClick={() => toggleDropdown("reportDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaFileAlt />
                  </IconWrapper>
                  Report
                </div>
                <ChevronIcon isOpen={dropdowns.reportDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.reportDetails}>
                <SubLink
                  to="/PatientDetails"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Report Generation
                </SubLink>
                <SubLink
                  to="/OutSourceDetails"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  O/S Report Generation
                </SubLink>
                <SubLink
                  to="/MBPatientDetails"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  M/B Report Generation
                </SubLink>
                <SubLink
                  to="/PatientList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Report Authorization
                </SubLink>
                <SubLink
                  to="/ApprovedList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Report Edit
                </SubLink>
                <SubLink
                  to="/MBPatientList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  M/B Report Authorization
                </SubLink>
                <SubLink to="/WorkList" onClick={() => setIsSidebarOpen(false)}>
                  Work List
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.logisticsDetails}
                onClick={() => toggleDropdown("logisticsDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaTruck />
                  </IconWrapper>
                  Logistics
                </div>
                <ChevronIcon isOpen={dropdowns.logisticsDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.logisticsDetails}>
                <SubLink
                  to="/LogisticsTaskAssign"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Logistics Task Assigning
                </SubLink>
                <SubLink
                  to="/LogisticsTaskManagement"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Logistics Approval
                </SubLink>
                <SubLink
                  to="/LogisticsDashboard"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Logistics Dashboard
                </SubLink>
                <SubLink
                  to="/LogisticsTracking"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Logistics Tracking
                </SubLink>
                <SubLink
                  to="/TrackingHistory"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Tracking History
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.salesDetails}
                onClick={() => toggleDropdown("salesDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaHandHoldingUsd />
                  </IconWrapper>
                  Sales
                </div>
                <ChevronIcon isOpen={dropdowns.salesDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.salesDetails}>
                <SubLink
                  to="/SalesVisit"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sales Visit Form
                </SubLink>
                <SubLink
                  to="/SalesVisitLogReport"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sales Visit Report
                </SubLink>
                <SubLink
                  to="/SalesDashboard"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sales Visit Dashboard
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.financeDetails}
                onClick={() => toggleDropdown("financeDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaCoins />
                  </IconWrapper>
                  Finance
                </div>
                <ChevronIcon isOpen={dropdowns.financeDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.financeDetails}>
                <SubLink to="/Invoice" onClick={() => setIsSidebarOpen(false)}>
                  Invoice
                </SubLink>
                <SubLink
                  to="/CashTally"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Cash Tally
                </SubLink>
                <SubLink to="/Refund" onClick={() => setIsSidebarOpen(false)}>
                  Refund
                </SubLink>
                <SubLink
                  to="/Cancellation"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Cancellation
                </SubLink>
              </DropdownContent>

              <SectionDivider />

              <SidebarNavLink
                to="/HMSPatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaChartLine />
                </IconWrapper>
                Report Dashboard
              </SidebarNavLink>
              <SidebarNavLink
                to="/CHCReport"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaCheckDouble />
                </IconWrapper>
                Corporate Report Approval
              </SidebarNavLink>

              <SidebarNavLink
                to="/TestEdit"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaEdit />
                </IconWrapper>
                Test Edit
              </SidebarNavLink>

              <DropdownHeader
                isOpen={dropdowns.misDetails}
                onClick={() => toggleDropdown("misDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaFileMedicalAlt />
                  </IconWrapper>
                  MIS
                </div>
                <ChevronIcon isOpen={dropdowns.misDetails} />
              </DropdownHeader>
              <DropdownContent isOpen={dropdowns.misDetails}>
                <SubLink
                  to="/PatientTAT"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Summary
                </SubLink>
                <SubLink
                  to="/ShanmugaMIS"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Overall TAT
                </SubLink>
                <SubLink
                  to="/LogisticsTAT"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Logistics TAT
                </SubLink>
                <SubLink
                  to="/CommunicationLogs"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Communication Logs
                </SubLink>
                <SubLink
                  to="/Testcount"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Test Count
                </SubLink>
                <SubLink
                  to="/HMSTestCount"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  HMS Test Count
                </SubLink>
                <SubLink
                  to="/OutsourcedSamples"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Outsourced Samples
                </SubLink>
                <SubLink
                  to="/LedgerBalance"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Ledger Balance
                </SubLink>
                <SubLink
                  to="/HomeCollectionReport"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Home Collection Report
                </SubLink>
              </DropdownContent>
            </>
          )}

          {role === "Diagnostics General Manager" && (
            <>
              <SidebarNavLink
                to="/MDashboard"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaChartPie />
                </IconWrapper>
                Dashboard
              </SidebarNavLink>

              <SidebarNavLink
                to="/RegisterDashboard"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaFileInvoiceDollar />
                </IconWrapper>
                Billing Dashboard
              </SidebarNavLink>

              <DropdownHeader
                isOpen={dropdowns.b2bDetails}
                onClick={() => toggleDropdown("b2bDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaClinicMedical />
                  </IconWrapper>
                  B2B Details
                </div>
                <ChevronIcon isOpen={dropdowns.b2bDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.b2bDetails}>
                <SubLink to="/B2B" onClick={() => setIsSidebarOpen(false)}>
                  B2B Master
                </SubLink>
                <SubLink
                  to="/B2BReport"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Report
                </SubLink>
                <SubLink
                  to="/B2BApproval"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Approval
                </SubLink>
                <SubLink
                  to="/B2BPackage"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Package
                </SubLink>
                <SubLink
                  to="/B2BPackageApproval"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Package Approval
                </SubLink>
                <SubLink
                  to="/B2BPackageList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Package List
                </SubLink>
              </DropdownContent>

              <SectionDivider />

              <DropdownHeader
                isOpen={dropdowns.patientDetails}
                onClick={() => toggleDropdown("patientDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  Patient Details
                </div>
                <ChevronIcon isOpen={dropdowns.patientDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.patientDetails}>
                <SubLink
                  to="/AppointmentBooking"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Appointment Booking
                </SubLink>
                <SubLink
                  to="/AppointmentList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Appointment List
                </SubLink>
                <SubLink
                  to="/PatientForm"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Registration
                </SubLink>
                <SubLink
                  to="/EditPatient"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Edit Patient
                </SubLink>
                <SubLink
                  to="/PatientRecordView"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Record
                </SubLink>
                <SubLink to="/Estimate" onClick={() => setIsSidebarOpen(false)}>
                  Bill Estimate
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.billingDetails}
                onClick={() => toggleDropdown("billingDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaCreditCard />
                  </IconWrapper>
                  Billing
                </div>
                <ChevronIcon isOpen={dropdowns.billingDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.billingDetails}>
                <SubLink
                  to="/PatientBilling"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Billing
                </SubLink>
                <SubLink
                  to="/PrintBill"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Overview
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.barcodeDetails}
                onClick={() => toggleDropdown("barcodeDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaBarcode />
                  </IconWrapper>
                  Barcode
                </div>
                <ChevronIcon isOpen={dropdowns.barcodeDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.barcodeDetails}>
                <SubLink
                  to="/BarcodeGeneration"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Barcode Generation
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.sampleDetails}
                onClick={() => toggleDropdown("sampleDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaVial />
                  </IconWrapper>
                  Sample
                </div>
                <ChevronIcon isOpen={dropdowns.sampleDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.sampleDetails}>
                <SubLink
                  to="/SampleStatus"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Sample Collection
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.logisticsDetails}
                onClick={() => toggleDropdown("logisticsDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaTruck />
                  </IconWrapper>
                  Logistics
                </div>
                <ChevronIcon isOpen={dropdowns.logisticsDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.logisticsDetails}>
                <SubLink
                  to="/LogisticsTaskAssign"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Logistics Task Assigning
                </SubLink>
                <SubLink
                  to="/LogisticsDashboard"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Logistics Dashboard
                </SubLink>
                <SubLink
                  to="/LogisticsTracking"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Logistics Tracking
                </SubLink>
                <SubLink
                  to="/TrackingHistory"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Tracking History
                </SubLink>
              </DropdownContent>

              <DropdownContent isOpen={dropdowns.logisticsDetails}>
                <SubLink
                  to="/Busfare"
                  onClick={() => setIsSidebarOpen(false)}
                >
                 Bus Sample Summary
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.routeDetails}
                onClick={() => toggleDropdown("routeDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaRoute />
                  </IconWrapper>
                  Route Master
                </div>
                <ChevronIcon isOpen={dropdowns.routeDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.routeDetails}>
                <SubLink
                  to="/RouteSetup"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Route Setup
                </SubLink>
                <SubLink
                  to="/RouteAnalysisDashboard"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Route Analysis Report
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.salesDetails}
                onClick={() => toggleDropdown("salesDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaHandHoldingUsd />
                  </IconWrapper>
                  Sales
                </div>
                <ChevronIcon isOpen={dropdowns.salesDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.salesDetails}>
                <SubLink
                  to="/SalesVisitLogReport"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sales Visit Report
                </SubLink>
                <SubLink
                  to="/SalesDashboard"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sales Visit Dashboard
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.financeDetails}
                onClick={() => toggleDropdown("financeDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaCoins />
                  </IconWrapper>
                  Finance
                </div>
                <ChevronIcon isOpen={dropdowns.financeDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.financeDetails}>
                <SubLink to="/Invoice" onClick={() => setIsSidebarOpen(false)}>
                  Invoice
                </SubLink>
                <SubLink to="/Corporatecreditbilling" onClick={() => setIsSidebarOpen(false)}>
                  Corporate Invoice
                </SubLink>
                <SubLink
                  to="/CashTally"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Cash Tally
                </SubLink>
                <SubLink to="/Refund" onClick={() => setIsSidebarOpen(false)}>
                  Refund
                </SubLink>
                <SubLink
                  to="/Cancellation"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Cancellation
                </SubLink>
              </DropdownContent>

              <SectionDivider />

              <SidebarNavLink
                to="/PatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaChartLine />
                </IconWrapper>
                Report Dashboard
              </SidebarNavLink>

              <SidebarNavLink
                to="/CHCReport"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaCheckDouble />
                </IconWrapper>
                Corporate Report Approval
              </SidebarNavLink>

              <SidebarNavLink
                to="/TestEdit"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaEdit />
                </IconWrapper>
                Test Edit
              </SidebarNavLink>

              <DropdownHeader
                isOpen={dropdowns.misDetails}
                onClick={() => toggleDropdown("misDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaFileMedicalAlt />
                  </IconWrapper>
                  MIS
                </div>
                <ChevronIcon isOpen={dropdowns.misDetails} />
              </DropdownHeader>
              <DropdownContent isOpen={dropdowns.misDetails}>
                <SubLink
                  to="/PatientTAT"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Summary
                </SubLink>
                <SubLink
                  to="/Testcount"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Test Count
                </SubLink>
                <SubLink
                  to="/LedgerBalance"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Ledger Balance
                </SubLink>
                <SubLink to="/MIS" onClick={() => setIsSidebarOpen(false)}>
                  Overall TAT
                </SubLink>
                <SubLink
                  to="/LogisticsTAT"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Logistics TAT
                </SubLink>
                <SubLink
                  to="/CommunicationLogs"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Communication Logs
                </SubLink>
                <SubLink
                  to="/OutsourcedSamples"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Outsourced Samples
                </SubLink>
                <SubLink
                  to="/HomeCollectionReport"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Home Collection Report
                </SubLink>
                <SubLink
                  to="/RejectedSamples"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Rejected Samples
                </SubLink>
              </DropdownContent>

              <SidebarNavLink
                to="/CustomerComplaints"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaChartLine />
                </IconWrapper>
                Customer Complaints
              </SidebarNavLink>
            </>
          )}

          {role === "CEO" && (
            <>
              <DropdownHeader
                isOpen={dropdowns.b2bDetails}
                onClick={() => toggleDropdown("b2bDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaClinicMedical />
                  </IconWrapper>
                  B2B Details
                </div>
                <ChevronIcon isOpen={dropdowns.b2bDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.b2bDetails}>
                <SubLink
                  to="/B2BFinalApproval"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Approval
                </SubLink>
                <SubLink
                  to="/B2BPackageApproval"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Package Approval
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.reportDetails}
                onClick={() => toggleDropdown("reportDetails")}
              >
                <div style={styles.dropdownHeaderRow}>
                  <IconWrapper>
                    <FaFileAlt />
                  </IconWrapper>
                  Report
                </div>
                <ChevronIcon isOpen={dropdowns.reportDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.reportDetails}>
                <SubLink
                  to="/PatientDetails"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Report Generation
                </SubLink>
                <SubLink
                  to="/PatientList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Report Authorization
                </SubLink>
              </DropdownContent>

              <SidebarNavLink
                to="/HMSPatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaChartLine />
                </IconWrapper>
                Report Dashboard
              </SidebarNavLink>

              <SidebarNavLink
                to="/CHCReport"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaCheckDouble />
                </IconWrapper>
                Corporate Report Approval
              </SidebarNavLink>

              <SidebarNavLink
                to="/ShanmugaMIS"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaFileMedicalAlt />
                </IconWrapper>
                MIS Report
              </SidebarNavLink>
            </>
          )}

          {role === "HR" && (
            <>
              <SidebarNavLink
                to="/LogisticsTracking"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaMapMarkedAlt />
                </IconWrapper>
                Logistics Tracking
              </SidebarNavLink>
              <SidebarNavLink
                to="/TrackingHistory"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaHistory />
                </IconWrapper>
                Tracking History
              </SidebarNavLink>
            </>
          )}
          {role === "PH" && (
            <>
              <SidebarNavLink
                to="/PreethamDashboard"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaChartPie />
                </IconWrapper>
                Dashboard
              </SidebarNavLink>

              <SidebarNavLink
                to="/Estimate"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaCalculator />
                </IconWrapper>
                Bill Estimate
              </SidebarNavLink>
              <SidebarNavLink
                to="/PreethamPatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaChartLine />
                </IconWrapper>
                Report Dashboard
              </SidebarNavLink>

              <SidebarNavLink
                to="/PreethamHospitalLedger"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaBook />
                </IconWrapper>
                Ledger Balance
              </SidebarNavLink>
            </>
          )}
        </SidebarContent>
        <SignOutWrapper>
          <SidebarNavLink
            to="#"
            onClick={() => {
              setIsSidebarOpen(false);
              window.location.href = "/Secure";
            }}
          >
            <IconWrapper>
              <FaSignOutAlt />
            </IconWrapper>
            Sign Out
          </SidebarNavLink>
        </SignOutWrapper>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
