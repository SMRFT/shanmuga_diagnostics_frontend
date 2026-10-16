import React, { useEffect, useState, useCallback, useMemo } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import axios from "axios";
import apiRequest from "../Auth/apiRequest";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaBus,
  FaPlus,
  FaCalendarAlt,
  FaRupeeSign,
  FaFileExcel,
  FaFilePdf,
  FaTimes,
  FaCamera,
  FaUpload,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
} from "react-icons/fa";

// ─── Styled Components ────────────────────────────────────────────────────────

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 24px 20px;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #f5f7ff 0%, #ede9fe 100%);
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`;

const ContentCard = styled.div`
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.08);
  border-radius: 20px;
  padding: 28px;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 18px 14px;
    border-radius: 16px;
  }
`;

const Toast = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 99999;
  padding: 14px 22px;
  border-radius: 12px;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
  background: ${(props) =>
    props.$type === "error"
      ? "linear-gradient(135deg, #ef4444, #dc2626)"
      : "linear-gradient(135deg, #10b981, #059669)"};
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 420px;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      transform: translateY(-15px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 480px) {
    left: 14px;
    right: 14px;
    top: 14px;
    max-width: none;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  background: linear-gradient(135deg, #f093fb, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 640px) {
    font-size: 22px;
  }
`;

const Subtitle = styled.span`
  color: #64748b;
  font-size: 13px;
  font-weight: 400;
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  padding: 11px 22px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.35);
  transition: all 0.25s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.45);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const ControlsSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 18px;
  margin-bottom: 22px;
  padding: 18px 20px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FilterLabel = styled.label`
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DateInput = styled.input`
  padding: 9px 13px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13.5px;
  color: #1e293b;
  background: #fff;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }
`;

const TotalCard = styled.div`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.12) 100%);
  border: 1.5px solid rgba(102, 126, 234, 0.2);
  border-radius: 14px;
  padding: 10px 22px;
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const TotalIconBox = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.25);
`;

const TotalDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const TotalLabel = styled.span`
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.04em;
`;

const TotalValue = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #4338ca;
  letter-spacing: -0.5px;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
`;

const ExportGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ExportExcelBtn = styled.button`
  background: #ecfdf5;
  color: #059669;
  border: 1.5px solid #a7f3d0;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #059669;
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ExportPdfBtn = styled.button`
  background: #fef2f2;
  color: #dc2626;
  border: 1.5px solid #fecaca;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #dc2626;
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EntryCountBadge = styled.span`
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 14px;
  border: 1.5px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  background: #fff;

  @media (max-width: 768px) {
    border: none;
    box-shadow: none;
    background: transparent;
    overflow-x: visible;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  font-size: 13.5px;

  th {
    background: #f8fafc;
    color: #475569;
    font-weight: 600;
    font-size: 12.5px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 14px 16px;
    border-bottom: 2px solid #e2e8f0;
    text-align: left;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  td {
    padding: 14px 16px;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    vertical-align: middle;
    white-space: nowrap;
  }

  tbody tr {
    transition: background 0.15s ease;
    &:hover {
      background: #f8faff;
    }
    &:last-child td {
      border-bottom: none;
    }
  }

  @media (max-width: 768px) {
    thead {
      display: none;
    }

    tbody, tr, td {
      display: block;
      width: 100%;
      box-sizing: border-box;
    }

    tr {
      background: #fff;
      border-radius: 14px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
      margin-bottom: 16px;
      padding: 8px 12px;
    }

    td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      white-space: normal;
      text-align: right;
      border-bottom: 1px solid #f1f5f9;
      padding: 10px 8px;
      font-size: 13px;
    }

    td:last-child {
      border-bottom: none;
    }

    td::before {
      content: attr(data-label);
      font-weight: 700;
      color: #64748b;
      text-align: left;
      font-size: 11.5px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      flex-shrink: 0;
    }
  }
`;

const AmountBadge = styled.span`
  font-weight: 700;
  color: #059669;
  background: #ecfdf5;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid #d1fae5;
  display: inline-block;
`;

const LocationBadge = styled.span`
  font-weight: 600;
  color: #4338ca;
  display: inline-flex;
  align-items: center;
  gap: 5px;
`;

const RowSelect = styled.select`
  padding: 7px 10px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  background: #f8fafc;
  color: #1e293b;
  min-width: 160px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
  }

  &:disabled {
    background: #f1f5f9;
    color: #64748b;
    cursor: not-allowed;
    border-color: #e2e8f0;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    min-width: 0;
    width: 100%;
    max-width: 190px;
    font-size: 14px;
  }
`;

const PhotoThumb = styled.img`
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }
`;

const EmptyState = styled.div`
  padding: 48px 20px;
  text-align: center;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SummaryWrapper = styled.div`
  margin-top: 28px;
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  max-width: 520px;
`;

const SummaryHeaderBox = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #ede9fe 100%);
  padding: 14px 18px;
  border-bottom: 1.5px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SummaryHeading = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #4338ca;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SummaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th,
  td {
    padding: 11px 18px;
    text-align: left;
  }

  th {
    background: #f8fafc;
    color: #64748b;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    border-bottom: 1px solid #e2e8f0;
  }

  td {
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
  }

  tr:hover td {
    background: #faf5ff;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

// ─── Modal Styled Components ──────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 16px;

  @media (max-width: 640px) {
    align-items: flex-end;
    padding: 0;
  }
`;

const ModalBox = styled.div`
  background: #fff;
  width: 480px;
  max-width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 20px;
  padding: 26px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  font-family: 'Poppins', sans-serif;

  @media (max-width: 640px) {
    width: 100%;
    border-radius: 20px 20px 0 0;
    padding: 22px 18px calc(18px + env(safe-area-inset-bottom, 0px));
    max-height: 92vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
`;

const ModalTitle = styled.h3`
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 10px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }
`;

const Select = styled.select`
  padding: 10px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  background: #fff;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`;

const CancelBtn = styled.button`
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #1e293b;
  }

  @media (max-width: 480px) {
    padding: 12px 18px;
  }
`;

const SaveBtn = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.25s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 12px 22px;
  }
`;

const TimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  select {
    flex: 1;
    min-width: 0;
  }
`;

const PhotoActions = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 420px) {
    flex-direction: column;
  }
`;

const PhotoButton = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  color: #4338ca;
  border: 1.5px dashed #cbd5e1;
  padding: 11px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    background: #ede9fe;
    border-color: #667eea;
  }

  @media (max-width: 420px) {
    padding: 12px 14px;
  }
`;

const PhotoPreviewWrapper = styled.div`
  position: relative;
  margin-top: 12px;
  width: 100%;
`;

const PhotoPreview = styled.img`
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  display: block;
`;

const RemovePhotoButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #ef4444;
  }
`;

// ─── Helpers & Business Logic ─────────────────────────────────────────────────

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

const getErrorMessage = (err, fallback = "Something went wrong. Please try again.") => {
  const data = err?.response?.data || err?.data || err;
  if (!data || typeof data !== "object") {
    return (typeof data === "string" && data) || err?.message || fallback;
  }
  if (data.message) return data.message;
  if (data.error) return data.error;
  if (data.errors && typeof data.errors === "object") {
    const firstKey = Object.keys(data.errors)[0];
    const firstVal = data.errors[firstKey];
    const detail = Array.isArray(firstVal) ? firstVal[0] : firstVal;
    return firstKey ? `${firstKey}: ${detail}` : fallback;
  }
  return err?.message || fallback;
};

const getTodayDate = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const emptyForm = {
  date: getTodayDate(),
  location: "",
  amount: "",
  collectedby: "",
  pickuptime: "",
  busreachedtime: "",
  bustphoto: null,
};

const getCollectorLabel = (collector) =>
  collector?.employeeName ||
  collector?.name ||
  collector?.username ||
  (typeof collector === "string" ? collector : "");

const getCollectorValue = (collector) =>
  collector?.employeeId ||
  collector?.employeeName ||
  (typeof collector === "string" ? collector : "");

const getCollectorNameById = (collectors, id) => {
  if (!id) return "-";
  const match = (Array.isArray(collectors) ? collectors : []).find(
    (c) => getCollectorValue(c) === id
  );
  return match ? getCollectorLabel(match) : id;
};

const computeLocationSummary = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  const byDate = {};
  rows.forEach((row) => {
    const d = row.date || "Unknown";
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(row);
  });

  const summary = [];
  const sortedDates = Object.keys(byDate).sort();

  sortedDates.forEach((dateKey) => {
    const dayRows = byDate[dateKey];
    const locCounts = new Map();
    const keyMap = new Map();

    dayRows.forEach((row) => {
      if (!row.location || typeof row.location !== "string") return;
      const parts = row.location
        .split(/[,;\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      parts.forEach((part) => {
        const match = part.match(/^(.+?)\s*\(\s*\d+\s*\)$/);
        const name = match ? match[1].trim() : part.trim();
        if (!name) return;

        const lower = name.toLowerCase();
        if (keyMap.has(lower)) {
          const canonical = keyMap.get(lower);
          locCounts.set(canonical, locCounts.get(canonical) + 1);
        } else {
          keyMap.set(lower, name);
          locCounts.set(name, 1);
        }
      });
    });

    locCounts.forEach((count, locName) => {
      summary.push({
        date: dateKey,
        location: locName,
        count: count,
      });
    });
  });

  return summary;
};

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

const isCompleteTime = (value) => /^\d{2}:\d{2}$/.test(value || "");

function TimeSelect({ value, onChange }) {
  const [h = "", m = ""] = (value || "").split(":");

  const update = (part, newVal) => {
    const nextH = part === "h" ? newVal : h;
    const nextM = part === "m" ? newVal : m;
    onChange(`${nextH || "00"}:${nextM || "00"}`);
  };

  return (
    <TimeRow>
      <Select value={h} onChange={(e) => update("h", e.target.value)}>
        <option value="">HH</option>
        {HOURS.map((hh) => (
          <option key={hh} value={hh}>
            {hh}
          </option>
        ))}
      </Select>
      <span style={{ fontWeight: 700, color: "#94a3b8" }}>:</span>
      <Select value={m} onChange={(e) => update("m", e.target.value)}>
        <option value="">MM</option>
        {MINUTES.map((mm) => (
          <option key={mm} value={mm}>
            {mm}
          </option>
        ))}
      </Select>
    </TimeRow>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function Busfare() {
  const [busfares, setBusfares] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [pickingUpId, setPickingUpId] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());

  const loadBusfares = useCallback(async (from, to) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (from) params.append("from_date", from);
      if (to) params.append("to_date", to);
      const qs = params.toString();
      const res = await apiRequest(
        `${Labbaseurl}bus_fare/${qs ? `?${qs}` : ""}`,
        "GET"
      );
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.results)
        ? res.results
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data?.results)
        ? res.data.results
        : [];
      setBusfares(list);
    } catch (err) {
      console.error("Failed to load bus fares:", err);
      setBusfares([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCollectors = useCallback(async () => {
    try {
      const res = await apiRequest(`${Labbaseurl}get_b2b_employees/`, "GET");
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.results)
        ? res.results
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data?.results)
        ? res.data.results
        : [];
      setCollectors(list);
    } catch (err) {
      console.error("Failed to load collectors:", err);
      setCollectors([]);
    }
  }, []);

  useEffect(() => {
    loadBusfares(fromDate, toDate);
  }, [loadBusfares, fromDate, toDate]);

  useEffect(() => {
    loadCollectors();
  }, [loadCollectors]);

  const openModal = () => {
    setFormData(emptyForm);
    setErrors({});
    setPhotoPreviewUrl(null);
    setShowModal(true);
  };

  const closeModal = () => {
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }
    setShowModal(false);
    setFormData(emptyForm);
    setErrors({});
    setPhotoPreviewUrl(null);
  };

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleTimeChange = (field) => (val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }

    setFormData((prev) => ({ ...prev, bustphoto: file }));
    setPhotoPreviewUrl(URL.createObjectURL(file));

    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }
    setFormData((prev) => ({ ...prev, bustphoto: null }));
    setPhotoPreviewUrl(null);
  };

  const validate = () => {
    const errs = {};
    if (!formData.date) errs.date = "Date is required";
    if (!formData.location || !formData.location.trim())
      errs.location = "Location is required";
    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      parseFloat(formData.amount) <= 0
    ) {
      errs.amount = "Enter a valid amount";
    }
    if (!formData.collectedby)
      errs.collectedby = "Please select a collector";
    if (!formData.pickuptime || !isCompleteTime(formData.pickuptime))
      errs.pickuptime = "Pickup time is required (HH:MM)";
    if (!formData.busreachedtime || !isCompleteTime(formData.busreachedtime))
      errs.busreachedtime = "Bus reached time is required (HH:MM)";
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      const baseData = {
        date: formData.date,
        location: formData.location.trim(),
        amount: parseFloat(formData.amount),
        collectedby: formData.collectedby,
        pickuptime: formData.pickuptime,
        busreachedtime: formData.busreachedtime,
      };

      if (formData.bustphoto instanceof File) {
        const body = new FormData();
        Object.entries(baseData).forEach(([k, v]) => body.append(k, v));
        body.append("bustphoto", formData.bustphoto);

        const token = localStorage.getItem("access_token");
        const branch = localStorage.getItem("selected_branch");
        const url = `${Labbaseurl}bus_fare/`;

        const res = await axios.post(url, body, {
          headers: {
            Authorization: token,
            "Branch-Code": branch,
          },
        });

        if (res.status >= 200 && res.status < 300) {
          setToast({
            type: "success",
            message: res?.data?.message || "Bus fare entry saved successfully.",
          });
        } else {
          throw res;
        }
      } else {
        const { bustphoto, ...rest } = baseData;
        const res = await apiRequest(`${Labbaseurl}bus_fare/`, "POST", rest);
        setToast({
          type: "success",
          message: res?.message || res?.data?.message || "Bus fare entry saved successfully.",
        });
      }

      closeModal();
      loadBusfares(fromDate, toDate);
    } catch (err) {
      console.error("Failed to save bus fare:", err);
      setToast({
        type: "error",
        message: getErrorMessage(err, "Failed to save bus fare entry."),
      });
    } finally {
      setSaving(false);
    }
  };

  const totalAmount = (Array.isArray(busfares) ? busfares : []).reduce(
    (sum, row) => sum + (parseFloat(row.amount) || 0),
    0
  );

  const locationSummary = useMemo(
    () => computeLocationSummary(busfares),
    [busfares]
  );

  const buildExportRows = () =>
    (Array.isArray(busfares) ? busfares : []).map((row) => ({
      Date: row.date || "",
      Location: row.location || "",
      Amount: row.amount || "",
      "Collected By": getCollectorNameById(collectors, row.collectedby),
      "Pickup Time": row.pickuptime || "",
      "Bus Reached Time": row.busreachedtime || "",
      "Picked Up By": getCollectorNameById(collectors, row.pickedupby),
    }));

  const handleExportExcel = () => {
    const rows = buildExportRows();
    if (rows.length === 0) return;

    rows.push({
      Date: "",
      Location: "Total",
      Amount: totalAmount.toFixed(2),
      "Collected By": "",
      "Pickup Time": "",
      "Bus Reached Time": "",
      "Picked Up By": "",
    });

    rows.push({
      Date: "",
      Location: "",
      Amount: "",
      "Collected By": "",
      "Pickup Time": "",
      "Bus Reached Time": "",
      "Picked Up By": "",
    });

    locationSummary.forEach((item) => {
      rows.push({
        Date: item.date,
        Location: item.location,
        Amount: item.count,
        "Collected By": "",
        "Pickup Time": "",
        "Bus Reached Time": "",
        "Picked Up By": "",
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 14 },
      { wch: 25 },
      { wch: 12 },
      { wch: 18 },
      { wch: 12 },
      { wch: 16 },
      { wch: 18 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bus Fares");
    XLSX.writeFile(workbook, `bus-fares_${fromDate}_to_${toDate}.xlsx`);
  };

  const handleExportPDF = () => {
    const rows = buildExportRows();
    if (rows.length === 0) return;

    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(16);
    doc.text("Bus Sample Summary", 14, 16);

    doc.setFontSize(10);
    doc.text(`From: ${fromDate}   To: ${toDate}`, 14, 23);
    doc.text(`Total Amount: Rs. ${totalAmount.toFixed(2)}`, 14, 29);

    const headers = [
      "Date",
      "Location",
      "Amount",
      "Collected By",
      "Pickup Time",
      "Bus Reached Time",
      "Picked Up By",
    ];

    const body = rows.map((r) => [
      r.Date,
      r.Location,
      r.Amount,
      r["Collected By"],
      r["Pickup Time"],
      r["Bus Reached Time"],
      r["Picked Up By"],
    ]);

    body.push(["", "Total", totalAmount.toFixed(2), "", "", "", ""]);

    autoTable(doc, {
      head: [headers],
      body,
      startY: 34,
      theme: "grid",
      headStyles: { fillColor: [102, 126, 234], textColor: 255 },
      styles: { fontSize: 9 },
    });

    if (locationSummary.length > 0) {
      const summaryStartY = (doc.lastAutoTable?.finalY || 34) + 12;

      doc.setFontSize(12);
      doc.text("Location Summary", 14, summaryStartY);

      const sumHeaders = ["Date", "Location", "Count"];
      const sumBody = locationSummary.map((item) => [
        item.date,
        item.location,
        String(item.count),
      ]);

      autoTable(doc, {
        head: [sumHeaders],
        body: sumBody,
        startY: summaryStartY + 4,
        theme: "grid",
        headStyles: { fillColor: [118, 75, 162], textColor: 255 },
        styles: { fontSize: 9 },
      });
    }

    doc.save(`bus-fares_${fromDate}_to_${toDate}.pdf`);
  };

  const handlePickedUpChange = async (busfareId, newPickedUpBy) => {
    if (!newPickedUpBy) return;

    setPickingUpId(busfareId);
    try {
      const res = await apiRequest(
        `${Labbaseurl}bus_fare/${busfareId}/pickedup/`,
        "PATCH",
        { pickedupby: newPickedUpBy }
      );
      setToast({
        type: "success",
        message: res?.message || res?.data?.message || "Picked-up collector assigned.",
      });
      setBusfares((prev) =>
        prev.map((row) =>
          (row.busfare_id || row.id) === busfareId
            ? { ...row, pickedupby: newPickedUpBy }
            : row
        )
      );
    } catch (err) {
      console.error("Failed to update picked-up collector:", err);
      setToast({
        type: "error",
        message: getErrorMessage(err, "Failed to update picked-up collector."),
      });
    } finally {
      setPickingUpId(null);
    }
  };

  return (
    <PageContainer>
      {toast && <Toast $type={toast.type}>{toast.message}</Toast>}

      <ContentCard>
        <Header>
          <TitleWrapper>
            <Title>
              <FaBus style={{ color: "#667eea" }} /> Bus Sample Summary
            </Title>
            <Subtitle>Track and manage bus sample collection fares and handover details</Subtitle>
          </TitleWrapper>
          <AddButton onClick={openModal}>
            <FaPlus size={13} /> Add Bus Fare
          </AddButton>
        </Header>

        <ControlsSection>
          <FilterGroup>
            <FilterField>
              <FilterLabel htmlFor="busfare-from-date">
                <FaCalendarAlt size={12} color="#667eea" /> From Date
              </FilterLabel>
              <DateInput
                id="busfare-from-date"
                type="date"
                value={fromDate}
                max={toDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </FilterField>
            <FilterField>
              <FilterLabel htmlFor="busfare-to-date">
                <FaCalendarAlt size={12} color="#667eea" /> To Date
              </FilterLabel>
              <DateInput
                id="busfare-to-date"
                type="date"
                value={toDate}
                min={fromDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </FilterField>
          </FilterGroup>

          <TotalCard>
            <TotalIconBox>
              <FaRupeeSign />
            </TotalIconBox>
            <TotalDetails>
              <TotalLabel>Total Bus Fare</TotalLabel>
              <TotalValue>₹{totalAmount.toFixed(2)}</TotalValue>
            </TotalDetails>
          </TotalCard>
        </ControlsSection>

        <ActionBar>
          <ExportGroup>
            <ExportExcelBtn
              onClick={handleExportExcel}
              disabled={!Array.isArray(busfares) || busfares.length === 0}
            >
              <FaFileExcel size={14} /> Export Excel
            </ExportExcelBtn>
            <ExportPdfBtn
              onClick={handleExportPDF}
              disabled={!Array.isArray(busfares) || busfares.length === 0}
            >
              <FaFilePdf size={14} /> Export PDF
            </ExportPdfBtn>
          </ExportGroup>
          <EntryCountBadge>
            Showing {Array.isArray(busfares) ? busfares.length : 0} {busfares.length === 1 ? "entry" : "entries"}
          </EntryCountBadge>
        </ActionBar>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Location</th>
                <th>Amount</th>
                <th>Collected By</th>
                <th>Pickup Time</th>
                <th>Bus Reached Time</th>
                <th>Picked Up By</th>
                <th>Photo</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(busfares) ? busfares : []).map((row) => (
                <tr key={row.busfare_id || row.id}>
                  <td data-label="Date">
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>{row.date}</span>
                  </td>
                  <td data-label="Location">
                    <LocationBadge>
                      <FaMapMarkerAlt size={12} /> {row.location}
                    </LocationBadge>
                  </td>
                  <td data-label="Amount">
                    <AmountBadge>₹{Number(row.amount || 0).toFixed(2)}</AmountBadge>
                  </td>
                  <td data-label="Collected By">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
                      <FaUser size={11} color="#6366f1" />
                      {getCollectorNameById(collectors, row.collectedby)}
                    </span>
                  </td>
                  <td data-label="Pickup Time">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#475569" }}>
                      <FaClock size={11} color="#94a3b8" /> {row.pickuptime || "-"}
                    </span>
                  </td>
                  <td data-label="Bus Reached Time">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#475569" }}>
                      <FaClock size={11} color="#94a3b8" /> {row.busreachedtime || "-"}
                    </span>
                  </td>
                  <td data-label="Picked Up By">
                    <RowSelect
                      value={row.pickedupby || ""}
                      onChange={(e) => handlePickedUpChange(row.busfare_id, e.target.value)}
                      disabled={pickingUpId === row.busfare_id || Boolean(row.pickedupby)}
                      title={row.pickedupby ? "Picked Up By is finalized" : "Select collector"}
                    >
                      <option value="">Select collector</option>
                      {(Array.isArray(collectors) ? collectors : []).map((collector, idx) => (
                        <option key={idx} value={getCollectorValue(collector)}>
                          {getCollectorLabel(collector)}
                        </option>
                      ))}
                    </RowSelect>
                  </td>
                  <td data-label="Photo">
                    {row.bustphoto ? (
                      <a
                        href={`${Labbaseurl}bus_fare_photo/?file_id=${row.bustphoto}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Click to view full photo"
                      >
                        <PhotoThumb
                          src={`${Labbaseurl}bus_fare_photo/?file_id=${row.bustphoto}`}
                          alt="Bus photo"
                        />
                      </a>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: 12 }}>No photo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {!loading && (!Array.isArray(busfares) || busfares.length === 0) && (
            <EmptyState>
              <FaBus size={44} style={{ color: "#cbd5e1", marginBottom: 12 }} />
              <div style={{ fontWeight: 600, fontSize: 16, color: "#475569" }}>No bus fare entries found</div>
              <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
                Add an entry or adjust the date filter to see records.
              </div>
            </EmptyState>
          )}

          {loading && (
            <EmptyState>
              <div style={{ fontWeight: 600, color: "#667eea", fontSize: 15 }}>
                Loading bus fare records...
              </div>
            </EmptyState>
          )}
        </TableWrapper>

        {!loading && locationSummary.length > 0 && (
          <SummaryWrapper>
            <SummaryHeaderBox>
              <SummaryHeading>
                <FaMapMarkerAlt size={15} /> Location Summary
              </SummaryHeading>
            </SummaryHeaderBox>
            <SummaryTable>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Location</th>
                  <th style={{ textAlign: "right" }}>Count</th>
                </tr>
              </thead>
              <tbody>
                {locationSummary.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.date}</td>
                    <td>
                      <LocationBadge>
                        <FaMapMarkerAlt size={11} /> {item.location}
                      </LocationBadge>
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: "#4338ca" }}>
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </SummaryTable>
          </SummaryWrapper>
        )}
      </ContentCard>

      {showModal &&
        ReactDOM.createPortal(
          <Overlay onClick={closeModal}>
            <ModalBox onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>
                  <FaBus size={18} style={{ color: "#667eea" }} />
                  Add Bus Fare
                </ModalTitle>
                <CloseButton onClick={closeModal} aria-label="Close">
                  <FaTimes size={14} />
                </CloseButton>
              </ModalHeader>

              <FormGroup>
                <Label>Date</Label>
                <Input type="date" value={formData.date} onChange={handleChange("date")} />
                {errors.date && <ErrorText>{errors.date}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>Location</Label>
                <Input
                  type="text"
                  placeholder="Enter location (e.g. Mettur)"
                  value={formData.location}
                  onChange={handleChange("location")}
                />
                {errors.location && <ErrorText>{errors.location}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange("amount")}
                />
                {errors.amount && <ErrorText>{errors.amount}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>Collected By</Label>
                <Select value={formData.collectedby} onChange={handleChange("collectedby")}>
                  <option value="">Select collector</option>
                  {(Array.isArray(collectors) ? collectors : []).map((collector, idx) => (
                    <option key={idx} value={getCollectorValue(collector)}>
                      {getCollectorLabel(collector)}
                    </option>
                  ))}
                </Select>
                {errors.collectedby && <ErrorText>{errors.collectedby}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>Pickup Time</Label>
                <TimeSelect
                  value={formData.pickuptime}
                  onChange={handleTimeChange("pickuptime")}
                />
                {errors.pickuptime && <ErrorText>{errors.pickuptime}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>Bus Reached Time</Label>
                <TimeSelect
                  value={formData.busreachedtime}
                  onChange={handleTimeChange("busreachedtime")}
                />
                {errors.busreachedtime && <ErrorText>{errors.busreachedtime}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>Bus Photo (optional)</Label>
                <PhotoActions>
                  <PhotoButton htmlFor="bustphoto-upload">
                    <FaUpload size={13} style={{ marginRight: 6 }} /> Upload Photo
                    <input
                      id="bustphoto-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handlePhotoChange}
                    />
                  </PhotoButton>
                  <PhotoButton htmlFor="bustphoto-camera">
                    <FaCamera size={13} style={{ marginRight: 6 }} /> Use Camera
                    <input
                      id="bustphoto-camera"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      style={{ display: "none" }}
                      onChange={handlePhotoChange}
                    />
                  </PhotoButton>
                </PhotoActions>
                {photoPreviewUrl && (
                  <PhotoPreviewWrapper>
                    <PhotoPreview src={photoPreviewUrl} alt="Bus photo preview" />
                    <RemovePhotoButton
                      type="button"
                      onClick={handleRemovePhoto}
                      aria-label="Remove photo"
                      title="Remove photo"
                    >
                      <FaTimes size={13} />
                    </RemovePhotoButton>
                  </PhotoPreviewWrapper>
                )}
              </FormGroup>

              <ModalActions>
                <CancelBtn onClick={closeModal}>Cancel</CancelBtn>
                <SaveBtn onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Bus Fare"}
                </SaveBtn>
              </ModalActions>
            </ModalBox>
          </Overlay>,
          document.body
        )}
    </PageContainer>
  );
}

export default Busfare;