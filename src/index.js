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
  const dev_token ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDAwMiIsImVtYWlsIjoibmFqbWFzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiTmFqbWEiLCJhbGxvd2VkLWFjdGlvbnMiOlsiU0QtUC1ITVNQQi1SIiwiU0QtQVBJLVZDLVJXIiwiU0QtUC1HU1AtUiIsIlNUUi1BUEktVFJMUi1SIiwiU0QtUC1CVEQtUiIsIlNELVAtSE1TQ1MtUiIsIk1EQy1QLVJFRy1SVyIsIlNELVAtU1NVLVJXIiwiU0QtUC1TSVItUiIsIlNELVAtSE1TU1MtUiIsIlNELVItQSIsIlNELVAtTFNELVJXIiwiU0QtUC1TR0FDLVJXIiwiU0QtUC1MVVNDRC1SVyIsIlNELUFQSS1HT1ItUlciLCJTVFItUi1BIiwiTURDLUFQSS1BVC1SIiwiU0QtUC1HUEQtUiIsIk1EQy1QLVNPUi1SIiwiSE1TLUFQSS1JWFJBWS1SVyIsIlNULVAtTlRGLVIiLCJITVMtQVBJLURSTS1SIiwiSE1TLUFQSS1EUk0tUlciLCJTVFItQVBJLUlMLVIiLCJTRC1QLUhNU1BCLVJXIiwiU0QtUC1TUy1SVyIsIkhNUy1BUEktSU1SSS1SIiwiU0QtUC1VUEItUiIsIlNULVAtU05PLVJXIiwiU1RSLUFQSS1USU4tUiIsIlNELVAtUEctUiIsIlNELVAtREYtUiIsIlNUUi1BUEktVkwtUiIsIlNELVAtU0NVLVJXIiwiU0QtUC1QRC1SIiwiSE1TLUFQSS1JQi1SIiwiU0QtUC1ITVNURC1SVyIsIlNELUFQSS1JVk0tUlciLCJTVFItUC1USU5SLVJXIiwiSE1TLUFQSS1JVVNHLVJXIiwiU1QtUC1DTVQtUiIsIlNELVAtU1ZGLVJXIiwiTURDLVAtUE5QLVJXIiwiU0QtUC1QT1YtUlciLCJTVFItQVBJLUlMIiwiU0QtUC1MR0xELVIiLCJTRC1QLVBPVi1SIiwiU0QtQVBJLVJCLVIiLCJITVMtQVBJLVNVTS1SIiwiU0QtUC1TSEYtUiIsIlNULVAtREVTLVJXIiwiU0QtUC1ITVNTUC1SIiwiU1RSLUFQSS1WTC1SVyIsIlNELUFQSS1JVk0tUiIsIk1EQy1QLUNERS1SVyIsIlNULVAtTlRGLVJXIiwiU0QtUC1HUEItUlciLCJTRC1QLUJBLVIiLCJITVMtQVBJLUlDVC1SVyIsIlNELVAtU0MtUiIsIlNELVAtSE1TU1MtUlciLCJTVC1QLVRETC1SIiwiU0QtQVBJLU1CVEQtUlciLCJTRC1QLVRFLVIiLCJNREMtUC1SRUctUiIsIlNUUi1BUEktVFJMLVIiLCJITVMtQVBJLVNVTS1SVyIsIk1EQy1QLU9TQi1SVyIsIlNELVAtQlRELVJXIiwiU0QtQVBJLUdSLVJXIiwiU0QtUC1ITVNURC1SIiwiU0QtUC1QTC1SIiwiU0QtUC1CRy1SIiwiU0QtUC1TUC1SIiwiU0QtUC1MQk4tUiIsIlNELVAtSE1TVUMtUlciLCJTRC1BUEktR0MtUlciLCJTRC1QLUxTQ0wtUiIsIk1EQy1BUEktTEJOLVIiLCJTRC1QLUxSQy1SIiwiTURDLVAtUkRFLVJXIiwiTURDLVAtQVNNLVJXIiwiU0QtUC1TSVItUlciLCJTRC1QLVBGLVIiLCJTRC1BUEktVE0tUlciLCJTRC1QLU1CVFYtUiIsIlNELUFQSS1UTS1SIiwiSE1TLUFQSS1JQ1QtUiIsIlNELUFQSS1HRC1SIiwiU0QtUC1MR0xULVIiLCJTRC1QLVBCLVJXIiwiU0QtQVBJLVRWLVIiLCJTRC1QLVBHLVJXIiwiU1QtUi1BIiwiSE1TLUFQSS1JQi1SVyIsIkdQLVAtR0NOLVIiLCJTRC1QLVBCLVIiLCJTRC1QLUhNU0xELVIiLCJNREMtUC1QTlAtUiIsIlNELUFQSS1SQ0wtUlciLCJTVC1QLURFUy1SIiwiSE1TLUFQSS1JTVJJLVJXIiwiU0QtUC1NSVMtUiIsIk1EQy1QLVBURS1SVyIsIk1EQy1QLVBOUFItUiIsIlNULUFQSS1UUkxSLVJXIiwiTURDLVAtVFJCLVJXIiwiU0QtQVBJLUNOLVIiLCJTRC1QLVNHQUMtUiIsIlNELVAtSE1TU1AtUlciLCJTRC1QLURGLVJXIiwiU0QtUC1ITVNQUy1SVyIsIlNELUFQSS1QUi1SIiwiTURDLUFQSS1DRFItUiIsIlNELVAtSE1TR0MtUiIsIlNUUi1BUEktVFJMLVJXIiwiU0QtQVBJLUdPQy1SVyIsIlNULVAtQ01ULVJXIiwiU0QtUC1VUEItUlciLCJTRC1QLVNIRi1SVyIsIlNELVAtTFNDLVJXIiwiTURDLUFQSS1QQVQtUiIsIlNELVAtU1ZGLVIiLCJTVFItUC1JQ1MtUiIsIlNELVAtQkEtUlciLCJTRC1BUEktVlAtUlciLCJTRC1QLVRFLVJXIiwiU0QtQVBJLU1JUy1SVyIsIlNELVAtU1MtUiIsIlNULVAtQlJELVIiLCJTVC1QLVRETC1SVyIsIlNELVAtVEQtUlciLCJTRC1QLUxQSS1SIiwiU0QtUC1QRi1SVyIsIlNELVAtTEdELVJXIiwiTURDLUFQSS1USFItUiIsIlNULUFQSS1FTVAtUiIsIk1EQy1BUEktUkRMLVIiLCJTRC1QLVRELVIiLCJTRC1QLU1CUEQtUiIsIk1EQy1BUEktUlRTLVIiLCJTRC1QLUNIQy1SVyIsIlNELVAtTEdTQy1SIiwiU0QtUC1NQkRGLVJXIiwiU0QtUC1TU1UtUiIsIlNULUFQSS1DUkQtUlciLCJNREMtQVBJLUdBUy1SIiwiTURDLUFQSS1BVC1SVyIsIkhNUy1BUEktSVVTRy1SIiwiU1RSLVAtVElOUi1SIiwiSE1TLUFQSS1JWFJBWS1SIiwiU0QtUC1DSEMtUiIsIlNULUFQSS1CUkQtUlciLCJTRC1QLUhNU1NELVJXIiwiU1QtQVBJLUFNQy1SVyIsIlNUUi1BUEktVElOLVJXIiwiU1RSLUFQSS1JTC1SVyIsIlNELUFQSS1URC1SIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiLCJTSEIwMDIiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3Njg4MTA2NzMsImV4cCI6MTc2ODg5NzY3MywianRpIjoiZmY5NDQzYjUtYmVhNS00ZDA3LTg2YWQtNGM2ZTYyYjE0YWQwIn0.M5aFwdn94lQ7wSIzusqoDPVxbkI1pQuf-MnnJwYZpUm-vm4Dg5laTTn2yNmMont6Uhh2Jz_zS8_aaJ9g2nLD3qvsYj1ZQNWveLXvLOx3dX8wG3DwBopCAEpE9kjyRqhk_I4bugbivcwHCcXbaWy9DDffCT4R_75y2cNrk0FlykhMM1AoHi5LYZ_vjC-SeR9w4A0tfoqT3ZU77CmedLIlnNJTlr8Bfc3pG9lcMTPez9YQF413v_zrCh_-JdLrotjPhvqXMJDw_w5uVNMlu_kHVn6TNGshvgIEoge8woIwL4k6y78_uFj_QAU-TU2TG9axmM_CqgRttvRFAtP1aMIndg"; 
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

