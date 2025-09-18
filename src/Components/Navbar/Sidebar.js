import { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaCreditCard,
  FaBarcode,
  FaVial,
  FaFileAlt,
  FaSignOutAlt
} from "react-icons/fa";
import { ImLab } from "react-icons/im";
import { PiTestTubeDuotone } from "react-icons/pi";
import { GrOverview } from "react-icons/gr";

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

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [dropdowns, setDropdowns] = useState({
    patientDetails: false,
    barcodeDetails: false,
    sampleDetails: false,
    reportDetails: false,
    misDetails: false,
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

  return (
    <>
      <SidebarToggle onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </SidebarToggle>

      <SidebarContainer isOpen={isSidebarOpen}>
        <LogoContainer>
          <h1>Shanmuga Diagnostics</h1>
        </LogoContainer>

        <SidebarContent>
          {role === "Receptionist" && (
            <>
              <DropdownHeader
                isOpen={dropdowns.patientDetails}
                onClick={() => toggleDropdown("patientDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaCreditCard />
                  </IconWrapper>
                  Billing
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
                <div style={{ display: "flex", alignItems: "center" }}>
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
                  HMS Barcode
                </SubLink>
              </DropdownContent>


            <DropdownHeader
                isOpen={dropdowns.sampleDetails}
                onClick={() => toggleDropdown("sampleDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaVial />
                  </IconWrapper>
                  Sample
                </div>
                <ChevronIcon isOpen={dropdowns.sampleDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.sampleDetails}>
                <SubLink
                  to="/Hmssamplestatus"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Hms Sample Collection
                </SubLink>
              </DropdownContent>
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
                  Patient
                </div>
                <ChevronIcon isOpen={dropdowns.patientDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.patientDetails}>
                <SubLink
                  to="/PatientForm"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Diagnostics Patient Form
                </SubLink>
              </DropdownContent>


            <DropdownHeader
                isOpen={dropdowns.sampleDetails}
                onClick={() => toggleDropdown("sampleDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                  Diagnostics Sample Accessioning
                </SubLink>
              </DropdownContent>

              <DropdownContent isOpen={dropdowns.sampleDetails}>
                <SubLink
                  to="/HmsSampleStatusUpdate"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Hms Sample Accessioning
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.reportDetails}
                onClick={() => toggleDropdown("reportDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                  Diagnostics Report Generation
                </SubLink>
              </DropdownContent>

              <DropdownContent isOpen={dropdowns.reportDetails}>
                <SubLink
                  to="/HMSPatientDetails"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Hms Report Generation
                </SubLink>
              </DropdownContent>

              <SidebarNavLink
                to="/PatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <GrOverview />
                </IconWrapper>
                 Diagnostics Report Dashboard
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
                    <FaFileAlt />
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

        </SidebarContent>
          <SignOutWrapper>
            <SidebarNavLink
              to="#"
              onClick={() => {
                setIsSidebarOpen(false);
                window.location.href = "https://shinova.in/login";
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