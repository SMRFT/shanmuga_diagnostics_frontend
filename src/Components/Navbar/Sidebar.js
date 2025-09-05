import { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaUserPlus,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaWpforms,
  FaEdit,
  FaChartPie,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { ImLab } from "react-icons/im";
import { PiTestTubeDuotone } from "react-icons/pi";
import { GrOverview } from "react-icons/gr";
import { TbReport } from "react-icons/tb";
import { FaClinicMedical } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
// import SignOut from "../AUTH/SignOut";
import { DollarSign } from "lucide-react";
// Keyframes for animations
const fadeIn = keyframes`
 from { opacity: 0; }
 to { opacity: 1; }
`;

const slideIn = keyframes`
 from { transform: translateX(-20px); opacity: 0; }
 to { transform: translateX(0); opacity: 1; }
`;

const gradientAnimation = keyframes`
 0% { background-position: 0% 50%; }
 50% { background-position: 100% 50%; }
 100% { background-position: 0% 50%; }
`;

// Glass effect styles
const glassEffect = css`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

// Sidebar Container
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

  /* Custom scrollbar */
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
// Logo Container
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

// Sidebar Toggle Button
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

// Sidebar Content
const SidebarContent = styled.div`
  padding: 0 15px 20px;
`;

// Section Divider
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

// Navigation Link
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

// Dropdown Header
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

// Dropdown Content
const DropdownContent = styled.div`
  overflow: hidden;
  max-height: ${(props) => (props.isOpen ? "500px" : "0")};
  transition: max-height 0.4s ease-in-out;
  margin-left: 10px;

  & > * {
    animation: ${slideIn} 0.3s ease forwards;
  }
`;

// Sub Link
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

// Icon Wrapper
const IconWrapper = styled.span`
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

// Chevron Icon with animation
const ChevronIcon = styled(FaChevronDown)`
  transition: transform 0.3s ease;
  transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0)")};
`;

// User Info Section
const UserInfo = styled.div`
  ${glassEffect}
  padding: 15px;
  border-radius: 12px;
  margin: 0 15px 20px;
  display: flex;
  align-items: center;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    font-size: 18px;
  }

  .user-details {
    flex: 1;

    .name {
      font-weight: 600;
      font-size: 14px;
    }

    .role {
      font-size: 12px;
      opacity: 0.8;
    }
  }
`;

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [dropdowns, setDropdowns] = useState({
    patientDetails: false,
    sampleDetails: false,
    reportDetails: false,
    salesDetails: false,
    logisticsDetails: false,
    financeDetails: false,
    misDetails: false,
    b2bDetails: false,
  });

  // Toggle dropdown state
  const toggleDropdown = (dropdown) => {
    setDropdowns({
      ...dropdowns,
      [dropdown]: !dropdowns[dropdown],
    });
  };

  // Fetch the role when the component mounts
  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const userName = localStorage.getItem("name"); // Fix: Use getItem instead of setItem

    setRole(userRole || "");
    setName(userName || ""); // Set name in state
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get first letter of role for avatar
  const getInitial = () => {
    return name ? name.charAt(0).toUpperCase() : "U"; // Show name initial instead of role initial
  };

  return (
    <>
      <SidebarToggle onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </SidebarToggle>

      <SidebarContainer isOpen={isSidebarOpen}>
        <LogoContainer>
          <h1>Shanmuga Diagnostics</h1>
          {/* <img src={logo} alt="Logo" style={{ width: "250px", height: "90px" }} /> */}
        </LogoContainer>

        {/* <UserInfo>
          <div className="avatar">{getInitial()}</div>
          <div className="user-details">
          <div className="name">Welcome, {name || "Guest"}</div> 
          <div className="role">{role || "User"}</div>
          </div>
          </UserInfo> */}

        <SidebarContent>
          <SidebarNavLink to="/" onClick={() => setIsSidebarOpen(false)}>
            <IconWrapper>
              <FaHome />
            </IconWrapper>
            Home
          </SidebarNavLink>

          {role === "Receptionist" && (
            <>
              <DropdownHeader
                isOpen={dropdowns.patientDetails}
                onClick={() => toggleDropdown("patientDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                <SubLink to="/Estimate" onClick={() => setIsSidebarOpen(false)}>
                  Bill Estimate
                </SubLink>
                <SubLink
                  to="/PatientBilling"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Billing
                </SubLink>
                <SubLink
                  to="/PrintBill"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Overview
                </SubLink>
                <SubLink
                  to="/BarcodeGeneration"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Barcode Generation
                </SubLink>
              </DropdownContent>

              <SidebarNavLink to="/B2B" onClick={() => setIsSidebarOpen(false)}>
                <IconWrapper>
                  <GrOverview />
                </IconWrapper>
                B2B Report
              </SidebarNavLink>

              <DropdownHeader
                isOpen={dropdowns.sampleDetails}
                onClick={() => toggleDropdown("sampleDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                  Sample Collection
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.logisticsDetails}
                onClick={() => toggleDropdown("logisticsDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaWpforms />
                  </IconWrapper>
                  Logistics
                </div>
                <ChevronIcon isOpen={dropdowns.logisticsDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.logisticsDetails}>
                <SubLink
                  to="/LogisticManagementApproval"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Logistics Approval
                </SubLink>
              </DropdownContent>

              <SidebarNavLink
                to="/PatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <GrOverview />
                </IconWrapper>
                Report Dashboard
              </SidebarNavLink>
            </>
          )}

          {role === "Technician" && (
            <>
              <DropdownHeader
                isOpen={dropdowns.sampleDetails}
                onClick={() => toggleDropdown("sampleDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                  Sample Accessioning
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.reportDetails}
                onClick={() => toggleDropdown("reportDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <ImLab />
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
                to="/PatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <GrOverview />
                </IconWrapper>
                Report Dashboard
              </SidebarNavLink>
            </>
          )}

          {role === "Doctor" && (
            <>
              <DropdownHeader
                isOpen={dropdowns.reportDetails}
                onClick={() => toggleDropdown("reportDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <ImLab />
                  </IconWrapper>
                  Report
                </div>
                <ChevronIcon isOpen={dropdowns.reportDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.reportDetails}>
                <SubLink
                  to="/PatientList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Report Authorization
                </SubLink>
              </DropdownContent>

              <SidebarNavLink
                to="/PatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <GrOverview />
                </IconWrapper>
                Report Dashboard
              </SidebarNavLink>
            </>
          )}

          {role === "Front Office" && (
            <>
              <DropdownHeader
                isOpen={dropdowns.patientDetails}
                onClick={() => toggleDropdown("patientDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                  Patient Billing
                </SubLink>
                <SubLink
                  to="/PrintBill"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Overview
                </SubLink>
              </DropdownContent>
              <SidebarNavLink
                to="/PaymentDashboard"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <DollarSign />
                </IconWrapper>
                Payment Dashboard
              </SidebarNavLink>
              <SidebarNavLink
                to="/RegisterDashboard"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <GrOverview />
                </IconWrapper>
                Billing Dashboard
              </SidebarNavLink>
              <SidebarNavLink
                to="/PatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <GrOverview />
                </IconWrapper>
                Report Dashboard
              </SidebarNavLink>
            </>
          )}
          {role === "Sales Person" && (
            <>
              <DropdownHeader
                isOpen={dropdowns.patientDetails}
                onClick={() => toggleDropdown("patientDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                <SubLink to="/Estimate" onClick={() => setIsSidebarOpen(false)}>
                  Bill Estimate
                </SubLink>
                <SubLink
                  to="/PrintBill"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Overview
                </SubLink>
                <SubLink
                  to="/BarcodeGeneration"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Barcode Generation
                </SubLink>
              </DropdownContent>
              <DropdownHeader
                isOpen={dropdowns.salesDetails}
                onClick={() => toggleDropdown("salesDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <TbReport />
                  </IconWrapper>
                  Sales
                </div>
                <ChevronIcon isOpen={dropdowns.salesDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.salesDetails}>
                <SubLink
                  to="/SalesVisitLog"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sales Visit Form
                </SubLink>
                <SubLink
                  to="/SalesReport"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sales Report
                </SubLink>
              </DropdownContent>
              <SidebarNavLink to="/B2B" onClick={() => setIsSidebarOpen(false)}>
                <IconWrapper>
                  <GrOverview />
                </IconWrapper>
                B2B Report
              </SidebarNavLink>
            </>
          )}

          {role === "Sample Collector" && (
            <>
              <DropdownHeader
                isOpen={dropdowns.patientDetails}
                onClick={() => toggleDropdown("patientDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                <SubLink to="/Estimate" onClick={() => setIsSidebarOpen(false)}>
                  Bill Estimate
                </SubLink>
                <SubLink
                  to="/PatientBilling"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Billing
                </SubLink>
                <SubLink
                  to="/PrintBill"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Overview
                </SubLink>
                <SubLink
                  to="/BarcodeGeneration"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Barcode Generation
                </SubLink>
              </DropdownContent>
              <DropdownHeader
                isOpen={dropdowns.sampleDetails}
                onClick={() => toggleDropdown("sampleDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                  Sample Collection
                </SubLink>
              </DropdownContent>
              <DropdownHeader
                isOpen={dropdowns.logisticsDetails}
                onClick={() => toggleDropdown("logisticsDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaWpforms />
                  </IconWrapper>
                  Logistics
                </div>
                <ChevronIcon isOpen={dropdowns.logisticsDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.logisticsDetails}>
                <SubLink
                  to="/LogisticManagementApproval"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Logistics Approval
                </SubLink>
              </DropdownContent>

              <SidebarNavLink
                to="/PatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <GrOverview />
                </IconWrapper>
                Report Dashboard
              </SidebarNavLink>
              <SidebarNavLink to="/B2B" onClick={() => setIsSidebarOpen(false)}>
                <IconWrapper>
                  <GrOverview />
                </IconWrapper>
                B2B Report
              </SidebarNavLink>
            </>
          )}

          {role === "Accounts" && (
            <>
              <DropdownHeader
                isOpen={dropdowns.financeDetails}
                onClick={() => toggleDropdown("financeDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaFileInvoiceDollar />
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
                <SubLink
                  to="/RefundAndCancellationLog"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Refund And Cancellation Log
                </SubLink>
              </DropdownContent>
            </>
          )}

          {role === "Admin" && (
            <>
              <SidebarNavLink
                to="/Dashboard"
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
                  <GrOverview />
                </IconWrapper>
                Billing Dashboard
              </SidebarNavLink>

              <DropdownHeader
                isOpen={dropdowns.b2bDetails}
                onClick={() => toggleDropdown("b2bDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                {/* <SubLink
                  to="/B2BPackageApproval"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Package Approval
                </SubLink> */}
              </DropdownContent>

              <SectionDivider />

              <DropdownHeader
                isOpen={dropdowns.financeDetails}
                onClick={() => toggleDropdown("financeDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaFileInvoiceDollar />
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
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.salesDetails}
                onClick={() => toggleDropdown("salesDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <TbReport />
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
                isOpen={dropdowns.logisticsDetails}
                onClick={() => toggleDropdown("logisticsDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaWpforms />
                  </IconWrapper>
                  Logistics
                </div>
                <ChevronIcon isOpen={dropdowns.logisticsDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.logisticsDetails}>
                <SubLink
                  to="/LogisticsDashboard"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Logistics Dashboard
                </SubLink>
                <SubLink
                  to="/LiveTrackingDashboard"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Logistics Tracking
                </SubLink>
              </DropdownContent>

              <SectionDivider />

              <SidebarNavLink
                to="/PatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <GrOverview />
                </IconWrapper>
                Report Dashboard
              </SidebarNavLink>

              <DropdownHeader
                isOpen={dropdowns.misDetails}
                onClick={() => toggleDropdown("misDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <GrOverview />
                  </IconWrapper>
                  MIS
                </div>
                <ChevronIcon isOpen={dropdowns.misDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.misDetails}>
                <SubLink to="/MIS" onClick={() => setIsSidebarOpen(false)}>
                  Overall TAT
                </SubLink>
              </DropdownContent>
              <DropdownContent isOpen={dropdowns.misDetails}>
                <SubLink
                  to="/LogisticsTAT"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Logistics TAT
                </SubLink>
              </DropdownContent>
            </>
          )}

          {role === "General Manager" && (
            <>
              <SidebarNavLink
                to="/Dashboard"
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
                  <GrOverview />
                </IconWrapper>
                Billing Dashboard
              </SidebarNavLink>

              <DropdownHeader
                isOpen={dropdowns.b2bDetails}
                onClick={() => toggleDropdown("b2bDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaClinicMedical />
                  </IconWrapper>
                  B2B Details
                </div>
                <ChevronIcon isOpen={dropdowns.b2bDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.b2bDetails}>
                <SubLink to="/B2B" onClick={() => setIsSidebarOpen(false)}>
                  B2B
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
                {/* <SubLink
                  to="/B2BPackage"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  B2B Package
                </SubLink> */}
              </DropdownContent>

              <SectionDivider />

              <DropdownHeader
                isOpen={dropdowns.patientDetails}
                onClick={() => toggleDropdown("patientDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                <SubLink to="/Estimate" onClick={() => setIsSidebarOpen(false)}>
                  Bill Estimate
                </SubLink>
                <SubLink
                  to="/PrintBill"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Overview
                </SubLink>
                <SubLink
                  to="/BarcodeGeneration"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Barcode Generation
                </SubLink>
                <SubLink
                  to="/PatientEditForm"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Patient Edit
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.sampleDetails}
                onClick={() => toggleDropdown("sampleDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                  Sample Collection
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.financeDetails}
                onClick={() => toggleDropdown("financeDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaFileInvoiceDollar />
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

              <DropdownHeader
                isOpen={dropdowns.salesDetails}
                onClick={() => toggleDropdown("salesDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <TbReport />
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
                <SubLink
                  to="/SalesDetailsEdit"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sales Visit Edit
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.logisticsDetails}
                onClick={() => toggleDropdown("logisticsDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaWpforms />
                  </IconWrapper>
                  Logistics
                </div>
                <ChevronIcon isOpen={dropdowns.logisticsDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.logisticsDetails}>
                <SubLink
                  to="/LogisticManagementAdmin"
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
                  to="/LiveTrackingDashboard"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Logistics Tracking
                </SubLink>
              </DropdownContent>

              <SectionDivider />

              <SidebarNavLink
                to="/PatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <GrOverview />
                </IconWrapper>
                Report Dashboard
              </SidebarNavLink>

              <DropdownHeader
                isOpen={dropdowns.misDetails}
                onClick={() => toggleDropdown("misDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <GrOverview />
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
              </DropdownContent>
              <DropdownContent isOpen={dropdowns.misDetails}>
                <SubLink to="/MIS" onClick={() => setIsSidebarOpen(false)}>
                  Overall TAT
                </SubLink>
              </DropdownContent>
              <DropdownContent isOpen={dropdowns.misDetails}>
                <SubLink
                  to="/LogisticsTAT"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Logistics TAT
                </SubLink>
              </DropdownContent>

              <SidebarNavLink
                to="/Registration"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaUserPlus />
                </IconWrapper>
                User Rights
              </SidebarNavLink>
            </>
          )}

          {role === "HR" && (
            <>
              <SidebarNavLink
                to="/LiveTrackingDashboard"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <FaMapMarkerAlt />
                </IconWrapper>
                Logistics Tracking
              </SidebarNavLink>
            </>
          )}
        </SidebarContent>
        <SignOutWrapper>{/* <SignOut /> */}</SignOutWrapper>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
