"use client";

import { useState, useEffect } from "react";
import {
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
  ArrowDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
// Import styled components
import styled, { keyframes, css } from "styled-components";
import { Calendar, ChevronDown } from "lucide-react";

// Import header and footer images
import headerImage from "../Images/Header.png";
import FooterImage from "../Images/Footer.png";

// Enhanced animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
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

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const bounceArrow = keyframes`
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
  height: 297mm;
  margin: 0 auto;
  padding: 5mm;
  box-sizing: border-box;
  position: relative;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  page-break-after: avoid;
  page-break-inside: avoid;

  @media print {
    margin: 0;
    padding: 5mm;
    box-shadow: none;
    width: 100%;
    height: 100vh;
    max-width: none;
    max-height: none;
    overflow: hidden;
  }
`;

export const PrintHeaderImage = styled.div`
  width: 100%;
  height: 60px;
  background-image: url(${headerImage});
  background-size: cover;
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
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  margin-top: auto;
  flex-shrink: 0;

  @media print {
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

const B2BPatients = () => {
  const [activeTab, setActiveTab] = useState("generate");
  const [patients, setPatients] = useState([]);
  const [clinicalNames, setClinicalNames] = useState([]);
  const [selectedClinicalName, setSelectedClinicalName] = useState("");
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printInvoice, setPrintInvoice] = useState(null);
  const [lastGeneratedInvoice, setLastGeneratedInvoice] = useState(null);
  const [showInvoiceSuccess, setShowInvoiceSuccess] = useState(false);
  const [loading, setLoading] = useState({
    patients: false,
    invoices: true,
    clinicalNames: true,
    generateInvoice: false,
    updateInvoice: false,
    refreshData: false,
  });

  const [showPatientList, setShowPatientList] = useState(false);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [selectedInvoiceForHistory, setSelectedInvoiceForHistory] =
    useState(null);

  const Labbaseurl =
    process.env.REACT_APP_BACKEND_LAB_BASE_URL || "http://localhost:8000/api/";

  useEffect(() => {
    fetchClinicalNames();
    fetchInvoices();
  }, []);

  useEffect(() => {
    if (selectedClinicalName) {
      fetchPatients();
    } else {
      setPatients([]);
    }
  }, [selectedClinicalName, fromDate, toDate]);

const fetchClinicalNames = async () => {
  try {
    setLoading((prev) => ({ ...prev, clinicalNames: true }));

    const token = localStorage.getItem("access_token"); // adjust key if different
    const branch = localStorage.getItem("selected_branch");

    const response = await axios.get(
      `${Labbaseurl}get_clinicalname_invoice/`,
      {
        headers: {
          Authorization: token,
          "Branch-Code": branch,
          "Content-Type": "application/json",
        },
      }
    );

    const carryCredits = response.data.filter(
      (clinical) => clinical.b2bType === "Credit"
    );

    setClinicalNames(carryCredits);
  } catch (error) {
    console.error("Error fetching clinical names:", error);
    toast.error("Failed to load clinical names", { autoClose: 3000 });
  } finally {
    setLoading((prev) => ({ ...prev, clinicalNames: false }));
  }
};


const fetchPatients = async () => {
  if (!selectedClinicalName) return;

  try {
    setLoading((prev) => ({ ...prev, patients: true }));

    const token = localStorage.getItem("access_token"); // get token
    const branch = localStorage.getItem("selected_branch"); // or however you store it

    const queryParams = new URLSearchParams();
    queryParams.append("clinical_name", selectedClinicalName);
    queryParams.append("segment", "B2B");
    queryParams.append("min_credit", "0.01");
    if (fromDate) queryParams.append("from_date", fromDate);
    if (toDate) queryParams.append("to_date", toDate);

    const response = await axios.get(
      `${Labbaseurl}all-patients/?${queryParams.toString()}`,
      {
        headers: {
          Authorization: token,
          "Branch-Code": branch,
          "Content-Type": "application/json",
        },
      }
    );

    const filteredData = response.data.filter(
      (patient) =>
        patient.segment === "B2B" && Number(patient.credit_amount) > 0
    );

    setPatients(filteredData);
  } catch (error) {
    console.error("Error fetching patients:", error);
    toast.error("Failed to load patients data", { autoClose: 3000 });
  } finally {
    setLoading((prev) => ({ ...prev, patients: false }));
  }
};


const fetchInvoices = async () => {
  try {
    setLoading((prev) => ({ ...prev, invoices: true }));

    const token = localStorage.getItem("access_token"); // adjust key if needed
const branch = localStorage.getItem("selected_branch");
    const response = await axios.get(`${Labbaseurl}get-invoices/`, {
      headers: {
        Authorization: ` ${token}`,
        "Branch-Code": branch,
        "Content-Type": "application/json",
      },
    });

    setInvoices(response.data);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    toast.error("Failed to load invoices data", { autoClose: 3000 });
  } finally {
    setLoading((prev) => ({ ...prev, invoices: false }));
  }
};


  const handleSelectPatient = (patientId) => {
    setSelectedPatients((prev) =>
      prev.includes(patientId)
        ? prev.filter((id) => id !== patientId)
        : [...prev, patientId]
    );
  };

  const handleSelectAll = () => {
    const filteredPatients = getFilteredPatients();
    setSelectedPatients(
      filteredPatients.length === selectedPatients.length
        ? []
        : filteredPatients.map((p) => p.patient_id)
    );
  };

const getFilteredPatients = () => {
  return patients.filter((p) => {
    const recordDate = new Date(p.date);

    const startDate = fromDate ? new Date(fromDate) : null;
    const endDate = toDate ? new Date(toDate) : null;

    // Fix: make endDate include the entire day
    if (endDate) {
      endDate.setHours(23, 59, 59, 999);
    }

    const isDateMatch =
      (!startDate || recordDate >= startDate) &&
      (!endDate || recordDate <= endDate);

    return isDateMatch;
  });
};


  const calculateProportionalCredits = (patients, totalPaid, totalCredit) => {
    const proportionalCredits = [];
    let remainingPaid = Number(totalPaid);
    const totalCreditNum = Number(totalCredit);

    patients.forEach((patient, index) => {
      const patientCredit = Number(patient.credit_amount);
      const proportion = patientCredit / totalCreditNum;

      if (index === patients.length - 1) {
        proportionalCredits.push({
          ...patient,
          proportionalCredit: Math.max(0, remainingPaid).toFixed(2),
          proportion: ((remainingPaid / patientCredit) * 100).toFixed(1),
        });
      } else {
        const proportionalAmount = totalPaid * proportion;
        proportionalCredits.push({
          ...patient,
          proportionalCredit: proportionalAmount.toFixed(2),
          proportion: (proportion * 100).toFixed(1),
        });
        remainingPaid -= proportionalAmount;
      }
    });

    return proportionalCredits;
  };

const handleGenerateInvoice = async () => {
  const selectedData = patients.filter((p) =>
    selectedPatients.includes(p.patient_id)
  );
  if (selectedData.length === 0) {
    toast.warn("Please select at least one patient.", { autoClose: 3000 });
    return;
  }

  if (!selectedClinicalName) {
    toast.warn("Please select a clinical name.", { autoClose: 3000 });
    return;
  }

  setLoading((prev) => ({ ...prev, generateInvoice: true }));
  const totalCreditAmount = selectedData.reduce(
    (sum, p) => sum + Number(p.credit_amount),
    0
  );
    const token = localStorage.getItem("access_token"); // adjust key if needed
const branch = localStorage.getItem("selected_branch");
  const invoiceData = {
    clinicalName: selectedClinicalName,
    generateDate: new Date().toISOString().split("T")[0],
    fromDate,
    toDate,
    // ❌ remove invoiceNumber (let backend handle it)
    totalCreditAmount: totalCreditAmount.toFixed(2),
    paidAmount: "0.00",
    pendingAmount: totalCreditAmount.toFixed(2),
    patients: selectedData,
    paymentDetails: {},
    proportionalCredits: [],
    paymentHistory: [],
  };

  try {
    const response = await axios.post(
      `${Labbaseurl}generate-invoice/`,
      invoiceData,
      {
        headers: {
          Authorization: token,
          "Branch-Code": branch,
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Invoice Generated Successfully!", { autoClose: 3000 });

    // Use response from backend (with invoiceNumber, createdBy, createdAt)
    setLastGeneratedInvoice(response.data);
    setShowInvoiceSuccess(true);

    fetchInvoices();
    setSelectedPatients([]);

    // Auto-hide success banner after 10 seconds
    setTimeout(() => {
      setShowInvoiceSuccess(false);
    }, 10000);
  } catch (error) {
    console.error("Error generating invoice:", error);
    toast.error("Failed to generate invoice. Please try again.", {
      autoClose: 3000,
    });
  } finally {
    setLoading((prev) => ({ ...prev, generateInvoice: false }));
  }
};


  const handleEditInvoice = (invoice) => {
    const paymentDetails = invoice.paymentDetails
      ? typeof invoice.paymentDetails === "string"
        ? JSON.parse(invoice.paymentDetails)
        : invoice.paymentDetails
      : {};

    const paymentHistory = invoice.paymentHistory
      ? typeof invoice.paymentHistory === "string"
        ? JSON.parse(invoice.paymentHistory)
        : invoice.paymentHistory
      : [];

    setEditingInvoice({
      ...invoice,
      newAmount: invoice.totalCreditAmount,
      newPaidAmount: "0.00",
      currentTotalPaid: invoice.paidAmount || "0.00",
      newPendingAmount: invoice.pendingAmount || invoice.totalCreditAmount,
      paymentDate: "",
      paymentMethod: "",
      paymentDetails: "",
      paymentHistory: paymentHistory,
      originalPaidAmount: invoice.paidAmount || "0.00",
      originalPendingAmount: invoice.pendingAmount || invoice.totalCreditAmount,
      originalTotalAmount: invoice.totalCreditAmount,
    });

    setShowEditModal(true);
  };

  const handleUpdateInvoice = async (invoiceNumber) => {
    try {
      setLoading((prev) => ({ ...prev, updateInvoice: true }));

      const totalAmount = Number.parseFloat(editingInvoice.newAmount);
      const currentTotalPaid = Number.parseFloat(
        editingInvoice.currentTotalPaid
      );
      const newPaymentAmount = Number.parseFloat(editingInvoice.newPaidAmount);

      const updatedTotalPaid = currentTotalPaid + newPaymentAmount;
      const pendingAmount = Math.max(0, totalAmount - updatedTotalPaid).toFixed(
        2
      );

      const paymentDetails = {
        paymentDate: editingInvoice.paymentDate || "",
        paymentMethod: editingInvoice.paymentMethod || "",
        paymentAmount: newPaymentAmount.toFixed(2),
        details: editingInvoice.paymentDetails || "",
      };

      const proportionalCredits = calculateProportionalCredits(
        editingInvoice.patients || [],
        updatedTotalPaid,
        totalAmount
      );

      const paymentHistoryEntry = {
        date: new Date().toISOString(),
        paymentAmount: newPaymentAmount.toFixed(2),
        previousTotalPaid: currentTotalPaid.toFixed(2),
        newTotalPaid: updatedTotalPaid.toFixed(2),
        previousPending: editingInvoice.originalPendingAmount,
        newPending: pendingAmount,
        paymentMethod: editingInvoice.paymentMethod,
        paymentDetails: editingInvoice.paymentDetails,
        proportionalCredits: proportionalCredits,
        updatedBy: localStorage.getItem("name") || "System",
      };

      const existingHistory = editingInvoice.paymentHistory || [];
      const updatedHistory = [...existingHistory, paymentHistoryEntry];

await axios.put(
  `${Labbaseurl}update-invoice/${invoiceNumber}/`,
  {
    totalCreditAmount: editingInvoice.newAmount,
    paidAmount: updatedTotalPaid.toFixed(2),
    pendingAmount: pendingAmount,
    paymentDetails: JSON.stringify(paymentDetails),
    paymentHistory: JSON.stringify(updatedHistory),
    proportionalCredits: JSON.stringify(proportionalCredits),
  },
  {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("access_token") || "", // or your token variable
        "Branch-Code": localStorage.getItem("selected_branch") || "",
    },
  }
);


      toast.success("Invoice Updated successfully!", { autoClose: 3000 });

      setInvoices(
        invoices.map((invoice) =>
          invoice.invoiceNumber === invoiceNumber
            ? {
                ...invoice,
                totalCreditAmount: editingInvoice.newAmount,
                paidAmount: updatedTotalPaid.toFixed(2),
                pendingAmount: pendingAmount,
                paymentDetails: paymentDetails,
                paymentHistory: updatedHistory,
                proportionalCredits: proportionalCredits,
              }
            : invoice
        )
      );

      setEditingInvoice(null);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update invoice", { autoClose: 3000 });
    } finally {
      setLoading((prev) => ({ ...prev, updateInvoice: false }));
    }
  };

const handleDeleteInvoice = async (invoiceNumber) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`${Labbaseurl}delete-invoice/${invoiceNumber}/`, {
        headers: {
         Authorization: localStorage.getItem("access_token") || "", // or your token variable
        "Branch-Code": localStorage.getItem("selected_branch") || "",
        "Content-Type": "application/json",
        },
      });

      setInvoices(
        invoices.filter((invoice) => invoice.invoiceNumber !== invoiceNumber)
      );

      Swal.fire("Deleted!", "The invoice has been deleted.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to delete the invoice.", "error");
      console.error("Delete invoice error:", error);
    }
  }
};

  const getFilteredInvoices = () => {
    return invoices.filter((invoice) =>
      (invoice.clinicalName || invoice.labName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setEditingInvoice((prev) => {
      const newTotal = Number.parseFloat(value) || 0;
      const currentTotalPaid = Number.parseFloat(prev.currentTotalPaid) || 0;
      const newPending = Math.max(0, newTotal - currentTotalPaid).toFixed(2);

      return {
        ...prev,
        newAmount: value,
        newPendingAmount: newPending,
      };
    });
  };

  const handleNewPaidAmountChange = (e) => {
    const value = e.target.value;
    setEditingInvoice((prev) => ({
      ...prev,
      newPaidAmount: value,
    }));
  };

  // Enhanced PDF generation - Patient Details Only

const generatePDF = async (invoice) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  let headerImgData = null;
  let footerImgData = null;

  try {
    // Preload header image
    const headerImg = new Image();
    headerImg.crossOrigin = "anonymous";
    headerImgData = await new Promise((resolve, reject) => {
      headerImg.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = headerImg.width;
        canvas.height = headerImg.height;
        ctx.drawImage(headerImg, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      headerImg.onerror = reject;
      headerImg.src = headerImage;
    });

    // Preload footer image
    const footerImg = new Image();
    footerImg.crossOrigin = "anonymous";
    footerImgData = await new Promise((resolve, reject) => {
      footerImg.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = footerImg.width;
        canvas.height = footerImg.height;
        ctx.drawImage(footerImg, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      footerImg.onerror = reject;
      footerImg.src = FooterImage;
    });

    // Add header content to first page
    doc.addImage(headerImgData, "PNG", 10, 10, 190, 30);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("PATIENT DETAILS REPORT", 105, 55, { align: "center" });

    // Invoice details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 14, 70);
    doc.text(
      `Clinical Name: ${invoice.clinicalName || invoice.labName}`,
      14,
      77
    );
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 84);

    if (invoice.fromDate && invoice.toDate) {
      doc.text(
        `Period: ${new Date(
          invoice.fromDate
        ).toLocaleDateString()} - ${new Date(
          invoice.toDate
        ).toLocaleDateString()}`,
        14,
        91
      );
    }

    // Patient Details Table with Test Names
    if (invoice.patients && invoice.patients.length > 0) {
      const tableData = invoice.patients.map((patient, index) => {
        // Parse proportional credits
        const proportionalCredits = invoice.proportionalCredits
          ? typeof invoice.proportionalCredits === "string"
            ? JSON.parse(invoice.proportionalCredits)
            : invoice.proportionalCredits
          : [];

        const proportionalCredit =
          proportionalCredits.find((p) => p.patient_id === patient.patient_id)
            ?.proportionalCredit || "0.00";

        // Format testname properly - extract from array if it's an array and include amount in brackets with numbering

let testNameFormatted = "";

if (Array.isArray(patient.testdetails)) {
  testNameFormatted = patient.testdetails
    .map((test, testIndex) => {
      const amount = test.MRP ? ` (${test.MRP})` : "";
      return `${testIndex + 1}. ${test.test_name || "N/A"}${amount}`;
    })
    .join("\n");
} else if (
  typeof patient.testdetails === "object" &&
  patient.testdetails !== null
) {
  const amount = patient.testdetails.MRP
    ? ` (${patient.testdetails.MRP})`
    : "";
  testNameFormatted = `1. ${patient.testdetails.test_name || "N/A"}${amount}`;
} else {
  testNameFormatted = "N/A";
}


        return [
          (index + 1).toString(),
          patient.patient_id,
          patient.patientname,
          new Date(patient.bill_date).toLocaleDateString(),
          testNameFormatted,
          `${Number.parseFloat(patient.credit_amount).toFixed(2)}`,
          `${proportionalCredit}`,
          `${(
            Number.parseFloat(patient.credit_amount) - proportionalCredit
          ).toFixed(2)}`,
        ];
      });

      // FIXED: Use standalone autoTable function instead of doc.autoTable
      autoTable(doc, {
        startY: 105,
        head: [
          [
            "S.No",
            "Patient ID",
            "Patient Name",
            "Date",
            "Test Name",
            "Net(Rs).",
            "Rec(Rs).",
            "Due(Rs).",
          ],
        ],
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        columnStyles: {
          4: { cellWidth: 50 }, // Test Name column wider
          5: { halign: "right" }, // Net column right aligned
          6: { halign: "right" }, // Received column right aligned
          7: { halign: "right" }, // Due column right aligned
        },
        margin: { top: 20, bottom: 20 },
        pageBreak: "auto",
        showHead: "everyPage",
        didDrawPage: function (data) {
          const pageNumber = data.pageNumber;
          const pageHeight = doc.internal.pageSize.height;
          const pageWidth = doc.internal.pageSize.width;

          // Add header only to first page
          if (pageNumber === 1) {
            // Header is already added above for first page
            // No need to add again here
          }

          // Don't add page numbers here - they will be added later to avoid overlap
        },
      });
    }

    // Summary
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80); // Reset text color
    doc.text("Summary", 14, finalY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Total Patients: ${invoice.patients.length}`, 14, finalY + 7);
    doc.text(
      `Total Original Credit Amount: ${invoice.totalCreditAmount}`,
      14,
      finalY + 14
    );
    doc.text(`Paid: ${invoice.paidAmount || "0.00"}`, 14, finalY + 21);
    doc.text(
      `Pending: ${invoice.pendingAmount || invoice.totalCreditAmount}`,
      14,
      finalY + 28
    );

    // Add footer only to the last page after all content is added
    const totalPages = doc.internal.getNumberOfPages();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    // Go to the last page
    doc.setPage(totalPages);

    // Add footer image
    doc.addImage(footerImgData, "PNG", 10, pageHeight - 40, 190, 25);

    // Add footer text
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0); // Reset to black
    doc.text(
      `Generated on: ${new Date().toLocaleString()} | Patient Details Report`,
      14,
      pageHeight - 10
    );

    // Update page numbers to show total pages
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 5, {
        align: "center",
      });
    }

    doc.save(`Patient-Details-${invoice.invoiceNumber}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF", { autoClose: 3000 });
  }
};

  const handlePrintInvoice = (invoice) => {
    setPrintInvoice(invoice);
    setShowPrintModal(true);

    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleRefreshData = async () => {
    setLoading((prev) => ({ ...prev, refreshData: true }));
    try {
      await Promise.all([
        fetchClinicalNames(),
        fetchPatients(),
        fetchInvoices(),
      ]);
      toast.success("Data refreshed successfully", { autoClose: 2000 });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data", { autoClose: 3000 });
    } finally {
      setLoading((prev) => ({ ...prev, refreshData: false }));
    }
  };

  const calculateInvoiceStats = (invoice) => {
    const patients = invoice.patients || [];
    const totalTests = patients.reduce(
      (sum, patient) => sum + (patient.test_count || 1),
      0
    );
    const totalPatients = patients.length;
    const avgCreditPerPatient =
      totalPatients > 0
        ? Number.parseFloat(invoice.totalCreditAmount) / totalPatients
        : 0;

    return {
      totalPatients,
      totalTests,
      avgCreditPerPatient: avgCreditPerPatient.toFixed(2),
      totalAmount: Number.parseFloat(invoice.totalCreditAmount || 0),
      paidAmount: Number.parseFloat(invoice.paidAmount || 0),
      pendingAmount: Number.parseFloat(
        invoice.pendingAmount || invoice.totalCreditAmount || 0
      ),
      paymentPercentage:
        invoice.totalCreditAmount > 0
          ? (
              (Number.parseFloat(invoice.paidAmount || 0) /
                Number.parseFloat(invoice.totalCreditAmount)) *
              100
            ).toFixed(1)
          : 0,
    };
  };

  // Helper function to safely parse payment history
  const getPaymentHistory = (invoice) => {
    if (!invoice?.paymentHistory) return [];

    try {
      if (typeof invoice.paymentHistory === "string") {
        return JSON.parse(invoice.paymentHistory);
      }
      if (Array.isArray(invoice.paymentHistory)) {
        return invoice.paymentHistory;
      }
      return [];
    } catch (error) {
      console.error("Error parsing payment history:", error);
      return [];
    }
  };

  const handleRegenerateInvoice = () => {
    setShowInvoiceSuccess(false);
    setLastGeneratedInvoice(null);
    // Reset form state
    setSelectedClinicalName("");
    setSelectedPatients([]);
    setFromDate("");
    setToDate("");
  };

  const handleViewGeneratedInvoices = () => {
    setActiveTab("generated");
    setShowInvoiceSuccess(false);
  };

  const handleViewPaymentHistory = (invoice) => {
    setSelectedInvoiceForHistory(invoice);
    setShowPaymentHistoryModal(true);
  };

  const getPaymentHistoryStats = (paymentHistory) => {
    if (!paymentHistory || paymentHistory.length === 0) {
      return {
        totalPayments: 0,
        totalAmount: 0,
        averagePayment: 0,
        lastPaymentDate: null,
        mostUsedMethod: "N/A",
      };
    }

    const totalAmount = paymentHistory.reduce(
      (sum, payment) => sum + Number.parseFloat(payment.paymentAmount || 0),
      0
    );
    const totalPayments = paymentHistory.length;
    const averagePayment = totalPayments > 0 ? totalAmount / totalPayments : 0;

    const lastPayment = paymentHistory[paymentHistory.length - 1];
    const lastPaymentDate = lastPayment ? new Date(lastPayment.date) : null;

    const methodCounts = paymentHistory.reduce((acc, payment) => {
      const method = payment.paymentMethod || "Unknown";
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});

    const mostUsedMethod = Object.keys(methodCounts).reduce(
      (a, b) => (methodCounts[a] > methodCounts[b] ? a : b),
      "N/A"
    );

    return {
      totalPayments,
      totalAmount,
      averagePayment,
      lastPaymentDate,
      mostUsedMethod,
    };
  };

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={3000} />

      <Header>
        <Title>Carry Credit Management</Title>
        <Subtitle>
          Manage carry credit patients and generate proportional invoices for
          clinical names
        </Subtitle>
      </Header>

      <TabsContainer>
        <Tab
          $active={activeTab === "generate"}
          onClick={() => setActiveTab("generate")}
        >
          Generate Invoice
        </Tab>
        <Tab
          $active={activeTab === "generated"}
          onClick={() => setActiveTab("generated")}
        >
          Generated Invoices
        </Tab>
      </TabsContainer>

      <TabContent $active={activeTab === "generate"}>
        {/* Invoice Success Banner */}
        {showInvoiceSuccess && lastGeneratedInvoice && (
          <InvoiceSuccessBanner>
            <BannerContent>
              <CheckCircle size={24} />
              <BannerText>
                <h3>Invoice Generated Successfully!</h3>
                <p>
                  Invoice {lastGeneratedInvoice.invoiceNumber} for{" "}
                  {lastGeneratedInvoice.clinicalName} has been created
                </p>
              </BannerText>
            </BannerContent>
            <BannerActions>
              <Button
                onClick={handleViewGeneratedInvoices}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                View Invoices
              </Button>
              <Button
                onClick={handleRegenerateInvoice}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                Generate Another
              </Button>
              <IconButton
                onClick={() => setShowInvoiceSuccess(false)}
                style={{ color: "white" }}
              >
                <X size={20} />
              </IconButton>
            </BannerActions>
          </InvoiceSuccessBanner>
        )}

        {/* Regeneration Prompt for when no invoice is generated */}
        {!showInvoiceSuccess && !selectedClinicalName && (
          <RegenerationPrompt>
            <BannerContent>
              <AlertCircle size={24} />
              <BannerText>
                <h3>Ready to Generate Invoice</h3>
                <p>
                  Select a clinical name and patients to generate a new carry
                  credit invoice
                </p>
              </BannerText>
            </BannerContent>
            <BannerActions>
              <RefreshButton
                onClick={handleRefreshData}
                $loading={loading.refreshData}
                style={{ color: "white" }}
              >
                <RefreshCw size={16} />
                Refresh Data
              </RefreshButton>
            </BannerActions>
          </RegenerationPrompt>
        )}

        <FiltersRow>
          <SelectWrapper>
            <Select
              value={selectedClinicalName}
              onChange={(e) => setSelectedClinicalName(e.target.value)}
              disabled={loading.clinicalNames}
            >
              <option value="">
                {loading.clinicalNames
                  ? "Loading clinical names..."
                  : "Select Clinical Name (Carry Credit)"}
              </option>
              {clinicalNames.map((clinical) => (
                <option key={clinical.id} value={clinical.clinicalname}>
                  {clinical.clinicalname}
                </option>
              ))}
            </Select>
            <StyledChevronDown />
          </SelectWrapper>

          <DateFilterGroup>
            <DateInputWrapper>
              <StyledCalendarIcon />
              <DateInput
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="From Date"
                disabled={!selectedClinicalName}
              />
            </DateInputWrapper>
            <DateInputWrapper>
              <StyledCalendarIcon />
              <DateInput
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                placeholder="To Date"
                disabled={!selectedClinicalName}
              />
            </DateInputWrapper>
          </DateFilterGroup>

          <Button
            onClick={handleSelectAll}
            disabled={
              !selectedClinicalName || getFilteredPatients().length === 0
            }
          >
            <Filter size={18} />
            {selectedPatients.length === getFilteredPatients().length
              ? "Deselect All"
              : "Select All"}
          </Button>

          {selectedPatients.length > 0 && (
            <Button
              $primary
              onClick={handleGenerateInvoice}
              $loading={loading.generateInvoice}
            >
              Generate Invoice
            </Button>
          )}
          <Button
            onClick={() => {
              const newParams = new URLSearchParams();
              newParams.append("clinical_name", selectedClinicalName);
              newParams.append("segment", "B2B");
              newParams.append("min_credit", "0.01");
              newParams.append("include_invoiced", "true");
              if (fromDate) newParams.append("from_date", fromDate);
              if (toDate) newParams.append("to_date", toDate);

              // Fetch patients including invoiced ones
              axios
                .get(`${Labbaseurl}all-patients/?${newParams.toString()}`)
                .then((response) => {
                  const allData = response.data.filter(
                    (patient) =>
                      patient.segment === "B2B" &&
                      Number(patient.credit_amount) > 0
                  );
                  setPatients(allData);
                  toast.info(
                    "Now showing all patients including invoiced ones",
                    { autoClose: 3000 }
                  );
                })
                .catch((error) => {
                  toast.error("Failed to load all patients", {
                    autoClose: 3000,
                  });
                });
            }}
            disabled={!selectedClinicalName}
            style={{ fontSize: "12px", padding: "8px 12px" }}
          >
            <RefreshCw size={14} />
            Show All Patients
          </Button>
        </FiltersRow>

        {/* Collapsible Patient List - Show when invoice is generated */}
        {showInvoiceSuccess && (
          <>
            <CollapsibleHeader
              onClick={() => setShowPatientList(!showPatientList)}
            >
              <CollapsibleContent>
                <CheckCircle size={20} />
                <CollapsibleText>
                  <h3>Invoice Generated - View Patient Details</h3>
                  <p>
                    Click to {showPatientList ? "hide" : "show"} the{" "}
                    {lastGeneratedInvoice?.patients?.length || 0} patients
                    included in this invoice
                  </p>
                </CollapsibleText>
              </CollapsibleContent>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <PatientListToggle>
                  {showPatientList ? "Hide" : "Show"} Patient List
                </PatientListToggle>
                <CollapsibleArrow $expanded={showPatientList} />
              </div>
            </CollapsibleHeader>

            <CollapsibleBody $expanded={showPatientList}>
              <TableContainer>
                <TableHeader>
                  <TableTitle>
                    <Users size={18} />
                    Generated Invoice Patients -{" "}
                    {lastGeneratedInvoice?.clinicalName}
                  </TableTitle>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <Badge $primary>
                      {lastGeneratedInvoice?.patients?.length || 0} Patients
                    </Badge>
                    <Badge>
                      Total: ₹{lastGeneratedInvoice?.totalCreditAmount}
                    </Badge>
                  </div>
                </TableHeader>

                <ScrollContainer>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Date</Th>
                        <Th>Patient ID</Th>
                        <Th>Patient Name</Th>
                        <Th>Credit Amount</Th>
                        <Th>Status</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {lastGeneratedInvoice?.patients?.map((patient, index) => (
                        <TableRow key={patient.patient_id}>
                          <Td>
                            {new Date(patient.date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </Td>
                          <Td>{patient.patient_id}</Td>
                          <Td>{patient.patientname}</Td>
                          <Td $amount>₹{patient.credit_amount}</Td>
                          <Td>
                            <Badge
                              style={{
                                background: "#dcfce7",
                                color: "#15803d",
                              }}
                            >
                              Invoiced
                            </Badge>
                          </Td>
                        </TableRow>
                      )) || (
                        <tr>
                          <td colSpan={5}>
                            <EmptyState>
                              <EmptyStateTitle>
                                No patients data available
                              </EmptyStateTitle>
                            </EmptyState>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </ScrollContainer>
              </TableContainer>
            </CollapsibleBody>
          </>
        )}

        <TableContainer>
          <TableHeader>
            <TableTitle>
              <Users size={18} />
              Available Patients -{" "}
              {selectedClinicalName || "Select Clinical Name"}
              <span
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  fontWeight: "normal",
                  marginLeft: "8px",
                }}
              >
                (Excluding already invoiced patients)
              </span>
            </TableTitle>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <RefreshButton
                onClick={handleRefreshData}
                $loading={loading.refreshData}
              >
                <RefreshCw size={16} />
                Refresh
              </RefreshButton>
              <Badge $primary>{getFilteredPatients().length} Patients</Badge>
              {selectedPatients.length > 0 && (
                <Badge>{selectedPatients.length} Selected</Badge>
              )}
            </div>
          </TableHeader>

          <ScrollContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Select</Th>
                  <Th>Date</Th>
                  <Th>Patient ID</Th>
                  <Th>Patient Name</Th>
                  <Th>Credit Amount</Th>
                </tr>
              </thead>
              <tbody>
                {loading.patients ? (
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        <Td>
                          <div
                            style={{
                              width: "18px",
                              height: "18px",
                              background: "#f1f5f9",
                              borderRadius: "4px",
                            }}
                          ></div>
                        </Td>
                        <Td>
                          <div
                            style={{
                              width: "80px",
                              height: "14px",
                              background: "#f1f5f9",
                              borderRadius: "4px",
                            }}
                          ></div>
                        </Td>
                        <Td>
                          <div
                            style={{
                              width: "80px",
                              height: "14px",
                              background: "#f1f5f9",
                              borderRadius: "4px",
                            }}
                          ></div>
                        </Td>
                        <Td>
                          <div
                            style={{
                              width: "150px",
                              height: "14px",
                              background: "#f1f5f9",
                              borderRadius: "4px",
                            }}
                          ></div>
                        </Td>
                        <Td>
                          <div
                            style={{
                              width: "60px",
                              height: "14px",
                              background: "#f1f5f9",
                              borderRadius: "4px",
                            }}
                          ></div>
                        </Td>
                      </TableRow>
                    ))
                ) : getFilteredPatients().length > 0 ? (
                  getFilteredPatients().map((patient) => (
                    <TableRow key={patient.patient_id}>
                      <Td>
                        <Checkbox
                          type="checkbox"
                          checked={selectedPatients.includes(
                            patient.patient_id
                          )}
                          onChange={() =>
                            handleSelectPatient(patient.patient_id)
                          }
                        />
                      </Td>
                      <Td>
                        {new Date(patient.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </Td>
                      <Td>{patient.patient_id}</Td>
                      <Td>{patient.patientname}</Td>
                      <Td $amount>₹{patient.credit_amount}</Td>
                    </TableRow>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState>
                        <EmptyStateIcon>
                          <Users size={40} />
                        </EmptyStateIcon>
                        <EmptyStateTitle>
                          {selectedClinicalName
                            ? "No carry credit patients found"
                            : "Select a clinical name"}
                        </EmptyStateTitle>
                        <EmptyStateText>
                          {selectedClinicalName
                            ? "Try adjusting your date filters to see patients with carry credit."
                            : "Please select a clinical name from the dropdown to view carry credit patients."}
                        </EmptyStateText>
                      </EmptyState>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ScrollContainer>
        </TableContainer>
      </TabContent>

      <TabContent $active={activeTab === "generated"}>
        <TableContainer>
          <TableHeader>
            <TableTitle>
              <CreditCard size={18} />
              Generated Carry Credit Invoices
            </TableTitle>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <RefreshButton
                onClick={handleRefreshData}
                $loading={loading.refreshData}
              >
                <RefreshCw size={16} />
                Refresh
              </RefreshButton>
              <Badge>{getFilteredInvoices().length} Invoices</Badge>
            </div>
          </TableHeader>

          <SearchContainer>
            <SearchIconWrapper>
              <Search size={20} />
            </SearchIconWrapper>
            <SearchInput
              type="text"
              placeholder="Search by clinical name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>

          <ScrollContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Invoice Number</Th>
                  <Th>Clinical Name</Th>
                  <Th>Date Range</Th>
                  <Th>Total Amount</Th>
                  <Th>Paid Amount</Th>
                  <Th>Pending Amount</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {loading.invoices ? (
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        <Td>
                          <div
                            style={{
                              width: "80px",
                              height: "14px",
                              background: "#f1f5f9",
                              borderRadius: "4px",
                            }}
                          ></div>
                        </Td>
                        <Td>
                          <div
                            style={{
                              width: "100px",
                              height: "14px",
                              background: "#f1f5f9",
                              borderRadius: "4px",
                            }}
                          ></div>
                        </Td>
                        <Td>
                          <div
                            style={{
                              width: "150px",
                              height: "14px",
                              background: "#f1f5f9",
                              borderRadius: "4px",
                            }}
                          ></div>
                        </Td>
                        <Td>
                          <div
                            style={{
                              width: "60px",
                              height: "14px",
                              background: "#f1f5f9",
                              borderRadius: "4px",
                            }}
                          ></div>
                        </Td>
                        <Td>
                          <div
                            style={{
                              width: "60px",
                              height: "14px",
                              background: "#f1f5f9",
                              borderRadius: "4px",
                            }}
                          ></div>
                        </Td>
                        <Td>
                          <div
                            style={{
                              width: "60px",
                              height: "14px",
                              background: "#f1f5f9",
                              borderRadius: "4px",
                            }}
                          ></div>
                        </Td>
                        <Td>
                          <div
                            style={{
                              width: "120px",
                              height: "14px",
                              background: "#f1f5f9",
                              borderRadius: "4px",
                            }}
                          ></div>
                        </Td>
                      </TableRow>
                    ))
                ) : getFilteredInvoices().length > 0 ? (
                  getFilteredInvoices().map((invoice) => (
                    <TableRow key={invoice.invoiceNumber}>
                      <Td>{invoice.invoiceNumber}</Td>
                      <Td>
                        <Badge>{invoice.clinicalName || invoice.labName}</Badge>
                      </Td>
                      <Td>
                        {invoice.fromDate && invoice.toDate
                          ? `${new Date(
                              invoice.fromDate
                            ).toLocaleDateString()} - ${new Date(
                              invoice.toDate
                            ).toLocaleDateString()}`
                          : "N/A"}
                      </Td>
                      <Td $amount>₹{invoice.totalCreditAmount}</Td>
                      <Td $amount>₹{invoice.paidAmount || "0.00"}</Td>
                      <Td $pending>
                        ₹{invoice.pendingAmount || invoice.totalCreditAmount}
                      </Td>
                      <Td>
                        <ActionContainer>
                          <IconButton
                            onClick={() => handleEditInvoice(invoice)}
                          >
                            <PencilIcon size={18} />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleDeleteInvoice(invoice.invoiceNumber)
                            }
                            style={{ color: "red" }}
                          >
                            <Trash2 size={18} />
                          </IconButton>
                          <IconButton
                            onClick={() => generatePDF(invoice)}
                            style={{ color: "green" }}
                          >
                            <Download size={18} />
                          </IconButton>
                          {/* <IconButton
                            onClick={() => handlePrintInvoice(invoice)}
                            style={{ color: "purple" }}
                          >
                            <Printer size={18} />
                          </IconButton> */}
                          <IconButton
                            onClick={() => handleViewPaymentHistory(invoice)}
                            style={{ color: "#8b5cf6" }}
                            title="View Payment History"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 3v5h5" />
                              <path d="M21 21v-5h-5" />
                              <path d="M21 3a9 9 0 0 0-9 9 9 9 0 0 0-9-9" />
                              <path d="M3 21a9 9 0 0 1 9-9 9 9 0 0 1 9 9" />
                            </svg>
                          </IconButton>
                        </ActionContainer>
                      </Td>
                    </TableRow>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState>
                        <EmptyStateIcon>
                          <CreditCard size={40} />
                        </EmptyStateIcon>
                        <EmptyStateTitle>No invoices found</EmptyStateTitle>
                        <EmptyStateText>
                          {searchQuery
                            ? `No invoices match your search for "${searchQuery}"`
                            : "Generate your first carry credit invoice by selecting patients in the Generate Invoice tab"}
                        </EmptyStateText>
                        {searchQuery && (
                          <Button onClick={() => setSearchQuery("")}>
                            Clear Search
                          </Button>
                        )}
                      </EmptyState>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ScrollContainer>
        </TableContainer>
      </TabContent>

      {/* Edit Modal */}
      {showEditModal && editingInvoice && (
        <ModalOverlay>
          <ModalContainer>
            <ModalHeader>
              <ModalTitle>
                <Calculator size={20} />
                Edit Payment - {editingInvoice.invoiceNumber}
              </ModalTitle>
              <ModalCloseButton onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>

            <ModalBody>
              <ModalSection>
                <ModalSectionTitle>
                  <CreditCard size={18} />
                  Payment Summary
                </ModalSectionTitle>

                <AmountCard $color="#f0f9ff">
                  <AmountRow>
                    <AmountLabel>Total Credit Amount</AmountLabel>
                    <AmountInput
                      type="number"
                      value={editingInvoice.newAmount}
                      onChange={handleAmountChange}
                    />
                  </AmountRow>
                </AmountCard>

                <AmountCard $color="#f0fff4">
                  <AmountRow>
                    <AmountLabel>Already Paid Amount</AmountLabel>
                    <AmountValue $color="#059669">
                      ₹{editingInvoice.currentTotalPaid}
                    </AmountValue>
                  </AmountRow>
                </AmountCard>

                <AmountCard $color="#fffbeb">
                  <AmountRow>
                    <AmountLabel>New Payment Amount</AmountLabel>
                    <AmountInput
                      type="number"
                      value={editingInvoice.newPaidAmount}
                      onChange={handleNewPaidAmountChange}
                      placeholder="Enter new payment amount"
                    />
                  </AmountRow>
                </AmountCard>

                <AmountCard $color="#fff5f5">
                  <AmountRow $noMargin>
                    <AmountLabel>Pending Amount</AmountLabel>
                    <AmountValue $color="#e11d48">
                      ₹
                      {(
                        Number(editingInvoice.newAmount) -
                        Number(editingInvoice.currentTotalPaid) -
                        Number(editingInvoice.newPaidAmount || 0)
                      ).toFixed(2)}
                    </AmountValue>
                  </AmountRow>
                </AmountCard>
              </ModalSection>

              <ModalSection>
                <ModalSectionTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="1"
                      y="4"
                      width="22"
                      height="16"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  Payment Details
                </ModalSectionTitle>

                <PaymentInputRow>
                  <PaymentLabel>Payment Date:</PaymentLabel>
                  <DateInput
                    type="date"
                    value={editingInvoice.paymentDate}
                    onChange={(e) =>
                      setEditingInvoice((prev) => ({
                        ...prev,
                        paymentDate: e.target.value,
                      }))
                    }
                  />
                </PaymentInputRow>

                <PaymentInputRow>
                  <PaymentLabel>Payment Method:</PaymentLabel>
                  <PaymentMethodSelect
                    value={editingInvoice.paymentMethod}
                    onChange={(e) =>
                      setEditingInvoice((prev) => ({
                        ...prev,
                        paymentMethod: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Method</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cheque">Cheque</option>
                  </PaymentMethodSelect>
                </PaymentInputRow>

                <PaymentInputRow>
                  <PaymentLabel>Details:</PaymentLabel>
                  <PaymentDetailsInput
                    type="text"
                    placeholder="Transaction ID, Cheque No, etc."
                    value={editingInvoice.paymentDetails}
                    onChange={(e) =>
                      setEditingInvoice((prev) => ({
                        ...prev,
                        paymentDetails: e.target.value,
                      }))
                    }
                  />
                </PaymentInputRow>
              </ModalSection>

              {editingInvoice.paymentHistory &&
                editingInvoice.paymentHistory.length > 0 && (
                  <ModalSection>
                    <PaymentHistoryContainer>
                      <PaymentHistoryTitle>Payment History</PaymentHistoryTitle>
                      {editingInvoice.paymentHistory.map((payment, index) => (
                        <PaymentHistoryItem key={index}>
                          <PaymentHistoryDate>
                            {new Date(payment.date).toLocaleDateString()}
                          </PaymentHistoryDate>
                          <PaymentHistoryDetails>
                            <div>Payment: ₹{payment.paymentAmount}</div>
                            <div>Method: {payment.paymentMethod}</div>
                            <div>By: {payment.updatedBy}</div>
                          </PaymentHistoryDetails>
                          <PaymentHistoryAmount>
                            Total Paid: ₹{payment.newTotalPaid}
                          </PaymentHistoryAmount>
                        </PaymentHistoryItem>
                      ))}
                    </PaymentHistoryContainer>
                  </ModalSection>
                )}

              {editingInvoice.patients &&
                editingInvoice.patients.length > 0 &&
                Number(editingInvoice.newPaidAmount) > 0 && (
                  <ModalSection>
                    <ProportionalCreditContainer>
                      <ProportionalTitle>
                        <Calculator size={16} />
                        Proportional Credit Distribution (New Payment)
                      </ProportionalTitle>

                      {calculateProportionalCredits(
                        editingInvoice.patients,
                        Number(editingInvoice.newPaidAmount),
                        Number(editingInvoice.newAmount)
                      ).map((patient, index) => (
                        <ProportionalItem key={index}>
                          <ProportionalPatient>
                            <PatientName>{patient.patientname}</PatientName>
                            <PatientId>ID: {patient.patient_id}</PatientId>
                          </ProportionalPatient>
                          <ProportionalAmount>
                            <OriginalAmount>
                              ₹{patient.credit_amount}
                            </OriginalAmount>
                            <span
                              style={{ color: "#3b82f6", fontWeight: "bold" }}
                            >
                              →
                            </span>
                            <NewAmount>₹{patient.proportionalCredit}</NewAmount>
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#64748b",
                                marginLeft: "8px",
                              }}
                            >
                              ({patient.proportion}%)
                            </span>
                          </ProportionalAmount>
                        </ProportionalItem>
                      ))}
                    </ProportionalCreditContainer>
                  </ModalSection>
                )}
            </ModalBody>

            <ModalFooter>
              <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button
                $primary
                onClick={() =>
                  handleUpdateInvoice(editingInvoice.invoiceNumber)
                }
                $loading={loading.updateInvoice}
                disabled={
                  !editingInvoice.newPaidAmount ||
                  Number(editingInvoice.newPaidAmount) <= 0
                }
              >
                Save Payment
              </Button>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* Enhanced Print Modal - Single Page with Overall Stats */}
      {showPrintModal && printInvoice && (
        <>
          <PrintContainer>
            <PrintPage>
              <PrintHeaderImage />

              <PrintInvoiceHeader>
                <PrintInvoiceTitle>
                  <PrintInvoiceNumber>
                    Invoice #{printInvoice.invoiceNumber}
                  </PrintInvoiceNumber>
                  <PrintInvoiceSubtitle>
                    Carry Credit Management - Overall Statistics
                  </PrintInvoiceSubtitle>
                </PrintInvoiceTitle>
                <div>
                  <PrintInvoiceSubtitle
                    style={{ fontSize: "12px", color: "#64748b" }}
                  >
                    Clinical:{" "}
                    {printInvoice.clinicalName || printInvoice.labName}
                  </PrintInvoiceSubtitle>
                  <PrintInvoiceSubtitle
                    style={{ fontSize: "12px", color: "#64748b" }}
                  >
                    Generated: {new Date().toLocaleDateString()}
                  </PrintInvoiceSubtitle>
                </div>
              </PrintInvoiceHeader>

              {/* Overall Statistics Cards */}
              <PrintStatsSection>
                <PrintStatCard>
                  <PrintStatTitle>Total Patients</PrintStatTitle>
                  <PrintStatValue>
                    {calculateInvoiceStats(printInvoice).totalPatients}
                  </PrintStatValue>
                  <PrintStatSubtext>Carry Credit Patients</PrintStatSubtext>
                </PrintStatCard>

                <PrintStatCard>
                  <PrintStatTitle>Average Credit</PrintStatTitle>
                  <PrintStatValue>
                    ₹{calculateInvoiceStats(printInvoice).avgCreditPerPatient}
                  </PrintStatValue>
                  <PrintStatSubtext>Per Patient</PrintStatSubtext>
                </PrintStatCard>

                <PrintStatCard>
                  <PrintStatTitle>Payment Status</PrintStatTitle>
                  <PrintStatValue>
                    {calculateInvoiceStats(printInvoice).paymentPercentage}%
                  </PrintStatValue>
                  <PrintStatSubtext>Completed</PrintStatSubtext>
                </PrintStatCard>
              </PrintStatsSection>

              {/* Summary Information */}
              <PrintSummaryGrid>
                <PrintSummaryBox>
                  <PrintSummaryTitle>Financial Summary</PrintSummaryTitle>
                  <PrintSummaryItem>
                    <span>Total Credit Amount:</span>
                    <span>
                      ₹
                      {Number.parseFloat(
                        printInvoice.totalCreditAmount
                      ).toFixed(2)}
                    </span>
                  </PrintSummaryItem>
                  <PrintSummaryItem>
                    <span>Paid Amount:</span>
                    <span>
                      ₹
                      {Number.parseFloat(printInvoice.paidAmount || 0).toFixed(
                        2
                      )}
                    </span>
                  </PrintSummaryItem>
                  <PrintSummaryItem>
                    <span>Outstanding Balance:</span>
                    <span>
                      ₹
                      {Number.parseFloat(
                        printInvoice.pendingAmount ||
                          printInvoice.totalCreditAmount
                      ).toFixed(2)}
                    </span>
                  </PrintSummaryItem>
                </PrintSummaryBox>

                <PrintSummaryBox>
                  <PrintSummaryTitle>Invoice Details</PrintSummaryTitle>
                  <PrintSummaryItem>
                    <span>Invoice Number:</span>
                    <span>{printInvoice.invoiceNumber}</span>
                  </PrintSummaryItem>
                  {printInvoice.fromDate && printInvoice.toDate && (
                    <PrintSummaryItem>
                      <span>Period:</span>
                      <span>
                        {new Date(printInvoice.fromDate).toLocaleDateString()} -{" "}
                        {new Date(printInvoice.toDate).toLocaleDateString()}
                      </span>
                    </PrintSummaryItem>
                  )}
                  <PrintSummaryItem>
                    <span>Payment Records:</span>
                    <span>{getPaymentHistory(printInvoice).length}</span>
                  </PrintSummaryItem>
                  <PrintSummaryItem>
                    <span>Status:</span>
                    <span>
                      {printInvoice.paidAmount &&
                      Number.parseFloat(printInvoice.paidAmount) > 0
                        ? Number.parseFloat(
                            printInvoice.pendingAmount ||
                              printInvoice.totalCreditAmount
                          ) > 0
                          ? "Partial Payment"
                          : "Fully Paid"
                        : "Pending"}
                    </span>
                  </PrintSummaryItem>
                </PrintSummaryBox>
              </PrintSummaryGrid>

              {/* Payment History Summary */}
              {getPaymentHistory(printInvoice).length > 0 && (
                <PrintSummaryBox style={{ margin: "15px 0" }}>
                  <PrintSummaryTitle>Recent Payment History</PrintSummaryTitle>
                  {getPaymentHistory(printInvoice)
                    .slice(0, 5)
                    .map((payment, index) => (
                      <PrintSummaryItem key={index}>
                        <span>
                          {new Date(payment.date).toLocaleDateString()} -{" "}
                          {payment.paymentMethod}
                        </span>
                        <span>₹{payment.paymentAmount}</span>
                      </PrintSummaryItem>
                    ))}
                </PrintSummaryBox>
              )}

              <PrintFooterImage />
            </PrintPage>
          </PrintContainer>
        </>
      )}

      {/* Payment History Modal */}
      {showPaymentHistoryModal && selectedInvoiceForHistory && (
        <PaymentHistoryModal>
          <PaymentHistoryContent>
            <PaymentHistoryHeader>
              <ModalTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3v5h5" />
                  <path d="M21 21v-5h-5" />
                  <path d="M21 3a9 9 0 0 0-9 9 9 9 0 0 0-9-9" />
                  <path d="M3 21a9 9 0 0 1 9-9 9 9 0 0 1 9 9" />
                </svg>
                Payment History - {selectedInvoiceForHistory.invoiceNumber}
              </ModalTitle>
              <ModalCloseButton
                onClick={() => setShowPaymentHistoryModal(false)}
              >
                <X size={20} />
              </ModalCloseButton>
            </PaymentHistoryHeader>

            <PaymentHistoryBody>
              {(() => {
                const paymentHistory = getPaymentHistory(
                  selectedInvoiceForHistory
                );
                const stats = getPaymentHistoryStats(paymentHistory);

                if (paymentHistory.length === 0) {
                  return (
                    <EmptyPaymentHistory>
                      <EmptyPaymentIcon>
                        <CreditCard size={40} />
                      </EmptyPaymentIcon>
                      <EmptyPaymentTitle>No Payment History</EmptyPaymentTitle>
                      <EmptyPaymentText>
                        This invoice doesn't have any payment records yet.
                        Payments will appear here once they are recorded.
                      </EmptyPaymentText>
                    </EmptyPaymentHistory>
                  );
                }

                return (
                  <>
                    {/* Payment Statistics */}
                    <PaymentHistoryStats>
                      <PaymentStatCard>
                        <PaymentStatValue>
                          {stats.totalPayments}
                        </PaymentStatValue>
                        <PaymentStatLabel>Total Payments</PaymentStatLabel>
                      </PaymentStatCard>
                      <PaymentStatCard>
                        <PaymentStatValue>
                          ₹{stats.totalAmount.toFixed(2)}
                        </PaymentStatValue>
                        <PaymentStatLabel>Total Amount</PaymentStatLabel>
                      </PaymentStatCard>
                      <PaymentStatCard>
                        <PaymentStatValue>
                          ₹{stats.averagePayment.toFixed(2)}
                        </PaymentStatValue>
                        <PaymentStatLabel>Average Payment</PaymentStatLabel>
                      </PaymentStatCard>
                      <PaymentStatCard>
                        <PaymentStatValue>
                          {stats.mostUsedMethod}
                        </PaymentStatValue>
                        <PaymentStatLabel>Most Used Method</PaymentStatLabel>
                      </PaymentStatCard>
                    </PaymentHistoryStats>

                    {/* Payment History Cards */}
                    {paymentHistory.map((payment, index) => {
                      const paymentDate = new Date(payment.date);
                      const progressPercentage = (
                        (Number.parseFloat(payment.newTotalPaid) /
                          Number.parseFloat(
                            selectedInvoiceForHistory.totalCreditAmount
                          )) *
                        100
                      ).toFixed(1);

                      return (
                        <PaymentHistoryCard key={index}>
                          <PaymentHistoryCardHeader>
                            <PaymentHistoryDate>
                              <PaymentDatePrimary>
                                {paymentDate.toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </PaymentDatePrimary>
                              <PaymentDateSecondary>
                                {paymentDate.toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </PaymentDateSecondary>
                            </PaymentHistoryDate>
                            <PaymentHistoryAmount>
                              <PaymentAmountPrimary>
                                ₹{payment.paymentAmount}
                              </PaymentAmountPrimary>
                              <PaymentAmountSecondary>
                                Payment #{index + 1}
                              </PaymentAmountSecondary>
                            </PaymentHistoryAmount>
                          </PaymentHistoryCardHeader>

                          <PaymentHistoryDetails>
                            <PaymentDetailItem>
                              <PaymentDetailLabel>
                                Payment Method
                              </PaymentDetailLabel>
                              <PaymentDetailValue>
                                <PaymentMethodBadge
                                  $method={payment.paymentMethod}
                                >
                                  {payment.paymentMethod || "Not specified"}
                                </PaymentMethodBadge>
                              </PaymentDetailValue>
                            </PaymentDetailItem>
                            <PaymentDetailItem>
                              <PaymentDetailLabel>
                                Transaction Details
                              </PaymentDetailLabel>
                              <PaymentDetailValue>
                                {payment.paymentDetails ||
                                  "No details provided"}
                              </PaymentDetailValue>
                            </PaymentDetailItem>
                            <PaymentDetailItem>
                              <PaymentDetailLabel>
                                Updated By
                              </PaymentDetailLabel>
                              <PaymentDetailValue>
                                {payment.updatedBy || "System"}
                              </PaymentDetailValue>
                            </PaymentDetailItem>
                          </PaymentHistoryDetails>

                          <PaymentHistoryDetails>
                            <PaymentDetailItem>
                              <PaymentDetailLabel>
                                Previous Total Paid
                              </PaymentDetailLabel>
                              <PaymentDetailValue>
                                ₹{payment.previousTotalPaid}
                              </PaymentDetailValue>
                            </PaymentDetailItem>
                            <PaymentDetailItem>
                              <PaymentDetailLabel>
                                New Total Paid
                              </PaymentDetailLabel>
                              <PaymentDetailValue
                                style={{ color: "#059669", fontWeight: "700" }}
                              >
                                ₹{payment.newTotalPaid}
                              </PaymentDetailValue>
                            </PaymentDetailItem>
                            <PaymentDetailItem>
                              <PaymentDetailLabel>
                                Remaining Balance
                              </PaymentDetailLabel>
                              <PaymentDetailValue
                                style={{ color: "#e11d48", fontWeight: "700" }}
                              >
                                ₹{payment.newPending}
                              </PaymentDetailValue>
                            </PaymentDetailItem>
                          </PaymentHistoryDetails>

                          <PaymentHistoryProgress>
                            <PaymentProgressLabel>
                              <span>Payment Progress</span>
                              <span>{progressPercentage}% Complete</span>
                            </PaymentProgressLabel>
                            <PaymentProgressBar>
                              <PaymentProgressFill
                                $percentage={progressPercentage}
                              />
                            </PaymentProgressBar>
                          </PaymentHistoryProgress>
                        </PaymentHistoryCard>
                      );
                    })}
                  </>
                );
              })()}
            </PaymentHistoryBody>
          </PaymentHistoryContent>
        </PaymentHistoryModal>
      )}
    </Container>
  );
};

export default B2BPatients;
