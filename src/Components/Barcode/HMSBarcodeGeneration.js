import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "../Auth/apiRequest";
// Styled Components
import {
  Calendar,
  User,
  ChevronRight,
  Search,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";

// Modern styled components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const SearchInput = styled.input`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  font-size: 1rem;
  width: 100%;
  background-color: #f8fafc;
  color: #334155;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #94a3b8;
    box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`;

const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const DateInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DateLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StyledDatePicker = styled.input`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  width: 150px;
  background-color: #f8fafc;
  color: #334155;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #94a3b8;
    box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.2);
  }
`;

const ApplyButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-end;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// Table styled components
const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-top: 1.5rem;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #667eea, #764ba2);
`;

const TableHeaderRow = styled.tr``;

const TableHeaderCell = styled.th`
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #334155;
  vertical-align: middle;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background-color: #e0e7ff;
  color: #4f46e5;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background-color: #f8fafc;
  border-radius: 16px;
  border: 1px dashed #cbd5e1;
`;

const EmptyStateText = styled.p`
  color: #64748b;
  font-size: 1rem;
  margin: 0.5rem 0 0;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: ${(props) => (props.active ? "#6366f1" : "#f8fafc")};
  color: ${(props) => (props.active ? "white" : "#64748b")};
  border: 1px solid ${(props) => (props.active ? "#6366f1" : "#e2e8f0")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#4f46e5" : "#e2e8f0")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  padding: 0 1rem;
`;

const ResultsSummary = styled.div`
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
`;

const SummaryText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
  text-align: center;
`;

const HMSBarcodeGeneration = () => {
  const [allPatients, setAllPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [displayedPatients, setDisplayedPatients] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const patientsPerPage = 15; // Increased for table layout
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const navigate = useNavigate();

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest(
        `${Labbaseurl}hms_patients_get_barcode/?from_date=${
          fromDate.toISOString().split("T")[0]
        }&to_date=${toDate.toISOString().split("T")[0]}`,
        "GET"
      );

      if (response.success) {
        const data = response.data.data;
        if (Array.isArray(data)) {
          setAllPatients(data);
          setFilteredPatients(data);
          setTotalPages(Math.ceil(data.length / patientsPerPage));
        } else {
          console.error("Invalid data format:", data);
          setAllPatients([]);
          setFilteredPatients([]);
          setTotalPages(1);
          toast.error("Invalid data format received from server");
        }
      } else {
        console.error("Error fetching patients:", response.error);
        setAllPatients([]);
        setFilteredPatients([]);
        setTotalPages(1);
        toast.error(response.error || "Failed to fetch patients");
      }
    } catch (error) {
      console.error("Unexpected error in fetchPatients:", error);
      setAllPatients([]);
      setFilteredPatients([]);
      setTotalPages(1);
      toast.error("An unexpected error occurred while fetching patients");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateBarcode = (patient, e) => {
    e.stopPropagation(); // Prevent row click if table row has click handler
    // Convert the patient's bill date to a Date object for consistency
    const patientDate = new Date(patient.date);

    navigate("/HMSBarcodeTestDetails", {
      state: {
        patientId: patient.patient_id,
        patientName: patient.patientname,
        age: patient.age,
        gender: patient.gender,
        bill_no: patient.bill_no,
        selectedDate: patientDate, // Now sending the patient's actual bill date
        fromDate: fromDate, // Also include the date range for reference if needed
        toDate: toDate,
      },
    });
  };

  const handleApplyDateRange = () => {
    if (fromDate > toDate) {
      toast.error("From date cannot be later than To date");
      return;
    }
    fetchPatients();
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Filter patients based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPatients(allPatients);
    } else {
      const filtered = allPatients.filter((patient) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          patient.patientname?.toLowerCase().includes(searchLower) ||
          patient.patient_id?.toLowerCase().includes(searchLower) ||
          patient.bill_no?.toString().includes(searchLower) ||
          patient.age?.toString().includes(searchLower) ||
          patient.gender?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredPatients(filtered);
    }

    setCurrentPage(1);
    setTotalPages(
      Math.max(1, Math.ceil(filteredPatients.length / patientsPerPage))
    );
  }, [searchTerm, allPatients]);

  // Update displayed patients based on current page
  useEffect(() => {
    const startIndex = (currentPage - 1) * patientsPerPage;
    setDisplayedPatients(
      filteredPatients.slice(startIndex, startIndex + patientsPerPage)
    );
  }, [currentPage, filteredPatients]);

  // Initialize with today's date
  useEffect(() => {
    handleApplyDateRange();
  }, []);

  // Format the patient.date to show only the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  const getGenderBadgeStyle = (gender) => {
    if (gender.toLowerCase() === "male") {
      return {
        bg: "#dbeafe",
        color: "#2563eb",
      };
    } else if (gender.toLowerCase() === "female") {
      return {
        bg: "#fce7f3",
        color: "#db2777",
      };
    } else {
      return {
        bg: "#e0e7ff",
        color: "#4f46e5",
      };
    }
  };

  // Pagination functions
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatDateRange = () => {
    const fromFormatted = formatDate(fromDate.toISOString());
    const toFormatted = formatDate(toDate.toISOString());

    if (fromFormatted === toFormatted) {
      return `for ${fromFormatted}`;
    }
    return `from ${fromFormatted} to ${toFormatted}`;
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>Patient Barcode Generation</Title>
        <Subtitle>
          Select date range to view patients and generate barcodes for their lab
          tests
        </Subtitle>
      </PageHeader>

      <ControlsContainer>
        <SearchContainer>
          <SearchIcon>
            <Search size={16} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by ID, Name, bill no, age..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <DateRangeContainer>
          <DateInputGroup>
            <DateLabel>From Date</DateLabel>
            <StyledDatePicker
              type="date"
              value={fromDate.toISOString().split("T")[0]}
              onChange={(e) => setFromDate(new Date(e.target.value))}
            />
          </DateInputGroup>

          <DateInputGroup>
            <DateLabel>To Date</DateLabel>
            <StyledDatePicker
              type="date"
              value={toDate.toISOString().split("T")[0]}
              onChange={(e) => setToDate(new Date(e.target.value))}
            />
          </DateInputGroup>

          <ApplyButton onClick={handleApplyDateRange} disabled={isLoading}>
            {isLoading ? "Loading..." : "Apply"}
          </ApplyButton>
        </DateRangeContainer>
      </ControlsContainer>

      {allPatients.length > 0 && (
        <ResultsSummary>
          <SummaryText>
            Found {allPatients.length} patient
            {allPatients.length !== 1 ? "s" : ""} {formatDateRange()}
            {filteredPatients.length !== allPatients.length &&
              ` (${filteredPatients.length} matching search)`}
          </SummaryText>
        </ResultsSummary>
      )}

      {displayedPatients.length > 0 ? (
        <TableContainer>
          <StyledTable>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Patient ID</TableHeaderCell>
                <TableHeaderCell>Patient Name</TableHeaderCell>
                <TableHeaderCell>Age</TableHeaderCell>
                <TableHeaderCell>Gender</TableHeaderCell>

                <TableHeaderCell>Bill No</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {displayedPatients.map((patient, index) => {
                const genderStyle = getGenderBadgeStyle(patient.gender);

                return (
                  <TableRow key={index}>
                    <TableCell>{formatDate(patient.date)}</TableCell>
                    <TableCell>{patient.patient_id}</TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <User size={16} color="#64748b" />
                        <span style={{ fontWeight: "600" }}>
                          {patient.patientname}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{patient.age} years</TableCell>
                    <TableCell>
                      <Badge
                        style={{
                          backgroundColor: genderStyle.bg,
                          color: genderStyle.color,
                        }}
                      >
                        {patient.gender}
                      </Badge>
                    </TableCell>

                    <TableCell>{patient.bill_no || "-"}</TableCell>
                    <TableCell>
                      <ActionButton
                        onClick={(e) => handleGenerateBarcode(patient, e)}
                      >
                        Generate Barcode
                        <ChevronRight size={16} />
                      </ActionButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </StyledTable>
        </TableContainer>
      ) : (
        <EmptyState>
          <Calendar size={40} color="#94a3b8" />
          <EmptyStateText>
            {searchTerm
              ? "No matching patients found. Try a different search term."
              : isLoading
              ? "Loading patients..."
              : "No patients found for the selected date range."}
          </EmptyStateText>
        </EmptyState>
      )}

      {filteredPatients.length > 0 && (
        <PaginationContainer>
          <PageButton onClick={goToPreviousPage} disabled={currentPage === 1}>
            <ChevronLeft size={16} />
          </PageButton>

          {[...Array(Math.min(totalPages, 5))].map((_, index) => {
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = index + 1;
            } else if (currentPage <= 3) {
              pageNumber = index + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + index;
            } else {
              pageNumber = currentPage - 2 + index;
            }

            return (
              <PageButton
                key={pageNumber}
                active={currentPage === pageNumber}
                onClick={() => goToPage(pageNumber)}
              >
                {pageNumber}
              </PageButton>
            );
          })}

          <PageButton
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon size={16} />
          </PageButton>

          <PageInfo>
            Page {currentPage} of {totalPages}
          </PageInfo>
        </PaginationContainer>
      )}
    </PageContainer>
  );
};

export default HMSBarcodeGeneration;