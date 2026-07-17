import { useEffect, useState } from "react";
import apiRequest from "../../Auth/apiRequest";

// ─── Data-fetching hook extracted from FranchiseOverview ──────────────────────
// Owns the patient list + status map (keyed by barcode, since a franchise
// patient can have multiple barcodes with different statuses) and the date
// range that drives the fetch. Same single useEffect + dependency array as
// the original inline version.
const useFranchiseOverviewData = () => {
  const [patients, setPatients] = useState([]);
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

      const url = `${Labbaseurl}franchise_overall_report/?from_date=${formattedStartDate}&to_date=${formattedEndDate}`;

      const result = await apiRequest(url, "GET");

      if (result.success) {
        const patientData = Array.isArray(result.data?.data)
          ? result.data.data
          : [];

        // Set the full patient list; filteredPatients is derived via useMemo below
        setPatients(patientData);

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

export default useFranchiseOverviewData;
