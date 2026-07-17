import React, { useEffect, useState, useMemo, useCallback } from "react";
import ReactDOM from "react-dom"; // NEW
import axios from "axios";
import { format } from "date-fns";
import Modal from "react-modal";
import "react-datepicker/dist/react-datepicker.css";
import TestSorting from "../TestSorting";
import MBTestSorting from "../MBTestSorting";
import PatientOverallReport from "../../Finance/PatientOverallReport";
import {
  Calendar,
  Search,
  Printer,
  Mail,
  Flag,
  X,
  List,
  user,
  ChevronDown,
  Filter,
  RefreshCw,
  CreditCard,
  MessageCircle,
  Eye,
} from "lucide-react";
import { IoIosFemale, IoIosMale, IoMdClose } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import apiRequest from "../../Auth/apiRequest";

import {
  GlobalStyle,
  Container,
  Card,
  CardHeader,
  Title,
  FiltersContainer,
  FilterRow,
  FilterGroup,
  FilterLabel,
  FilterInput,
  BarcodeSearchWrapper,
  StepButton,
  FilterSelect,
  ButtonContainer,
  ClearButton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  PaginationContainer,
  PageButton,
  NoData,
  Badge,
  ActionContainer,
  ActionButton,
  CreditAmount,
  GenderIcon,
  PrintDropdown,
  PortalDropdownMenu,
  DropdownItem,
  NavigationContainer,
  NavigationTab,
  DepartmentCell,
  DepartmentPill,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  TestStatusList,
  TestStatusItem,
  TestNameText,
  StatusBadgeContainer,
  TATIndicator,
  TATText,
  TATLabel,
} from "./styles";
import {
  formatTimeRemaining,
  isPrintAndMailEnabled,
  isSortingEnabled,
  isMBTestSortingEnabled,
  isOnlyMicrobiology,
  isOnlyMolecularBiology,
  getBadgeColor,
  getDepartmentStatus,
} from "./helpers";
import { buildPdfDocument } from "./pdfBuilder";
import usePatientOverviewData from "./usePatientOverviewData";

const PatientOverview = () => {
  const {
    patients,
    statuses,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    refByOptions,
    clinicalNames,
    loading,
    setLoading,
    error,
    Labbaseurl,
  } = usePatientOverviewData();

  const [activeDropdownPatientId, setActiveDropdownPatientId] = useState(null);
  const [activeDropdownType, setActiveDropdownType] = useState(null);
  // NEW: position state for the portal dropdown menu
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [branch, setBranch] = useState("");
  const [barcode, setBarcode] = useState("");
  const [B2B, setB2B] = useState("");
  const [refBy, setRefBy] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isMBTestModalOpen, setIsMBTestModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("hms");
  const [isTestStatusModalOpen, setIsTestStatusModalOpen] = useState(false);
  const [selectedPatientForStatus, setSelectedPatientForStatus] =
    useState(null);

  useEffect(() => {
    if (location.pathname === "/HMSPatientOverview") setActiveTab("hms");
    else if (location.pathname === "/PatientOverview")
      setActiveTab("reference");
    else if (location.pathname === "/FranchiseOverview")
      setActiveTab("franchise");
    else if (location.pathname === "/CorporateOverview")
      setActiveTab("corporate");
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "hms") navigate("/HMSPatientOverview");
    else if (tab === "reference") navigate("/PatientOverview");
    else if (tab === "franchise") navigate("/FranchiseOverview");
    else if (tab === "corporate") navigate("/CorporateOverview");
  };

  const TestStatusModal = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
      if (!isTestStatusModalOpen) return;
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, [isTestStatusModalOpen]);

    if (!isTestStatusModalOpen || !selectedPatientForStatus) return null;
    const testStatuses = selectedPatientForStatus.test_statuses || [];

    const calculateLiveSecondsLeft = (test) => {
      if (test.tat_status === "completed") return test.seconds_left;
      if (test.tat_status === "pending" && test.tat_deadline) {
        const deadline = new Date(test.tat_deadline);
        return Math.floor((deadline - currentTime) / 1000);
      }
      return test.seconds_left;
    };

    const formatTATDisplay = (test) => {
      if (!test.tat_time) return null;
      const liveSecondsLeft = calculateLiveSecondsLeft(test);
      if (test.tat_status === "completed") {
        const timeStr = formatTimeRemaining(liveSecondsLeft);
        return liveSecondsLeft >= 0
          ? { label: "Completed", time: `${timeStr} early`, isOverdue: false }
          : { label: "Completed", time: `${timeStr} late`, isOverdue: true };
      } else if (test.tat_status === "pending") {
        const timeStr = formatTimeRemaining(liveSecondsLeft);
        return liveSecondsLeft > 0
          ? { label: "Time Left", time: timeStr, isOverdue: false }
          : { label: "Overdue", time: timeStr, isOverdue: true };
      }
      return { label: "TAT", time: test.tat_time, isOverdue: false };
    };

    return (
      <ModalOverlay onClick={() => setIsTestStatusModalOpen(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>
              Test Status - {selectedPatientForStatus.patient_name}
            </ModalTitle>
            <CloseButton onClick={() => setIsTestStatusModalOpen(false)}>
              <X size={24} />
            </CloseButton>
          </ModalHeader>
          <TestStatusList>
            {testStatuses.length > 0 ? (
              testStatuses.map((test, index) => {
                const tatDisplay = formatTATDisplay(test);
                const liveSecondsLeft = calculateLiveSecondsLeft(test);
                return (
                  <TestStatusItem
                    key={index}
                    highlight={
                      test.status === "Approved" || test.status === "Dispatched"
                    }
                  >
                    <div style={{ flex: 1 }}>
                      <TestNameText>{test.test_name}</TestNameText>
                      {test.sample_collected_time && (
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--gray)",
                            marginTop: "0.25rem",
                          }}
                        >
                          Collected:{" "}
                          {format(
                            new Date(test.sample_collected_time),
                            "dd MMM yy, HH:mm:ss",
                          )}
                        </div>
                      )}
                      {test.approve_time && (
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--gray)",
                            marginTop: "0.25rem",
                          }}
                        >
                          Approved:{" "}
                          {format(
                            new Date(test.approve_time),
                            "dd MMM yy, HH:mm:ss",
                          )}
                        </div>
                      )}
                    </div>
                    <StatusBadgeContainer
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "0.5rem",
                      }}
                    >
                      <Badge color={getBadgeColor(test.status)}>
                        {test.status}
                      </Badge>
                      {tatDisplay && (
                        <TATIndicator secondsLeft={liveSecondsLeft}>
                          <div style={{ textAlign: "center" }}>
                            <TATLabel>{tatDisplay.label}</TATLabel>
                            <TATText>{tatDisplay.time}</TATText>
                          </div>
                        </TATIndicator>
                      )}
                    </StatusBadgeContainer>
                  </TestStatusItem>
                );
              })
            ) : (
              <NoData>No test status information available</NoData>
            )}
          </TestStatusList>
        </ModalContent>
      </ModalOverlay>
    );
  };

  // Expensive filter over the (potentially large) patient list — recomputed
  // only when one of these inputs actually changes, instead of on every
  // render, and without the extra state + effect round-trip render.
  const filteredPatients = useMemo(() => {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    return patients.filter((patient) => {
      const patientDate = new Date(patient.date);
      const patientStatus = statuses[patient.patient_id]?.status || "";
      const matchesDepartment =
        !departmentFilter ||
        (patient.department &&
          patient.department
            .split(",")
            .some((dept) => dept.trim() === departmentFilter));
      return (
        patientDate >= startOfDay &&
        patientDate <= endOfDay &&
        (!branch || patient.b2b === branch) &&
        (!B2B || patient.b2b === B2B) &&
        (!refBy || patient.refby === refBy) &&
        (!patientId || patient.patient_id.includes(patientId)) &&
        (!barcode ||
          patient.barcode?.toLowerCase().includes(barcode.toLowerCase())) &&
        (!patientName ||
          patient.patient_name
            ?.toLowerCase()
            .includes(patientName.toLowerCase())) &&
        (!statusFilter || patientStatus === statusFilter) &&
        (!segmentFilter || patient.segment === segmentFilter) &&
        matchesDepartment
      );
    });
  }, [
    startDate,
    endDate,
    patients,
    branch,
    B2B,
    refBy,
    patientId,
    barcode,
    patientName,
    statusFilter,
    segmentFilter,
    departmentFilter,
    statuses,
  ]);

  // Reset to page 1 whenever the filtered result set would change, preserving
  // prior behavior where filtering and the page reset happened together.
  useEffect(() => {
    setCurrentPage(1);
  }, [
    startDate,
    endDate,
    patients,
    branch,
    B2B,
    refBy,
    patientId,
    barcode,
    patientName,
    statusFilter,
    segmentFilter,
    departmentFilter,
    statuses,
  ]);

  const clearFilters = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setBranch("");
    setBarcode("");
    setB2B("");
    setRefBy("");
    setPatientId("");
    setPatientName("");
    setStatusFilter("");
    setSegmentFilter("");
    setDepartmentFilter("");
  };
  const handleBarcodeStep = (delta) => {
    setBarcode((prev) => {
      const match = prev.match(/^(.*?)(\d+)$/);
      if (match) {
        const prefix = match[1];
        const num = parseInt(match[2], 10);
        const padLength = match[2].length;
        const next = Math.max(0, num + delta);
        return prefix + String(next).padStart(padLength, "0");
      }
      return delta > 0 ? prev + "1" : prev;
    });
  };
  const handleWhatsAppShare = async (patient, withLetterpad = true) => {
    if (!patient || !patient.phone) {
      toast.error("Patient phone number is missing");
      return;
    }
    const phoneNumber = patient.phone.startsWith("+91")
      ? patient.phone.replace("+", "")
      : `91${patient.phone}`;
    try {
      const pdfBlob = await handlePrint(patient, withLetterpad, false);
      if (!pdfBlob) {
        toast.error("Failed to generate the PDF");
        return;
      }
      const pdfName = `${patient.patient_name || "Patient"}_TestDetails.pdf`;
      const pdfFile = new File([pdfBlob], pdfName, { type: "application/pdf" });
      const formData = new FormData();
      formData.append("file", pdfFile);
      const uploadResponse = await axios.post(
        `${Labbaseurl}upload-pdf/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      const fileUrl = uploadResponse.data.file_url;
      if (!fileUrl) {
        toast.error("File upload failed");
        return;
      }
      const res = await axios.post(`${Labbaseurl}send-whatsapp/`, {
        patient_name: patient.patient_name || "Valued Patient",
        phone: phoneNumber,
        collection_time: patient.collection_time || "N/A",
        collected_date: patient.collected_date || "N/A",
        file_url: fileUrl,
        pdf_name: pdfName,
        patient_id: patient.patient_id,
      });
      if (res.data.success)
        toast.success("WhatsApp PDF message sent successfully!");
      else {
        toast.error("Failed to send WhatsApp template message.");
        console.error("Backend error:", res.data.error);
      }
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      toast.error("Error sending WhatsApp message.");
    }
  };

  const handleSendEmail = async (patient, withLetterpad = true) => {
    try {
      const pdfBlob = await handlePrint(patient, withLetterpad, false);
      if (!pdfBlob) {
        toast.error("Failed to generate the PDF.");
        return;
      }
      if (!patient.email) {
        toast.warning("Patient email is missing.");
        return;
      }
      const formData = new FormData();
      formData.append("subject", `Test Details for ${patient.patient_name}`);
      formData.append(
        "message",
        `Dear ${patient.patient_name || "Recipient"},\n\nWe hope this message finds you well. Please find attached the lab test results for ${patient.patient_name || "the patient"}. If you have any questions or require further assistance, feel free to contact us.\n\nThank you for choosing our services.`,
      );
      formData.append("recipients", patient.email);
      formData.append("patient_id", patient.patient_id);
      formData.append("patient_name", patient.patient_name);
      formData.append(
        "attachments",
        new File([pdfBlob], `${patient.patient_name}_TestDetails.pdf`, {
          type: "application/pdf",
        }),
      );
      const emailResponse = await apiRequest(
        `${Labbaseurl}send-email/`,
        "POST",
        formData,
        { "Content-Type": "multipart/form-data" },
      );
      if (emailResponse.success) toast.success("Email sent successfully!");
      else toast.error(`Failed to send email: ${emailResponse.error}`);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email.");
    }
  };

  const handlePrint = async (patient, withLetterpad = true) => {
    try {
      const response = await apiRequest(
        `${Labbaseurl}get_patient_test_details/?barcode=${patient.barcode}`,
        "GET",
      );
      if (!response.success) {
        toast.error(response.error || "Failed to fetch patient details");
        setLoading(false);
        return null;
      }

      let patientDetails;
      let signaturesData = [];
      if (response.data.patient_data && response.data.signatures) {
        patientDetails = response.data.patient_data;
        signaturesData = response.data.signatures;
      } else {
        patientDetails = response.data;
      }
      if (Array.isArray(patientDetails)) {
        patientDetails = {
          ...patientDetails[0],
          testdetails: patientDetails.flatMap(
            (record) => record.testdetails || [],
          ),
        };
      }
      if (
        !patientDetails.testdetails ||
        patientDetails.testdetails.length === 0
      ) {
        toast.error("No test details found for the patient.");
        setLoading(false);
        return null;
      }
      // Keep a copy of all fetched tests (including Molecular Biology) for unapproved tests comparison
      const allFetchedTests = [...(patientDetails.testdetails || [])];

      // Skip Molecular Biology tests from the printed report
      patientDetails.testdetails = patientDetails.testdetails.filter(
        (test) => test.department !== "Molecular Biology",
      );

      if (patientDetails.testdetails.length === 0) {
        toast.error(
          "No printable test details found (Molecular Biology tests are excluded).",
        );
        setLoading(false);
        return null;
      }

      const doc = await buildPdfDocument(
        patientDetails,
        patient,
        signaturesData,
        allFetchedTests,
        withLetterpad,
      );

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
      setLoading(false);
      return pdfBlob;
    } catch (error) {
      console.error("Error while generating the PDF:", error);
      toast.error("An unexpected error occurred while generating the PDF");
      setLoading(false);
      return null;
    }
  };
  // Open modal for editing credit amount
  const openModal = (patient) => {
    setSelectedPatient(patient);
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPatient(null);
  };
  const openTestModal = (patient) => {
    setSelectedPatient(patient);
    setIsTestModalOpen(true);
  };
  const openMBTestModal = (patient) => {
    setSelectedPatient(patient);
    setIsMBTestModalOpen(true);
  };

  // NEW: showDropdown captures the button's screen position for the portal menu
  const showDropdown = (id, type, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 4, // 4px below the button
      left: rect.right - 200, // right-align to button
    });
    setActiveDropdownPatientId(id);
    setActiveDropdownType(type);
  };

  const hideDropdown = useCallback(() => {
    setActiveDropdownPatientId(null);
    setActiveDropdownType(null);
  }, []);

  // Identify which patient is currently active in the portal dropdown
  const activePatient = useMemo(
    () =>
      filteredPatients.find(
        (p) =>
          p.barcode === activeDropdownPatientId ||
          p.patient_id === activeDropdownPatientId,
      ),
    [filteredPatients, activeDropdownPatientId],
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <GlobalStyle />
      <Card>
        <CardHeader>
          <NavigationContainer>
            <NavigationTab
              active={activeTab === "hms"}
              onClick={() => handleTabChange("hms")}
            >
              Shanmuga Lab
            </NavigationTab>
            <NavigationTab
              active={activeTab === "reference"}
              onClick={() => handleTabChange("reference")}
            >
              Shanmuga Diagnostics
            </NavigationTab>
            <NavigationTab
              active={activeTab === "franchise"}
              onClick={() => handleTabChange("franchise")}
            >
              Franchise
            </NavigationTab>
            <NavigationTab
              active={activeTab === "corporate"}
              onClick={() => handleTabChange("corporate")}
            >
              Corporate Health Checkup
            </NavigationTab>
          </NavigationContainer>
          <Title>Diagnostics Patient Status</Title>
        </CardHeader>

        <FiltersContainer>
          <FilterRow>
            <FilterGroup>
              <FilterLabel>Start Date</FilterLabel>
              <FilterInput
                type="date"
                value={startDate.toISOString().split("T")[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>End Date</FilterLabel>
              <FilterInput
                type="date"
                value={endDate.toISOString().split("T")[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Select B2B</FilterLabel>
              <FilterSelect
                value={B2B}
                onChange={(e) => setB2B(e.target.value)}
              >
                <option value="">Select Clinical Name</option>
                {clinicalNames.map((name, index) => (
                  <option key={index} value={name.clinicalname}>
                    {name.clinicalname}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Select Segment</FilterLabel>
              <FilterSelect
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value)}
              >
                <option value="">All Segments</option>
                <option value="B2B">B2B</option>
                <option value="Home Collection">Home Collection</option>
                <option value="Walk-in">Walk-in</option>
              </FilterSelect>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Select Referral</FilterLabel>
              <FilterSelect
                value={refBy}
                onChange={(e) => setRefBy(e.target.value)}
              >
                <option value="">Select Refby</option>
                {refByOptions.map((refby, index) => (
                  <option key={index} value={refby.name}>
                    {refby.name}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Patient ID</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Barcode</FilterLabel>
              <BarcodeSearchWrapper>
                <FilterInput
                  type="text"
                  placeholder="Enter Barcode"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  style={{ flex: 1, minWidth: 0 }}
                />
                <StepButton
                  type="button"
                  title="Decrement barcode number"
                  onClick={() => handleBarcodeStep(-1)}
                >
                  −
                </StepButton>
                <StepButton
                  type="button"
                  title="Increment barcode number"
                  onClick={() => handleBarcodeStep(1)}
                >
                  +
                </StepButton>
              </BarcodeSearchWrapper>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Patient Name</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter patient name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Status</FilterLabel>
              <FilterSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Registered">Registered</option>
                <option value="Collected">Collected</option>
                <option value="Partially Collected">Partially Collected</option>
                <option value="Received">Received</option>
                <option value="Partially Received">Partially Received</option>
                <option value="Tested">Tested</option>
                <option value="Partially Tested">Partially Tested</option>
                <option value="Approved">Approved</option>
                <option value="Partially Approved">Partially Approved</option>
                <option value="Dispatched">Dispatched</option>
              </FilterSelect>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Department</FilterLabel>
              <FilterSelect
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                <option value="Haematology">Haematology</option>
                <option value="Coagulation">Coagulation</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Immunology">Immunology</option>
                <option value="Immunoassay">Immunoassay</option>
                <option value="Serology">Serology</option>
                <option value="Clinical Pathology">Clinical Pathology</option>
                <option value="Clinical Chemistry">Clinical Chemistry</option>
                <option value="Cytology">Cytology</option>
                <option value="Genetics">Genetics</option>
                <option value="Histopathology">Histopathology</option>
                <option value="Immunohistochemistry">
                  Immunohistochemistry
                </option>
                <option value="Microbiology">Microbiology</option>
                <option value="Molecular Biology">Molecular Biology</option>
              </FilterSelect>
            </FilterGroup>
          </FilterRow>
          <ButtonContainer>
            <ClearButton onClick={clearFilters}>
              <X size={16} />
              Clear Filters
            </ClearButton>
          </ButtonContainer>
        </FiltersContainer>

        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <th>Date</th>
                <th>Patient ID</th>
                <th>Barcode</th>
                <th>Patient Name</th>
                <th>Branch</th>
                <th>Referral</th>
                <th>B2B</th>
                <th>Department</th>
                <th>Status</th>
                <th>Credit</th>
                <th>Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {loading ? (
                <tr>
                  <td
                    colSpan={11}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Loading patient data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={11}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--danger)",
                    }}
                  >
                    {error}
                  </td>
                </tr>
              ) : currentPatients.length > 0 ? (
                currentPatients.map((patient) => {
                  const patientStatus = statuses[patient.patient_id] || {};
                  const status = patientStatus.status || "Loading...";
                  const barcodeVal = patientStatus.barcode || "N/A";
                  const isMBSortingEnabledFlag =
                    isMBTestSortingEnabled(patient);
                  const onlyMB = isOnlyMicrobiology(patient);
                  const onlyMolBio = isOnlyMolecularBiology(patient);
                  const isPrintMailEnabled =
                    !onlyMB && !onlyMolBio && isPrintAndMailEnabled(status);
                  const isSortingEnabledFlag =
                    !onlyMB && isSortingEnabled(status);
                  const isWhatsAppEmailEnabled =
                    !onlyMB && !onlyMolBio && isPrintAndMailEnabled(status);
                  const badgeColor = getBadgeColor(status);

                  return (
                    <tr key={patient.patient_id}>
                      <td>
                        {patient.date
                          ? format(new Date(patient.date), "yyyy-MM-dd")
                          : "N/A"}
                      </td>
                      <td>{patient.patient_id}</td>
                      <td>{barcodeVal}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", fontWeight: 500 }}>
                          <GenderIcon gender={patient.gender}>
                            {patient.gender === "Female" ? (
                              <IoIosFemale size={14} />
                            ) : (
                              <IoIosMale size={14} />
                            )}
                          </GenderIcon>
                          {patient.patient_name}
                        </div>
                        {patient.phone && (
                          <div style={{ fontSize: "0.7rem", color: "var(--gray)", marginLeft: "2rem", marginTop: "0.15rem" }}>
                            Mob: {patient.phone}
                          </div>
                        )}
                      </td>
                      <td>{patient.branch || "N/A"}</td>
                      <td>{patient.refby || "N/A"}</td>
                      <td>{patient.b2b || "N/A"}</td>
                      <td>
                        <DepartmentCell>
                          {getDepartmentStatus(patient).map((deptInfo, idx) => (
                            <DepartmentPill
                              key={idx}
                              color={deptInfo.color}
                              isPending={deptInfo.isPending}
                            >
                              {deptInfo.department}: {deptInfo.status}
                            </DepartmentPill>
                          ))}
                        </DepartmentCell>
                      </td>
                      <td>
                        <StatusBadgeContainer>
                          <Badge color={badgeColor}>{status}</Badge>
                          <ActionButton
                            onClick={() => {
                              setSelectedPatientForStatus(patient);
                              setIsTestStatusModalOpen(true);
                            }}
                            title="View Test Details"
                            style={{
                              width: "1.75rem",
                              height: "1.75rem",
                              marginLeft: "0.5rem",
                            }}
                          >
                            <Eye size={14} />
                          </ActionButton>
                        </StatusBadgeContainer>
                      </td>
                      <td>
                        <CreditAmount onClick={() => openModal(patient)}>
                          {patient.credit_amount || "0"}
                        </CreditAmount>
                      </td>
                      <td>
                        <ActionContainer>
                          <ActionButton
                            onClick={() => openMBTestModal(patient)}
                            title={
                              isMBSortingEnabledFlag
                                ? "Sort M/B Tests"
                                : "Microbiology not approved"
                            }
                            disabled={!isMBSortingEnabledFlag}
                          >
                            <List size={16} />
                          </ActionButton>
                          <ActionButton
                            onClick={() => openTestModal(patient)}
                            title="Sort Tests"
                            disabled={!isSortingEnabledFlag}
                          >
                            <List size={16} />
                          </ActionButton>

                          {/* PRINT dropdown trigger — no menu inside, portal renders it outside the table */}
                          <PrintDropdown
                            onMouseEnter={(e) =>
                              isPrintMailEnabled &&
                              showDropdown(patient.barcode, "print", e)
                            }
                            onMouseLeave={hideDropdown}
                          >
                            <ActionButton
                              disabled={!isPrintMailEnabled}
                              title="Print Options"
                            >
                              <Printer size={16} />
                            </ActionButton>
                          </PrintDropdown>

                          {/* WHATSAPP dropdown trigger */}
                          <PrintDropdown
                            onMouseEnter={(e) =>
                              isWhatsAppEmailEnabled && // ← changed
                              showDropdown(patient.patient_id, "whatsapp", e)
                            }
                            onMouseLeave={hideDropdown}
                          >
                            <ActionButton
                              disabled={!isWhatsAppEmailEnabled} // ← changed
                              title="Share via WhatsApp"
                            >
                              <MessageCircle size={16} />
                            </ActionButton>
                          </PrintDropdown>

                          {/* EMAIL dropdown trigger */}
                          <PrintDropdown
                            onMouseEnter={(e) =>
                              isWhatsAppEmailEnabled && // ← changed
                              patient.email &&
                              showDropdown(patient.patient_id, "email", e)
                            }
                            onMouseLeave={hideDropdown}
                          >
                            <ActionButton
                              disabled={
                                !isWhatsAppEmailEnabled || !patient.email
                              } // ← changed
                              title={
                                patient.email
                                  ? "Send Email"
                                  : "Email not available"
                              }
                              style={{
                                opacity: !patient.email ? 0.5 : 1,
                                cursor: !patient.email
                                  ? "not-allowed"
                                  : "pointer",
                              }}
                            >
                              <Mail
                                size={16}
                                color={
                                  patient.email ? "currentColor" : "var(--gray)"
                                }
                              />
                            </ActionButton>
                          </PrintDropdown>
                        </ActionContainer>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11}>
                    <NoData>No patients found</NoData>
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {totalPages > 0 && (
          <PaginationContainer>
            <span style={{ fontSize: "0.875rem", color: "var(--gray)" }}>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPatients.length)} of {filteredPatients.length} entries
            </span>
            {totalPages > 1 && (
              <div>
                <PageButton
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </PageButton>
                {Array.from({ length: totalPages }, (_, i) => {
                  if (
                    i === 0 ||
                    i === totalPages - 1 ||
                    (i >= currentPage - 2 && i <= currentPage)
                  ) {
                    return (
                      <PageButton
                        key={i + 1}
                        active={currentPage === i + 1}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </PageButton>
                    );
                  } else if (
                    i === currentPage - 3 ||
                    i === currentPage + 1
                  ) {
                    return <span key={i + 1}>...</span>;
                  }
                  return null;
                })}
                <PageButton
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </PageButton>
              </div>
            )}
          </PaginationContainer>
        )}
      </Card>

      {/* ── PORTAL DROPDOWN: renders at <body> level, escapes overflow:auto clipping ── */}
      {activeDropdownPatientId &&
        activePatient &&
        ReactDOM.createPortal(
          <PortalDropdownMenu
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            onMouseEnter={() => {
              // Keep the menu open while hovering over it
              setActiveDropdownPatientId(activeDropdownPatientId);
              setActiveDropdownType(activeDropdownType);
            }}
            onMouseLeave={hideDropdown}
          >
            {activeDropdownType === "print" && (
              <>
                <DropdownItem
                  onClick={() => {
                    handlePrint(activePatient, true);
                    hideDropdown();
                  }}
                >
                  Print with Letterpad
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    handlePrint(activePatient, false);
                    hideDropdown();
                  }}
                >
                  Print without Letterpad
                </DropdownItem>
              </>
            )}
            {activeDropdownType === "whatsapp" && (
              <>
                <DropdownItem
                  onClick={() => {
                    handleWhatsAppShare(activePatient, true);
                    hideDropdown();
                  }}
                >
                  Send with Letterpad
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    handleWhatsAppShare(activePatient, false);
                    hideDropdown();
                  }}
                >
                  Send without Letterpad
                </DropdownItem>
              </>
            )}
            {activeDropdownType === "email" && (
              <>
                <DropdownItem
                  onClick={() => {
                    handleSendEmail(activePatient, true);
                    hideDropdown();
                  }}
                >
                  Send with Letterpad
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    handleSendEmail(activePatient, false);
                    hideDropdown();
                  }}
                >
                  Send without Letterpad
                </DropdownItem>
              </>
            )}
          </PortalDropdownMenu>,
          document.body,
        )}

      {isTestModalOpen && (
        <TestSorting
          patient={selectedPatient}
          onClose={() => setIsTestModalOpen(false)}
        />
      )}
      {isMBTestModalOpen && (
        <MBTestSorting
          patient={selectedPatient}
          onClose={() => setIsMBTestModalOpen(false)}
        />
      )}
      <TestStatusModal />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
          content: {
            width: "800px",
            height: "fit-content",
            position: "absolute",
            left: "400px",
            right: "auto",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            overflowY: "auto",
          },
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "15px",
            right: "20px",
            cursor: "pointer",
            fontSize: "20px",
            color: "#333",
          }}
          onClick={closeModal}
        >
          <IoMdClose />
        </div>
        {selectedPatient && (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <PatientOverallReport
              patient_id={selectedPatient.patient_id}
              date={selectedPatient.date}
            />
          </div>
        )}
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
};

export default PatientOverview;
