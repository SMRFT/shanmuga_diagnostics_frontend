"use client";

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
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import useInvoiceData from "./useInvoiceData";
import { generatePDF } from "./pdfGenerator";
import {
  calculateProportionalCredits,
  calculateInvoiceStats,
  getPaymentHistory,
  getPaymentHistoryStats,
} from "./helpers";

import {
  Container,
  Header,
  Title,
  Subtitle,
  TabsContainer,
  Tab,
  FiltersRow,
  DateFilterGroup,
  DateInputWrapper,
  DateInput,
  StyledCalendarIcon,
  SelectWrapper,
  Select,
  StyledChevronDown,
  Button,
  InvoiceSuccessBanner,
  BannerContent,
  BannerText,
  BannerActions,
  ArrowPointer,
  ArrowIcon,
  ArrowText,
  TableContainer,
  TableHeader,
  TableTitle,
  Table,
  Th,
  Td,
  TableRow,
  IconButton,
  ActionContainer,
  AmountInput,
  Checkbox,
  ScrollContainer,
  Badge,
  SearchContainer,
  SearchInput,
  SearchIconWrapper,
  TabContent,
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalSection,
  ModalSectionTitle,
  AmountCard,
  AmountRow,
  AmountLabel,
  AmountValue,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
  RefreshButton,
  ProportionalCreditContainer,
  ProportionalTitle,
  ProportionalItem,
  ProportionalPatient,
  PatientName,
  PatientId,
  ProportionalAmount,
  OriginalAmount,
  NewAmount,
  PaymentInputRow,
  PaymentLabel,
  PaymentMethodSelect,
  PaymentDetailsInput,
  PaymentHistoryContainer,
  PaymentHistoryTitle,
  PaymentHistoryItem,
  PrintContainer,
  PrintPage,
  PrintHeaderImage,
  PrintFooterImage,
  PrintInvoiceHeader,
  PrintInvoiceTitle,
  PrintInvoiceNumber,
  PrintInvoiceSubtitle,
  PrintStatsSection,
  PrintStatCard,
  PrintStatTitle,
  PrintStatValue,
  PrintStatSubtext,
  FormGroup,
  Label,
  Input,
  InvoiceHeader,
  InvoiceInfo,
  InvoiceInfoLabel,
  InvoiceInfoValue,
  PaymentHistoryModal,
  PaymentHistoryContent,
  PaymentHistoryHeader,
  PaymentHistoryBody,
  PaymentHistoryCard,
  PaymentHistoryCardHeader,
  PaymentHistoryDate,
  PaymentDatePrimary,
  PaymentDateSecondary,
  PaymentHistoryAmount,
  PaymentAmountPrimary,
  PaymentAmountSecondary,
  PaymentHistoryDetails,
  PaymentDetailItem,
  PaymentDetailLabel,
  PaymentDetailValue,
  PaymentMethodBadge,
  PaymentHistoryProgress,
  PaymentProgressLabel,
  PaymentProgressBar,
  PaymentProgressFill,
  PaymentHistoryStats,
  PaymentStatCard,
  PaymentStatValue,
  PaymentStatLabel,
  EmptyPaymentHistory,
  EmptyPaymentIcon,
  EmptyPaymentTitle,
  EmptyPaymentText,
  PrintSummaryGrid,
  PrintSummaryBox,
  PrintSummaryTitle,
  PrintSummaryItem,
  RegenerationPrompt,
  CollapsibleHeader,
  CollapsibleContent,
  CollapsibleText,
  CollapsibleArrow,
  CollapsibleBody,
  PatientListToggle,
  PaymentNote,
  PrintControls,
  PrintButton,
  PrintInfoGrid,
  PrintInfoBox,
  PrintInfoTitle,
  PrintInfoRow,
  PrintTable
} from "../InvoiceStyles";

const B2BPatients = () => {
  const {
    activeTab,
    setActiveTab,
    patients,
    setPatients,
    clinicalNames,
    selectedClinicalName,
    setSelectedClinicalName,
    selectedPatients,
    invoices,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    invoiceListFromDate,
    setInvoiceListFromDate,
    invoiceListToDate,
    setInvoiceListToDate,
    editingInvoice,
    setEditingInvoice,
    searchQuery,
    setSearchQuery,
    showEditModal,
    setShowEditModal,
    showPrintModal,
    printInvoice,
    lastGeneratedInvoice,
    showInvoiceSuccess,
    setShowInvoiceSuccess,
    loading,
    showPatientList,
    setShowPatientList,
    showPaymentHistoryModal,
    setShowPaymentHistoryModal,
    selectedInvoiceForHistory,
    getFilteredPatients,
    getFilteredInvoices,
    handleSelectPatient,
    handleSelectAll,
    handleGenerateInvoice,
    handleEditInvoice,
    handleUpdateInvoice,
    handleDeleteInvoice,
    handleExportCSV,
    handleAmountChange,
    handleNewPaidAmountChange,
    handleRefreshData,
    handleRegenerateInvoice,
    handleViewGeneratedInvoices,
    handleViewPaymentHistory,
    handleShowAllPatients,
  } = useInvoiceData();

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
            onClick={handleShowAllPatients}
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
                          <Td>
                            {lastGeneratedInvoice?.generatedDate
                              ? new Date(
                                lastGeneratedInvoice.generatedDate
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                              : "N/A"}
                          </Td>
                        </TableRow>
                      )) || (
                          <tr>
                            <td colSpan={6}>
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
              <RefreshButton
                onClick={handleExportCSV}
                disabled={getFilteredInvoices().length === 0}
                style={{ background: "#10b981", color: "white", borderColor: "#10b981" }}
              >
                <Download size={16} />
                Export CSV
              </RefreshButton>
              <Badge>{getFilteredInvoices().length} Invoices</Badge>
            </div>
          </TableHeader>

          <FiltersRow style={{ marginBottom: "16px", marginTop: "16px" }}>
            <DateFilterGroup>
              <DateInputWrapper>
                <StyledCalendarIcon />
                <DateInput
                  type="date"
                  value={invoiceListFromDate}
                  onChange={(e) => setInvoiceListFromDate(e.target.value)}
                  placeholder="From Date"
                />
              </DateInputWrapper>
              <DateInputWrapper>
                <StyledCalendarIcon />
                <DateInput
                  type="date"
                  value={invoiceListToDate}
                  onChange={(e) => setInvoiceListToDate(e.target.value)}
                  placeholder="To Date"
                />
              </DateInputWrapper>
            </DateFilterGroup>
          </FiltersRow>

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
                  <Th>Generated Date</Th>
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
                              width: "90px",
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
                        {invoice.generateDate
                          ? new Date(invoice.generateDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          : "N/A"}
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
                          {/* {Number(invoice.paidAmount || 0) === 0 && (
                            <IconButton
                              onClick={() =>
                                handleDeleteInvoice(invoice.invoiceNumber)
                              }
                              style={{ color: "red" }}
                            >
                              <Trash2 size={18} />
                            </IconButton>
                          )} */}
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
                  <PaymentLabel>
                    Payment Date: <span style={{ color: "red" }}>*</span>
                  </PaymentLabel>
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
                  <PaymentLabel>
                    Payment Method: <span style={{ color: "red" }}>*</span>
                  </PaymentLabel>
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
                  Number(editingInvoice.newPaidAmount) <= 0 ||
                  !editingInvoice.paymentDate ||
                  !editingInvoice.paymentMethod
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
