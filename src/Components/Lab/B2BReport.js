"use client";

import { useEffect, useState, useMemo } from "react";

import apiRequest from "../Auth/apiRequest";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import {
  Eye,
  User,
  MapPin,
  FileText,
  CreditCard,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
} from "lucide-react";

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// --- Styled Components ---

const PageContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #f0f4ff 0%, #f3e5f5 100%);
  min-height: 100vh;
  font-family: 'Outfit', 'Inter', sans-serif;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  animation: ${fadeIn} 0.5s ease-out;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  width: 50px;
  height: 50px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  
  svg {
    stroke-width: 2.5px;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #1a1a1a;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
`;

const FilterSection = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6366f1;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 14px 14px 48px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #334155;
  transition: all 0.3s;
  background: #f8f9fa;

  &:focus {
    outline: none;
    border-color: #6366f1;
    background: white;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #334155;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;

  &:focus {
    outline: none;
    border-color: #6366f1;
    background-color: white;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const TableCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.6);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.8s ease-out;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Th = styled.th`
  background: rgba(248, 250, 252, 0.8);
  padding: 1.2rem 1.5rem;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  white-space: nowrap;
`;

const Tr = styled.tr`
  transition: all 0.2s;

  &:hover {
    background: rgba(99, 102, 241, 0.05);
  }
`;

const Td = styled.td`
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid rgba(241, 245, 249, 0.8);
  color: #334155;
  font-size: 0.95rem;
  vertical-align: middle;

  ${Tr}:last-child & {
    border-bottom: none;
  }
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  ${props => props.variant === 'primary' && `
    background: rgba(99, 102, 241, 0.1);
    color: #4f46e5;
    
    &:hover {
      background: rgba(99, 102, 241, 0.2);
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: white;
    border: 1px solid #e2e8f0;
    color: #475569;
    
    &:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }
  `}
`;

const Badge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
  
  ${props => {
    switch (props.status) {
      case 'APPROVED':
        return `
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        `;
      case 'PENDING_APPROVAL':
        return `
          background: #fef9c3;
          color: #854d0e;
          border: 1px solid #fde047;
        `;
      default:
        return `
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        `;
    }
  }}
`;

// Detail components
const DetailCard = styled.div`
  background: white;
  margin: 1rem 2rem;
  border-radius: 16px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-out;
`;

const DetailHeader = styled.div`
  padding: 1.25rem 2rem;
  background: #f8fafc;
  color: #1e293b;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid #e2e8f0;

  &:hover {
    background: #f1f5f9;
  }
`;

const DetailBody = styled.div`
  padding: ${(props) => (props.expanded ? "2rem" : "0")};
  max-height: ${(props) => (props.expanded ? "2000px" : "0")};
  overflow: hidden;
  transition: all 0.4s ease-in-out;
  background: white;
`;

const DetailSection = styled.div`
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
`;

const SectionTitle = styled.h3`
  font-size: 0.95rem;
  color: #334155;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
  font-weight: 700;
  
  svg {
    color: #6366f1;
  }
`;

const InfoItem = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: baseline;
`;

const InfoLabel = styled.div`
  width: 40%;
  font-weight: 600;
  color: #64748b;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

const InfoValue = styled.div`
  width: 60%;
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: 500;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 24px;
  width: 55%;
  height: 95%;
  max-width: 1200px;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.4);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: #1e293b;
  font-weight: 700;
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: white;
`;

const ModalFooter = styled.div`
  padding: 1.25rem 2rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  background: #f8fafc;
  gap: 1rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #475569;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.2s;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #6366f1;
    background: white;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const PageButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: ${props => props.active ? '#6366f1' : 'white'};
  color: ${props => props.active ? 'white' : '#64748b'};
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => props.active ? '#4f46e5' : '#f8fafc'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DocumentLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;
  padding: 0.6rem 1rem;
  background: #eef2ff;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #e0e7ff;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CloseButton = styled.button`
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #ef4444;
    border-color: #fecaca;
    background: #fef2f2;
  }
`;

const DocumentActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const PaginationInfo = styled.div`
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
  
  span {
    color: #1e293b;
    font-weight: 700;
  }
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #e2e8f0;
  border-top: 3px solid #6366f1;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const PreviewLoading = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 10;
  color: #64748b;
  font-weight: 500;
`;

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

const B2BReport = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [b2bTypeFilter, setB2bTypeFilter] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    fileId: null,
    fileName: null,
    loading: false,
  });

  const [editModal, setEditModal] = useState({
    isOpen: false,
    data: null,
    loading: false,
  });

  const [formData, setFormData] = useState({});
  const [salesExecutives, setSalesExecutives] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiRequest(`${Labbaseurl}get_clinicalname/`, "GET");
      if (response && response.success) {
        setData(response.data);
      } else {
        console.error("Error fetching data:", response.error);
      }
    };

    fetchData();
    fetchSalesExecutives();
  }, []);

  const fetchSalesExecutives = async () => {
    try {
      const response = await apiRequest(`${Labbaseurl}get_sales_executives/`, "GET");
      let list = [];
      if (response && response.success !== false) {
        list = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : (response.data?.data || []);
      }
      setSalesExecutives(list);
    } catch (error) {
      console.error("Error fetching sales executives:", error);
    }
  };

  // Filter and pagination logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        (item.clinicalname &&
          item.clinicalname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.referrerCode &&
          item.referrerCode.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = !statusFilter || item.status === statusFilter;

      const matchesB2bType = !b2bTypeFilter || item.b2bType === b2bTypeFilter;

      return matchesSearch && matchesStatus && matchesB2bType;
    });
  }, [data, searchTerm, statusFilter, b2bTypeFilter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedItem(null);
    setSelectedIndex(null);
  }, [searchTerm, statusFilter, b2bTypeFilter]);
  // Export to Excel function
  const exportToExcel = () => {
    try {
      // Create workbook and worksheet
      const worksheet = {};

      // Define headers
      const headers = [
        "Referrer Code",
        "Clinical Name",
        "Type",
        "Sales Mapping",
        "Phone",
        "Status",
        "Email",
        "Alternate Number",
        "Address",
        "Area",
        "City",
        "State",
        "Pincode",
        "B2B Type",
        "Credit Type",
        "Credit Limit",
        "Invoice Period",
        "Report Delivery",
        "Report Format",
        "Created At",
      ];

      // Add headers to worksheet
      headers.forEach((header, index) => {
        const cellAddress = String.fromCharCode(65 + index) + "1"; // A1, B1, C1, etc.
        worksheet[cellAddress] = { v: header, t: "s" };
      });

      // Add data rows
      filteredData.forEach((item, rowIndex) => {
        const row = rowIndex + 2; // Start from row 2 (after headers)

        const rowData = [
          item.referrerCode || "",
          item.clinicalname || "",
          item.type || "",
          item.salesMapping || "",
          item.phone || "",
          item.status || "",
          item.email || "",
          item.alternateNumber || "",
          item.address || "",
          item.area || "",
          item.city || "",
          item.state || "",
          item.pincode || "",
          item.b2bType || "",
          item.creditType || "",
          item.creditLimit || "",
          item.invoicePeriod || "",
          item.reportDelivery || "",
          item.report || "",
          item.created_at ? new Date(item.created_at).toLocaleString() : "",
        ];

        rowData.forEach((cellValue, colIndex) => {
          const cellAddress = String.fromCharCode(65 + colIndex) + row;
          worksheet[cellAddress] = { v: cellValue, t: "s" };
        });
      });

      // Set worksheet range
      const range = `A1:${String.fromCharCode(65 + headers.length - 1)}${filteredData.length + 1
        }`;
      worksheet["!ref"] = range;

      // Create workbook
      const workbook = {
        Sheets: { "B2B Report": worksheet },
        SheetNames: ["B2B Report"],
      };

      // Convert to CSV format (simple implementation)
      let csvContent = headers.join(",") + "\n";

      filteredData.forEach((item) => {
        const row = [
          item.referrerCode || "",
          item.clinicalname || "",
          item.type || "",
          item.salesMapping || "",
          item.phone || "",
          item.status || "",
          item.email || "",
          item.alternateNumber || "",
          item.address || "",
          item.area || "",
          item.city || "",
          item.state || "",
          item.pincode || "",
          item.b2bType || "",
          item.creditType || "",
          item.creditLimit || "",
          item.invoicePeriod || "",
          item.reportDelivery || "",
          item.report || "",
          item.created_at ? new Date(item.created_at).toLocaleString() : "",
        ].map((field) => `"${String(field).replace(/"/g, '""')}"`); // Escape quotes

        csvContent += row.join(",") + "\n";
      });

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `B2B_Report_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Error exporting data. Please try again.");
    }
  };

  const handleViewDetails = (item, index) => {
    setSelectedItem(item);
    setSelectedIndex(index);
    setExpandedDetails(true);
  };

  const toggleDetails = () => {
    setExpandedDetails(!expandedDetails);
  };

  const handlePreviewMOU = (item) => {
    setPreviewModal({
      isOpen: true,
      fileId: item.mou_file_id,
      fileName: `MOU - ${item.clinicalname || item.referrerCode}`,
      loading: true,
    });
  };

  const closePreviewModal = () => {
    setPreviewModal({
      isOpen: false,
      fileId: null,
      fileName: null,
      loading: false,
    });
  };

  const handleIframeLoad = () => {
    setPreviewModal((prev) => ({
      ...prev,
      loading: false,
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedItem(null);
    setSelectedIndex(null);
  };

  // Edit Handlers
  const handleEditClick = (item) => {
    setFormData({ ...item }); // Initialize form with item data
    setEditModal({ isOpen: true, data: item, loading: false });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, data: null, loading: false });
    setFormData({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    if (!formData.referrerCode) {
      alert("Referrer Code is missing.");
      return;
    }

    setEditModal((prev) => ({ ...prev, loading: true }));

    // Build payload with only updatable model fields
    const payload = {
      referrerCode: formData.referrerCode,
      clinicalname: formData.clinicalname || "",
      type: formData.type || "",
      salesMapping: formData.salesMapping || "",
      phone: formData.phone || "",
      alternateNumber: formData.alternateNumber || "",
      address: formData.address || "",
      area: formData.area || "",
      city: formData.city || "",
      state: formData.state || "",
      pincode: formData.pincode || "",
      b2bType: formData.b2bType || "",
      creditType: formData.creditType || "",
      creditLimit: formData.creditLimit || "",
      invoicePeriod: formData.invoicePeriod || "",
      reportDelivery: formData.reportDelivery || "",
      report: formData.report || "",
    };

    if (formData.email && formData.email.trim() !== "") {
      payload.email = formData.email.trim();
    }

    try {
      const response = await apiRequest(
        `${Labbaseurl}clinicalname_update/`,
        "PUT",
        payload
      );

      if (response && response.success !== false && !response.error) {
        // Update local data
        setData((prevData) =>
          prevData.map((item) =>
            item.referrerCode === formData.referrerCode ? { ...item, ...payload } : item
          )
        );
        alert("Details updated successfully!");
        closeEditModal();
      } else {
        const errorMsg =
          typeof response?.error === "object"
            ? JSON.stringify(response.error)
            : response?.error || response?.message || "Failed to update details.";
        alert(errorMsg);
      }
    } catch (error) {
      console.error("Error updating details:", error);
      alert("An error occurred while updating details.");
    } finally {
      setEditModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <PageButton
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PageButton>
      );
    }
    return buttons;
  };

  return (
    <PageContainer>
      <Header>
        <TitleGroup>
          <IconWrapper>
            <FileText size={24} />
          </IconWrapper>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Title>B2B Lab Report</Title>
            <Subtitle>Manage and track clinical B2B partnerships</Subtitle>
          </div>
        </TitleGroup>
      </Header>

      <FilterSection>
        <SearchWrapper>
          <SearchIconWrapper>
            <Search size={18} />
          </SearchIconWrapper>
          <SearchInput
            type="text"
            placeholder="Search by clinical name or referrer code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="APPROVED">Approved</option>
          <option value="PENDING_APPROVAL">Pending</option>
        </Select>

        <Select
          value={b2bTypeFilter}
          onChange={(e) => setB2bTypeFilter(e.target.value)}
        >
          <option value="">All B2B Types</option>
          <option value="Cash">Cash</option>
          <option value="Credit">Credit</option>
        </Select>
      </FilterSection>

      <TableCard>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid rgba(226, 232, 240, 0.8)' }}>
          <ActionButton
            onClick={exportToExcel}
            disabled={filteredData.length === 0}
          >
            <Download size={18} />
            Export to Excel
          </ActionButton>
        </div>

        {filteredData.length > 0 ? (
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Referrer Code</Th>
                  <Th>Clinical Name</Th>
                  <Th>Type</Th>
                  <Th>Sales Mapping</Th>
                  <Th>Phone</Th>
                  <Th>Status</Th>
                  <Th style={{ textAlign: "center" }}>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <>
                    <Tr key={index}>
                      <Td style={{ fontWeight: 600 }}>{item.referrerCode}</Td>
                      <Td>{item.clinicalname}</Td>
                      <Td>{item.type}</Td>
                      <Td>{item.salesMapping}</Td>
                      <Td>{item.phone}</Td>
                      <Td>
                        <Badge status={item.status}>{item.status}</Badge>
                      </Td>
                      <Td style={{ textAlign: "center", display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <ActionBtn
                          variant="primary"
                          onClick={() => handleViewDetails(item, index)}
                        >
                          <Eye size={14} />
                          View
                        </ActionBtn>
                        <ActionBtn
                          variant="secondary"
                          onClick={() => handleEditClick(item)}
                        >
                          <Edit size={14} />
                          Edit
                        </ActionBtn>
                      </Td>
                    </Tr>

                    {selectedItem && selectedIndex === index && (
                      <Tr key={`details-${index}`}>
                        <Td colSpan="7" style={{ padding: 0, border: "none" }}>
                          <DetailCard>
                            <DetailHeader onClick={toggleDetails}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FileText size={18} color="#6366f1" />
                                <span>
                                  {selectedItem.clinicalname || selectedItem.referrerCode} - Detailed Information
                                </span>
                              </div>
                              {expandedDetails ? (
                                <ChevronUp size={18} color="#64748b" />
                              ) : (
                                <ChevronDown size={18} color="#64748b" />
                              )}
                            </DetailHeader>

                            <DetailBody expanded={expandedDetails}>
                              <DetailGrid>
                                <DetailSection>
                                  <SectionTitle>
                                    <User size={18} /> Basic Information
                                  </SectionTitle>
                                  <InfoItem>
                                    <InfoLabel>Referrer Code</InfoLabel>
                                    <InfoValue>{selectedItem.referrerCode}</InfoValue>
                                  </InfoItem>
                                  <InfoItem>
                                    <InfoLabel>Clinical Name</InfoLabel>
                                    <InfoValue>{selectedItem.clinicalname || "N/A"}</InfoValue>
                                  </InfoItem>
                                  <InfoItem>
                                    <InfoLabel>Type</InfoLabel>
                                    <InfoValue>{selectedItem.type || "N/A"}</InfoValue>
                                  </InfoItem>
                                  <InfoItem>
                                    <InfoLabel>Sales Mapping</InfoLabel>
                                    <InfoValue>{selectedItem.salesMapping || "N/A"}</InfoValue>
                                  </InfoItem>
                                  <InfoItem>
                                    <InfoLabel>Status</InfoLabel>
                                    <InfoValue>
                                      <Badge status={selectedItem.status}>
                                        {selectedItem.status}
                                      </Badge>
                                    </InfoValue>
                                  </InfoItem>
                                </DetailSection>

                                <DetailSection>
                                  <SectionTitle>
                                    <MapPin size={18} /> Contact & Location
                                  </SectionTitle>
                                  <InfoItem>
                                    <InfoLabel>Email</InfoLabel>
                                    <InfoValue>{selectedItem.email || "N/A"}</InfoValue>
                                  </InfoItem>
                                  <InfoItem>
                                    <InfoLabel>Phone</InfoLabel>
                                    <InfoValue>{selectedItem.phone || "N/A"}</InfoValue>
                                  </InfoItem>
                                  <InfoItem>
                                    <InfoLabel>Alternate Number</InfoLabel>
                                    <InfoValue>{selectedItem.alternateNumber || "N/A"}</InfoValue>
                                  </InfoItem>
                                  <InfoItem>
                                    <InfoLabel>Address</InfoLabel>
                                    <InfoValue>{selectedItem.address || "N/A"}</InfoValue>
                                  </InfoItem>
                                  <InfoItem>
                                    <InfoLabel>Area</InfoLabel>
                                    <InfoValue>{selectedItem.area || "N/A"}</InfoValue>
                                  </InfoItem>
                                  <InfoItem>
                                    <InfoLabel>City</InfoLabel>
                                    <InfoValue>{selectedItem.city || "N/A"}</InfoValue>
                                  </InfoItem>
                                  <InfoItem>
                                    <InfoLabel>State</InfoLabel>
                                    <InfoValue>{selectedItem.state || "N/A"}</InfoValue>
                                  </InfoItem>
                                  <InfoItem>
                                    <InfoLabel>Pincode</InfoLabel>
                                    <InfoValue>{selectedItem.pincode || "N/A"}</InfoValue>
                                  </InfoItem>
                                </DetailSection>

                                <DetailSection>
                                  <SectionTitle>
                                    <CreditCard size={18} /> Credit Information
                                  </SectionTitle>
                                  <InfoItem>
                                    <InfoLabel>B2B Type</InfoLabel>
                                    <InfoValue>{selectedItem.b2bType || "N/A"}</InfoValue>
                                  </InfoItem>
                                  <InfoItem>
                                    <InfoLabel>Credit Type</InfoLabel>
                                    <InfoValue>{selectedItem.creditType || "N/A"}</InfoValue>
                                  </InfoItem>
                                  <InfoItem>
                                    <InfoLabel>Credit Limit</InfoLabel>
                                    <InfoValue>₹{selectedItem.creditLimit || "N/A"}</InfoValue>
                                  </InfoItem>
                                  <InfoItem>
                                    <InfoLabel>Invoice Period</InfoLabel>
                                    <InfoValue>{selectedItem.invoicePeriod || "N/A"} days</InfoValue>
                                  </InfoItem>
                                </DetailSection>

                                <DetailSection>
                                  <SectionTitle>
                                    <FileText size={18} /> Report Preferences
                                  </SectionTitle>
                                  <InfoItem>
                                    <InfoLabel>Report Delivery</InfoLabel>
                                    <InfoValue>{selectedItem.reportDelivery || "N/A"}</InfoValue>
                                  </InfoItem>
                                  <InfoItem>
                                    <InfoLabel>Report Format</InfoLabel>
                                    <InfoValue>{selectedItem.report || "N/A"}</InfoValue>
                                  </InfoItem>
                                  <InfoItem>
                                    <InfoLabel>Created At</InfoLabel>
                                    <InfoValue>
                                      {selectedItem.created_at
                                        ? new Date(selectedItem.created_at).toLocaleString()
                                        : "N/A"}
                                    </InfoValue>
                                  </InfoItem>
                                  <InfoItem>
                                    <InfoLabel>MOU Document</InfoLabel>
                                    <InfoValue>
                                      {selectedItem.mou_file_id ? (
                                        <DocumentActions>
                                          <DocumentLink
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handlePreviewMOU(selectedItem);
                                            }}
                                          >
                                            <Eye size={14} />
                                            Preview MOU
                                          </DocumentLink>
                                        </DocumentActions>
                                      ) : (
                                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No MOU Uploaded</span>
                                      )}
                                    </InfoValue>
                                  </InfoItem>
                                </DetailSection>
                              </DetailGrid>
                            </DetailBody>
                          </DetailCard>
                        </Td>
                      </Tr>
                    )}
                  </>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        ) : (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '50%', display: 'inline-flex', marginBottom: '1rem' }}>
              <Search size={32} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem', color: '#334155' }}>No Records Found</h3>
            <p style={{ margin: 0 }}>Try adjusting your search criteria</p>
          </div>
        )}

        {filteredData.length > 0 && (
          <PaginationContainer>
            <PaginationInfo>
              Showing <span>{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span>{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of{" "}
              <span>{filteredData.length}</span> entries
            </PaginationInfo>

            <PaginationControls>
              <PageButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
              </PageButton>

              {renderPaginationButtons()}

              <PageButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={18} />
              </PageButton>
            </PaginationControls>
          </PaginationContainer>
        )}
      </TableCard>

      {/* Document Preview Modal */}
      {previewModal.isOpen && (
        <ModalOverlay onClick={closePreviewModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={20} color="#6366f1" />
                <ModalTitle>{previewModal.fileName}</ModalTitle>
              </div>
              <CloseButton onClick={closePreviewModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              {previewModal.loading && (
                <PreviewLoading>
                  <LoadingSpinner />
                  <p style={{ marginTop: "1rem" }}>
                    Loading document preview...
                  </p>
                </PreviewLoading>
              )}
              <iframe
                src={`${Labbaseurl}mou-preview/${previewModal.fileId}/`}
                title="MOU Document Preview"
                onLoad={handleIframeLoad}
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </ModalBody>
            <ModalFooter>
              <ActionBtn variant="secondary" onClick={closePreviewModal}>
                Close
              </ActionBtn>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Edit Modal */}
      {editModal.isOpen && (
        <ModalOverlay>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit size={20} color="#6366f1" />
                <ModalTitle>Edit Details - {editModal.data?.clinicalname}</ModalTitle>
              </div>
              <CloseButton onClick={closeEditModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              {editModal.loading && (
                <PreviewLoading>
                  <LoadingSpinner />
                </PreviewLoading>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <FormLabel>Clinical Name</FormLabel>
                  <Input
                    name="clinicalname"
                    value={formData.clinicalname || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <FormLabel>Referrer Code (Read Only)</FormLabel>
                  <Input
                    name="referrerCode"
                    value={formData.referrerCode || ""}
                    readOnly
                    style={{ backgroundColor: "#f1f5f9", color: '#64748b' }}
                  />
                </div>
                <div>
                  <FormLabel>Type</FormLabel>
                  <Input
                    name="type"
                    value={formData.type || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <FormLabel>Contact Person</FormLabel>
                  <Input
                    name="contactPerson"
                    value={formData.contactPerson || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    value={formData.email || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <FormLabel>Address</FormLabel>
                  <Input
                    name="address"
                    value={formData.address || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <FormLabel>Area</FormLabel>
                  <Input
                    name="area"
                    value={formData.area || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <FormLabel>City</FormLabel>
                  <Input
                    name="city"
                    value={formData.city || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <FormLabel>State</FormLabel>
                  <Input
                    name="state"
                    value={formData.state || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <FormLabel>Pincode</FormLabel>
                  <Input
                    name="pincode"
                    value={formData.pincode || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <FormLabel>Sales Mapping</FormLabel>
                  <Select
                    name="salesMapping"
                    value={formData.salesMapping || ""}
                    onChange={handleEditChange}
                    style={{ padding: "12px 14px", backgroundColor: "#f8fafc" }}
                  >
                    <option value="">-- Select Sales Person --</option>
                    {formData.salesMapping &&
                      !salesExecutives.some(
                        (p) => (typeof p === "string" ? p : (p.employeeName || p.name)) === formData.salesMapping
                      ) && (
                        <option value={formData.salesMapping}>{formData.salesMapping}</option>
                      )}
                    {salesExecutives.map((person, index) => {
                      const pName =
                        typeof person === "string"
                          ? person
                          : person.employeeName || person.name || person.employeeId;
                      return (
                        <option key={index} value={pName}>
                          {pName} {person.employeeId && person.employeeId !== pName ? `(${person.employeeId})` : ""}
                        </option>
                      );
                    })}
                  </Select>
                </div>
                <div>
                  <FormLabel>B2B Type</FormLabel>
                  <Input
                    name="b2bType"
                    value={formData.b2bType || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <FormLabel>Credit Limit</FormLabel>
                  <Input
                    name="creditLimit"
                    value={formData.creditLimit || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <FormLabel>Invoice Period (Days)</FormLabel>
                  <Input
                    name="invoicePeriod"
                    value={formData.invoicePeriod || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <FormLabel>Report Delivery</FormLabel>
                  <Input
                    name="reportDelivery"
                    value={formData.reportDelivery || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <FormLabel>Report Format</FormLabel>
                  <Input
                    name="report"
                    value={formData.report || ""}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <ActionBtn variant="secondary" onClick={closeEditModal}>
                Cancel
              </ActionBtn>
              <ActionButton onClick={handleSaveEdit}>
                Save Changes
              </ActionButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default B2BReport;