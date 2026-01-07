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
  const dev_token ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDAwMiIsImVtYWlsIjoibmFqbWFzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiTmFqbWEiLCJhbGxvd2VkLWFjdGlvbnMiOlsiIiwiU0QtUC1ITVNQQi1SIiwiU0QtQVBJLVZDLVJXIiwiU0QtUC1HU1AtUiIsIlNUUi1BUEktVFJMUi1SIiwiU0QtUC1CVEQtUiIsIlNELVAtSE1TQ1MtUiIsIk1EQy1QLVJFRy1SVyIsIlNELVAtU1NVLVJXIiwiU0QtUC1TSVItUiIsIlNELVAtSE1TU1MtUiIsIlNELVItQSIsIlNELVAtTFNELVJXIiwiU0QtUC1TR0FDLVJXIiwiU0QtUC1MVVNDRC1SVyIsIlNELUFQSS1HT1ItUlciLCJTVFItUi1BIiwiTURDLUFQSS1BVC1SIiwiU0QtUC1HUEQtUiIsIk1EQy1QLVNPUi1SIiwiSE1TLUFQSS1JWFJBWS1SVyIsIlNULVAtTlRGLVIiLCJITVMtQVBJLURSTS1SIiwiSE1TLUFQSS1EUk0tUlciLCJTVFItQVBJLUlMLVIiLCJTRC1QLUhNU1BCLVJXIiwiU0QtUC1TUy1SVyIsIkhNUy1BUEktSU1SSS1SIiwiU0QtUC1VUEItUiIsIlNULVAtU05PLVJXIiwiU1RSLUFQSS1USU4tUiIsIlNELVAtUEctUiIsIlNELVAtREYtUiIsIlNUUi1BUEktVkwtUiIsIlNELVAtU0NVLVJXIiwiU0QtUC1QRC1SIiwiSE1TLUFQSS1JQi1SIiwiU0QtUC1ITVNURC1SVyIsIlNELUFQSS1JVk0tUlciLCJTVFItUC1USU5SLVJXIiwiSE1TLUFQSS1JVVNHLVJXIiwiU1QtUC1DTVQtUiIsIlNELVAtU1ZGLVJXIiwiTURDLVAtUE5QLVJXIiwiU0QtUC1QT1YtUlciLCJTVFItQVBJLUlMIiwiU0QtUC1MR0xELVIiLCJTRC1QLVBPVi1SIiwiU0QtQVBJLVJCLVIiLCJITVMtQVBJLVNVTS1SIiwiU0QtUC1TSEYtUiIsIlNULVAtREVTLVJXIiwiU0QtUC1ITVNTUC1SIiwiU1RSLUFQSS1WTC1SVyIsIlNELUFQSS1JVk0tUiIsIk1EQy1QLUNERS1SVyIsIlNULVAtTlRGLVJXIiwiU0QtUC1HUEItUlciLCJTRC1QLUJBLVIiLCJITVMtQVBJLUlDVC1SVyIsIlNELVAtU0MtUiIsIlNELVAtSE1TU1MtUlciLCJTVC1QLVRETC1SIiwiU0QtUC1URS1SIiwiTURDLVAtUkVHLVIiLCJTVFItQVBJLVRSTC1SIiwiSE1TLUFQSS1TVU0tUlciLCJNREMtUC1PU0ItUlciLCJTRC1QLUJURC1SVyIsIlNELUFQSS1HUi1SVyIsIlNELVAtSE1TVEQtUiIsIlNELVAtUEwtUiIsIlNELVAtQkctUiIsIlNELVAtU1AtUiIsIlNELVAtTEJOLVIiLCJTRC1QLUhNU1VDLVJXIiwiU0QtQVBJLUdDLVJXIiwiU0QtUC1MU0NMLVIiLCJNREMtQVBJLUxCTi1SIiwiU0QtUC1MUkMtUiIsIk1EQy1QLVJERS1SVyIsIk1EQy1QLUFTTS1SVyIsIlNELVAtU0lSLVJXIiwiU0QtUC1QRi1SIiwiU0QtQVBJLVRNLVJXIiwiU0QtQVBJLVRNLVIiLCJITVMtQVBJLUlDVC1SIiwiU0QtQVBJLUdELVIiLCJTRC1QLUxHTFQtUiIsIlNELVAtUEItUlciLCJTRC1BUEktVFYtUiIsIlNELVAtUEctUlciLCJTVC1SLUEiLCJITVMtQVBJLUlCLVJXIiwiR1AtUC1HQ04tUiIsIlNELVAtUEItUiIsIlNELVAtSE1TTEQtUiIsIk1EQy1QLVBOUC1SIiwiU0QtQVBJLVJDTC1SVyIsIlNULVAtREVTLVIiLCJITVMtQVBJLUlNUkktUlciLCJTRC1QLU1JUy1SIiwiTURDLVAtUFRFLVJXIiwiTURDLVAtUE5QUi1SIiwiU1QtQVBJLVRSTFItUlciLCJNREMtUC1UUkItUlciLCJTRC1BUEktQ04tUiIsIlNELVAtU0dBQy1SIiwiU0QtUC1ITVNTUC1SVyIsIlNELVAtREYtUlciLCJTRC1QLUhNU1BTLVJXIiwiU0QtQVBJLVBSLVIiLCJNREMtQVBJLUNEUi1SIiwiU0QtUC1ITVNHQy1SIiwiU1RSLUFQSS1UUkwtUlciLCJTRC1BUEktR09DLVJXIiwiU1QtUC1DTVQtUlciLCJTRC1QLVVQQi1SVyIsIlNELVAtU0hGLVJXIiwiU0QtUC1MU0MtUlciLCJNREMtQVBJLVBBVC1SIiwiU0QtUC1TVkYtUiIsIlNUUi1QLUlDUy1SIiwiU0QtUC1CQS1SVyIsIlNELUFQSS1WUC1SVyIsIlNELVAtVEUtUlciLCJTRC1QLVNTLVIiLCJTVC1QLUJSRC1SIiwiU1QtUC1UREwtUlciLCJTRC1QLVRELVJXIiwiU0QtUC1MUEktUiIsIlNELVAtUEYtUlciLCJTRC1QLUxHRC1SVyIsIk1EQy1BUEktVEhSLVIiLCJTVC1BUEktRU1QLVIiLCJNREMtQVBJLVJETC1SIiwiU0QtUC1URC1SIiwiTURDLUFQSS1SVFMtUiIsIlNELVAtQ0hDLVJXIiwiU0QtUC1MR1NDLVIiLCJTRC1QLVNTVS1SIiwiU1QtQVBJLUNSRC1SVyIsIk1EQy1BUEktR0FTLVIiLCJNREMtQVBJLUFULVJXIiwiSE1TLUFQSS1JVVNHLVIiLCJTVFItUC1USU5SLVIiLCJITVMtQVBJLUlYUkFZLVIiLCJTRC1QLUNIQy1SIiwiU1QtQVBJLUJSRC1SVyIsIlNELVAtSE1TU0QtUlciLCJTVC1BUEktQU1DLVJXIiwiU1RSLUFQSS1USU4tUlciLCJTVFItQVBJLUlMLVJXIiwiU0QtQVBJLVRELVIiXSwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwMSIsIlNIQjAwMiJdLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc2Nzc1Nzk4NSwiZXhwIjoxNzY3ODQ0OTg1LCJqdGkiOiIwMjAwNzFhNi1jZTVlLTQyYjgtOGNmYS0yOWE0OWVlYzM5ZjYifQ.PkW2knJ28neN-SmYdQ7ZCEfaYeDLKIVRiyNMkeskNvEHvrm1L2tO0SzsINeZqyZHTrxwyd1Rk_8YSQVX9UNa_WtjrSOGcBWsVxQx7B6KMghh2FlkVUNDaK1cT2d08Jg8VME7h0zirQilwXaaIDKeXRrIwMiipkjxzTuwzPjPfwW1pX8ramGVosJAwP6Ib4DDM_xr3X8qF_bBzqMHUB4KtodkDk-kViG1Am4x1Yyjj4spQgLPEZ5zw0jfXMlFUhS0O22Yi029rz0_fVPIKq50_AU0Pl7VkyTBLnaT49Of651mbXczcjdUO9RRELiXOfIiGohzbJU_gvbP-RlZlb4k_Q"; 
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
  } else if (allowedActions.includes("SD-R-SP")) {
    return "Sales Person";
  } else if (allowedActions.includes("SD-R-ACT")) {
    return "Accounts";
  } else if (allowedActions.includes("SD-R-CEO")) {
    return "CEO";  
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

