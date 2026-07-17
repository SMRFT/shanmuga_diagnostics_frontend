// ─── Pure helpers extracted from CorporatePatientOverview ─────────────────────
// None of these read React state directly; any data they need is passed in as
// an argument by the caller (patient/status objects), so behavior is
// unchanged from the original inline versions.

export const isPrintAndMailEnabled = (status) =>
  status === "Approved" || status === "Dispatched";

export const isSortingEnabled = (status) =>
  status === "Approved" ||
  status === "Partially Approved" ||
  status === "Partially Dispatched" ||
  status === "Dispatched";

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
