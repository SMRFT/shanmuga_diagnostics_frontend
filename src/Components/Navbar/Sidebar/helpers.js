// Default state for every collapsible dropdown section in the sidebar.
export const defaultDropdowns = {
  patientDetails: false,
  billingDetails: false,
  barcodeDetails: false,
  sampleDetails: false,
  routeDetails: false,
  reportDetails: false,
  osreportDetails: false,
  salesDetails: false,
  logisticsDetails: false,
  financeDetails: false,
  misDetails: false,
  b2bDetails: false,
};

// Reads the persisted dropdown open/closed state from localStorage,
// merging it on top of the defaults so newly added dropdown keys are
// always present even for users with stale saved state.
export function loadDropdownState() {
  try {
    const saved = localStorage.getItem("sidebarDropdowns");
    return saved
      ? { ...defaultDropdowns, ...JSON.parse(saved) }
      : defaultDropdowns;
  } catch {
    return defaultDropdowns;
  }
}

// Persists the given dropdown state to localStorage.
export function saveDropdownState(state) {
  localStorage.setItem("sidebarDropdowns", JSON.stringify(state));
}

// Reads the logged-in user's info (role/name/employeeId) from localStorage,
// applying the same fallback values the component previously inlined.
export function loadUserInfo() {
  const userRole = localStorage.getItem("role");
  const userName = localStorage.getItem("name");
  const userEmployeeId =
    localStorage.getItem("employee_id") || localStorage.getItem("employeeId");

  return {
    role: userRole || "",
    name: userName || "User",
    employeeId: userEmployeeId || "N/A",
  };
}
