"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import styled, { createGlobalStyle } from "styled-components";
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
} from "lucide-react";

// Global styles
const GlobalStyle = createGlobalStyle`
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

// Styled components
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  color: var(--primary-dark);
  font-weight: 600;
  margin: 0;
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

// Filter components
const FilterContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: var(--light);
  border-radius: var(--border-radius);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray);
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
  }
`;
// Table header with export button
const TableHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const ExportButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--success);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: #28a745;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  overflow: hidden;
`;

const THead = styled.thead`
  background-color: var(--secondary);
  color: white;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--gray-light);
  font-size: 0.875rem;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: var(--light);
  }

  &:hover {
    background-color: rgba(67, 97, 238, 0.05);
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${(props) => (props.primary ? "var(--primary)" : "white")};
  color: ${(props) => (props.primary ? "white" : "var(--gray)")};
  border: 1px solid
    ${(props) => (props.primary ? "var(--primary)" : "var(--gray-light)")};
  border-radius: var(--border-radius);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: ${(props) =>
      props.primary ? "var(--primary-dark)" : "var(--gray-light)"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background-color: ${(props) =>
    props.status === "APPROVED"
      ? "rgba(40, 167, 69, 0.1)"
      : "rgba(108, 117, 125, 0.1)"};
  color: ${(props) =>
    props.status === "APPROVED" ? "#28a745" : "var(--gray)"};
`;

// Pagination components
const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--light);
  border-radius: var(--border-radius);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: var(--gray);
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--gray-light);
  background-color: ${(props) => (props.active ? "var(--primary)" : "white")};
  color: ${(props) => (props.active ? "white" : "var(--gray)")};
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition);

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.active ? "var(--primary-dark)" : "var(--gray-light)"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Detail components
const DetailCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 1.5rem;
  overflow: hidden;
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DetailHeader = styled.div`
  padding: 1rem 1.5rem;
  background-color: var(--primary-light);
  color: white;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const DetailBody = styled.div`
  padding: ${(props) => (props.expanded ? "1.5rem" : "0")};
  max-height: ${(props) => (props.expanded ? "2000px" : "0")};
  overflow: hidden;
  transition: max-height 0.5s ease, padding 0.3s ease;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailSection = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  color: var(--primary-dark);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--gray-light);
`;

const InfoItem = styled.div`
  display: flex;
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.div`
  width: 40%;
  font-weight: 500;
  color: var(--gray);
  font-size: 0.875rem;
`;

const InfoValue = styled.div`
  width: 60%;
  font-size: 0.875rem;
`;

const DocumentLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const DocumentActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

// Modal components
const ModalOverlay = styled.div`
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

const ModalContent = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: var(--primary-dark);
`;

const ModalBody = styled.div`
  flex: 1;
  overflow: hidden;
  height: 70vh;
  position: relative;
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--gray-light);
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--gray);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--primary-dark);
  }
`;

const LoadingSpinner = styled.div`
  border: 2px solid var(--gray-light);
  border-top: 2px solid var(--primary);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
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

  useEffect(() => {
    axios
      .get(`${Labbaseurl}get_clinicalname/`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

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
      const range = `A1:${String.fromCharCode(65 + headers.length - 1)}${
        filteredData.length + 1
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
    <>
      <GlobalStyle />
      <Container>
        <Card>
          <CardHeader>
            <Title>B2B Lab Report</Title>
          </CardHeader>

          <CardBody>
            {/* Filters */}
            <FilterContainer>
              <SearchContainer>
                <SearchIcon>
                  <Search size={16} />
                </SearchIcon>
                <SearchInput
                  type="text"
                  placeholder="Search by clinical name or referrer code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchContainer>

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
            </FilterContainer>
            {/* Export Button */}
            <TableHeader>
              <ExportButton
                onClick={exportToExcel}
                disabled={filteredData.length === 0}
              >
                <Download size={16} />
                Export to Excel
              </ExportButton>
            </TableHeader>

            <div style={{ overflowX: "auto" }}>
              <Table>
                <THead>
                  <Tr>
                    <Th>Referrer Code</Th>
                    <Th>Clinical Name</Th>
                    <Th>Type</Th>
                    <Th>Sales Mapping</Th>
                    <Th>Phone</Th>
                    <Th>Status</Th>
                    <Th style={{ textAlign: "center" }}>Actions</Th>
                  </Tr>
                </THead>
                <tbody>
                  {paginatedData && paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <>
                        <Tr key={index}>
                          <Td>{item.referrerCode}</Td>
                          <Td>{item.clinicalname}</Td>
                          <Td>{item.type}</Td>
                          <Td>{item.salesMapping}</Td>
                          <Td>{item.phone}</Td>
                          <Td>
                            <Badge status={item.status}>{item.status}</Badge>
                          </Td>
                          <Td style={{ textAlign: "center" }}>
                            <Button
                              primary
                              onClick={() => handleViewDetails(item, index)}
                            >
                              <Eye size={14} />
                              View
                            </Button>
                          </Td>
                        </Tr>

                        {/* Show details immediately after the clicked row */}
                        {selectedItem && selectedIndex === index && (
                          <Tr key={`details-${index}`}>
                            <Td
                              colSpan="7"
                              style={{ padding: 0, border: "none" }}
                            >
                              <DetailCard
                                style={{
                                  margin: 0,
                                  boxShadow: "none",
                                  border: "2px solid var(--primary-light)",
                                }}
                              >
                                <DetailHeader onClick={toggleDetails}>
                                  <span>
                                    {selectedItem.clinicalname ||
                                      selectedItem.referrerCode}{" "}
                                    - Detailed Information
                                  </span>
                                  {expandedDetails ? (
                                    <ChevronUp size={18} />
                                  ) : (
                                    <ChevronDown size={18} />
                                  )}
                                </DetailHeader>

                                <DetailBody expanded={expandedDetails}>
                                  <DetailGrid>
                                    <DetailSection>
                                      <SectionTitle>
                                        <User size={16} /> Basic Information
                                      </SectionTitle>
                                      <InfoItem>
                                        <InfoLabel>Referrer Code</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.referrerCode}
                                        </InfoValue>
                                      </InfoItem>
                                      <InfoItem>
                                        <InfoLabel>Clinical Name</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.clinicalname || "N/A"}
                                        </InfoValue>
                                      </InfoItem>
                                      <InfoItem>
                                        <InfoLabel>Type</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.type || "N/A"}
                                        </InfoValue>
                                      </InfoItem>
                                      <InfoItem>
                                        <InfoLabel>Sales Mapping</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.salesMapping || "N/A"}
                                        </InfoValue>
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
                                        <MapPin size={16} /> Contact & Location
                                      </SectionTitle>
                                      <InfoItem>
                                        <InfoLabel>Email</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.email || "N/A"}
                                        </InfoValue>
                                      </InfoItem>
                                      <InfoItem>
                                        <InfoLabel>Phone</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.phone || "N/A"}
                                        </InfoValue>
                                      </InfoItem>
                                      <InfoItem>
                                        <InfoLabel>Alternate Number</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.alternateNumber ||
                                            "N/A"}
                                        </InfoValue>
                                      </InfoItem>
                                      <InfoItem>
                                        <InfoLabel>Address</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.address || "N/A"}
                                        </InfoValue>
                                      </InfoItem>
                                      <InfoItem>
                                        <InfoLabel>Area</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.area || "N/A"}
                                        </InfoValue>
                                      </InfoItem>
                                      <InfoItem>
                                        <InfoLabel>City</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.city || "N/A"}
                                        </InfoValue>
                                      </InfoItem>
                                      <InfoItem>
                                        <InfoLabel>State</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.state || "N/A"}
                                        </InfoValue>
                                      </InfoItem>
                                      <InfoItem>
                                        <InfoLabel>Pincode</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.pincode || "N/A"}
                                        </InfoValue>
                                      </InfoItem>
                                    </DetailSection>
                                  </DetailGrid>

                                  <DetailGrid>
                                    <DetailSection>
                                      <SectionTitle>
                                        <CreditCard size={16} /> Credit
                                        Information
                                      </SectionTitle>
                                      <InfoItem>
                                        <InfoLabel>B2B Type</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.b2bType || "N/A"}
                                        </InfoValue>
                                      </InfoItem>
                                      <InfoItem>
                                        <InfoLabel>Credit Type</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.creditType || "N/A"}
                                        </InfoValue>
                                      </InfoItem>
                                      <InfoItem>
                                        <InfoLabel>Credit Limit</InfoLabel>
                                        <InfoValue>
                                          ₹{selectedItem.creditLimit || "N/A"}
                                        </InfoValue>
                                      </InfoItem>
                                      <InfoItem>
                                        <InfoLabel>Invoice Period</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.invoicePeriod || "N/A"}{" "}
                                          days
                                        </InfoValue>
                                      </InfoItem>
                                    </DetailSection>

                                    <DetailSection>
                                      <SectionTitle>
                                        <FileText size={16} /> Report
                                        Preferences
                                      </SectionTitle>
                                      <InfoItem>
                                        <InfoLabel>Report Delivery</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.reportDelivery || "N/A"}
                                        </InfoValue>
                                      </InfoItem>
                                      <InfoItem>
                                        <InfoLabel>Report Format</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.report || "N/A"}
                                        </InfoValue>
                                      </InfoItem>
                                      <InfoItem>
                                        <InfoLabel>Created At</InfoLabel>
                                        <InfoValue>
                                          {selectedItem.created_at
                                            ? new Date(
                                                selectedItem.created_at
                                              ).toLocaleString()
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
                                                  handlePreviewMOU(
                                                    selectedItem
                                                  );
                                                }}
                                              >
                                                <Eye size={14} />
                                                Preview MOU
                                              </DocumentLink>
                                            </DocumentActions>
                                          ) : (
                                            "No MOU Uploaded"
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
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan="7" style={{ textAlign: "center" }}>
                        {filteredData.length === 0 && data.length > 0
                          ? "No results found for the current filters"
                          : "No data available"}
                      </Td>
                    </Tr>
                  )}
                </tbody>
              </Table>
            </div>

            {/* Pagination */}
            {filteredData.length > 0 && (
              <PaginationContainer>
                <PaginationInfo>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
                  {filteredData.length} entries
                  {(searchTerm || statusFilter || b2bTypeFilter) &&
                    ` (filtered from ${data.length} total entries)`}
                </PaginationInfo>

                <PaginationControls>
                  <PageButton
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </PageButton>

                  {renderPaginationButtons()}

                  <PageButton
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </PageButton>
                </PaginationControls>
              </PaginationContainer>
            )}
          </CardBody>
        </Card>
      </Container>

      {/* Document Preview Modal */}
      {previewModal.isOpen && (
        <ModalOverlay onClick={closePreviewModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{previewModal.fileName}</ModalTitle>
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
                style={{ width: "100%", height: "600px", border: "none" }}
              />
            </ModalBody>
            <ModalFooter>
              <Button onClick={closePreviewModal}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default B2BReport;