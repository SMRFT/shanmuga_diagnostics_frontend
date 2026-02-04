"use client";

import { useState, useEffect } from "react";
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
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


// Import header and footer images
import headerImage from "../Images/Header.png";
import FooterImage from "../Images/Footer.png";

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
} from "./InvoiceStyles";

const B2BPatients = () => {
  const [activeTab, setActiveTab] = useState("generate");
  const [patients, setPatients] = useState([]);
  const [clinicalNames, setClinicalNames] = useState([]);
  const [selectedClinicalName, setSelectedClinicalName] = useState("");
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printInvoice, setPrintInvoice] = useState(null);
  const [lastGeneratedInvoice, setLastGeneratedInvoice] = useState(null);
  const [showInvoiceSuccess, setShowInvoiceSuccess] = useState(false);
  const [loading, setLoading] = useState({
    patients: false,
    invoices: true,
    clinicalNames: true,
    generateInvoice: false,
    updateInvoice: false,
    refreshData: false,
  });

  const [showPatientList, setShowPatientList] = useState(false);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [selectedInvoiceForHistory, setSelectedInvoiceForHistory] =
    useState(null);

  const Labbaseurl =
    process.env.REACT_APP_BACKEND_LAB_BASE_URL || "http://localhost:8000/api/";

  useEffect(() => {
    fetchClinicalNames();

    // Set default date range to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    // Format dates as YYYY-MM-DD
    const formatDate = (date) => {
      const offset = date.getTimezoneOffset();
      const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
      return adjustedDate.toISOString().split('T')[0];
    };

    const formattedFromDate = formatDate(firstDay);
    const formattedToDate = formatDate(today);

    setFromDate(formattedFromDate);
    setToDate(formattedToDate);

    // Fetch invoices will be triggered by the date state change in the other useEffect or call it here with params
    fetchInvoices(formattedFromDate, formattedToDate);
  }, []);

  useEffect(() => {
    if (selectedClinicalName) {
      fetchPatients();
    } else {
      setPatients([]);
    }
  }, [selectedClinicalName, fromDate, toDate]);

  const fetchClinicalNames = async () => {
    try {
      setLoading((prev) => ({ ...prev, clinicalNames: true }));

      const token = localStorage.getItem("access_token"); // adjust key if different
      const branch = localStorage.getItem("selected_branch");

      const response = await axios.get(
        `${Labbaseurl}get_clinicalname_invoice/`,
        {
          headers: {
            Authorization: token,
            "Branch-Code": branch,
            "Content-Type": "application/json",
          },
        }
      );

      const carryCredits = response.data.filter(
        (clinical) => clinical.b2bType === "Credit"
      );

      setClinicalNames(carryCredits);
    } catch (error) {
      console.error("Error fetching clinical names:", error);
      toast.error("Failed to load clinical names", { autoClose: 3000 });
    } finally {
      setLoading((prev) => ({ ...prev, clinicalNames: false }));
    }
  };


  const fetchPatients = async () => {
    if (!selectedClinicalName) return;

    try {
      setLoading((prev) => ({ ...prev, patients: true }));

      const token = localStorage.getItem("access_token"); // get token
      const branch = localStorage.getItem("selected_branch"); // or however you store it

      const payload = {
        clinical_name: selectedClinicalName,
        segment: "B2B",
        min_credit: "0.01",
        from_date: fromDate,
        to_date: toDate
      };

      const response = await axios.post(
        `${Labbaseurl}all-patients/`,
        payload,
        {
          headers: {
            Authorization: token,
            "Branch-Code": branch,
            "Content-Type": "application/json",
          },
        }
      );

      const filteredData = response.data.filter(
        (patient) =>
          patient.segment === "B2B" && Number(patient.credit_amount) > 0
      );

      setPatients(filteredData);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to load patients data", { autoClose: 3000 });
    } finally {
      setLoading((prev) => ({ ...prev, patients: false }));
    }
  };


  const fetchInvoices = async () => {
    try {
      setLoading((prev) => ({ ...prev, invoices: true }));

      const token = localStorage.getItem("access_token"); // adjust key if needed
      const branch = localStorage.getItem("selected_branch");
      const response = await axios.get(`${Labbaseurl}get-invoices/`, {
        headers: {
          Authorization: ` ${token}`,
          "Branch-Code": branch,
          "Content-Type": "application/json",
        },
      });

      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to load invoices data", { autoClose: 3000 });
    } finally {
      setLoading((prev) => ({ ...prev, invoices: false }));
    }
  };


  const handleSelectPatient = (patientId) => {
    setSelectedPatients((prev) =>
      prev.includes(patientId)
        ? prev.filter((id) => id !== patientId)
        : [...prev, patientId]
    );
  };

  const handleSelectAll = () => {
    const filteredPatients = getFilteredPatients();
    setSelectedPatients(
      filteredPatients.length === selectedPatients.length
        ? []
        : filteredPatients.map((p) => p.patient_id)
    );
  };

  const getFilteredPatients = () => {
    return patients.filter((p) => {
      const recordDate = new Date(p.date);

      const startDate = fromDate ? new Date(fromDate) : null;
      const endDate = toDate ? new Date(toDate) : null;

      // Fix: make endDate include the entire day
      if (endDate) {
        endDate.setHours(23, 59, 59, 999);
      }

      const isDateMatch =
        (!startDate || recordDate >= startDate) &&
        (!endDate || recordDate <= endDate);

      return isDateMatch;
    });
  };


  const calculateProportionalCredits = (patients, totalPaid, totalCredit) => {
    const proportionalCredits = [];
    let remainingPaid = Number(totalPaid);
    const totalCreditNum = Number(totalCredit);

    patients.forEach((patient, index) => {
      const patientCredit = Number(patient.credit_amount);
      const proportion = patientCredit / totalCreditNum;

      if (index === patients.length - 1) {
        proportionalCredits.push({
          ...patient,
          proportionalCredit: Math.max(0, remainingPaid).toFixed(2),
          proportion: ((remainingPaid / patientCredit) * 100).toFixed(1),
        });
      } else {
        const proportionalAmount = totalPaid * proportion;
        proportionalCredits.push({
          ...patient,
          proportionalCredit: proportionalAmount.toFixed(2),
          proportion: (proportion * 100).toFixed(1),
        });
        remainingPaid -= proportionalAmount;
      }
    });

    return proportionalCredits;
  };

  const handleGenerateInvoice = async () => {
    const selectedData = patients.filter((p) =>
      selectedPatients.includes(p.patient_id)
    );
    if (selectedData.length === 0) {
      toast.warn("Please select at least one patient.", { autoClose: 3000 });
      return;
    }

    if (!selectedClinicalName) {
      toast.warn("Please select a clinical name.", { autoClose: 3000 });
      return;
    }

    setLoading((prev) => ({ ...prev, generateInvoice: true }));
    const totalCreditAmount = selectedData.reduce(
      (sum, p) => sum + Number(p.credit_amount),
      0
    );
    const token = localStorage.getItem("access_token"); // adjust key if needed
    const branch = localStorage.getItem("selected_branch");
    const invoiceData = {
      clinicalName: selectedClinicalName,
      generateDate: new Date().toISOString().split("T")[0],
      fromDate,
      toDate,
      // ❌ remove invoiceNumber (let backend handle it)
      totalCreditAmount: totalCreditAmount.toFixed(2),
      paidAmount: "0.00",
      pendingAmount: totalCreditAmount.toFixed(2),
      patients: selectedData,
      paymentDetails: {},
      proportionalCredits: [],
      paymentHistory: [],
    };

    try {
      const response = await axios.post(
        `${Labbaseurl}generate-invoice/`,
        invoiceData,
        {
          headers: {
            Authorization: token,
            "Branch-Code": branch,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Invoice Generated Successfully!", { autoClose: 3000 });

      // Use response from backend (with invoiceNumber, createdBy, createdAt)
      setLastGeneratedInvoice(response.data);
      setShowInvoiceSuccess(true);

      fetchInvoices();
      setSelectedPatients([]);

      // Auto-hide success banner after 10 seconds
      setTimeout(() => {
        setShowInvoiceSuccess(false);
      }, 10000);
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice. Please try again.", {
        autoClose: 3000,
      });
    } finally {
      setLoading((prev) => ({ ...prev, generateInvoice: false }));
    }
  };


  const handleEditInvoice = (invoice) => {
    const paymentDetails = invoice.paymentDetails
      ? typeof invoice.paymentDetails === "string"
        ? JSON.parse(invoice.paymentDetails)
        : invoice.paymentDetails
      : {};

    const paymentHistory = invoice.paymentHistory
      ? typeof invoice.paymentHistory === "string"
        ? JSON.parse(invoice.paymentHistory)
        : invoice.paymentHistory
      : [];

    setEditingInvoice({
      ...invoice,
      newAmount: invoice.totalCreditAmount,
      newPaidAmount: "0.00",
      currentTotalPaid: invoice.paidAmount || "0.00",
      newPendingAmount: invoice.pendingAmount || invoice.totalCreditAmount,
      paymentDate: "",
      paymentMethod: "",
      paymentDetails: "",
      paymentHistory: paymentHistory,
      originalPaidAmount: invoice.paidAmount || "0.00",
      originalPendingAmount: invoice.pendingAmount || invoice.totalCreditAmount,
      originalTotalAmount: invoice.totalCreditAmount,
    });

    setShowEditModal(true);
  };

  const handleUpdateInvoice = async (invoiceNumber) => {
    try {
      setLoading((prev) => ({ ...prev, updateInvoice: true }));

      const totalAmount = Number.parseFloat(editingInvoice.newAmount);
      const currentTotalPaid = Number.parseFloat(
        editingInvoice.currentTotalPaid
      );
      const newPaymentAmount = Number.parseFloat(editingInvoice.newPaidAmount);

      const updatedTotalPaid = currentTotalPaid + newPaymentAmount;
      const pendingAmount = Math.max(0, totalAmount - updatedTotalPaid).toFixed(
        2
      );

      const paymentDetails = {
        paymentDate: editingInvoice.paymentDate || "",
        paymentMethod: editingInvoice.paymentMethod || "",
        paymentAmount: newPaymentAmount.toFixed(2),
        details: editingInvoice.paymentDetails || "",
      };

      const proportionalCredits = calculateProportionalCredits(
        editingInvoice.patients || [],
        updatedTotalPaid,
        totalAmount
      );

      const paymentHistoryEntry = {
        date: new Date().toISOString(),
        paymentAmount: newPaymentAmount.toFixed(2),
        previousTotalPaid: currentTotalPaid.toFixed(2),
        newTotalPaid: updatedTotalPaid.toFixed(2),
        previousPending: editingInvoice.originalPendingAmount,
        newPending: pendingAmount,
        paymentMethod: editingInvoice.paymentMethod,
        paymentDetails: editingInvoice.paymentDetails,
        proportionalCredits: proportionalCredits,
        updatedBy: localStorage.getItem("name") || "System",
      };

      const existingHistory = editingInvoice.paymentHistory || [];
      const updatedHistory = [...existingHistory, paymentHistoryEntry];

      await axios.post(
        `${Labbaseurl}update-invoice/`,
        {
          invoiceNumber: invoiceNumber,
          totalCreditAmount: editingInvoice.newAmount,
          paidAmount: updatedTotalPaid.toFixed(2),
          pendingAmount: pendingAmount,
          paymentDetails: JSON.stringify(paymentDetails),
          paymentHistory: JSON.stringify(updatedHistory),
          proportionalCredits: JSON.stringify(proportionalCredits),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("access_token") || "", // or your token variable
            "Branch-Code": localStorage.getItem("selected_branch") || "",
          },
        }
      );


      toast.success("Invoice Updated successfully!", { autoClose: 3000 });

      setInvoices(
        invoices.map((invoice) =>
          invoice.invoiceNumber === invoiceNumber
            ? {
              ...invoice,
              totalCreditAmount: editingInvoice.newAmount,
              paidAmount: updatedTotalPaid.toFixed(2),
              pendingAmount: pendingAmount,
              paymentDetails: paymentDetails,
              paymentHistory: updatedHistory,
              proportionalCredits: proportionalCredits,
            }
            : invoice
        )
      );

      setEditingInvoice(null);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update invoice", { autoClose: 3000 });
    } finally {
      setLoading((prev) => ({ ...prev, updateInvoice: false }));
    }
  };

  const handleDeleteInvoice = async (invoiceNumber) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.post(`${Labbaseurl}delete-invoice/`, {
          invoiceNumber: invoiceNumber
        }, {
          headers: {
            Authorization: localStorage.getItem("access_token") || "", // or your token variable
            "Branch-Code": localStorage.getItem("selected_branch") || "",
            "Content-Type": "application/json",
          },
        });

        setInvoices(
          invoices.filter((invoice) => invoice.invoiceNumber !== invoiceNumber)
        );

        Swal.fire("Deleted!", "The invoice has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the invoice.", "error");
        console.error("Delete invoice error:", error);
      }
    }
  };

  const getFilteredInvoices = () => {
    return invoices.filter((invoice) =>
      (invoice.clinicalName || invoice.labName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setEditingInvoice((prev) => {
      const newTotal = Number.parseFloat(value) || 0;
      const currentTotalPaid = Number.parseFloat(prev.currentTotalPaid) || 0;
      const newPending = Math.max(0, newTotal - currentTotalPaid).toFixed(2);

      return {
        ...prev,
        newAmount: value,
        newPendingAmount: newPending,
      };
    });
  };

  const handleNewPaidAmountChange = (e) => {
    const value = e.target.value;
    setEditingInvoice((prev) => ({
      ...prev,
      newPaidAmount: value,
    }));
  };

  // Enhanced PDF generation - Patient Details Only

  const generatePDF = async (invoice) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let headerImgData = null;
    let footerImgData = null;

    try {
      // Preload header image
      const headerImg = new Image();
      headerImg.crossOrigin = "anonymous";
      headerImgData = await new Promise((resolve, reject) => {
        headerImg.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = headerImg.width;
          canvas.height = headerImg.height;
          ctx.drawImage(headerImg, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };
        headerImg.onerror = reject;
        headerImg.src = headerImage;
      });

      // Preload footer image
      const footerImg = new Image();
      footerImg.crossOrigin = "anonymous";
      footerImgData = await new Promise((resolve, reject) => {
        footerImg.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = footerImg.width;
          canvas.height = footerImg.height;
          ctx.drawImage(footerImg, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };
        footerImg.onerror = reject;
        footerImg.src = FooterImage;
      });

      // Add header content to first page
      doc.addImage(headerImgData, "PNG", 10, 10, 190, 30);

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(44, 62, 80);
      doc.text("PATIENT DETAILS REPORT", 105, 55, { align: "center" });

      // Invoice details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 14, 70);
      doc.text(
        `Clinical Name: ${invoice.clinicalName || invoice.labName}`,
        14,
        77
      );
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 84);

      if (invoice.fromDate && invoice.toDate) {
        doc.text(
          `Period: ${new Date(
            invoice.fromDate
          ).toLocaleDateString()} - ${new Date(
            invoice.toDate
          ).toLocaleDateString()}`,
          14,
          91
        );
      }

      // Patient Details Table with Test Names
      if (invoice.patients && invoice.patients.length > 0) {
        const tableData = invoice.patients.map((patient, index) => {
          // Parse proportional credits
          const proportionalCredits = invoice.proportionalCredits
            ? typeof invoice.proportionalCredits === "string"
              ? JSON.parse(invoice.proportionalCredits)
              : invoice.proportionalCredits
            : [];

          const proportionalCredit =
            proportionalCredits.find((p) => p.patient_id === patient.patient_id)
              ?.proportionalCredit || "0.00";

          // Format testname properly - extract from array if it's an array and include amount in brackets with numbering

          let testNameFormatted = "";

          if (Array.isArray(patient.testdetails)) {
            testNameFormatted = patient.testdetails
              .map((test, testIndex) => {
                const amount = test.MRP ? ` (${test.MRP})` : "";
                const tName = test.testname || test.test_name || "N/A";
                return `${testIndex + 1}. ${tName}${amount}`;
              })
              .join("\n");
          } else if (
            typeof patient.testdetails === "object" &&
            patient.testdetails !== null
          ) {
            const amount = patient.testdetails.MRP
              ? ` (${patient.testdetails.MRP})`
              : "";
            const tName = patient.testdetails.testname || patient.testdetails.test_name || "N/A";
            testNameFormatted = `1. ${tName}${amount}`;
          } else {
            testNameFormatted = "N/A";
          }


          return [
            (index + 1).toString(),
            patient.patient_id,
            patient.patientname,
            new Date(patient.bill_date).toLocaleDateString(),
            testNameFormatted,
            `${Number.parseFloat(patient.credit_amount).toFixed(2)}`,
            `${proportionalCredit}`,
            `${(
              Number.parseFloat(patient.credit_amount) - proportionalCredit
            ).toFixed(2)}`,
          ];
        });

        // FIXED: Use standalone autoTable function instead of doc.autoTable
        autoTable(doc, {
          startY: 105,
          head: [
            [
              "S.No",
              "Patient ID",
              "Patient Name",
              "Date",
              "Test Name",
              "Net(Rs).",
              "Rec(Rs).",
              "Due(Rs).",
            ],
          ],
          body: tableData,
          theme: "grid",
          styles: {
            fontSize: 8,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          columnStyles: {
            4: { cellWidth: 50 }, // Test Name column wider
            5: { halign: "right" }, // Net column right aligned
            6: { halign: "right" }, // Received column right aligned
            7: { halign: "right" }, // Due column right aligned
          },
          margin: { top: 20, bottom: 20 },
          pageBreak: "auto",
          showHead: "everyPage",
          didDrawPage: function (data) {
            const pageNumber = data.pageNumber;
            const pageHeight = doc.internal.pageSize.height;
            const pageWidth = doc.internal.pageSize.width;

            // Add header only to first page
            if (pageNumber === 1) {
              // Header is already added above for first page
              // No need to add again here
            }

            // Don't add page numbers here - they will be added later to avoid overlap
          },
        });
      }

      // Summary
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(44, 62, 80); // Reset text color
      doc.text("Summary", 14, finalY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Total Patients: ${invoice.patients.length}`, 14, finalY + 7);
      doc.text(
        `Total Original Credit Amount: ${invoice.totalCreditAmount}`,
        14,
        finalY + 14
      );
      doc.text(`Paid: ${invoice.paidAmount || "0.00"}`, 14, finalY + 21);
      doc.text(
        `Pending: ${invoice.pendingAmount || invoice.totalCreditAmount}`,
        14,
        finalY + 28
      );

      // Add footer only to the last page after all content is added
      const totalPages = doc.internal.getNumberOfPages();
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;

      // Go to the last page
      doc.setPage(totalPages);

      // Add footer image
      doc.addImage(footerImgData, "PNG", 10, pageHeight - 40, 190, 25);

      // Add footer text
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0); // Reset to black
      doc.text(
        `Generated on: ${new Date().toLocaleString()} | Patient Details Report`,
        14,
        pageHeight - 10
      );

      // Update page numbers to show total pages
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 5, {
          align: "center",
        });
      }

      doc.save(`Patient-Details-${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF", { autoClose: 3000 });
    }
  };

  const handlePrintInvoice = (invoice) => {
    setPrintInvoice(invoice);
    setShowPrintModal(true);

    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleRefreshData = async () => {
    setLoading((prev) => ({ ...prev, refreshData: true }));
    try {
      await Promise.all([
        fetchClinicalNames(),
        fetchPatients(),
        fetchInvoices(),
      ]);
      toast.success("Data refreshed successfully", { autoClose: 2000 });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data", { autoClose: 3000 });
    } finally {
      setLoading((prev) => ({ ...prev, refreshData: false }));
    }
  };

  const calculateInvoiceStats = (invoice) => {
    const patients = invoice.patients || [];
    const totalTests = patients.reduce(
      (sum, patient) => sum + (patient.test_count || 1),
      0
    );
    const totalPatients = patients.length;
    const avgCreditPerPatient =
      totalPatients > 0
        ? Number.parseFloat(invoice.totalCreditAmount) / totalPatients
        : 0;

    return {
      totalPatients,
      totalTests,
      avgCreditPerPatient: avgCreditPerPatient.toFixed(2),
      totalAmount: Number.parseFloat(invoice.totalCreditAmount || 0),
      paidAmount: Number.parseFloat(invoice.paidAmount || 0),
      pendingAmount: Number.parseFloat(
        invoice.pendingAmount || invoice.totalCreditAmount || 0
      ),
      paymentPercentage:
        invoice.totalCreditAmount > 0
          ? (
            (Number.parseFloat(invoice.paidAmount || 0) /
              Number.parseFloat(invoice.totalCreditAmount)) *
            100
          ).toFixed(1)
          : 0,
    };
  };

  // Helper function to safely parse payment history
  const getPaymentHistory = (invoice) => {
    if (!invoice?.paymentHistory) return [];

    try {
      if (typeof invoice.paymentHistory === "string") {
        return JSON.parse(invoice.paymentHistory);
      }
      if (Array.isArray(invoice.paymentHistory)) {
        return invoice.paymentHistory;
      }
      return [];
    } catch (error) {
      console.error("Error parsing payment history:", error);
      return [];
    }
  };

  const handleRegenerateInvoice = () => {
    setShowInvoiceSuccess(false);
    setLastGeneratedInvoice(null);
    // Reset form state
    setSelectedClinicalName("");
    setSelectedPatients([]);
    setFromDate("");
    setToDate("");
  };

  const handleViewGeneratedInvoices = () => {
    setActiveTab("generated");
    setShowInvoiceSuccess(false);
  };

  const handleViewPaymentHistory = (invoice) => {
    setSelectedInvoiceForHistory(invoice);
    setShowPaymentHistoryModal(true);
  };

  const getPaymentHistoryStats = (paymentHistory) => {
    if (!paymentHistory || paymentHistory.length === 0) {
      return {
        totalPayments: 0,
        totalAmount: 0,
        averagePayment: 0,
        lastPaymentDate: null,
        mostUsedMethod: "N/A",
      };
    }

    const totalAmount = paymentHistory.reduce(
      (sum, payment) => sum + Number.parseFloat(payment.paymentAmount || 0),
      0
    );
    const totalPayments = paymentHistory.length;
    const averagePayment = totalPayments > 0 ? totalAmount / totalPayments : 0;

    const lastPayment = paymentHistory[paymentHistory.length - 1];
    const lastPaymentDate = lastPayment ? new Date(lastPayment.date) : null;

    const methodCounts = paymentHistory.reduce((acc, payment) => {
      const method = payment.paymentMethod || "Unknown";
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});

    const mostUsedMethod = Object.keys(methodCounts).reduce(
      (a, b) => (methodCounts[a] > methodCounts[b] ? a : b),
      "N/A"
    );

    return {
      totalPayments,
      totalAmount,
      averagePayment,
      lastPaymentDate,
      mostUsedMethod,
    };
  };

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
            onClick={() => {
              const newParams = new URLSearchParams();
              newParams.append("clinical_name", selectedClinicalName);
              newParams.append("segment", "B2B");
              newParams.append("min_credit", "0.01");
              newParams.append("include_invoiced", "true");
              if (fromDate) newParams.append("from_date", fromDate);
              if (toDate) newParams.append("to_date", toDate);

              // Fetch patients including invoiced ones
              axios
                .get(`${Labbaseurl}all-patients/?${newParams.toString()}`)
                .then((response) => {
                  const allData = response.data.filter(
                    (patient) =>
                      patient.segment === "B2B" &&
                      Number(patient.credit_amount) > 0
                  );
                  setPatients(allData);
                  toast.info(
                    "Now showing all patients including invoiced ones",
                    { autoClose: 3000 }
                  );
                })
                .catch((error) => {
                  toast.error("Failed to load all patients", {
                    autoClose: 3000,
                  });
                });
            }}
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
                        </TableRow>
                      )) || (
                          <tr>
                            <td colSpan={5}>
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
              <Badge>{getFilteredInvoices().length} Invoices</Badge>
            </div>
          </TableHeader>

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
                          <IconButton
                            onClick={() =>
                              handleDeleteInvoice(invoice.invoiceNumber)
                            }
                            style={{ color: "red" }}
                          >
                            <Trash2 size={18} />
                          </IconButton>
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
                  <PaymentLabel>Payment Date:</PaymentLabel>
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
                  <PaymentLabel>Payment Method:</PaymentLabel>
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
                  Number(editingInvoice.newPaidAmount) <= 0
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
