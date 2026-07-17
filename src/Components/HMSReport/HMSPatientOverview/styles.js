// Styled-components used by HMSPatientOverview.
// Extracted verbatim from the original monolithic HMSPatientOverview.js
// (no styling changes — purely relocated).
import styled, { createGlobalStyle } from "styled-components";

// Global styles
export const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #4361ee;
    --primary-light: #4895ef;
    --primary-dark: #3a0ca3;
    --secondary: #3f37c9;
    --success: #4cc9f0;
    --danger: #f72585;
    --warning: #f8961e;
    --info: #90e0ef;
    --light: #f8f9fa;
    --dark: #212529;
    --gray: #6c757d;
    --gray-light: #e9ecef;
    --border-radius: 8px;
    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f7fb;
    color: var(--dark);
    line-height: 1.5;
  }
`;

// Container for the main content
export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Card = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  margin-bottom: 2rem;
`;

export const CardHeader = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-dark);
  font-weight: 600;
  margin: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--gray-light);
`;

export const FiltersContainer = styled.div`
  padding: 0.4rem 1rem;
  border-bottom: 1px solid var(--gray-light);
`;

export const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.35rem;
  margin-bottom: 0.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

export const FilterLabel = styled.label`
  font-size: 0.7rem;
  color: var(--gray);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

export const FilterInput = styled.input`
  padding: 0.25rem 0.4rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.775rem;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;
export const BarcodeSearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  width: 100%;
`;

export const StepButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  flex-shrink: 0;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  background: white;
  color: var(--primary);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  line-height: 1;
  &:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    box-shadow: 0 2px 8px rgba(67, 97, 238, 0.4);
  }
  &:active {
    transform: scale(0.95);
  }
`;

export const FilterSelect = styled.select`
  padding: 0.25rem 0.4rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.775rem;
  transition: var(--transition);
  background-color: white;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.4rem;
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-dark);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.3);
  }
`;

export const ClearButton = styled(Button)`
  background-color: var(--light);
  color: var(--dark);

  &:hover {
    background-color: var(--gray-light);
  }
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  transform: rotateX(180deg);

  &::-webkit-scrollbar {
    width: 6px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--gray-light);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--gray);
    border-radius: 20px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  transform: rotateX(180deg);
`;

export const TableHead = styled.thead`
  background-color: var(--gray-light);

  th {
    padding: 0.5rem 0.6rem;
    text-align: left;
    font-weight: 600;
    color: var(--gray);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
`;

export const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--gray-light);

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: rgba(67, 97, 238, 0.05);
    }
  }

  td {
    padding: 0.5rem 0.6rem;
    vertical-align: middle;
    font-size: 0.825rem;
  }
`;

export const NoData = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray);
  font-style: italic;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${(props) => props.color || "var(--gray)"};
  color: white;
`;

export const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
  background-color: ${(props) =>
    props.disabled ? "var(--gray-light)" : "white"};
  color: ${(props) => (props.disabled ? "var(--gray)" : "var(--dark)")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: var(--transition);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
    props.disabled
      ? "0 2px 4px rgba(0, 0, 0, 0.1)"
      : "0 4px 8px rgba(0, 0, 0, 0.1)"};
  }
`;

export const CreditAmount = styled.span`
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const GenderIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  margin-right: 0.5rem;
  background-color: ${(props) =>
    props.gender === "Female"
      ? "rgba(232, 62, 140, 0.1)"
      : "rgba(0, 123, 255, 0.1)"};
  color: ${(props) => (props.gender === "Female" ? "#E83E8C" : "#007BFF")};
`;

export const PrintDropdown = styled.div`
  position: relative;
  &::after {
    content: "";
    position: fixed;
    width: 210px;
    height: 10px;
    left: ${(p) => p.left || 0}px;
    top: ${(p) => p.top || 0}px;
    z-index: 9998;
    pointer-events: auto;
    background: transparent;
  }
`;
export const PortalDropdownMenu = styled.div`
  position: fixed;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  min-width: 200px;
  z-index: 9999;
  overflow: hidden;
  border: 1px solid #e9ecef;
  // Bridge the gap with invisible top padding
  padding-top: 6px;
  margin-top: -6px;
`;

export const DropdownItem = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  border: none;
  background-color: white;
  color: black;
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--gray-light);
  }
`;

export const NavigationContainer = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 2px solid #f0f0f0;
`;

export const NavigationTab = styled.button`
  padding: 12px 24px;
  border: none;
  background: ${(props) =>
    props.active ? "var(--primary-dark)" : "transparent"};
  color: ${(props) => (props.active ? "white" : "#666")};
  font-weight: ${(props) => (props.active ? "600" : "400")};
  font-size: 14px;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  margin-right: 4px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: ${(props) => (props.active ? "#0056b3" : "#f8f9fa")};
    color: ${(props) => (props.active ? "white" : "#333")};
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${(props) => (props.active ? "#ccc" : "transparent")};
  }
`;

export const DepartmentBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
  background-color: ${(props) => (props.isPending ? "white" : props.color)};
  color: ${(props) => (props.isPending ? "#dc3545" : "white")};
  border: ${(props) => (props.isPending ? "2px solid #dc3545" : "none")};
  animation: ${(props) => (props.isPending ? "blink 1s infinite" : "none")};

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
`;

export const DepartmentCell = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  max-width: 320px;
`;

export const DepartmentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: nowrap;
`;

export const DepartmentPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  background-color: ${(props) => (props.isPending ? "rgba(220, 53, 69, 0.1)" : props.color)};
  color: ${(props) => (props.isPending ? "#dc3545" : "white")};
  border: 1px solid ${(props) => (props.isPending ? "#dc3545" : "transparent")};
  animation: ${(props) => (props.isPending ? "blink 1s infinite" : "none")};
  white-space: nowrap;

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  position: relative;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--gray-light);
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--primary-dark);
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--gray);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition);

  &:hover {
    background-color: var(--gray-light);
    color: var(--dark);
  }
`;

export const TestStatusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const TestStatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  background-color: ${(props) =>
    props.highlight ? "rgba(67, 97, 238, 0.05)" : "white"};
  transition: var(--transition);

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const TestNameText = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--dark);
  flex: 1;
`;

export const StatusBadgeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const TATIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  min-width: 120px;
  justify-content: center;
  background-color: ${(props) => {
    if (!props.secondsLeft && props.secondsLeft !== 0) return "transparent";
    if (props.secondsLeft < 0) return "#dc3545"; // Red - Overdue
    if (props.secondsLeft < 7200) return "#ffc107"; // Yellow - Critical (less than 2 hours)
    return "#28a745"; // Green - On track
  }};
  color: ${(props) => (props.secondsLeft !== null ? "white" : "var(--gray)")};
`;

export const TATText = styled.span`
  white-space: nowrap;
  font-family: "Courier New", monospace;
  letter-spacing: 0.5px;
`;

export const TATLabel = styled.div`
  font-size: 0.7rem;
  opacity: 0.9;
`;
