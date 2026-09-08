"use client";

import { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { NavLink } from "react-router-dom";
import React from "react";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaChevronDown,
  FaSignOutAlt,
  FaUserInjured,
  FaReceipt,
  FaBarcode,
  FaVial,
  FaTruck,
  FaRoute,
  FaMapMarkedAlt,
  FaHistory,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaChartLine,
  FaChartPie,
  FaNotesMedical,
  FaFileMedicalAlt,
  FaFlask,
  FaClipboardList,
  FaChartBar,
  FaHandshake,
  FaBuilding,
  FaVials,
  FaHospitalAlt,
  FaHandHoldingUsd,
  FaCoins,
  FaBalanceScale,
  FaCalculator,
  FaHeadset,
  FaCheckDouble
  FaCheckDouble,
  FaMapMarkedAlt,
  FaHistory,
  FaBook,
  FaQrcode
} from "react-icons/fa";
import { PiTestTubeDuotone } from "react-icons/pi";

const slideIn = keyframes`
 from { transform: translateX(-20px); opacity: 0; }
 to { transform: translateX(0); opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.15); }
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
  overflow: hidden;
  z-index: 1000;
  transform: ${({ isOpen }) =>
    isOpen ? "translateX(0)" : "translateX(-100%)"};
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  box-shadow: 4px 0 25px rgba(0, 0, 0, 0.15);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;

  @media (min-width: 769px) {
    transform: translateX(0);
  }
`;

const SidebarTopFixed = styled.div`
  flex-shrink: 0;
  position: relative;
  z-index: 20;
  background: transparent;
`;

const SignOutWrapper = styled.div`
  flex-shrink: 0;
  margin-top: auto;
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 20;
`;

const LogoContainer = styled.div`
  padding: 16px 16px 12px 16px;
  display: flex;
  align-items: center;
  gap: 11px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
`;

const LogoBadge = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  position: relative;
  flex-shrink: 0;
`;

const PulseIndicator = styled.span`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 9px;
  height: 9px;
  background: #34d399;
  border: 2px solid #a777e3;
  border-radius: 50%;
  animation: ${pulse} 2s infinite ease-in-out;
`;

const BrandTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const BrandTitle = styled.div`
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1.2px;
  color: white;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
`;

const BrandSubtitle = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 2px;
`;

const UserInfoContainer = styled.div`
  ${glassEffect}
  padding: 10px 14px;
  margin: 10px 14px 8px 14px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const UserDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const UserName = styled.div`
  font-size: 14.5px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const UserMetaRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRoleText = styled.span`
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MetaDivider = styled.span`
  margin: 0 6px;
  opacity: 0.5;
  font-size: 10px;
  flex-shrink: 0;
`;

const EmployeeText = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  flex-shrink: 0;
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
  padding: 4px 15px 16px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  /* Custom smooth scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.25);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.45);
  }
`;

const SectionDivider = styled.div`
  margin: 8px 6px;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.35),
    transparent
  );
`;

const SidebarNavLink = styled(NavLink)`
  color: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  padding: 9px 12px;
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 500;
  border-radius: 9px;
  margin-bottom: 2px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    transform: translateX(3px);
  }

  &.active {
    background: rgba(255, 255, 255, 0.22);
    color: white;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.25);
  }
`;

const DropdownHeader = styled.div`
  color: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  font-size: 13.5px;
  font-weight: 500;
  border-radius: 9px;
  margin-bottom: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    transform: translateX(3px);
  }

  ${(props) =>
    props.isOpen &&
    css`
      background: rgba(255, 255, 255, 0.15);
      color: white;
      font-weight: 600;
    `}
`;

const DropdownContent = styled.div`
  overflow: hidden;
  max-height: ${(props) => (props.isOpen ? "800px" : "0")};
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 12px;
  padding-left: 4px;
  border-left: 1.5px solid rgba(255, 255, 255, 0.2);
  margin-bottom: ${(props) => (props.isOpen ? "4px" : "0")};

  & > * {
    animation: ${slideIn} 0.2s ease forwards;
  }
`;

const SubLink = styled(NavLink)`
  color: rgba(255, 255, 255, 0.85);
  padding: 7px 10px 7px 20px;
  text-decoration: none;
  font-size: 12.5px;
  font-weight: 500;
  display: flex;
  align-items: center;
  border-radius: 7px;
  margin-bottom: 2px;
  transition: all 0.2s ease;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    left: 8px;
    top: 50%;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: translateY(-50%);
    transition: all 0.2s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: white;
    transform: translateX(3px);

    &:before {
      background: white;
      box-shadow: 0 0 5px white;
    }
  }

  &.active {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-weight: 600;

    &:before {
      background: white;
      box-shadow: 0 0 6px white;
      transform: translateY(-50%) scale(1.2);
    }
  }
`;

const IconWrapper = styled.span`
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: white;
  flex-shrink: 0;
`;

const ChevronIcon = styled(FaChevronDown)`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
  transition: transform 0.25s ease;
  transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0)")};
  flex-shrink: 0;
`;


const SearchContainer = styled.div`
  padding: 0 14px 10px 14px;
`;

const SearchInputWrapper = styled.div`
  ${glassEffect}
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.15);
  transition: all 0.25s ease;
  border: 1px solid rgba(255, 255, 255, 0.25);

  &:focus-within {
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const SearchIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  margin-right: 8px;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 13px;
  width: 100%;
  font-weight: 500;

  &::placeholder {
    color: rgba(255, 255, 255, 0.75);
    font-size: 12.5px;
    font-weight: 400;
  }
`;

const ClearSearchButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  border-radius: 4px;
  font-size: 11px;
  transition: all 0.15s ease;
  margin-left: 4px;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.25);
  }
`;

const SearchResultsHeader = styled.div`
  padding: 4px 6px 8px 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10.5px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  margin-bottom: 8px;
  letter-spacing: 0.5px;
`;

const MatchCountBadge = styled.span`
  background: rgba(255, 255, 255, 0.25);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.35);
  padding: 1px 6px;
  border-radius: 8px;
  font-size: 9.5px;
  font-weight: 700;
`;

const NoResultsFound = styled.div`
  ${glassEffect}
  padding: 22px 14px;
  margin: 10px 4px;
  border-radius: 10px;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: ${slideIn} 0.25s ease forwards;
`;

const flattenElements = (children) => {
  const elements = [];
  React.Children.forEach(children, (child) => {
    if (!child) return;
    if (child.type === React.Fragment) {
      elements.push(...flattenElements(child.props.children));
    } else if (Array.isArray(child)) {
      elements.push(...flattenElements(child));
    } else {
      elements.push(child);
    }
  });
  return elements;
};

const extractTextFromNode = (node) => {
  if (!node) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromNode).join(" ");
  if (React.isValidElement(node) && node.props && node.props.children) {
    return extractTextFromNode(node.props.children);
  }
  return "";
};

const SearchableMenu = ({ searchQuery, children }) => {
  if (!searchQuery || !searchQuery.trim()) {
    return <>{children}</>;
  }

  const query = searchQuery.toLowerCase().trim();
  const elements = flattenElements(children);
  const matchedElements = [];

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (!el || !React.isValidElement(el)) continue;

    if (el.type === DropdownHeader) {
      const headerText = extractTextFromNode(el).toLowerCase();
      const contentEl = elements[i + 1];
      const isContent = contentEl && contentEl.type === DropdownContent;

      let hasSubMatch = false;
      let matchedSubLinks = [];

      if (isContent && contentEl.props && contentEl.props.children) {
        const subLinks = flattenElements(contentEl.props.children);
        matchedSubLinks = subLinks.filter((sub) => {
          const subText = extractTextFromNode(sub).toLowerCase();
          return subText.includes(query);
        });
        hasSubMatch = matchedSubLinks.length > 0;
      }

      if (headerText.includes(query)) {
        matchedElements.push(
          React.cloneElement(el, { key: `match-hdr-${i}`, isOpen: true })
        );
        if (isContent) {
          matchedElements.push(
            React.cloneElement(contentEl, {
              key: `match-cnt-${i}`,
              isOpen: true,
            })
          );
        }
      } else if (hasSubMatch) {
        matchedElements.push(
          React.cloneElement(el, { key: `match-subhdr-${i}`, isOpen: true })
        );
        matchedElements.push(
          React.cloneElement(
            contentEl,
            { key: `match-subcnt-${i}`, isOpen: true },
            matchedSubLinks
          )
        );
      }

      if (isContent) i++;
    } else if (el.type === SidebarNavLink) {
      const linkText = extractTextFromNode(el).toLowerCase();
      if (linkText.includes(query)) {
        matchedElements.push(
          React.cloneElement(el, { key: `match-link-${i}` })
        );
      }
    }
  }

  if (matchedElements.length === 0) {
    return (
      <NoResultsFound>
        <FaSearch style={{ fontSize: "20px", opacity: 0.6, marginBottom: "4px" }} />
        <div style={{ fontWeight: 600, fontSize: "13px" }}>No results found</div>
        <div style={{ fontSize: "11px", opacity: 0.8 }}>No matches for "{searchQuery}"</div>
      </NoResultsFound>
    );
  }

  return (
    <>
      <SearchResultsHeader>
        <span>SEARCH RESULTS</span>
        <MatchCountBadge>{matchedElements.length} MATCHES</MatchCountBadge>
      </SearchResultsHeader>
      {matchedElements}
    </>
  );
};

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  // With this:
  const defaultDropdowns = {
    patientDetails: false,
    billingDetails: false,
    barcodeDetails: false,
    sampleDetails: false,
    routeDetails: false,
    reportDetails: false,
    osreportDetails: false,
    salesDetails: false,
    logisticsDetails: false,
    financeDetails: false,
    misDetails: false,
    b2bDetails: false,
    franchiseDetails: false,
  };

  const [dropdowns, setDropdowns] = useState(() => {
    try {
      const saved = localStorage.getItem("sidebarDropdowns");
      return saved
        ? { ...defaultDropdowns, ...JSON.parse(saved) }
        : defaultDropdowns;
    } catch {
      return defaultDropdowns;
    }
  });

  const toggleDropdown = (dropdown) => {
    setDropdowns((prev) => {
      const updated = { ...prev, [dropdown]: !prev[dropdown] };
      localStorage.setItem("sidebarDropdowns", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const userName = localStorage.getItem("name");
    const userEmployeeId =
      localStorage.getItem("employee_id") || localStorage.getItem("employeeId");

    setRole(userRole || "");
    setName(userName || "User");
    setEmployeeId(userEmployeeId || "N/A");
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
        <SidebarTopFixed>
          <LogoContainer>
            <LogoBadge>
              <PiTestTubeDuotone />
              <PulseIndicator />
            </LogoBadge>
            <BrandTextGroup>
              <BrandTitle>SHANMUGA</BrandTitle>
              <BrandSubtitle>DIAGNOSTICS</BrandSubtitle>
            </BrandTextGroup>
          </LogoContainer>

          <UserInfoContainer>
            <UserDetails>
              <UserName title={name}>{name}</UserName>
              <UserMetaRow>
                <UserRoleText>{role || "Staff"}</UserRoleText>
                <MetaDivider>|</MetaDivider>
                <EmployeeText>
                  {employeeId
                    ? employeeId.startsWith("ID")
                      ? employeeId
                      : `ID: ${employeeId}`
                    : "ID: N/A"}
                </EmployeeText>
              </UserMetaRow>
            </UserDetails>
          </UserInfoContainer>

          <SearchContainer>
            <SearchInputWrapper>
              <SearchIconWrapper>
                <FaSearch />
              </SearchIconWrapper>
              <SearchInput
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search navigation menu"
              />
              {searchQuery && (
                <ClearSearchButton
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                  type="button"
                >
                  <FaTimes />
                </ClearSearchButton>
              )}
            </SearchInputWrapper>
          </SearchContainer>
        </SidebarTopFixed>

        <SidebarContent>
          <SearchableMenu searchQuery={searchQuery}>
          {role === "Sample Collector" && (
            <>
              <DropdownHeader
                isOpen={dropdowns.b2bDetails}
                onClick={() => toggleDropdown("b2bDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaHandshake />
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaUserInjured />
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaReceipt />
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
                <div style={{ display: "flex", alignItems: "center" }}>
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
                <div style={{ display: "flex", alignItems: "center" }}>
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
                    <FaFileMedicalAlt />
                  </IconWrapper>
                Report Dashboard
              </SidebarNavLink>

              <SidebarNavLink
                to="/CustomerComplaints"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                    <FaHeadset />
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaUserInjured />
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
                    <FaFileMedicalAlt />
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaReceipt />
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
                  HMS Barcode Generation
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaFileMedicalAlt />
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
                <SubLink
                  to="/ApprovedList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Report Edit
                </SubLink>
              </DropdownContent>

              <SidebarNavLink
                to="/TestEdit"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                    <FaFlask />
                  </IconWrapper>
                Test Edit
              </SidebarNavLink>

              <SidebarNavLink
                to="/HMSPatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                    <FaFileMedicalAlt />
                  </IconWrapper>
                Report Dashboard
              </SidebarNavLink>

              <SidebarNavLink
                to="/ShanmugaMIS"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                    <FaClipboardList />
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaUserInjured />
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaReceipt />
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaFileMedicalAlt />
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
                    <FaFileMedicalAlt />
                  </IconWrapper>
                Report Dashboard
              </SidebarNavLink>

              <SidebarNavLink
                to="/TestEdit"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                    <FaFlask />
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
                    <FaClipboardList />
                  </IconWrapper>
                MIS Report
              </SidebarNavLink>
              <SidebarNavLink
                to="/HMSTestCount"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                    <FaHospitalAlt />
                  </IconWrapper>
                HMS Test Count
              </SidebarNavLink>

              <SidebarNavLink
                to="/CustomerComplaints"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                    <FaHeadset />
                  </IconWrapper>
                Customer Complaints
              </SidebarNavLink>
            </>
          )}

          {(role === "Sales Executive" || role === "Sales Person") && (
            <>
              <DropdownHeader
                isOpen={dropdowns.patientDetails}
                onClick={() => toggleDropdown("patientDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaUserInjured />
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaReceipt />
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
                <div style={{ display: "flex", alignItems: "center" }}>
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
                isOpen={dropdowns.routeDetails}
                onClick={() => toggleDropdown("routeDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.logisticsDetails}
                onClick={() => toggleDropdown("logisticsDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                    <FaFileMedicalAlt />
                  </IconWrapper>
                Report Dashboard
              </SidebarNavLink>


              <SidebarNavLink
                to="/CustomerComplaints"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                    <FaHeadset />
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
                <div style={{ display: "flex", alignItems: "center" }}>
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
                    <FaNotesMedical />
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
                isOpen={dropdowns.franchiseDetails}
                onClick={() => toggleDropdown("franchiseDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaClinicMedical />
                  </IconWrapper>
                  Franchise Management
                </div>
                <ChevronIcon isOpen={dropdowns.franchiseDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.franchiseDetails}>
                <SubLink
                  to="/FranchiseRegister"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Franchise Register
                </SubLink>
                <SubLink
                  to="/FranchiseList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Franchise List
                </SubLink>
                <SubLink
                  to="/FranchiseLocations"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Franchise Locations
                </SubLink>
                <SubLink
                  to="/InactiveFranchises"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Inactive Franchises
                </SubLink>
                <SubLink
                  to="/Barcodestock"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Barcode Stock
                </SubLink>
                <SubLink
                  to="/Cancelledbill"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Cancelled Bill
                </SubLink>
                <SubLink
                  to="/Cancelledbillreport"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Cancelled Bill Report
                </SubLink>
                <SubLink
                  to="/MonthEndCalculation"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Month End Calculation
                </SubLink>
                <SubLink
                  to="/FranchiseHomeCollection"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Home Collection
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.b2bDetails}
                onClick={() => toggleDropdown("b2bDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaHandshake />
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaUserInjured />
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaReceipt />
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaFileMedicalAlt />
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
                <div style={{ display: "flex", alignItems: "center" }}>
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
                <div style={{ display: "flex", alignItems: "center" }}>
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
                <div style={{ display: "flex", alignItems: "center" }}>
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
                    <FaFileMedicalAlt />
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
                    <FaFlask />
                  </IconWrapper>
                Test Edit
              </SidebarNavLink>

              <DropdownHeader
                isOpen={dropdowns.misDetails}
                onClick={() => toggleDropdown("misDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaChartBar />
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

          {(role === "Diagnostics General Manager" || role === "General Manager" || role === "GM") && (
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
                isOpen={dropdowns.franchiseDetails}
                onClick={() => toggleDropdown("franchiseDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaClinicMedical />
                  </IconWrapper>
                  Franchise Management
                </div>
                <ChevronIcon isOpen={dropdowns.franchiseDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.franchiseDetails}>
                <SubLink
                  to="/FranchiseRegister"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Franchise Register
                </SubLink>
                <SubLink
                  to="/FranchiseList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Franchise List
                </SubLink>
                <SubLink
                  to="/FranchiseLocations"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Franchise Locations
                </SubLink>
                <SubLink
                  to="/InactiveFranchises"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Inactive Franchises
                </SubLink>
                <SubLink
                  to="/Barcodestock"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Barcode Stock
                </SubLink>
                <SubLink
                  to="/Cancelledbill"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Cancelled Bill
                </SubLink>
                <SubLink
                  to="/Cancelledbillreport"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Cancelled Bill Report
                </SubLink>
                <SubLink
                  to="/MonthEndCalculation"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Month End Calculation
                </SubLink>
                <SubLink
                  to="/FranchiseHomeCollection"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Home Collection
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.b2bDetails}
                onClick={() => toggleDropdown("b2bDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaHandshake />
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaUserInjured />
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaReceipt />
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

              <DropdownHeader
                isOpen={dropdowns.logisticsDetails}
                onClick={() => toggleDropdown("logisticsDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                <div style={{ display: "flex", alignItems: "center" }}>
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
                <div style={{ display: "flex", alignItems: "center" }}>
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

                <SubLink
                  to="/salesplan"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  salesplan
                </SubLink>

                <SubLink
                  to="/Salesreport"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Salesreport
                </SubLink>


                <SubLink
                  to="/Salessummary"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Salessummary
                </SubLink>


              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.financeDetails}
                onClick={() => toggleDropdown("financeDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                    <FaFileMedicalAlt />
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
                    <FaFlask />
                  </IconWrapper>
                Test Edit
              </SidebarNavLink>

              <DropdownHeader
                isOpen={dropdowns.misDetails}
                onClick={() => toggleDropdown("misDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaChartBar />
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
                    <FaHeadset />
                  </IconWrapper>
                Customer Complaints
              </SidebarNavLink>

             

              <SidebarNavLink
                to="/FeedbackGrievanceReport"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                  <TbReport />
                </IconWrapper>
                Feedback & Grievance Report
              </SidebarNavLink>
            </>
          )}

          {role === "CEO" && (
            <>
              <DropdownHeader
                isOpen={dropdowns.franchiseDetails}
                onClick={() => toggleDropdown("franchiseDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaClinicMedical />
                  </IconWrapper>
                  Franchise Management
                </div>
                <ChevronIcon isOpen={dropdowns.franchiseDetails} />
              </DropdownHeader>

              <DropdownContent isOpen={dropdowns.franchiseDetails}>
                <SubLink
                  to="/FranchiseRegister"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Franchise Register
                </SubLink>
                <SubLink
                  to="/FranchiseList"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Franchise List
                </SubLink>
                <SubLink
                  to="/FranchiseLocations"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Franchise Locations
                </SubLink>
                <SubLink
                  to="/InactiveFranchises"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Inactive Franchises
                </SubLink>
                <SubLink
                  to="/Barcodestock"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Barcode Stock
                </SubLink>
                <SubLink
                  to="/Cancelledbill"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Cancelled Bill
                </SubLink>
                <SubLink
                  to="/Cancelledbillreport"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Cancelled Bill Report
                </SubLink>
                <SubLink
                  to="/MonthEndCalculation"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Month End Calculation
                </SubLink>
                <SubLink
                  to="/FranchiseHomeCollection"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Home Collection
                </SubLink>
              </DropdownContent>

              <DropdownHeader
                isOpen={dropdowns.b2bDetails}
                onClick={() => toggleDropdown("b2bDetails")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaHandshake />
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconWrapper>
                    <FaFileMedicalAlt />
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
                    <FaFileMedicalAlt />
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
                    <FaClipboardList />
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

          {role === "Clinical Reports" && (
            <>
              <SidebarNavLink
                to="/ClinicalDashboard"
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
                to="/ClinicalPatientOverview"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                    <FaFileMedicalAlt />
                  </IconWrapper>
                Report Dashboard
              </SidebarNavLink>

              <SidebarNavLink
                to="/ClinicalLedgerBalance"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                    <FaBalanceScale />
                  </IconWrapper>
                Ledger Balance
              </SidebarNavLink>


              <SidebarNavLink
                to="/CustomerComplaints"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                    <FaHeadset />
                  </IconWrapper>
                Customer Complaints
              </SidebarNavLink>
            </>
          )}

          {role === "Marketting AVP" && (
            <>
              <SidebarNavLink
                to="/CustomerComplaints"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconWrapper>
                    <FaHeadset />
                  </IconWrapper>
                Customer Complaints
              </SidebarNavLink>
            </>
          )}


          {role === "TeleCalling" && (
            <>
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

