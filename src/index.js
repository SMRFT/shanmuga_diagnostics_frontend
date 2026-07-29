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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDE1NyIsImVtYWlsIjoiZ20ubGFic2FsZXNAc21yZnQub3JnIiwibmFtZSI6IlN1bmRhciBNIiwiYWxsb3dlZC1hY3Rpb25zIjpbIlNELUFQSS1DTi1SVyIsIlNELVAtTFRBLVJXIiwiU0QtUC1DSEMtUlciLCJTVC1QLVRETC1SVyIsIlNELVAtVVBCLVJXIiwiU0QtUC1MQ0MtUlciLCJTRC1QLUxHRS1SVyIsIlNELVAtTEJGLVJXIiwiU1QtUC1DTVQtUlciLCJTRC1QLURGLVIiLCJTVC1QLUJSRC1SIiwiU0QtUC1TR0FDLVJXIiwiU0QtQVBJLVZQLVJXIiwiU0QtUC1DSEMtUiIsIlNELVAtUEItUlciLCJTRC1QLVNIRi1SIiwiU0QtQVBJLUdSLVJXIiwiU0QtUC1TVkYtUlciLCJTRC1QLVRFLVIiLCJTRC1QLVBGLVIiLCJTRC1QLVNDVS1SVyIsIlNELVAtTUJQRC1SIiwiU0QtUC1QRy1SIiwiU0QtQVBJLVBSLVIiLCJTVC1BUEktQlJELVJXIiwiU0QtUC1MQkMtUlciLCJTRC1BUEktVE0tUlciLCJTRC1QLUxCTC1SVyIsIlNULUFQSS1BTUMtUlciLCJTRC1QLVNWRC1SVyIsIkZFLVItRkEiLCJTRC1QLVBCLVIiLCJGRS1QLUZHLVJXIiwiRkUtUC1GUy1SVyIsIlNULVAtVERMLVIiLCJTRC1QLUJCQS1SVyIsIlNULUFQSS1DUkQtUlciLCJTRC1BUEktUkItUlciLCJTRC1QLUxQSS1SIiwiRkUtUC1GUi1SVyIsIlNELVAtVVBCLVIiLCJTRC1QLUJHLVIiLCJGRS1QLUZGLVJXIiwiU0QtUC1NSVMtUiIsIlNULVItSE9EIiwiU0QtQVBJLVRNLVIiLCJTRC1BUEktR09SLVJXIiwiU0QtUC1SRC1SVyIsIlNELUFQSS1HRC1SIiwiU0QtQVBJLVZDLVJXIiwiRkUtUC1GQUwtUiIsIlNELVAtUEQtUiIsIlNELVAtU1NVLVJXIiwiU0QtUC1CVEQtUlciLCJTRC1QLUxHRC1SVyIsIlNULVAtTlRGLVJXIiwiU0QtUC1TVkYtUiIsIlNULVAtTlRGLVIiLCJTRC1BUEktR09DLVJXIiwiU0QtUC1TU1UtUiIsIlNELVAtTEJOLVIiLCJTRC1QLVNIRi1SVyIsIlNELVAtUE9WLVJXIiwiU0QtUC1DTC1SVyIsIlNULVAtQ01ULVIiLCJHUC1QLUdDTi1SIiwiU0QtUC1TUy1SIiwiU0QtQVBJLU1JUy1SVyIsIlNELVAtTFRNLVJXIiwiRkUtUC1GVVMtUlciLCJTRC1SLUdNIiwiU0QtQVBJLU1CVEQtUlciLCJTRC1QLVRTLVJXIiwiU0QtQVBJLUdDLVJXIiwiU0QtUC1TR0FDLVIiLCJTVC1BUEktRU1QLVIiLCJTRC1QLUxTUC1SVyIsIlNELVAtUEYtUlciLCJTRC1QLUxUUi1SVyIsIlNELUFQSS1JVk0tUiIsIlNELVAtR1BELVJXIiwiU0QtUC1HUEItUlciLCJTRC1QLUdTUC1SIiwiU0QtUC1PRC1SIiwiU0QtUC1NQlRWLVIiLCJTRC1QLUxTUi1SVyIsIkZFLVAtRkdGLVIiLCJTRC1QLUdQVC1SVyIsIlNELVAtU0dFLVIiLCJTRC1BUEktVEQtUiIsIlNELUFQSS1UVi1SIiwiU0QtUC1URC1SVyIsIlNELVAtU1MtUlciLCJTVC1QLVNOTy1SVyIsIlNELVAtU09SLVJXIiwiU0QtUC1NQkRGLVJXIiwiU0QtQVBJLUlWTS1SVyIsIlNULVAtREVTLVJXIiwiU0QtUC1MRC1SVyIsIlNELVAtUEwtUiIsIlNELVAtU0MtUiIsIlNELVAtREYtUlciLCJTRC1QLVNJUi1SVyIsIlNELVAtQkEtUlciLCJTRC1QLUxTTC1SVyIsIlNELVAtVEUtUlciLCJTRC1QLVBHLVJXIiwiU1QtUC1ERVMtUiIsIlNELVAtTFJDLVIiLCJTRC1QLVNQLVIiLCJTRC1QLUdQRC1SIiwiU0QtUC1URC1SIiwiRkUtUC1GR0wtUiIsIlNELUFQSS1SQ0wtUlciLCJTRC1QLUJURC1SIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaG9zcGl0YWxfY29kZSI6IlNIMDAxIiwiaG1zX3BhZ2VzIjpbXSwiYWxsb3dlZC1vdXRsZXRzIjpbXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3ODQxNzk1OTMsImV4cCI6MTc4NDI2NjU5M30.A5TemR0C8QQ6KxWK_214vU3BjuYuvvXtkmd7ppOk-a12kVG1-GbldmrsGV_d3GUMULGVmK2yrXa03SJAcBKPPUff2GjCwdscCHtzVuH7ASVPKPH8eJxpKwmY0ZNf02r6jJtlxF9WIIQrqu-EAQ8ntmZIm06K31F-Vmy4wIMAsZyrpilgskSQ6oVNfLCyWb5ITbnTR9xi9rUdCOAK7ox6m_7GG7AzepLChqDNV31heoE5eQxcV4nNE0eHDS-lzmfNEmvfKPGu7dqt-zFf_eiBawEBI6nziv4jCDxS6dPyF2JRtVaDa_iPi4iWhx2K-ysZgvgRTgwWr4lq19HTdzdKiA";
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
  } else if (allowedActions.includes("SD-R-CL")) {
    return "Clinical Reports";

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

    // Register Service Worker for Logistics Tracking Notifications
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('✅ ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(err => {
            console.log('❌ ServiceWorker registration failed: ', err);
          });
      });
    }
  } catch (error) {
    console.error("❌ Token validation failed:", error.message);

    // Clean up invalid token
    localStorage.removeItem("access_token");

    // If validation fails, redirect to login instead of showing debug page
    console.log("❌ Redirecting to login due to validation failure");
    redirectToLogin();
  }
})();
