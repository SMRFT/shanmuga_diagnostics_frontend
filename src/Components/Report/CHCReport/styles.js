import styled, { createGlobalStyle } from "styled-components";

// ─── Global styles ────────────────────────────────────────────────────────────
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
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f7fb;
    color: var(--dark);
    line-height: 1.5;
  }
`;

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
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;
export const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-dark);
  font-weight: 600;
  margin: 0;
`;
export const FiltersContainer = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
`;
export const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
export const FilterLabel = styled.label`
  font-size: 0.8rem;
  color: var(--gray);
  font-weight: 500;
`;
export const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  transition: var(--transition);
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;
export const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
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
  margin-top: 1rem;
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
    height: 6px;
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
  min-width: 800px;
`;
export const TableHead = styled.thead`
  background-color: var(--gray-light);
  th {
    padding: 1rem;
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
    padding: 1rem;
    vertical-align: middle;
    font-size: 0.875rem;
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
  background-color: ${(p) => p.color || "var(--gray)"};
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
  background-color: ${(p) => (p.disabled ? "var(--gray-light)" : "white")};
  color: ${(p) => (p.disabled ? "var(--gray)" : "var(--dark)")};
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  transition: var(--transition);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &:hover {
    transform: ${(p) => (p.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(p) =>
    p.disabled ? "0 2px 4px rgba(0,0,0,0.1)" : "0 4px 8px rgba(0,0,0,0.1)"};
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
  background-color: ${(p) =>
    p.gender === "Female" ? "rgba(232,62,140,0.1)" : "rgba(0,123,255,0.1)"};
  color: ${(p) => (p.gender === "Female" ? "#E83E8C" : "#007BFF")};
`;
export const ExportButton = styled(Button)`
  background-color: #10b981;
  &:hover:not(:disabled) {
    background-color: #059669;
  }
`;
export const OverallPrintButton = styled(Button)`
  background-color: #8b5cf6;
  &:hover:not(:disabled) {
    background-color: #7c3aed;
  }
  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }
`;
export const InvestigationStatusDisplay = styled.div`
  font-size: 13px;
  color: #333;
  line-height: 1.6;
  white-space: pre-line;
  padding: 8px 0;
  @keyframes blink {
    0%,
    49% {
      opacity: 1;
    }
    50%,
    100% {
      opacity: 0.3;
    }
  }
  .pending-label {
    color: #ff0000;
    font-weight: 600;
    animation: blink 1s infinite;
    margin-left: 8px;
  }
  .all-approved {
    color: #69b444ff;
    font-weight: 600;
  }
`;

export const StyledCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--primary);
  border-radius: 3px;
`;
export const SelectionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1.5rem;
  background: #eff6ff;
  border-bottom: 1px solid #bfdbfe;
  font-size: 0.875rem;
  color: var(--primary-dark);
  font-weight: 500;
`;
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--gray-light);
`;
export const StatCard = styled.div`
  background-color: var(--light);
  border-radius: var(--border-radius);
  padding: 1rem 1.25rem;
`;
export const StatLabel = styled.p`
  font-size: 0.8rem;
  color: var(--gray);
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  gap: 6px;
`;
export const StatDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(p) => p.color};
  flex-shrink: 0;
`;
export const StatValue = styled.p`
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0;
  color: ${(p) => p.color || "var(--dark)"};
  line-height: 1;
`;
export const StatSub = styled.p`
  font-size: 0.75rem;
  color: var(--gray);
  margin: 5px 0 0;
`;

export const ManualNameList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
export const ManualNameRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--gray);
`;
export const ManualNameCount = styled.span`
  font-weight: 600;
  color: var(--primary-dark);
  background: var(--gray-light);
  border-radius: 10px;
  padding: 1px 7px;
  font-size: 0.7rem;
`;

// ── PrintDropdown: just a relative wrapper for the trigger button ─────────────
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
