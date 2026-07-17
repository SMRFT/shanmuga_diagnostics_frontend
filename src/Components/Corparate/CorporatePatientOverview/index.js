import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { format } from "date-fns";
import Modal from "react-modal";
import "react-datepicker/dist/react-datepicker.css";
import CorporateTestSorting from "../CorporateTestSorting";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import images
// import Savitha from "../../Images/Savitha.png";
import Dhana from "../../Images/Dhana.png";
import Brindha from "../../Images/Brindha.png";
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
} from "./styles";
import {
  isPrintAndMailEnabled,
  isSortingEnabled,
  getBadgeColor,
  getDepartmentStatus,
} from "./helpers";
import { buildPdfDocument } from "./pdfBuilder";
import useCorporatePatientOverviewData from "./useCorporatePatientOverviewData";

const CorporatePatientOverview = () => {
  const {
    patients,
    filteredPatients,
    setFilteredPatients,
    statuses,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    loading,
    setLoading,
    error,
    Labbaseurl,
  } = useCorporatePatientOverviewData();

  const [activeDropdownPatientId, setActiveDropdownPatientId] = useState(null);
  const [refByOptions, setRefByOptions] = useState([]);
  const [branch, setBranch] = useState("");
  const [barcode, setBarcode] = useState("");
  const [refBy, setRefBy] = useState("");
  const [patientId, setPatientId] = useState("");
  const [IPNumber, setIPNumber] = useState("");
  const [patientName, setPatientName] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [opIpFilter, setopIpFilter] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("hms");
  const [isTestStatusModalOpen, setIsTestStatusModalOpen] = useState(false);
  const [selectedPatientForStatus, setSelectedPatientForStatus] =
    useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  // Set active tab based on current route
  useEffect(() => {
    if (location.pathname === "/HMSPatientOverview") {
      setActiveTab("hms");
    } else if (location.pathname === "/PatientOverview") {
      setActiveTab("reference");
    } else if (location.pathname === "/FranchiseOverview") {
      setActiveTab("franchise");
    } else if (location.pathname === "/CorporateOverview") {
      setActiveTab("corporate");
    }
  }, [location.pathname]);

  // Handle tab navigation
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "hms") {
      navigate("/HMSPatientOverview");
    } else if (tab === "reference") {
      navigate("/PatientOverview");
    } else if (tab === "franchise") {
      navigate("/FranchiseOverview");
    } else if (tab === "corporate") {
      navigate("/CorporateOverview");
    }
  };

  const TestStatusModal = () => {
    if (!isTestStatusModalOpen || !selectedPatientForStatus) return null;

    const testStatuses = selectedPatientForStatus.test_statuses || [];

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
              testStatuses.map((test, index) => (
                <TestStatusItem
                  key={index}
                  highlight={
                    test.status === "Approved" || test.status === "Dispatched"
                  }
                >
                  <TestNameText>{test.test_name}</TestNameText>
                  <Badge color={getBadgeColor(test.status)}>
                    {test.status}
                  </Badge>
                </TestStatusItem>
              ))
            ) : (
              <NoData>No test status information available</NoData>
            )}
          </TestStatusList>
        </ModalContent>
      </ModalOverlay>
    );
  };

  useEffect(() => {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    const filtered = patients.filter((patient) => {
      const patientDate = new Date(patient.date);
      // Use barcode to lookup status since it's the unique identifier
      const patientStatus = statuses[patient.barcode]?.status || "";
      // Department filter logic
      const matchesDepartment =
        !departmentFilter ||
        (patient.department &&
          patient.department
            .split(",")
            .some((dept) => dept.trim() === departmentFilter));
      return (
        patientDate >= startOfDay &&
        patientDate <= endOfDay &&
        (!refBy || patient.refby === refBy) &&
        (!patientId || patient.patient_id.includes(patientId)) &&
        (!IPNumber || patient.ipnumber?.includes(IPNumber)) &&
        (!barcode ||
          patient.barcode?.toLowerCase().includes(barcode.toLowerCase())) &&
        (!patientName ||
          patient.patient_name
            ?.toLowerCase()
            .includes(patientName.toLowerCase())) &&
        (!statusFilter || patientStatus === statusFilter) &&
        (!opIpFilter || patient.opiptype === opIpFilter) &&
        matchesDepartment // Add this line
      );
    });
    setFilteredPatients(filtered);
  }, [
    startDate,
    endDate,
    patients,
    refBy,
    patientId,
    barcode,
    IPNumber,
    patientName,
    statusFilter,
    departmentFilter,
    opIpFilter,
    statuses,
  ]);
  // Update the clearFilters function to reset the status filter
  const clearFilters = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setBarcode("");
    setRefBy("");
    setPatientId("");
    setIPNumber("");
    setPatientName("");
    setStatusFilter("");
    setDepartmentFilter("");
    setopIpFilter("");
    setFilteredPatients(patients);
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

  const handleWhatsAppShare = async (patient) => {
    if (!patient || !patient.mobile) {
      toast.error("Patient phone number is missing");
      return;
    }

    const phoneNumber = patient.mobile.startsWith("+91")
      ? patient.mobile.replace("+", "")
      : `91${patient.mobile}`;

    try {
      const pdfBlob = await handlePrint(patient, true);
      if (!pdfBlob) {
        toast.error("Failed to generate the PDF");
        return;
      }

      const pdfName = `${patient.patient_name || "Patient"}_TestDetails.pdf`;
      const pdfFile = new File([pdfBlob], pdfName, { type: "application/pdf" });

      // Upload PDF to server
      const formData = new FormData();
      formData.append("file", pdfFile);

      const uploadResponse = await axios.post(`${Labbaseurl}upload-pdf/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileUrl = uploadResponse.data.file_url;
      if (!fileUrl) {
        toast.error("File upload failed");
        return;
      }

      // Call Django proxy instead of Botify directly
      const res = await axios.post(`${Labbaseurl}send-whatsapp/`, {
        patient_name: patient.patient_name || "Valued Patient",
        phone: phoneNumber,
        collection_time: patient.collection_time || "N/A",
        collected_date: patient.collected_date || "N/A",
        file_url: fileUrl,
        pdf_name: pdfName,
        template_name: "chc_report",
      });

      if (res.data.success) {
        toast.success("WhatsApp PDF message sent successfully!");
      } else {
        toast.error("Failed to send WhatsApp template message.");
        console.error("Backend error:", res.data.error);
      }
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      toast.error("Error sending WhatsApp message.");
    }
  };

  //  const handleSendEmail = async (patient) => {
  //   try {
  //     const pdfBlob = await handlePrint(patient, true); // Generate PDF with letterpad
  //     if (!pdfBlob) {
  //       toast.error("Failed to generate the PDF.");
  //       return;
  //     }

  //     if (!patient.email) {
  //       toast.warning("Patient email is missing.");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("subject", `Test Details for ${patient.patient_name}`);
  //     formData.append(
  //       "message",
  //       `Dear ${
  //         patient.patient_name || "Recipient"
  //       },\n\nWe hope this message finds you well. Please find attached the lab test results for ${
  //         patient.patient_name || "the patient"
  //       }. If you have any questions or require further assistance, feel free to contact us.\n\nThank you for choosing our services.`
  //     );
  //     formData.append("recipients", patient.email);
  //     formData.append(
  //       "attachments",
  //       new File([pdfBlob], `${patient.patient_name}_TestDetails.pdf`, {
  //         type: "application/pdf",
  //       })
  //     );

  //     const emailResponse = await apiRequest(
  //       `${Labbaseurl}send-email/`,
  //       "POST",
  //       formData,
  //       { "Content-Type": "multipart/form-data" }
  //     );

  //     if (emailResponse.success) {
  //       toast.success("Email sent successfully!");
  //     } else {
  //       toast.error(`Failed to send email: ${emailResponse.error}`);
  //     }
  //   } catch (error) {
  //     console.error("Error sending email:", error);
  //     toast.error("Failed to send email.");
  //   }
  // };

  const handlePrint = async (patient, withLetterpad = true) => {
    try {
      const response = await apiRequest(
        `${Labbaseurl}corporate_patient_test_details/?barcode=${patient.barcode}`,
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

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPatient(null);
  };

  const openTestModal = (patient) => {
    setSelectedPatient(patient);
    setIsTestModalOpen(true);
  };

  const showDropdown = (barcode, e) => {
    // Calculate where to place the portal menu based on the trigger button position
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 4, // 4px gap below the button
      left: rect.right - 190, // align right edge of menu with button right edge
    });
    setActiveDropdownPatientId(barcode);
  };

  const hideDropdown = () => {
    setActiveDropdownPatientId(null);
  };

  return (
    <Container>
      <GlobalStyle />
      <Card>
        <CardHeader>
          {/* Navigation Tabs */}
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
          <Title>CHC Patient Status</Title>
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
              <FilterLabel>Patient ID</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter Patient ID"
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
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Loading patient data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--danger)",
                    }}
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  // Use barcode to look up status since it's unique per test registration
                  const patientStatus = statuses[patient.barcode] || {};
                  const status = patientStatus.status || "Loading...";
                  const barcode =
                    patientStatus.barcode || patient.barcode || "N/A";
                  const isPrintMailEnabled = isPrintAndMailEnabled(status);
                  const isSortingEnabledFlag = isSortingEnabled(status);
                  const badgeColor = getBadgeColor(status);

                  return (
                    <tr key={`${patient.patient_id}-${patient.barcode}`}>
                      <td>
                        {patient.date
                          ? format(new Date(patient.date), "yyyy-MM-dd")
                          : "N/A"}
                      </td>
                      <td>{patient.patient_id}</td>
                      <td>{barcode}</td>
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
                        {patient.mobile && (
                          <div style={{ fontSize: "0.7rem", color: "var(--gray)", marginLeft: "2rem", marginTop: "0.15rem" }}>
                            Mob: {patient.mobile}
                          </div>
                        )}
                      </td>
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
                        <ActionContainer>
                          <ActionButton
                            onClick={() => openTestModal(patient)}
                            title="Sort Tests"
                            disabled={!isSortingEnabledFlag}
                          >
                            <List size={16} />
                          </ActionButton>

                          <PrintDropdown
                            onMouseEnter={(e) =>
                              isPrintMailEnabled &&
                              showDropdown(patient.barcode, e)
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
                          <ActionButton
                            disabled={!isPrintMailEnabled || !patient.mobile}
                            onClick={() =>
                              isPrintMailEnabled && patient.mobile && handleWhatsAppShare(patient)
                            }
                            title={patient.mobile ? "Share via WhatsApp" : "Phone number missing"}
                          >
                            <MessageCircle size={16} />
                          </ActionButton>
                          {/*
                          <ActionButton
                            disabled={!isPrintMailEnabled}
                            onClick={() =>
                              isPrintMailEnabled && handleSendEmail(patient)
                            }
                            title="Send Email"
                          >
                            <Mail size={16} />
                          </ActionButton> */}
                        </ActionContainer>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7}>
                    <NoData>No patients found</NoData>
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div
          style={{
            padding: "1rem 1.5rem",
            textAlign: "right",
            color: "var(--gray)",
            fontSize: "0.875rem",
            borderTop: "1px solid var(--gray-light)",
          }}
        >
          Showing {filteredPatients.length}{" "}
          {filteredPatients.length === 1 ? "entry" : "entries"}
        </div>
        {activeDropdownPatientId &&
          ReactDOM.createPortal(
            (() => {
              // Find which patient triggered the dropdown so we can pass it to handlePrint
              const activePatient = filteredPatients.find(
                (p) => p.barcode === activeDropdownPatientId,
              );
              if (!activePatient) return null;

              return (
                <PortalDropdownMenu
                  style={{ top: dropdownPos.top, left: dropdownPos.left }}
                  // Keep the menu open while hovering over it
                  onMouseEnter={() =>
                    setActiveDropdownPatientId(activeDropdownPatientId)
                  }
                  onMouseLeave={hideDropdown}
                >
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
                </PortalDropdownMenu>
              );
            })(),
            document.body,
          )}
      </Card>

      {/* Test Sorting Modal */}
      {isTestModalOpen && (
        <CorporateTestSorting
          patient={selectedPatient}
          onClose={() => setIsTestModalOpen(false)}
        />
      )}

      {/* Test Status Modal */}
      <TestStatusModal />
      {/* Credit Amount Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "800px",
            height: "fit-content",
            position: "absolute",
            left: "400px", // Adjusted for sidebar width
            right: "auto",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adding shadow
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            overflowY: "auto",
          },
        }}
      >
        {/* Close Icon at Top-Right */}
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
        {/* Pass patient_id and date as props */}
        {selectedPatient && (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          ></div>
        )}
      </Modal>
    </Container>
  );
};

export default CorporatePatientOverview;
