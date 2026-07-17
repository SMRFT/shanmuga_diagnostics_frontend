import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiRequest from "../../Auth/apiRequest";

// ─── Data-fetching hook extracted from CHCReport ──────────────────────────────
// Owns the patient list + status maps + the date-range that drives the fetch.
// Behavior (including the two useEffects and their dependency arrays) is
// unchanged from the original inline version.
const useCHCReportData = () => {
  const [patients, setPatients] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [investigationStatuses, setInvestigationStatuses] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const fetchCombinedPatientData = useCallback(async () => {
    setLoading(true);
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];
    const url = `${Labbaseurl}corporate_approval_report/?from_date=${formattedStartDate}&to_date=${formattedEndDate}`;
    const result = await apiRequest(url, "GET");
    if (result.success) {
      const patientData = Array.isArray(result.data?.data)
        ? result.data.data
        : [];
      setPatients(patientData);
      const statusMap = {};
      const investigationStatusMap = {};
      patientData.forEach((patient) => {
        statusMap[patient.patient_id] = {
          status: patient.status,
          barcode: patient.barcode,
        };
        if (patient.barcode) {
          investigationStatusMap[patient.barcode] = {
            chc_tests: patient.chc_tests || [],
            chc_investigation_status:
              patient.chc_investigation_status || "Pending",
            lab_approval: patient.lab_approval || "Pending",
          };
        }
      });
      setStatuses(statusMap);
      setInvestigationStatuses(investigationStatusMap);
    } else {
      setError("Failed to load patient data");
    }
    setLoading(false);
  }, [startDate, endDate, Labbaseurl]);

  const handleApprovalSaved = useCallback(async () => {
    await fetchCombinedPatientData();
    toast.success("Status updated successfully!");
  }, [fetchCombinedPatientData]);

  useEffect(() => {
    if (startDate && endDate) fetchCombinedPatientData();
  }, [fetchCombinedPatientData, startDate, endDate]);

  return {
    patients,
    statuses,
    investigationStatuses,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    loading,
    setLoading,
    error,
    fetchCombinedPatientData,
    handleApprovalSaved,
    Labbaseurl,
  };
};

export default useCHCReportData;
