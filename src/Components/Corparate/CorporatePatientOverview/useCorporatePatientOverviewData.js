import { useEffect, useState } from "react";
import apiRequest from "../../Auth/apiRequest";

// ─── Data-fetching hook extracted from CorporatePatientOverview ───────────────
// Owns the patient list (+ the currently filtered/displayed list), the
// barcode->status map, and the date range that drives the main fetch. The
// single original useEffect (combined patient data) is kept with an
// identical dependency array so fetch timing is unchanged. The fetch effect
// still sets filteredPatients directly (mirroring the original), the
// caller's own filter effect (in index.js) recomputes it afterwards from the
// local filter UI state.
const useCorporatePatientOverviewData = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Fetch patients when component mounts
  useEffect(() => {
    const fetchCombinedPatientData = async () => {
      setLoading(true);
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      const url = `${Labbaseurl}corporate_overall_report/?from_date=${formattedStartDate}&to_date=${formattedEndDate}`;

      const result = await apiRequest(url, "GET");

      if (result.success) {
        const patientData = Array.isArray(result.data?.data)
          ? result.data.data
          : [];

        // Set the full and filtered patient list
        setPatients(patientData);
        setFilteredPatients(patientData);

        const statusMap = {};
        patientData.forEach((patient) => {
          // Use barcode as the unique key since same patient can have multiple barcodes with different statuses
          statusMap[patient.barcode] = {
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

    if (startDate && endDate) {
      fetchCombinedPatientData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  return {
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
  };
};

export default useCorporatePatientOverviewData;
