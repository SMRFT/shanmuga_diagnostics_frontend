import styled, { keyframes, css } from "styled-components";
import {
    Calendar,
    ChevronDown,
    ArrowDown,
    PencilIcon,
    Filter,
    Trash2,
    Download,
    Search,
    CreditCard,
    X,
    RefreshCw,
    Users,
    Calculator,
    Printer,
    CheckCircle,
    AlertCircle
} from "lucide-react";

// Import header and footer images
import headerImage from "../Images/Header.png";
import FooterImage from "../Images/Footer.png";

// Enhanced animations
export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
`;

export const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const bounceArrow = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

export const Container = styled.div`
  padding: 32px;
  background: #f8fafc;
  min-height: 100vh;
  animation: ${fadeIn} 0.5s ease-out;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 32px;
  animation: ${fadeIn} 0.6s ease-out;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
  font-family: "Poppins", sans-serif;
  letter-spacing: 1px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    border-radius: 3px;
  }
`;

export const Subtitle = styled.p`
  color: #64748b;
  font-size: 18px;
  font-weight: 500;
  max-width: 600px;
  line-height: 1.6;
  font-family: "Inter", sans-serif;
  margin-top: 16px;
`;

export const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
  animation: ${fadeIn} 0.7s ease-out;
`;

export const Tab = styled.button`
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  background: none;
  border: none;
  border-bottom: 3px solid
    ${(props) => (props.$active ? "#3b82f6" : "transparent")};
  color: ${(props) => (props.$active ? "#3b82f6" : "#64748b")};
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &:hover {
    color: ${(props) => (props.$active ? "#3b82f6" : "#1e293b")};
  }

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    transform: translateX(${(props) => (props.$active ? "0" : "-100%")});
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: translateX(0);
  }
`;

export const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;
  gap: 20px;
  flex-wrap: wrap;
  animation: ${fadeIn} 0.8s ease-out;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

export const DateFilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 340px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 32px;
    width: 1px;
    background: #e2e8f0;
  }
`;

export const DateInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
`;

export const DateInput = styled.input`
  padding: 12px 16px;
  padding-left: 42px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  width: 100%;
  transition: all 0.3s;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: white;
  }

  &:hover {
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }
`;

export const StyledCalendarIcon = styled(Calendar)`
  position: absolute;
  left: 12px;
  color: #64748b;
  width: 20px;
  height: 20px;
  transition: color 0.3s;

  ${DateInputWrapper}:hover & {
    color: #3b82f6;
  }
`;

export const SelectWrapper = styled.div`
  position: relative;
  min-width: 240px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-1px);
  }
`;

export const Select = styled.select`
  appearance: none;
  padding: 12px 16px;
  padding-right: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  width: 100%;
  background-color: #f8fafc;
  cursor: pointer;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: white;
  }

  &:hover {
    border-color: #cbd5e1;
  }
`;

export const StyledChevronDown = styled(ChevronDown)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  width: 20px;
  height: 20px;
  pointer-events: none;
  transition: transform 0.3s;

  ${SelectWrapper}:hover & {
    color: #3b82f6;
    transform: translateY(-50%) rotate(-180deg);
  }
`;

export const Button = styled.button`
  background: ${(props) =>
        props.$primary ? "linear-gradient(90deg, #3b82f6, #60a5fa)" : "#fff"};
  color: ${(props) => (props.$primary ? "#fff" : "#3b82f6")};
  padding: 12px 20px;
  border: 1px solid ${(props) => (props.$primary ? "#3b82f6" : "#e2e8f0")};
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.4),
      rgba(255, 255, 255, 0.1)
    );
    transition: all 0.5s;
  }

  &:hover {
    background: ${(props) =>
        props.$primary ? "linear-gradient(90deg, #2563eb, #3b82f6)" : "#f8fafc"};
    border-color: ${(props) => (props.$primary ? "#2563eb" : "#cbd5e1")};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px
      rgba(59, 130, 246, ${(props) => (props.$primary ? "0.3" : "0.1")});

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px
      rgba(59, 130, 246, ${(props) => (props.$primary ? "0.2" : "0.05")});
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }

  ${(props) =>
        props.$loading &&
        css`
      position: relative;
      color: transparent !important;
      pointer-events: none;

      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid
          ${props.$primary ? "rgba(255,255,255,0.2)" : "rgba(59,130,246,0.2)"};
        border-top-color: ${props.$primary ? "#ffffff" : "#3b82f6"};
        border-radius: 50%;
        animation: ${rotate} 0.8s linear infinite;
      }
    `}
`;

// New Invoice Success Banner
export const InvoiceSuccessBanner = styled.div`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 20px 24px;
  border-radius: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${fadeIn} 0.5s ease-out;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.2);
`;

export const BannerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

export const BannerText = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }

  p {
    font-size: 14px;
    opacity: 0.9;
    margin: 0;
  }
`;

export const BannerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ArrowPointer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  animation: ${fadeIn} 0.6s ease-out;
`;

export const ArrowIcon = styled(ArrowDown)`
  color: #3b82f6;
  width: 32px;
  height: 32px;
  animation: ${bounceArrow} 2s infinite;
  filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3));
`;

export const ArrowText = styled.p`
  color: #3b82f6;
  font-size: 14px;
  font-weight: 600;
  margin: 8px 0 0 0;
  text-align: center;
`;

export const TableContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;
  overflow: hidden;
  animation: ${fadeIn} 0.9s ease-out;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const TableTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #3b82f6;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 800px;
`;

export const Th = styled.th`
  background: #f8fafc;
  color: #475569;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
  transition: all 0.3s;

  &:first-child {
    border-top-left-radius: 12px;
  }

  &:last-child {
    border-top-right-radius: 12px;
  }

  &:hover {
    background: #f1f5f9;
    color: #3b82f6;
  }
`;

export const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
  font-size: 14px;
  transition: all 0.3s;

  ${(props) =>
        props.$amount &&
        `
    font-weight: 600;
    color: #059669;
  `}

  ${(props) =>
        props.$pending &&
        `
    font-weight: 600;
    color: #e11d48;
  `}
`;

export const TableRow = styled.tr`
  transition: all 0.3s;
  animation: ${fadeIn} 0.5s ease-out;

  &:hover {
    background: #f8fafc;
    transform: translateX(4px);
    box-shadow: -4px 0 0 0 #3b82f6;
  }
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #3b82f6;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f1f5f9;
    color: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
  }
`;

export const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AmountInput = styled.input`
  padding: 10px 14px;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  font-size: 14px;
  width: 140px;
  font-weight: 600;
  color: #059669;
  transition: all 0.3s;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    transform: scale(1.02);
  }

  &:hover {
    border-color: #2563eb;
  }
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;

  &:checked {
    background-color: #3b82f6;
    border-color: #3b82f6;
    animation: ${pulse} 0.5s;
  }

  &:hover {
    border-color: #3b82f6;
    transform: scale(1.1);
  }
`;

export const ScrollContainer = styled.div`
  overflow-x: auto;
  border-radius: 12px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    transition: background 0.3s;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

export const Badge = styled.span`
  padding: 4px 8px;
  background: ${(props) => (props.$primary ? "#dbeafe" : "#f1f5f9")};
  color: ${(props) => (props.$primary ? "#2563eb" : "#475569")};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    background: ${(props) => (props.$primary ? "#bfdbfe" : "#e2e8f0")};
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

export const SearchInput = styled.input`
  width: 50%;
  max-width: 300px;
  padding: 12px 16px;
  padding-left: 42px;
  border: 3px solid #e2e8f0;
  border-radius: 30px;
  font-size: 14px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    width: 60%;
    max-width: 400px;
  }

  &:hover {
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  transition: all 0.3s;

  ${SearchContainer}:hover & {
    color: #3b82f6;
    transform: translateY(-50%) scale(1.1);
  }
`;

export const TabContent = styled.div`
  display: ${(props) => (props.$active ? "block" : "none")};
  animation: ${fadeIn} 0.5s ease-out;
`;

// Modal Components
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 0;
  position: relative;
  animation: ${fadeIn} 0.4s ease-out;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

export const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #3b82f6;
  }
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
    transform: rotate(90deg);
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
`;

export const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  position: sticky;
  bottom: 0;
  background: white;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;

export const ModalSection = styled.div`
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s ease-out;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ModalSectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #3b82f6;
    transition: transform 0.3s;
  }

  &:hover svg {
    transform: rotate(15deg);
  }
`;

export const AmountCard = styled.div`
  background: ${(props) => props.$color || "#f8fafc"};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  transition: all 0.3s;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: ${(props) => {
        if (props.$color === "#f0f9ff") return "#93c5fd";
        if (props.$color === "#f0fff4") return "#86efac";
        if (props.$color === "#fff5f5") return "#fca5a5";
        if (props.$color === "#fffbeb") return "#fbbf24";
        return "#e2e8f0";
    }};
  }
`;

export const AmountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => (props.$noMargin ? "0" : "12px")};
`;

export const AmountLabel = styled.span`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
`;

export const AmountValue = styled.div`
  font-size: ${(props) => (props.$large ? "24px" : "16px")};
  font-weight: 700;
  color: ${(props) => props.$color || "#334155"};
  transition: all 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
`;

export const EmptyStateIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;

  svg {
    width: 40px;
    height: 40px;
    color: #94a3b8;
  }
`;

export const EmptyStateTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
`;

export const EmptyStateText = styled.p`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 20px;
  max-width: 400px;
`;

export const RefreshButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s;

  &:hover {
    background: #f1f5f9;
    transform: translateY(-1px);
  }

  svg {
    transition: transform 0.3s;
  }

  &:hover svg {
    transform: rotate(180deg);
  }

  ${(props) =>
        props.$loading &&
        css`
      pointer-events: none;

      svg {
        animation: ${rotate} 1s linear infinite;
      }
    `}
`;

// New styled components for proportional credit distribution
export const ProportionalCreditContainer = styled.div`
  background: #f0f9ff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  animation: ${fadeIn} 0.5s ease-out;
`;

export const ProportionalTitle = styled.h4`
  color: #1e40af;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    transition: transform 0.3s;
  }

  &:hover svg {
    transform: rotate(15deg);
  }
`;

export const ProportionalItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed #bfdbfe;
  transition: all 0.3s;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:hover {
    background: rgba(59, 130, 246, 0.05);
    padding: 12px 8px;
    border-radius: 6px;
    margin: 0 -8px;
  }
`;

export const ProportionalPatient = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PatientName = styled.span`
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
`;

export const PatientId = styled.span`
  font-size: 12px;
  color: #64748b;
`;

export const ProportionalAmount = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
`;

export const OriginalAmount = styled.span`
  color: #64748b;
  text-decoration: line-through;
`;

export const NewAmount = styled.span`
  color: #059669;
`;

export const PaymentInputRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
  animation: ${slideIn} 0.3s ease-out;
`;

export const PaymentLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  min-width: 120px;
  transition: color 0.3s;

  ${PaymentInputRow}:hover & {
    color: #3b82f6;
  }
`;

export const PaymentMethodSelect = styled.select`
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  max-width: 200px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover {
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }
`;

export const PaymentDetailsInput = styled.input`
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  max-width: 300px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover {
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }
`;

// Payment History Components
export const PaymentHistoryContainer = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  animation: ${fadeIn} 0.5s ease-out;
`;

export const PaymentHistoryTitle = styled.h4`
  color: #334155;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PaymentHistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed #cbd5e1;
  transition: all 0.3s;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:hover {
    background: rgba(59, 130, 246, 0.05);
    padding: 12px 8px;
    border-radius: 6px;
    margin: 0 -8px;
  }
`;

// Enhanced Print Styles - Single Page Only with Header/Footer Images
export const PrintContainer = styled.div`
  display: none;

  @media print {
    display: block !important;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: white;
    z-index: 9999;
    padding: 0;
    margin: 0;
    font-family: "Arial", sans-serif;
    color: #000 !important;
    overflow: hidden;

    * {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
      print-color-adjust: exact !important;
      page-break-inside: avoid !important;
      page-break-after: avoid !important;
      page-break-before: avoid !important;
    }
  }

  @page {
    size: A4;
    margin: 5mm;
    page-break-after: avoid;
  }
`;

export const PrintPage = styled.div`
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 8mm 10mm 15mm 10mm;
  box-sizing: border-box;
  position: relative;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media print {
    margin: 0;
    padding: 8mm 10mm 15mm 10mm;
    box-shadow: none;
    width: 100%;
    height: auto;
    min-height: 100vh;
    max-width: none;
    overflow: visible;
  }
`;

export const PrintHeaderImage = styled.div`
  width: 100%;
  height: 60px;
  background-image: url(${headerImage});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  margin-bottom: 10px;
  flex-shrink: 0;

  @media print {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
`;

export const PrintFooterImage = styled.div`
  width: 100%;
  height: 50px;
  background-image: url(${FooterImage});
  background-size: contain;
  background-position: center bottom;
  background-repeat: no-repeat;
  border-radius: 8px;
  margin-top: 20px;
  flex-shrink: 0;
  page-break-inside: avoid;

  @media print {
    margin-top: 20px;
    page-break-inside: avoid;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
`;

export const PrintInvoiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding: 10px 0;
  border-bottom: 2px solid #e2e8f0;
  flex-shrink: 0;
`;

export const PrintInvoiceTitle = styled.div`
  text-align: left;
`;

export const PrintInvoiceNumber = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #2563eb;
  margin: 0 0 5px 0;
  letter-spacing: 1px;
`;

export const PrintInvoiceSubtitle = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
`;

// Print Stats Section - Overall Statistics
export const PrintStatsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  margin: 15px 0;
  flex-shrink: 0;
`;

export const PrintStatCard = styled.div`
  background: #f0f9ff;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  padding: 15px;
  text-align: center;

  @media print {
    background: #f0f9ff !important;
    border: 2px solid #3b82f6 !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
`;

export const PrintStatTitle = styled.h3`
  font-size: 14px;
  font-weight: bold;
  color: #1e40af;
  margin: 0 0 8px 0;
`;

export const PrintStatValue = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 4px;
`;

export const PrintStatSubtext = styled.div`
  font-size: 11px;
  color: #64748b;
`;

export const PrintSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin: 15px 0;
  flex: 1;
  min-height: 0;
`;

export const PrintSummaryBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 15px;

  @media print {
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
`;

export const PrintSummaryTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  color: #1e293b;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "●";
    color: #3b82f6;
    font-size: 12px;
  }
`;

export const PrintSummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  padding: 4px 0;
  border-bottom: 1px dotted #cbd5e1;

  &:last-child {
    margin-bottom: 0;
    padding-top: 8px;
    border-top: 2px solid #3b82f6;
    border-bottom: none;
    font-weight: bold;
    font-size: 14px;
    color: #1e40af;
  }

  span:first-child {
    color: #64748b;
    font-weight: 500;
  }

  span:last-child {
    color: #1e293b;
    font-weight: 600;
  }
`;

// Regeneration Prompt Component
export const RegenerationPrompt = styled.div`
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  padding: 20px 24px;
  border-radius: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${fadeIn} 0.5s ease-out;
  box-shadow: 0 4px 20px rgba(251, 191, 36, 0.2);
`;

// Add these styled components after the existing ones
export const CollapsibleHeader = styled.div`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(16, 185, 129, 0.3);
  }
`;

export const CollapsibleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

export const CollapsibleText = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }

  p {
    font-size: 14px;
    opacity: 0.9;
    margin: 0;
  }
`;

export const CollapsibleArrow = styled(ArrowDown)`
  color: white;
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
  transform: ${(props) =>
        props.$expanded ? "rotate(180deg)" : "rotate(0deg)"};
`;

export const CollapsibleBody = styled.div`
  overflow: hidden;
  transition: all 0.3s ease;
  max-height: ${(props) => (props.$expanded ? "2000px" : "0")};
  opacity: ${(props) => (props.$expanded ? "1" : "0")};
  margin-bottom: ${(props) => (props.$expanded ? "24px" : "0")};
`;

export const PatientListToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  opacity: 0.9;
`;

// Payment History Model Components
export const PaymentHistoryModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
  backdrop-filter: blur(4px);
`;

export const PaymentHistoryContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.4s ease-out;
`;

export const PaymentHistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

export const PaymentHistoryBody = styled.div`
  padding: 24px;
`;

export const PaymentHistoryCard = styled.div`
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  animation: ${slideIn} 0.3s ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const PaymentHistoryCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const PaymentHistoryDate = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PaymentDatePrimary = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
`;

export const PaymentDateSecondary = styled.span`
  font-size: 12px;
  color: #64748b;
`;

export const PaymentHistoryAmount = styled.div`
  text-align: right;
`;

export const PaymentAmountPrimary = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #059669;
  margin-bottom: 4px;
`;

export const PaymentAmountSecondary = styled.div`
  font-size: 12px;
  color: #64748b;
`;

export const PaymentHistoryDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
`;

export const PaymentDetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PaymentDetailLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const PaymentDetailValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #334155;
`;

export const PaymentMethodBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${(props) => {
        switch (props.$method) {
            case "Cash":
                return "#fef3c7";
            case "Bank Transfer":
                return "#dbeafe";
            case "UPI":
                return "#dcfce7";
            case "Credit Card":
                return "#fce7f3";
            case "Cheque":
                return "#f3e8ff";
            default:
                return "#f1f5f9";
        }
    }};
  color: ${(props) => {
        switch (props.$method) {
            case "Cash":
                return "#92400e";
            case "Bank Transfer":
                return "#1e40af";
            case "UPI":
                return "#166534";
            case "Credit Card":
                return "#be185d";
            case "Cheque":
                return "#7c3aed";
            default:
                return "#475569";
        }
    }};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid
    ${(props) => {
        switch (props.$method) {
            case "Cash":
                return "#fbbf24";
            case "Bank Transfer":
                return "#3b82f6";
            case "UPI":
                return "#10b981";
            case "Credit Card":
                return "#ec4899";
            case "Cheque":
                return "#8b5cf6";
            default:
                return "#cbd5e1";
        }
    }};
`;

export const PaymentHistoryProgress = styled.div`
  background: #f1f5f9;
  border-radius: 8px;
  padding: 12px;
  margin-top: 16px;
`;

export const PaymentProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
`;

export const PaymentProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
`;

export const PaymentProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 4px;
  transition: width 0.5s ease;
  width: ${(props) => props.$percentage}%;
`;

export const PaymentHistoryStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const PaymentStatCard = styled.div`
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border: 1px solid #0ea5e9;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(14, 165, 233, 0.2);
  }
`;

export const PaymentStatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #0c4a6e;
  margin-bottom: 4px;
`;

export const PaymentStatLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #0369a1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const EmptyPaymentHistory = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

export const EmptyPaymentIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  svg {
    width: 40px;
    height: 40px;
    color: #94a3b8;
  }
`;

export const EmptyPaymentTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
`;

export const EmptyPaymentText = styled.p`
  font-size: 14px;
  color: #64748b;
  max-width: 400px;
  line-height: 1.5;
`;

