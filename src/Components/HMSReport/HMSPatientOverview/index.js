import React, { useEffect, useState, useRef, useMemo } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Modal from "react-modal";
import "react-datepicker/dist/react-datepicker.css";
import HMSTestSorting from "../HMSTestSorting";
import HMSMBTestSorting from "../HMSMBTestSorting";
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
  Minus,
  Plus,
} from "lucide-react";
import { IoIosFemale, IoIosMale, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";

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
  GenderIcon,
  PrintDropdown,
  PortalDropdownMenu,
  DropdownItem,
  NavigationContainer,
  NavigationTab,
  DepartmentCell,
  DepartmentPill,
  StatusBadgeContainer,
} from "./styles";
import {
  isPrintAndMailEnabled,
  isSortingEnabled,
  isMBTestSortingEnabled,
  isOnlyMicrobiology,
  isOnlyMolecularBiology,
  getBadgeColor,
  getDepartmentStatus,
} from "./helpers";
import useHMSPatientOverviewData from "./useHMSPatientOverviewData";
import generatePatientReportPdf from "./generatePatientReportPdf";
import TestStatusModal from "./TestStatusModal";

const HMSPatientOverview = () => {
  const {
    patients,
    statuses,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    loading,
    setLoading,
    error,
  } = useHMSPatientOverviewData();
  const [activeDropdownPatientId, setActiveDropdownPatientId] = useState(null);
  const [activeDropdownType, setActiveDropdownType] = useState(null);
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
  const [isMBTestModalOpen, setIsMBTestModalOpen] = useState(false);
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
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

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
        (!patientName || // patientName now holds the unified search term
          patient.patient_id
            ?.toLowerCase()
            .includes(patientName.toLowerCase()) ||
          patient.ipnumber?.toLowerCase().includes(patientName.toLowerCase()) ||
          patient.barcode?.toLowerCase().includes(patientName.toLowerCase()) ||
          patient.patient_name
            ?.toLowerCase()
            .includes(patientName.toLowerCase())) &&
        (!statusFilter || patientStatus === statusFilter) &&
        (!opIpFilter || patient.opiptype === opIpFilter) &&
        matchesDepartment // Add this line
      );
    });
  }, [
    startDate,
    endDate,
    patients,
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
  };

  const handleBarcodeStep = (delta) => {
    setPatientName((prev) => {
      const match = prev.match(/^(.*?)(\d+)$/);
      if (match) {
        const prefix = match[1];
        const num = parseInt(match[2], 10);
        const padLength = match[2].length;
        const next = Math.max(0, num + delta);
        const newVal = prefix + String(next).padStart(padLength, "0");
        // Keep the other search state fields in sync
        setPatientId(newVal);
        setIPNumber(newVal);
        setBarcode(newVal);
        return newVal;
      }
      const newVal = delta > 0 ? prev + "1" : prev;
      setPatientId(newVal);
      setIPNumber(newVal);
      setBarcode(newVal);
      return newVal;
    });
  };

  // PDF generation for a patient's report lives in its own module — this is
  // just a thin call-through so the rest of the component (and the
  // WhatsApp-share flow below) can keep calling `handlePrint(patient, withLetterpad)`.
  const handlePrint = (patient, withLetterpad = true) =>
    generatePatientReportPdf(patient, withLetterpad, { Labbaseurl, setLoading });

  const handleWhatsAppShare = async (patient, withLetterpad = true) => {
    if (!patient || !patient.phone) {
      toast.error("Patient phone number is missing");
      return;
    }

    const phoneNumber = patient.phone.startsWith("+91")
      ? patient.phone.replace("+", "")
      : `91${patient.phone}`;

    try {
      const pdfBlob = await handlePrint(patient, withLetterpad);
      if (!pdfBlob) {
        toast.error("Failed to generate the PDF");
        return;
      }

      const pdfName = `${patient.patient_name || "Patient"}_TestDetails.pdf`;
      const pdfFile = new File([pdfBlob], pdfName, { type: "application/pdf" });

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

      let extractedCollectedTime = patient.collection_time || "N/A";
      let extractedCollectedDate = patient.collected_date || "N/A";

      if (extractedCollectedTime === "N/A" || extractedCollectedDate === "N/A") {
        if (patient.test_statuses && patient.test_statuses.length > 0) {
          const testWithTime = patient.test_statuses.find(t => t.sample_collected_time);
          if (testWithTime) {
            const dateObj = new Date(testWithTime.sample_collected_time);
            extractedCollectedTime = format(dateObj, "hh:mm a");
            extractedCollectedDate = format(dateObj, "dd MMM yyyy");
          }
        }
      }

      const res = await axios.post(`${Labbaseurl}send-whatsapp/`, {
        patient_name: patient.patient_name || "Valued Patient",
        phone: phoneNumber,
        collection_time: extractedCollectedTime,
        collected_date: extractedCollectedDate,
        file_url: fileUrl,
        pdf_name: pdfName,
        patient_id: patient.patient_id,
        template_name: "hms_diagnostics_template",
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
  const openMBTestModal = (patient) => {
    setSelectedPatient(patient);
    setIsMBTestModalOpen(true);
  };

  const showDropdown = (barcode, type, e) => {
    // Calculate where to place the portal menu based on the trigger button position
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 4, // 4px gap below the button
      left: rect.right - 190, // align right edge of menu with button right edge
    });
    setActiveDropdownPatientId(barcode);
    setActiveDropdownType(type);
  };

  const hideDropdown = () => {
    setActiveDropdownPatientId(null);
    setActiveDropdownType(null);
  };

  // Precompute per-row derived data (status lookup, sorting/print flags, badge color,
  // department pills) for every visible patient so this isn't recalculated on every
  // render (e.g. hovering a print icon, opening a modal) that doesn't actually change
  // filteredPatients or statuses.
  const enrichedPatients = useMemo(() => {
    return filteredPatients.map((patient) => {
      // Use barcode to look up status since it's unique per test registration
      const patientStatus = statuses[patient.barcode] || {};
      const status = patientStatus.status || "Loading...";
      const barcode = patientStatus.barcode || patient.barcode || "N/A";
      const isMBSortingEnabledFlag = isMBTestSortingEnabled(patient);
      const onlyMB = isOnlyMicrobiology(patient);
      const onlyMolBio = isOnlyMolecularBiology(patient);
      const isPrintMailEnabled =
        !onlyMB && !onlyMolBio && isPrintAndMailEnabled(status);
      const isSortingEnabledFlag = !onlyMB && isSortingEnabled(status);
      const badgeColor = getBadgeColor(status);
      const departmentStatuses = getDepartmentStatus(patient);

      return {
        patient,
        status,
        barcode,
        isMBSortingEnabledFlag,
        onlyMB,
        onlyMolBio,
        isPrintMailEnabled,
        isSortingEnabledFlag,
        badgeColor,
        departmentStatuses,
      };
    });
  }, [filteredPatients, statuses]);

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
          <Title>Shanmuga Patient Status</Title>
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
            <FilterGroup style={{ gridColumn: "span 2" }}>
              <FilterLabel>Search</FilterLabel>
              <BarcodeSearchWrapper>
                <FilterInput
                  type="text"
                  placeholder="Search by OP Number, IP Number, Barcode or Patient Name"
                  value={patientName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPatientName(val);
                    setPatientId(val);
                    setIPNumber(val);
                    setBarcode(val);
                  }}
                  style={{ flex: 1, minWidth: 0 }}
                />
                <StepButton
                  type="button"
                  title="Decrement barcode number"
                  onClick={() => handleBarcodeStep(-1)}
                >
                  <Minus size={14} />
                </StepButton>
                <StepButton
                  type="button"
                  title="Increment barcode number"
                  onClick={() => handleBarcodeStep(1)}
                >
                  <Plus size={14} />
                </StepButton>
              </BarcodeSearchWrapper>
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
              <FilterLabel>OP/IP Type</FilterLabel>
              <FilterSelect
                value={opIpFilter}
                onChange={(e) => setopIpFilter(e.target.value)}
              >
                <option value="">All Type</option>
                <option value="OP">OP</option>
                <option value="IP">IP</option>
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
                <th>Date / Gen Time</th>
                <th>OP/IP Info</th>
                <th>Patient Name & Mobile</th>
                <th>Barcode</th>
                <th>Referral</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Loading patient data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={8}
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
                enrichedPatients.map(
                  ({
                    patient,
                    status,
                    barcode,
                    isMBSortingEnabledFlag,
                    isPrintMailEnabled,
                    isSortingEnabledFlag,
                    badgeColor,
                    departmentStatuses,
                  }) => {

                  return (
                    <tr key={`${patient.patient_id}-${patient.barcode}`}>
                      <td>
                        <div>
                          {patient.date
                            ? format(new Date(patient.date), "yyyy-MM-dd")
                            : "N/A"}
                        </div>
                        {patient.barcode_generated_time && (
                          <div style={{ fontSize: "0.7rem", color: "var(--gray)", marginTop: "0.15rem", whiteSpace: "nowrap" }}>
                            {format(new Date(patient.barcode_generated_time), "dd-MMM-yy HH:mm")}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: "0.75rem", color: "var(--primary-dark)" }}>{patient.opiptype}</div>
                        {patient.opiptype === "IP" ? (
                          <div>
                            <span style={{ fontSize: "0.7rem", color: "var(--gray)" }}>IP:</span> {patient.ipnumber || "N/A"}
                            {patient.patient_id && (
                              <div style={{ fontSize: "0.7rem", color: "var(--gray)" }}>UHID: {patient.patient_id}</div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <span style={{ fontSize: "0.7rem", color: "var(--gray)" }}>OP:</span> {patient.patient_id || "N/A"}
                          </div>
                        )}
                      </td>
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
                      <td>{barcode}</td>
                      <td>{patient.refby || "N/A"}</td>
                      <td>
                        <DepartmentCell>
                          {departmentStatuses.map((deptInfo, idx) => (
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
                          {patient.opiptype === "OP" && (
                            <PrintDropdown
                              onMouseEnter={(e) =>
                                isPrintMailEnabled &&
                                showDropdown(patient.barcode, "whatsapp", e)
                              }
                              onMouseLeave={hideDropdown}
                            >
                              <ActionButton
                                disabled={!isPrintMailEnabled}
                                title="Share via WhatsApp"
                              >
                                <MessageCircle size={16} />
                              </ActionButton>
                            </PrintDropdown>
                          )}
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
                  <td colSpan={8}>
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
                  onMouseEnter={() => {
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
                        Share with Letterpad
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          handleWhatsAppShare(activePatient, false);
                          hideDropdown();
                        }}
                      >
                        Share without Letterpad
                      </DropdownItem>
                    </>
                  )}
                </PortalDropdownMenu>
              );
            })(),
            document.body,
          )}
      </Card>

      {/* Test Sorting Modal */}
      {isTestModalOpen && (
        <HMSTestSorting
          patient={selectedPatient}
          onClose={() => setIsTestModalOpen(false)}
        />
      )}
      {/* M/B Test Sorting Modal */}
      {isMBTestModalOpen && (
        <HMSMBTestSorting
          patient={selectedPatient}
          onClose={() => setIsMBTestModalOpen(false)}
        />
      )}
      {/* Test Status Modal */}
      <TestStatusModal
        isOpen={isTestStatusModalOpen}
        patient={selectedPatientForStatus}
        onClose={() => setIsTestStatusModalOpen(false)}
      />
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

export default HMSPatientOverview;
