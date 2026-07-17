// Pure helper / formatting functions extracted from HMSPatientOverview.
// None of these read or write component state — they only operate on
// the arguments passed in, so they are safe to share/import anywhere.

// Formats a signed number of seconds as e.g. "1D:02H:03M:04S".
export const formatTimeRemaining = (seconds) => {
  if (seconds === null || seconds === undefined) return null;

  const absSeconds = Math.abs(seconds);
  const days = Math.floor(absSeconds / 86400);
  const hours = Math.floor((absSeconds % 86400) / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const secs = Math.floor(absSeconds % 60);

  let parts = [];

  if (days > 0) {
    parts.push(`${days}D`);
  }
  if (hours > 0 || days > 0) {
    parts.push(`${hours}H`);
  }
  if (minutes > 0 || hours > 0 || days > 0) {
    parts.push(`${minutes}M`);
  }
  parts.push(`${secs}S`);

  return parts.join(":");
};

// Determine icon state based on patient status
export const isPrintAndMailEnabled = (status) =>
  status === "Approved" || status === "Dispatched";

export const isSortingEnabled = (status) =>
  status === "Approved" ||
  status === "Partially Approved" ||
  status === "Partially Dispatched" ||
  status === "Dispatched";

// Check if patient has Microbiology department and its status is Approved
export const isMBTestSortingEnabled = (patient) => {
  if (!patient.department_statuses) return false;

  const microbiologyStatus = patient.department_statuses["Microbiology"];
  return (
    microbiologyStatus === "Approved" ||
    microbiologyStatus === "Partially Approved" ||
    microbiologyStatus === "Partially Dispatched" ||
    microbiologyStatus === "Dispatched"
  );
};

// Returns true if the patient has ONLY Microbiology as their department
export const isOnlyMicrobiology = (patient) => {
  if (!patient.department) return false;
  const departments = patient.department
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);
  return departments.length === 1 && departments[0] === "Microbiology";
};

export const isOnlyMolecularBiology = (patient) => {
  if (!patient.department) return false;
  const departments = patient.department
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);
  return (
    departments.length > 0 &&
    departments.every((d) => d === "Molecular Biology")
  );
};

export const getBadgeColor = (status) => {
  switch (status) {
    case "Registered":
      return "#6c757d"; // Gray
    case "Collected":
      return "#0d6efd"; // Bright Blue
    case "Partially Collected":
      return "#6610f2"; // Indigo/Purple
    case "Received":
      return "#17a2b8"; // Cyan/Turquoise (distinctly different)
    case "Partially Received":
      return "#20c997"; // Teal/Mint Green
    case "Tested":
      return "#d63384"; // Pink/Magenta
    case "Partially Tested":
      return "#fd7e14"; // Orange
    case "Approved":
      return "#28a745"; // Success Green
    case "Partially Approved":
      return "#ffc107"; // Yellow/Amber
    case "Dispatched":
      return "#155724"; // Dark Forest Green
    case "Partially Dispatched":
      return "#617c68";
    default:
      return "#dc3545"; // Red for unknown/error
  }
};

export const getDepartmentStatus = (patient) => {
  if (!patient.department) return [];

  const departments = patient.department.split(",").map((d) => d.trim());
  const departmentStatuses = patient.department_statuses || {};

  return departments.map((dept) => {
    const backendStatus = departmentStatuses[dept] || "Pending";
    let status = backendStatus;
    let color = "#dc3545";
    let isPending = true;

    switch (backendStatus) {
      case "Dispatched":
        color = "#155724";
        isPending = false;
        break;
      case "Approved":
        color = "#28a745";
        isPending = false;
        break;
      case "Tested":
        color = "#d63384";
        isPending = false;
        break;
      case "Received":
        color = "#17a2b8";
        isPending = false;
        break;
      case "Collected":
        color = "#0d6efd";
        isPending = false;
        break;
      case "In Progress":
        color = "#ffc107";
        isPending = false;
        status = "In Progress";
        break;
      default:
        color = "#dc3545";
        isPending = true;
        status = "Pending";
    }

    return { department: dept, status, color, isPending };
  });
};
