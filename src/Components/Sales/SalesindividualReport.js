import React from "react";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled, { keyframes } from "styled-components";
import apiRequest from "../Auth/apiRequest";
import {
  Calendar,
  Download,
  FileText,
  Filter,
  Loader2,
  User,
  Image,
} from "lucide-react";

const SalesindividualReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [salesData, setSalesData] = useState([]);
  const [salesMapping, setSalesMapping] = useState("");
  const [filterByMonth, setFilterByMonth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setSalesMapping(storedName);
  }, []);

  // :white_check_mark: Fetch sales data using apiRequest
  useEffect(() => {
    if (selectedDate && salesMapping) {
      setIsLoading(true);
      setError(null);

      const formattedDate = filterByMonth
        ? selectedDate.toISOString().slice(0, 7)
        : selectedDate.toISOString().split("T")[0];

      const url = `${Labbaseurl}getsalesindividual/?salesMapping=${salesMapping}&date=${formattedDate}`;

      apiRequest(url, "GET")
        .then((response) => {
          const data = response?.data || [];
          setSalesData(Array.isArray(data) ? data : []);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError("Failed to fetch data. Please try again.");
          setIsLoading(false);
        });
    }
  }, [selectedDate, salesMapping, filterByMonth, Labbaseurl]);


  const csvHeaders = [
    { label: "Date", key: "date" },
    { label: "Time", key: "time" },
    { label: "Clinical Name", key: "clinicalname" },
    { label: "Sales Mapping", key: "salesMapping" },
    { label: "Person Met", key: "personMet" },
    { label: "Designation", key: "designation" },
    { label: "Location", key: "location" },
    { label: "Phone Number", key: "phoneNumber" },
    { label: "No. of Visits", key: "noOfVisits" },
    { label: "Comments", key: "comments" },
    { label: "Type", key: "type" },
    { label: "Image", key: "image" },
  ];

  return (
    <Container>
      <Card>
        <Header>
          <HeaderContent>
            <HeaderIcon>
              <FileText size={24} />
            </HeaderIcon>
            <Title>Sales Visit Log Report</Title>
          </HeaderContent>
          <UserInfo>
            <UserIcon>
              <User size={16} />
            </UserIcon>
            <Username>{salesMapping}</Username>
          </UserInfo>
        </Header>

        <FilterCard>
          <FilterHeader>
            <FilterIcon>
              <Filter size={18} />
            </FilterIcon>
            <FilterTitle>Filter Options</FilterTitle>
          </FilterHeader>

          <FilterContent>
            <FilterGroup>
              <CheckboxLabel>
                <CheckboxInput
                  type="checkbox"
                  checked={filterByMonth}
                  onChange={() => setFilterByMonth(!filterByMonth)}
                />
                <span>{filterByMonth ? "Monthly View" : "Daily View"}</span>
              </CheckboxLabel>
            </FilterGroup>

            <DatePickerWrapper>
              <DatePickerIcon>
                <Calendar size={18} />
              </DatePickerIcon>
              <StyledDatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat={filterByMonth ? "MMMM yyyy" : "dd MMMM yyyy"}
                showMonthYearPicker={filterByMonth}
                customInput={<DatePickerButton />}
                popperClassName="date-picker-popper"
                popperPlacement="bottom-start"
                popperModifiers={{
                  preventOverflow: {
                    enabled: true,
                    escapeWithReference: false,
                    boundariesElement: "scrollParent",
                  },
                  flip: {
                    enabled: true,
                    behavior: ["bottom", "top", "bottom-start", "top-start"],
                  },
                }}
              />
            </DatePickerWrapper>
          </FilterContent>
        </FilterCard>

        <ContentWrapper>
          {isLoading ? (
            <LoadingContainer>
              <Spinner>
                <Loader2 size={30} />
              </Spinner>
              <LoadingText>Loading data...</LoadingText>
            </LoadingContainer>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : salesData.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <FileText size={48} strokeWidth={1} />
              </EmptyStateIcon>
              <EmptyStateText>
                No data available for the selected date.
              </EmptyStateText>
              <EmptyStateSubtext>
                Try selecting a different date or filter option.
              </EmptyStateSubtext>
            </EmptyState>
          ) : (
            <>
              <ActionBar>
                <ResultCount>{salesData.length} records found</ResultCount>
                <StyledCSVLink
                  data={salesData.map((item) => ({
                    ...item,
                    image: item.visit_image_id
                      ? `${Labbaseurl}serve_sales_image/${item.visit_image_id}/`
                      : "N/A",
                  }))}
                  headers={csvHeaders}
                  filename="SalesReport.csv"
                >
                  <DownloadIcon>
                    <Download size={16} />
                  </DownloadIcon>
                  Export CSV
                </StyledCSVLink>
              </ActionBar>

              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      {csvHeaders.map((header) => (
                        <Th key={header.key}>{header.label}</Th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.map((row, index) => (
                      <TableRow key={index} delay={index * 0.03}>
                        {csvHeaders.map((header) => (
                          <Td key={header.key}>
                            {header.key === "image" ? (
                              row.visit_image_id ? (
                                <a
                                  href={`${Labbaseurl}serve_sales_image/${row.visit_image_id}/`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "#4a6cf7",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    textDecoration: "none",
                                  }}
                                >
                                  <Image size={16} /> View
                                </a>
                              ) : (
                                "N/A"
                              )
                            ) : (
                              row[header.key]
                            )}
                          </Td>
                        ))}
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            </>
          )}
        </ContentWrapper>
      </Card>

      {/* Global styles for date picker */}
      <GlobalDatePickerStyles />
    </Container>
  );
};

// Custom DatePicker Button
const DatePickerButton = React.forwardRef(({ value, onClick }, ref) => (
  <DatePickerCustomButton onClick={onClick} ref={ref}>
    {value}
  </DatePickerCustomButton>
));
DatePickerButton.displayName = "DatePickerButton";

// Global styles component for date picker
const GlobalDatePickerStyles = styled.div`
  .date-picker-popper {
    z-index: 99999 !important;
    position: fixed !important;
  }

  .react-datepicker {
    z-index: 99999 !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 8px !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !important;
    position: relative !important;
  }

  .react-datepicker__header {
    background-color: #4a6cf7 !important;
    border-bottom: 1px solid #3b5de7 !important;
    border-top-left-radius: 8px !important;
    border-top-right-radius: 8px !important;
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name {
    color: white !important;
  }

  .react-datepicker__day--selected {
    background-color: #4a6cf7 !important;
    color: white !important;
  }

  .react-datepicker__day:hover {
    background-color: #eef2ff !important;
  }

  .react-datepicker__navigation {
    top: 10px !important;
  }

  .react-datepicker__navigation--previous {
    border-right-color: white !important;
  }

  .react-datepicker__navigation--next {
    border-left-color: white !important;
  }

  /* Ensure date picker is always visible */
  .react-datepicker-popper {
    z-index: 99999 !important;
    position: fixed !important;
  }
`;

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
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

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  color: #333;
  background-color: #f5f7fa;
  min-height: 100vh;
  position: relative;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: visible;
  animation: ${fadeIn} 0.5s ease-out;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #4a6cf7, #2451b7);
  color: white;
  border-radius: 12px 12px 0 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 8px 12px;
  border-radius: 8px;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }
`;

const UserIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Username = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 0;
`;

const FilterCard = styled.div`
  margin: 20px 24px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: visible;
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: 0.1s;
  animation-fill-mode: both;
  position: relative;
  z-index: 1000;

  @media (max-width: 768px) {
    margin: 16px 12px;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 8px 8px 0 0;
`;

const FilterIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a6cf7;
`;

const FilterTitle = styled.h3`
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  color: #334155;
`;

const FilterContent = styled.div`
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  position: relative;
  z-index: 1000;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #475569;
  transition: color 0.2s ease;

  &:hover {
    color: #4a6cf7;
  }
`;

const CheckboxInput = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;

  &:checked {
    background-color: #4a6cf7;
    border-color: #4a6cf7;
  }

  &:checked::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 6px;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  &:hover {
    border-color: #4a6cf7;
  }
`;

const DatePickerWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  z-index: 1000;
`;

const DatePickerIcon = styled.div`
  position: absolute;
  left: 12px;
  z-index: 1001;
  color: #4a6cf7;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const StyledDatePicker = styled(DatePicker)`
  padding: 10px 12px 10px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #334155;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 180px;
  position: relative;
  z-index: 1000;

  &:hover,
  &:focus {
    border-color: #4a6cf7;
    outline: none;
    box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 200px;
  }
`;

const DatePickerCustomButton = styled.button`
  padding: 10px 12px 10px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #334155;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 180px;
  text-align: left;
  position: relative;
  z-index: 1000;

  &:hover {
    border-color: #4a6cf7;
    box-shadow: 0 2px 4px rgba(74, 108, 247, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 200px;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Spinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${rotate} 1.5s linear infinite;
  color: #4a6cf7;
  margin-bottom: 16px;
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #64748b;
  margin: 0;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

const ErrorMessage = styled.div`
  margin: 40px 24px;
  padding: 16px;
  background-color: #fee2e2;
  border-left: 4px solid #ef4444;
  color: #b91c1c;
  border-radius: 6px;
  font-size: 15px;
  animation: ${fadeIn} 0.3s ease-out;

  @media (max-width: 768px) {
    margin: 24px 12px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #64748b;
  animation: ${fadeIn} 0.3s ease-out;
`;

const EmptyStateIcon = styled.div`
  color: #cbd5e1;
  margin-bottom: 16px;
`;

const EmptyStateText = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
`;

const EmptyStateSubtext = styled.p`
  font-size: 14px;
  margin: 0;
  color: #94a3b8;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;

  @media (max-width: 768px) {
    padding: 16px 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const ResultCount = styled.div`
  font-size: 14px;
  color: #64748b;
`;

const StyledCSVLink = styled(CSVLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #4a6cf7;
  color: white;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(74, 108, 247, 0.2);

  &:hover {
    background-color: #3b5de7;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(74, 108, 247, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DownloadIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TableContainer = styled.div`
  margin: 0 24px 24px;
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: 0.3s;
  animation-fill-mode: both;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    margin: 0 12px 12px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  white-space: nowrap;
`;

const Th = styled.th`
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 5;
`;

const TableRow = styled.tr`
  opacity: 0;
  animation: ${fadeIn} 0.5s forwards;
  animation-delay: ${(props) => props.delay}s;

  &:nth-child(even) {
    background-color: #f8fafc;
  }

  &:hover {
    background-color: #eef2ff;
  }

  transition: background-color 0.2s ease;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
`;

export default SalesindividualReport;
