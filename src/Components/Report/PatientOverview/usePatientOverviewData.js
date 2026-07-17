import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiRequest from "../../Auth/apiRequest";

// ─── Data-fetching hook extracted from PatientOverview ────────────────────────
// Owns the patient list + status map, the referral/clinical-name option
// lists, and the date range that drives the main fetch. The three original
// useEffects (refby options, clinical names, combined patient data) are kept
// with identical dependency arrays so fetch timing is unchanged.
const usePatientOverviewData = () => {
  const [patients, setPatients] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [refByOptions, setRefByOptions] = useState([]);
  const [clinicalNames, setClinicalNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  useEffect(() => {
    const fetchRefby = async () => {
      const result = await apiRequest(`${Labbaseurl}refby/`, "GET");
      if (result.success) setRefByOptions(result.data);
      else {
        setError("Failed to load referral options");
        toast.error(result.error || "Failed to load referral options");
      }
    };
    fetchRefby();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchClinicalNames = async () => {
      const result = await apiRequest(
        `${Labbaseurl}clinical_name/`,
        "GET"
      );
      if (result.success) setClinicalNames(result.data?.data || []);
      else {
        setError("Failed to load clinical names");
        toast.error(result.error || "Failed to load clinical names");
      }
    };
    fetchClinicalNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchCombinedPatientData = async () => {
      setLoading(true);
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];
      const url = `${Labbaseurl}overall_report/?from_date=${formattedStartDate}&to_date=${formattedEndDate}`;
      const result = await apiRequest(url, "GET");
      if (result.success) {
        const patientData = Array.isArray(result.data?.data)
          ? result.data.data
          : [];
        setPatients(patientData);
        const statusMap = {};
        patientData.forEach((patient) => {
          statusMap[patient.patient_id] = {
            status: patient.status,
            barcode: patient.barcode,
          };
        });
        setStatuses(statusMap);
      } else {
        console.error("Error fetching combined patient data:", result.error);
        setError("Failed to load patient data");
      }
      setLoading(false);
    };
    if (startDate && endDate) fetchCombinedPatientData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  return {
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
  };
};

export default usePatientOverviewData;
