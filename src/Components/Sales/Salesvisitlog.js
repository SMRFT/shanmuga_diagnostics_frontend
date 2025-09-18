import apiRequest from "../Auth/apiRequest";
import axios from "axios";
import { useState, useEffect, useMemo, useRef } from "react";
import styled, { css } from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import {
  FaPlus,
  FaSearch,
  FaTimes,
  FaCalendar,
  FaUser,
  FaBuilding,
  FaPhone,
  FaMapMarkerAlt,
  FaTag,
  FaComments,
} from "react-icons/fa";
import HospitalLabForm from "../Sales/HospitalLabForm";

// Media queries
const breakpoints = {
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
};

const media = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
};

// Theme colors
const theme = {
  primary: "#4361ee",
  primaryHover: "#3a56d4",
  secondary: "#f8f9fa",
  text: "#333",
  textLight: "#6c757d",
  border: "#ced4da",
  error: "#e63946",
  success: "#2a9d8f",
  background: "#ffffff",
  cardBg: "#ffffff",
};

// Animation for alert appearance
const fadeIn = css`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  animation: fadeIn 0.3s ease-out forwards;
`;

const fadeOut = css`
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
  animation: fadeOut 0.3s ease-out forwards;
`;

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f5f7fb;
  padding: 16px;

  ${media.sm} {
    padding: 24px;
  }
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
  background: ${theme.cardBg};
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);

  ${media.lg} {
    padding: 32px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  border-bottom: 1px solid #eaedf3;
  padding-bottom: 16px;

  ${media.md} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.text};
  margin: 0 0 8px 0;

  ${media.md} {
    font-size: 1.75rem;
    margin: 0;
  }
`;

const SalespersonName = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${theme.textLight};

  svg {
    margin-right: 6px;
  }

  ${media.md} {
    font-size: 1rem;
  }
`;

const AlertContainer = styled.div`
  margin: 0 0 20px 0;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${fadeIn}

  ${(props) => props.isClosing && fadeOut}
 
  background-color: ${(props) =>
    props.type === "success"
      ? "rgba(42, 157, 143, 0.1)"
      : props.type === "danger"
      ? "rgba(230, 57, 70, 0.1)"
      : "rgba(67, 97, 238, 0.1)"};

  color: ${(props) =>
    props.type === "success"
      ? theme.success
      : props.type === "danger"
      ? theme.error
      : theme.primary};

  border-left: 4px solid
    ${(props) =>
      props.type === "success"
        ? theme.success
        : props.type === "danger"
        ? theme.error
        : theme.primary};
`;

const AlertText = styled.div`
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${media.md} {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  min-width: 100%;

  ${media.md} {
    min-width: ${(props) =>
      props.halfWidth ? "calc(50% - 8px)" : "calc(33.333% - 11px)"};
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.textLight};
  margin-bottom: 8px;

  svg {
    margin-right: 6px;
    font-size: 14px;
  }
`;

const InputBase = css`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${theme.border};
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  background-color: ${theme.background};
  color: ${theme.text};

  &:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
  }

  &:disabled,
  &[readonly] {
    background-color: ${theme.secondary};
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  ${InputBase}
`;

const Select = styled.select`
  ${InputBase}
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
`;

const DatePickerWrapper = styled.div`
  width: 100%;

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    ${InputBase}
  }

  .react-datepicker__input-container {
    position: relative;

    &:after {
      content: "";
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
    }
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  ${InputBase}
  padding-left: 36px;
  padding-right: ${(props) => (props.hasValue ? "36px" : "12px")};
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.textLight};
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${theme.textLight};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: ${theme.error};
  }
`;

const ResultsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid ${theme.border};
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 50;
`;

const ResultItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover,
  &.selected {
    background-color: ${theme.secondary};
  }
`;

const NoResults = styled.div`
  padding: 12px;
  color: ${theme.textLight};
  font-style: italic;
  text-align: center;
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AddButton = styled.button`
  border: none;
  background: ${theme.primary};
  color: white;
  border-radius: 8px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  flex-shrink: 0;

  &:hover {
    background: ${theme.primaryHover};
  }
`;

const TimeDisplay = styled.div`
  ${InputBase}
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.secondary};
  font-weight: 500;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 24px;
  background: ${theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-end;
  box-shadow: 0 4px 6px rgba(67, 97, 238, 0.2);

  &:hover {
    background: ${theme.primaryHover};
    transform: translateY(-1px);
    box-shadow: 0 6px 8px rgba(67, 97, 238, 0.25);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(67, 97, 238, 0.2);
  }

  ${media.md} {
    min-width: 150px;
  }
`;

const SalesVisitLog = () => {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [date, setDate] = useState(new Date());
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isClosingAlert, setIsClosingAlert] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clinicalNames, setClinicalNames] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const resultsRef = useRef(null);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [formData, setFormData] = useState({
    username: "",
    clinicalname: "",
    type: "",
    salesMapping: "",
    personMet: "",
    designation: "",
    location: "",
    phoneNumber: "",
    noOfVisits: "",
    comments: "",
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setUsername(storedName);
      setFormData((prevData) => ({
        ...prevData,
        username: storedName,
        salesMapping: storedName,
      }));
    }
  }, []);

 

  useEffect(() => {
  const fetchClinicalAndHospital = async () => {
    const result = await apiRequest(`${Labbaseurl}get_all_clinicalnames/`);
    if (result.success) {
      setClinicalNames(result.data?.data || result.data); // this is already merged list
    } else {
      console.error("Error fetching names:", result.error);
    }
  };
  fetchClinicalAndHospital();
}, []);



  // useEffect(() => {
  //   const fetchHospitals = async () => {
  //     const result = await apiRequest(`${Labbaseurl}hospitallabform/`);
     
  //     if (result.success) {
  //       setHospitals(result.data?.data || result.data);
  //     } else {
  //       console.error("Error fetching hospitals:", result.error);
  //     }
  //   };

  //   fetchHospitals();
  // }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  // Combined data source for search
  const combinedData = useMemo(() => clinicalNames, [clinicalNames]);

  // Filtered results based on search term
  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const lowerCaseSearch = searchTerm.toLowerCase().trim();

    return combinedData.filter((item) => {
      const name = (item.clinicalname || item.hospitalName || "").toLowerCase();
      return name.includes(lowerCaseSearch);
    });
  }, [searchTerm, combinedData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Determine whether the name is clinicalname or hospitalName and set form data accordingly
    const selectedData =
      name === "clinicalname" || name === "hospitalName"
        ? combinedData.find(
            (item) => item.clinicalname === value || item.hospitalName === value
          )
        : null;
    if (selectedData) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        personMet: selectedData?.contactPerson || "",
        phoneNumber: selectedData?.contactNumber || "",
        emailId: selectedData?.emailId || "",
        type: selectedData?.type || "",
        salesMapping: selectedData?.salesMapping || "",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle selecting an item from search results
  const handleSelectResult = (item) => {
    const name = item.clinicalname || item.hospitalName;
    setFormData((prevData) => ({
      ...prevData,
      clinicalname: name,
      personMet: item?.contactPerson || "",
      phoneNumber: item?.contactNumber || "",
      emailId: item?.emailId || "",
      type: item?.type || "",
      salesMapping: item?.salesMapping || "",
    }));
    setSearchTerm(name);
    setIsSearchFocused(false);
  };

  // Handle keyboard navigation in search results
  const handleKeyDown = (e) => {
    if (!filteredResults.length) return;

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredResults.length - 1 ? prev + 1 : prev
      );
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
    // Enter
    else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectResult(filteredResults[selectedIndex]);
    }
    // Escape
    else if (e.key === "Escape") {
      setIsSearchFocused(false);
    }
  };

  const formatTimeWithSeconds = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const handleCloseAlert = () => {
    setIsClosingAlert(true);
    setTimeout(() => {
      setMessage({ type: "", text: "" });
      setIsClosingAlert(false);
    }, 300);
  };

  const handleSubmitSalesVisitLog = async (e) => {
    e.preventDefault();
    try {
      // Use current time from the live timer for submission
      const combinedDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        currentTime.getHours(),
        currentTime.getMinutes(),
        currentTime.getSeconds()
      );

      // Convert the selected date and time to IST
      const timezone = "Asia/Kolkata";
      const zonedDate = toZonedTime(combinedDateTime, timezone);
      const formattedDate = format(zonedDate, "yyyy-MM-dd");
      const formattedTime = format(zonedDate, "hh:mm:ss a");

      // Send the formatted date and time to the backend using apiRequest
      const result = await apiRequest(`${Labbaseurl}SalesVisitLog/`, {
          ...formData,
          date: formattedDate,
          time: formattedTime,
        });

      if (result.success) {
        setMessage({
          type: "success",
          text: "Sales Visit form submitted successfully!",
        });
        setTimeout(() => {
          handleCloseAlert();
        }, 3000);

        // Reset form data but keep username
        setFormData({
          username: username,
          clinicalname: "",
          type: "",
          salesMapping: "",
          personMet: "",
          designation: "",
          location: "",
          phoneNumber: "",
          noOfVisits: "",
          comments: "",
        });
        setSearchTerm("");
      } else {
        console.error("Error submitting form:", result.error);
        setMessage({
          type: "danger",
          text: "Failed to submit Sales Visit form.",
        });
        setTimeout(() => {
          handleCloseAlert();
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({
        type: "danger",
        text: "Failed to submit Sales Visit form.",
      });
      setTimeout(() => {
        handleCloseAlert();
      }, 3000);
    }
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchTerm("");
    setFormData((prev) => ({
      ...prev,
      clinicalname: "",
      personMet: "",
      phoneNumber: "",
      emailId: "",
      type: "",
      salesMapping: "",
    }));
    setSelectedIndex(-1);
  };

  return (
    <PageWrapper>
      <Container>
        <Header>
          <Title>Sales Visit Log</Title>
          <SalespersonName>
            <FaUser /> {username}
          </SalespersonName>
        </Header>

        {message.text && (
          <AlertContainer type={message.type} isClosing={isClosingAlert}>
            <AlertText>{message.text}</AlertText>
            <CloseButton onClick={handleCloseAlert}>
              <FaTimes />
            </CloseButton>
          </AlertContainer>
        )}

        <Form onSubmit={handleSubmitSalesVisitLog}>
          <FormSection>
            <FormGroup>
              <Label>
                <FaCalendar /> Date
              </Label>
              <DatePickerWrapper>
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  dateFormat="MM/dd/yyyy"
                />
              </DatePickerWrapper>
            </FormGroup>

            <FormGroup>
              <Label>
                <FaBuilding /> Clinical Name
              </Label>
              <SearchWrapper>
                <SearchContainer>
                  <SearchIcon>
                    <FaSearch />
                  </SearchIcon>
                  <SearchInput
                    type="text"
                    placeholder="Search clinical name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => {
                      setTimeout(() => setIsSearchFocused(false), 200);
                    }}
                    onKeyDown={handleKeyDown}
                    hasValue={searchTerm}
                  />
                  {searchTerm && (
                    <ClearButton type="button" onClick={handleClearSearch}>
                      <FaTimes />
                    </ClearButton>
                  )}
                  {isSearchFocused && (
                    <ResultsDropdown ref={resultsRef}>
                      {filteredResults.length > 0 ? (
                        filteredResults.map((item, index) => (
                          <ResultItem
                            key={index}
                            className={
                              index === selectedIndex ? "selected" : ""
                            }
                            onClick={() => handleSelectResult(item)}
                            onMouseEnter={() => setSelectedIndex(index)}
                          >
                            {item.clinicalname || item.hospitalName}
                          </ResultItem>
                        ))
                      ) : searchTerm.trim() ? (
                        <NoResults>No results found</NoResults>
                      ) : null}
                    </ResultsDropdown>
                  )}
                </SearchContainer>
                <AddButton type="button" onClick={handleShowModal}>
                  <FaPlus />
                </AddButton>
              </SearchWrapper>
            </FormGroup>

            <FormGroup>
              <Label>
                <FaUser /> Salesperson Name
              </Label>
              <Input
                type="text"
                name="salesMapping"
                value={formData.salesMapping || username}  // :white_check_mark: show username if salesMapping is empty
                readOnly // optional: make it read-only if salesperson shouldn't edit
              />
            </FormGroup>

          </FormSection>

          <FormSection>
            <FormGroup>
              <Label>
                <FaTag /> Type
              </Label>
              <Input
                type="text"
                name="type"
                readOnly
                value={formData.type}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FaUser /> Person You Met
              </Label>
              <Input
                type="text"
                name="personMet"
                value={formData.personMet}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FaUser /> Designation
              </Label>
              <Input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              />
            </FormGroup>
          </FormSection>

          <FormSection>
            <FormGroup>
              <Label>
                <FaMapMarkerAlt /> Location
              </Label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FaPhone /> Phone Number
              </Label>
              <Input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Number of Visits</Label>
              <Input
                type="text"
                name="noOfVisits"
                value={formData.noOfVisits}
                onChange={handleChange}
              />
            </FormGroup>
          </FormSection>

          <FormSection>
            <FormGroup>
              <Label>
                <FaComments /> Comments
              </Label>
              <Input
                type="text"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
              />
            </FormGroup>
          </FormSection>

          <Button type="submit">Submit</Button>
        </Form>

        <HospitalLabForm
          show={showModal}
          handleClose={handleCloseModal}
          username={username}
        />
      </Container>
    </PageWrapper>
  );
};

export default SalesVisitLog;