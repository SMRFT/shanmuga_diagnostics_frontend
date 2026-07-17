import { useEffect, useState } from "react";
import apiRequest from "../../Auth/apiRequest";

// Encapsulates the patient-list data fetching (and the loading/error state
// tied to it) for HMSPatientOverview. startDate/endDate double as both the
// fetch range and the date-range filter shown in the UI, so they're
// returned alongside their setters.
export default function useHMSPatientOverviewData() {
  const [patients, setPatients] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Fetch patients when component mounts / date range changes
  useEffect(() => {
    const fetchCombinedPatientData = async () => {
      setLoading(true);
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      const url = `${Labbaseurl}hms_overall_report/?from_date=${formattedStartDate}&to_date=${formattedEndDate}`;

      const result = await apiRequest(url, "GET");

      if (result.success) {
        const patientData = result.data;

        // Set the full patient list; filteredPatients is derived via useMemo in the component
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
    setError,
  };
}
