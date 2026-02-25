import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Access the redirect URL from environment variables
const REDIRECT_URL = process.env.REACT_APP_LOGIN_REDIRECT_URL;

console.log("=== LAB INDEX.JS DEBUG ===");
console.log("REDIRECT_URL:", REDIRECT_URL);

// --- Function to set token for local development ---
function setforlocaldev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDE1NyIsImVtYWlsIjoiZ20ubGFic2FsZXNAc21yZnQub3JnIiwibmFtZSI6IlN1bmRhciBNIiwiYWxsb3dlZC1hY3Rpb25zIjpbIlNULVAtQlJELVIiLCJTRC1BUEktVkMtUlciLCJGRS1QLUZGLVJXIiwiU0QtUC1NSVMtUiIsIlNELVAtU1MtUlciLCJTVC1QLURFUy1SIiwiU0QtUC1HUEQtUlciLCJTVC1QLU5URi1SIiwiU0QtUC1QQi1SIiwiU0QtUC1URC1SIiwiU0QtUC1TSEYtUiIsIlNELUFQSS1SQ0wtUlciLCJTRC1QLVBELVIiLCJTRC1QLUxUUi1SVyIsIlNELVAtTEJOLVIiLCJTRC1BUEktR09SLVJXIiwiU0QtUC1CVEQtUlciLCJTRC1BUEktR1ItUlciLCJTRC1QLUJBLVJXIiwiU0QtQVBJLVZQLVJXIiwiU0QtQVBJLUNOLVJXIiwiU0QtUC1MU0wtUlciLCJTRC1QLUJCQS1SVyIsIlNELVAtUEctUiIsIlNELVAtQ0hDLVIiLCJTRC1BUEktR0QtUiIsIlNELVAtQkEtUiIsIkZFLVAtRkctUlciLCJTVC1QLVNOTy1SVyIsIlNELVAtU1NVLVIiLCJTRC1QLUNMLVJXIiwiU0QtUC1DSEMtUlciLCJTRC1QLU9ELVIiLCJTRC1QLUxCQy1SVyIsIlNULVAtQ01ULVJXIiwiU0QtQVBJLU1JUy1SVyIsIlNELVAtU09SLVJXIiwiU0QtUC1TR0FDLVJXIiwiU0QtUC1QQi1SVyIsIlNELVAtTUJQRC1SIiwiU0QtUC1MVE0tUlciLCJTRC1QLVNHRS1SIiwiU0QtQVBJLUdDLVJXIiwiU1QtUC1UREwtUiIsIlNELUFQSS1JVk0tUlciLCJTRC1QLVBGLVIiLCJTRC1QLUxELVJXIiwiU0QtUC1TUC1SIiwiU0QtUC1MR0QtUlciLCJTRC1QLVNIRi1SVyIsIlNELUFQSS1NQlRELVJXIiwiU1QtQVBJLUNSRC1SVyIsIlNULVItSE9EIiwiU0QtQVBJLVBSLVIiLCJTRC1QLVNHQUMtUiIsIlNELVAtUEYtUlciLCJTRC1QLVRFLVJXIiwiU0QtUC1QT1YtUlciLCJTRC1QLVRTLVJXIiwiU0QtQVBJLVJCLVIiLCJTRC1QLU1CVFYtUiIsIlNELVAtREYtUiIsIlNELVAtTUJERi1SVyIsIlNELVAtREYtUlciLCJTRC1QLVRFLVIiLCJTRC1BUEktR09DLVJXIiwiU0QtUC1CVEQtUiIsIlNELUFQSS1UVi1SIiwiU0QtUC1TQy1SIiwiU0QtUC1TUy1SIiwiU0QtUC1TVkYtUiIsIlNULUFQSS1BTUMtUlciLCJGRS1QLUZBTC1SIiwiU0QtQVBJLVRNLVIiLCJTVC1QLVRETC1SVyIsIlNELVItR00iLCJTRC1QLVBMLVIiLCJTRC1QLVNJUi1SVyIsIlNULVAtTlRGLVJXIiwiU0QtUC1HUFQtUlciLCJTRC1QLUdQQi1SVyIsIlNELVAtU1ZGLVJXIiwiU0QtQVBJLUlWTS1SIiwiRkUtUC1GR0wtUiIsIkZFLVAtRlMtUlciLCJTRC1QLVRELVJXIiwiU1QtQVBJLUVNUC1SIiwiU1QtQVBJLUJSRC1SVyIsIlNELVAtR1BELVIiLCJHUC1QLUdDTi1SIiwiU1QtUC1ERVMtUlciLCJTRC1QLVNWRC1SIiwiU1QtUC1DTVQtUiIsIlNELUFQSS1UTS1SVyIsIlNELVAtTFRBLVJXIiwiU0QtUC1MUkMtUiIsIlNELVAtQkctUiIsIkZFLVItRkEiLCJTRC1BUEktVEQtUiIsIlNELVAtTFNSLVJXIiwiU0QtUC1HU1AtUiIsIkZFLVAtRlVTLVJXIiwiRkUtUC1GR0YtUiIsIlNELVAtVVBCLVIiLCJTRC1QLVNDVS1SVyIsIlNELVAtU1NVLVJXIiwiU0QtUC1QRy1SVyIsIkZFLVAtRlItUlciLCJTRC1QLVJELVJXIiwiU0QtUC1VUEItUlciLCJTRC1QLUxQSS1SIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3NzIwMTU1MDIsImV4cCI6MTc3MjEwMjUwMiwianRpIjoiYTU1N2UzMWYtOWMyMC00MjBlLWFhMTMtMGUzMzQ4Y2Q5ZTc2In0.H35vfvtKwyE-muWFmHrbrzLfRF_N_O4_Q2SS8TuxhjBkX1OfhXtSaGuPzUu5BWMNzf7Ssqiq1boKtSuLQjJTFyjPr-qISmNMnDPfG-d0d1AjuFmDiyRoCpKol-Rafp9ug5D7_uQ5HTqgLK525hiY5bVHVl1FTWd8sUUdrxDP5UopcpEB_VAg-LvPM2Pmja9evvgtfnp0zNfuU0qzThOzPRytG9l2HaOSrNVfBoGyvMS7P8kji7tKMZtYeRxAD15SPU4Kmct2M0lpyzK04IL5DGi2D34qWoJGvQWSJIrwL6KQH0YINlpm-gft5IDGRT59E7RPXDMRKA2RSR-XWpo-fQ";
  console.log("🔧 Development token is empty - will redirect to login");
  const selectedBranch = "SHB001";
  localStorage.setItem("selected_branch", selectedBranch);
  return dev_token;
}

// --- Function to redirect to login ---
function redirectToLogin() {
  if (REDIRECT_URL) {
    console.log("🔄 Redirecting to login URL:", REDIRECT_URL);
    window.location.href = REDIRECT_URL;
  } else {
    console.error("❌ REDIRECT_URL not configured");
    // Even if REDIRECT_URL is not configured, don't show error - just redirect to a fallback
    window.location.href = "https://shinova.in/login";
  }
}

// --- Validate JWT Token Locally ---
function validate(token) {
  if (!token || token.trim() === "") {
    throw new Error("Token is empty");
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      throw new Error("Token expired");
    }
    return payload;
  } catch (err) {
    throw new Error("Invalid token");
  }
}

// --- Function to determine user role based on allowed-actions ---
function getUserRole(allowedActions) {
  if (!allowedActions || !Array.isArray(allowedActions)) {
    return "Employee"; // Default role
  }
  console.log("Allowed actions:", allowedActions);
  if (allowedActions.includes("SD-R-A")) {
    return "Admin";
  } else if (allowedActions.includes("SD-R-SMC")) {
    return "Sample Collector";
  } else if (allowedActions.includes("SD-R-LR")) {
    return "Lab Receptionist";
  } else if (allowedActions.includes("SD-R-LT")) {
    return "Lab Technician";
  } else if (allowedActions.includes("SD-R-GM")) {
    return "Diagnostics General Manager";
  } else if (allowedActions.includes("SD-R-DOC")) {
    return "Doctor";
  } else if (allowedActions.includes("SD-R-SE")) {
    return "Sales Executive";
  } else if (allowedActions.includes("SD-R-ACT")) {
    return "Accounts";
  } else if (allowedActions.includes("SD-R-CEO")) {
    return "CEO";
  } else if (allowedActions.includes("SD-R-PH")) {
    return "PH";
  } else if (allowedActions.includes("SD-R-HR")) {
    return "HR";

  } else {
    return "Accounts"; // Default role if none of the specific roles are found
  }
}

// --- Main execution ---
(function main() {
  try {
    console.log("Starting token validation...");

    // Retrieve token from localStorage
    let accessToken = localStorage.getItem("access_token");
    console.log("Access token from localStorage exists:", !!accessToken);

    // If no token found, try development token
    if (!accessToken) {
      console.log(
        "❌ No token found in localStorage, trying development token"
      );
      accessToken = setforlocaldev();
    }

    // If still no token (development token is empty), redirect to login
    if (!accessToken || accessToken.trim() === "") {
      console.log("❌ No valid token available, redirecting to login");
      localStorage.removeItem("access_token"); // Clean up
      redirectToLogin();
      return; // Stop execution here
    }

    // Validate the token
    const userPayload = validate(accessToken);
    console.log("✅ Token validated successfully");
    console.log("Decoded token payload:", userPayload);

    // Store the valid token and user information
    localStorage.setItem("access_token", accessToken);

    // Extract user information from token payload
    const employeeId = userPayload.aud; // Using 'aud' field as ID
    const name = userPayload.name;
    const userEmail = userPayload.email;
    const userRole = getUserRole(userPayload["allowed-actions"]);

    console.log("Employee ID:", employeeId);
    console.log("Name:", name);
    console.log("Email:", userEmail);
    console.log("User Role:", userRole);

    // Check if we have required data
    const isLoggedIn = !!(employeeId && name);
    console.log("Is logged in:", isLoggedIn);

    if (!isLoggedIn) {
      throw new Error(
        "Missing required user data (employeeId or employeeName)"
      );
    }

    // Store user payload and extracted information for app usage
    localStorage.setItem("user_payload", JSON.stringify(userPayload));
    localStorage.setItem("employeeId", employeeId);
    localStorage.setItem("name", name);
    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("role", userRole);

    console.log("✅ User payload and extracted data stored in localStorage");
    console.log("Stored data:", {
      employeeId,
      name,
      userEmail,
      role: userRole,
    });

    // Token is valid, render app
    console.log("✅ Rendering lab app...");
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    reportWebVitals();
  } catch (error) {
    console.error("❌ Token validation failed:", error.message);

    // Clean up invalid token
    localStorage.removeItem("access_token");

    // If validation fails, redirect to login instead of showing debug page
    console.log("❌ Redirecting to login due to validation failure");
    redirectToLogin();
  }
})();

