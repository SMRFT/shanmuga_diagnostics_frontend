import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  filterPatientsByDateRange,
  filterInvoicesBySearch,
  calculateProportionalCredits,
  buildInvoicesCsv,
} from "./helpers";

// Encapsulates all of the Invoice (B2BPatients) component's state,
// data-fetching, and CRUD/action handlers. Extracted verbatim from the
// component body - the JSX in index.js is unchanged, it just reads these
// values/functions from this hook instead of from local variables.
export default function useInvoiceData() {
  const [activeTab, setActiveTab] = useState("generate");
  const [patients, setPatients] = useState([]);
  const [clinicalNames, setClinicalNames] = useState([]);
  const [selectedClinicalName, setSelectedClinicalName] = useState("");
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  // New state for invoice list filtering
  const [invoiceListFromDate, setInvoiceListFromDate] = useState("");
  const [invoiceListToDate, setInvoiceListToDate] = useState("");
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
    setInvoiceListFromDate(formattedFromDate);
    setInvoiceListToDate(formattedToDate);

    // Initial fetch handled by the new useEffect on invoiceList dates
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
        `${Labbaseurl}get_clinicalname_invoice/?limit=500`,
        {
          headers: {
            Authorization: token,
            "Branch-Code": branch,
            "Content-Type": "application/json",
          },
        }
      );

      const carryCredits = response.data.data.filter(
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

      const filteredData = (
        Array.isArray(response.data?.data) ? response.data.data : []
      ).filter(
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

      const token = localStorage.getItem("access_token");
      const branch = localStorage.getItem("selected_branch");

      const payload = {};
      if (invoiceListFromDate) payload.from_date = invoiceListFromDate;
      if (invoiceListToDate) payload.to_date = invoiceListToDate;

      const response = await axios.post(`${Labbaseurl}get-invoices/`, payload, {
        headers: {
          Authorization: ` ${token}`,
          "Branch-Code": branch,
          "Content-Type": "application/json",
        },
      });

      setInvoices(
        Array.isArray(response.data?.data) ? response.data.data : [],
      );
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to load invoices data", { autoClose: 3000 });
    } finally {
      setLoading((prev) => ({ ...prev, invoices: false }));
    }
  };
  // Refetch invoices when date filters change
  useEffect(() => {
    if (invoiceListFromDate && invoiceListToDate) {
      fetchInvoices();
    }
  }, [invoiceListFromDate, invoiceListToDate]);

  const getFilteredPatients = () =>
    filterPatientsByDateRange(patients, fromDate, toDate);

  const getFilteredInvoices = () =>
    filterInvoicesBySearch(invoices, searchQuery);

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
    // Validation for mandatory fields
    if (!editingInvoice.paymentDate || !editingInvoice.paymentMethod) {
      toast.error("Payment Date and Payment Method are mandatory.");
      return;
    }

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

  const handleExportCSV = () => {
    const filteredInvoices = getFilteredInvoices();
    if (filteredInvoices.length === 0) {
      toast.error('No invoices to export');
      return;
    }

    const csvContent = buildInvoicesCsv(filteredInvoices);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'Generated_Invoices.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  // Fetches patients including ones that are already invoiced (used by the
  // "Show All Patients" button). Extracted verbatim from the inline JSX
  // onClick handler it previously lived in.
  const handleShowAllPatients = () => {
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
        const allData = (
          Array.isArray(response.data?.data)
            ? response.data.data
            : []
        ).filter(
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
  };

  return {
    activeTab,
    setActiveTab,
    patients,
    setPatients,
    clinicalNames,
    setClinicalNames,
    selectedClinicalName,
    setSelectedClinicalName,
    selectedPatients,
    setSelectedPatients,
    invoices,
    setInvoices,
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
    setShowPrintModal,
    printInvoice,
    setPrintInvoice,
    lastGeneratedInvoice,
    setLastGeneratedInvoice,
    showInvoiceSuccess,
    setShowInvoiceSuccess,
    loading,
    setLoading,
    showPatientList,
    setShowPatientList,
    showPaymentHistoryModal,
    setShowPaymentHistoryModal,
    selectedInvoiceForHistory,
    setSelectedInvoiceForHistory,
    fetchClinicalNames,
    fetchPatients,
    fetchInvoices,
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
    handlePrintInvoice,
    handleRefreshData,
    handleRegenerateInvoice,
    handleViewGeneratedInvoices,
    handleViewPaymentHistory,
    handleShowAllPatients,
  };
}
