import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Access the redirect URL from environment variables
const REDIRECT_URL = process.env.REACT_APP_LOGIN_REDIRECT_URL;

// --- Function to set token for local development ---
function setforlocaldev() {
  const dev_token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiRVItUC1FUlItUlciLCJFUi1QLUVSUkUtUlciLCJTVC1QLVNOTy1SVyIsIlNJTi1BUEktT1ItUlciLCJTSU4tQVBJLUlGLVJXIiwiU0QtUC1QRC1SIiwiU0QtUi1BIiwiTURDLVAtVFJCLVJXIiwiTURDLVAtUE5QLVJXIiwiU0QtUC1ERi1SIiwiU0lOLVAtSUNFLVIiLCJNREMtQVBJLUxCTi1SIiwiRVItUC1FUlBCLVJXIiwiRVItUC1FUlJFRy1SVyIsIk1EQy1QLVNPUi1SIiwiU0QtUC1URC1SIiwiU1QtUi1BIiwiU0QtUC1NSVMtUiIsIlNULUFQSS1DUkQtUlciLCJTVC1BUEktQU1DLVJXIiwiTURDLUFQSS1SVFMtUiIsIk1EQy1BUEktUEFULVIiLCJFUi1SLUVSTiIsIlNULVAtTlRGLVIiLCJTSU4tUC1HSUMtUiIsIlNULVAtTlRGLVJXIiwiU0QtUC1CVEQtUlciLCJNREMtQVBJLUNEUi1SIiwiU0QtUC1URC1SVyIsIk1EQy1BUEktVEhSLVIiLCJTVC1BUEktRU1QLVIiLCJTRC1QLVNTLVIiLCJTRC1BUEktVFYtUiIsIlNELUFQSS1URC1SIiwiTURDLVAtT1NCLVJXIiwiTURDLVAtUFRFLVJXIiwiTURDLVAtUkVHLVJXIiwiU0QtUC1CRy1SIiwiU0QtQVBJLVJCLVIiLCJTSU4tQVBJLUZVLVJXIiwiU0lOLUFQSS1JRi1SIiwiTURDLVAtQVNNLVJXIiwiU1QtUC1UREwtUlciLCJTVFItQVBJLVRJTi1SVyIsIlNUUi1QLVRSTC1SVyIsIlNULVAtREVTLVIiLCJTVC1QLURFUy1SVyIsIlNELVAtU1NVLVIiLCJTVC1QLUNNVC1SVyIsIkVSLVAtRVJELVIiLCJTRC1QLVNTLVJXIiwiU1RSLVAtTUVTIiwiTURDLUFQSS1SREwtUiIsIlNULVAtQlJELVIiLCJNREMtUC1QTlAtUiIsIlNELVAtQlRELVIiLCJTRC1QLVBPVi1SVyIsIlNULVAtVERMLVIiLCJFUi1QLUVSQi1SVyIsIlNELUFQSS1DTi1SIiwiU1RSLVItQSIsIlNUUi1QLUNMRyIsIlNUUi1QLVRSTC1SIiwiTURDLVAtUkVHLVIiLCJFUi1QLUVSUEQtUlciLCJTVFItQVBJLVRJTi1SIiwiTURDLVAtQ0RFLVJXIiwiU0QtUC1QT1YtUiIsIk1EQy1BUEktR0FTLVIiLCJTRC1BUEktT0FSLVIiLCJTRC1QLUdQRC1SIiwiU0QtUC1QTC1SIiwiTURDLVAtUkRFLVJXIiwiRVItUC1FUk5CTi1SIiwiU1QtQVBJLUJSRC1SVyIsIlNULVAtQ01ULVIiLCJTRC1QLURGLVJXIiwiRVItUC1FUlAtUiIsIlNELVAtU1NVLVJXIiwiU0lOLUFQSS1TRi1SIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3NTc2NTE4MTcsImV4cCI6MTc1NzczODgxNywianRpIjoiZTdiY2RjZTctYzNhNi00MzFlLWEwMTQtNTg3MmYzNDgwZGUyIn0.QUwQnI9SQbR71PwXTf66lSVN2KW37PWeVTd_UoNxQXVl1juVKMoifMON1zVNqMCNL-rxjmfma5D5tU-GhV-GZUZIdtv8aHP7Gz1qb4mJ-NcitfQpYPlB_K2Cs4oysflqXqG3RuRNhBJQL6KYIRa3m_nd0_qWqAtFTYaepkQ93cE9HBgtHf_7GOypEzzbTatQBMLd9m37EICqus7_-dCx93Emn4DeAIdSENj4qh8FvQGCpSFfKlFJIHde3oomxncTnUhXMuwPlucWOsopDY1YQqTV0XI0lteAYKyVLrzjwtf7Jb22kySrzXboKClB7GXyh9qRzazjm4jvk9u9uzbsSg"; // Keep empty to force redirect in development

  return dev_token;
}

// --- Function to redirect to login ---
function redirectToLogin() {
  if (REDIRECT_URL) {
    window.location.href = REDIRECT_URL;
  } else {
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

  if (allowedActions.includes("SD-R-A")) {
    return "Admin";
  } else if (allowedActions.includes("SD-R-REC")) {
    return "Receptionist";
  } else if (allowedActions.includes("SD-R-GM")) {
    return "General Manager";
  } else if (allowedActions.includes("SD-R-TEC")) {
    return "Technician";
  } else if (allowedActions.includes("SD-R-DOC")) {
    return "Doctor";
  } else if (allowedActions.includes("SD-R-FOF")) {
    return "Front Office";
  } else if (allowedActions.includes("SD-R-SLP")) {
    return "Sales Person";
  } else if (allowedActions.includes("SD-R-SMC")) {
    return "Sample Collector";
  } else if (allowedActions.includes("SD-R-ACT")) {
    return "Accounts";
  } else if (allowedActions.includes("SD-R-HR")) {
    return "HR";
  } else {
    return "Receptionist"; // Default role if none of the specific roles are found
  }
}

// --- Main execution ---
(function main() {
  try {
    // Retrieve token from localStorage
    let accessToken = localStorage.getItem("access_token");

    // If no token found, try development token
    if (!accessToken) {
      accessToken = setforlocaldev();
    }

    // If still no token (development token is empty), redirect to login
    if (!accessToken || accessToken.trim() === "") {
      localStorage.removeItem("access_token"); // Clean up
      redirectToLogin();
      return; // Stop execution here
    }

    // Validate the token
    const userPayload = validate(accessToken);

    // Store the valid token and user information
    localStorage.setItem("access_token", accessToken);

    // Extract user information from token payload
    const employeeId = userPayload.aud; // Using 'aud' field as ID
    const name = userPayload.name;
    const userEmail = userPayload.email;
    const userRole = getUserRole(userPayload["allowed-actions"]);
    const selectedBranch = "SHB001";
    localStorage.setItem("selected_branch", selectedBranch);

    console.log("Employee ID:", employeeId);
    console.log("Name:", name);
    console.log("Email:", userEmail);
    console.log("User Role:", userRole);

    // Check if we have required data
    const isLoggedIn = !!(employeeId && name);

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

    // Token is valid, render app

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    reportWebVitals();
  } catch (error) {
    // Clean up invalid token
    localStorage.removeItem("access_token");

    // If validation fails, redirect to login instead of showing debug page

    redirectToLogin();
  }
})();