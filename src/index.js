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
// console.log("REDIRECT_URL:", REDIRECT_URL);

// --- Function to set token for local development ---
function setforlocaldev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDE1NyIsImVtYWlsIjoibWFuaWJhbGFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6IlN1bmRhciBNIiwiYWxsb3dlZC1hY3Rpb25zIjpbIlNULVAtTlRGLVIiLCJTRC1QLVRFLVIiLCJTRC1BUEktVE0tUiIsIlNELVAtU1NVLVIiLCJTRC1QLU1JUy1SIiwiU1QtUC1DTVQtUiIsIlNELVAtQkJBLVJXIiwiU0QtUC1UUy1SVyIsIkZFLVAtRlItUlciLCJTRC1QLVBGLVIiLCJTRC1BUEktQ04tUlciLCJTRC1QLVNIRi1SVyIsIkZFLVAtRkdGLVIiLCJTRC1QLVNHQUMtUiIsIlNELUFQSS1HUi1SVyIsIkdQLVAtR0NOLVIiLCJTRC1QLVBELVIiLCJTRC1QLVVQQi1SVyIsIlNELVAtTEJOLVIiLCJTRC1QLUxSQy1SIiwiU0QtUC1TT1ItUlciLCJTRC1QLVNTLVIiLCJTVC1BUEktQlJELVJXIiwiU0QtUC1TVkYtUlciLCJTRC1QLUdQRC1SIiwiRkUtUC1GRy1SVyIsIlNELVAtU0lSLVJXIiwiU0QtQVBJLUlWTS1SVyIsIlNELUFQSS1HRC1SIiwiU0QtUC1CVEQtUlciLCJGRS1QLUZVUy1SVyIsIlNELVAtTFNMLVJXIiwiU0QtUC1ERi1SIiwiU0QtUC1CVEQtUiIsIlNELUFQSS1HT1ItUlciLCJTRC1QLUxQSS1SIiwiU0QtUC1QQi1SVyIsIlNELUFQSS1SQi1SIiwiRkUtUC1GU0ItUlciLCJTVC1QLVNOTy1SVyIsIlNELVItR00iLCJGRS1QLUZGLVJXIiwiU0QtUC1NQkRGLVJXIiwiRkUtUi1GQS1SVyIsIlNELVAtR1BULVJXIiwiU0QtQVBJLVJDTC1SVyIsIlNELVAtT0QtUiIsIlNELVAtR1BELVJXIiwiU0QtUC1URC1SVyIsIlNELVAtU1NVLVJXIiwiU0QtUC1TR0FDLVJXIiwiU0QtUC1HUEItUlciLCJTRC1QLUxUTS1SVyIsIlNELVAtREYtUlciLCJTRC1QLVNTLVJXIiwiU0QtUC1VUEItUiIsIlNELVAtVEQtUiIsIlNULUFQSS1FTVAtUiIsIlNELVAtTUJQRC1SIiwiU0QtUC1DSEMtUlciLCJTRC1QLVNDVS1SVyIsIlNELVAtTUJUVi1SIiwiU0QtUC1URS1SVyIsIlNULVAtVERMLVIiLCJTRC1QLVBPVi1SVyIsIlNULVAtTlRGLVJXIiwiRkUtUi1GQSIsIlNELVAtUEYtUlciLCJTRC1BUEktSVZNLVIiLCJTVC1BUEktQU1DLVJXIiwiU0QtQVBJLVBSLVIiLCJTRC1QLVNHRS1SIiwiU0QtQVBJLVRELVIiLCJGRS1QLUZBTC1SIiwiU0QtQVBJLVRNLVJXIiwiU0QtUC1HU1AtUiIsIlNULVAtREVTLVJXIiwiU0QtUC1MU1ItUlciLCJTRC1BUEktVkMtUlciLCJTVC1QLUJSRC1SIiwiU0QtUC1MR0QtUlciLCJGRS1QLUZVQi1SVyIsIlNULVItSE9EIiwiU0QtUC1TQy1SIiwiRkUtUC1GR0wtUiIsIlNELVAtQ0wtUlciLCJTRC1QLVBMLVIiLCJTVC1QLUNNVC1SVyIsIlNELVAtU0hGLVIiLCJTVC1BUEktQ1JELVJXIiwiU0QtUC1TVkQtUlciLCJTRC1QLUxUQS1SVyIsIlNULVAtVERMLVJXIiwiU0QtUC1SRC1SVyIsIlNELVAtTFRSLVJXIiwiU0QtQVBJLU1JUy1SVyIsIlNELVAtUEItUiIsIlNELVAtQ0hDLVIiLCJTRC1BUEktTUJURC1SVyIsIlNELVAtU1ZGLVIiLCJTRC1QLVBHLVJXIiwiU0QtQVBJLUdDLVJXIiwiU0QtQVBJLVRWLVIiLCJTRC1BUEktR09DLVJXIiwiU0QtUC1TUC1SIiwiU0QtUC1CQS1SIiwiU0QtUC1CQS1SVyIsIlNELUFQSS1WUC1SVyIsIlNELVAtTEJDLVJXIiwiRkUtUC1GUy1SVyIsIlNELVAtUEctUiIsIlNULVAtREVTLVIiLCJTRC1QLUxELVJXIiwiU0QtUC1CRy1SIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaG9zcGl0YWxfY29kZSI6IlNIMDAxIiwiaG1zX3BhZ2VzIjpbXSwiaG1zX291dGxldHMiOltdLCJhbGxvd2VkLW91dGxldHMiOltdLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc3NTg5Nzg4NCwiZXhwIjoxNzc1OTg0ODg0fQ.S5im9gVXVtMDIYHy7QwprMaCT6DgAOaay-_8RX5gtXEbBdDpasecYESz-m12iLx8nkbZ0wmYkgKuVNMdYsWxa5bYiopNDN1wE-hAV-IbIJ-vI0b3ioR-KRaKTEqJEYlKVExhT225B1OZ1PZAp4EQa8POUqM2aifZUZHhAd1EOs_7AJflNaPwmNmVybrfgAsZihWrDjalSbKc-9FA1wzCpJz6r4czFRpN6iFuPDpYKvHfrAgHqDDNbS_lmlaaj3FL8k1_3W-4gdHmrVmBdCrxSJa4B5P5WBGsbKcVkL-LpiDlBKd2_u7DxKZq1VkDhlVYIzkMiwAVPIKy04rNEIqZJw";
  console.log("🔧 Development token is empty - will redirect to login");
  const selectedBranch = "SHB001";
  localStorage.setItem("selected_branch", selectedBranch);
  return dev_token;
}

// --- Function to redirect to login ---
function redirectToLogin() {
  if (REDIRECT_URL) {
    console.log("🔄 Redirecting to login URL:", REDIRECT_URL);
    // window.location.href = REDIRECT_URL;
  } else {
    console.error("❌ REDIRECT_URL not configured");
    // Even if REDIRECT_URL is not configured, don't show error - just redirect to a fallback
    // window.location.href = "https://shinova.in/login";
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
        "❌ No token found in localStorage, trying development token",
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
        "Missing required user data (employeeId or employeeName)",
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
      </React.StrictMode>,
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
