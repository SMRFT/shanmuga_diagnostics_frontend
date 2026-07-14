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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDE1NyIsImVtYWlsIjoiZ20ubGFic2FsZXNAc21yZnQub3JnIiwibmFtZSI6IlN1bmRhciBNIiwiYWxsb3dlZC1hY3Rpb25zIjpbIlNELUFQSS1DTi1SVyIsIlNELVAtTFRBLVJXIiwiU0QtUC1DSEMtUlciLCJTVC1QLVRETC1SVyIsIlNELVAtVVBCLVJXIiwiU0QtUC1MR0UtUlciLCJTRC1QLUxCRi1SVyIsIlNULVAtQ01ULVJXIiwiU0QtUC1ERi1SIiwiU1QtUC1CUkQtUiIsIlNELVAtU0dBQy1SVyIsIlNELUFQSS1WUC1SVyIsIlNELVAtQ0hDLVIiLCJTRC1QLVBCLVJXIiwiU0QtUC1TSEYtUiIsIlNELUFQSS1HUi1SVyIsIlNELVAtU1ZGLVJXIiwiU0QtUC1URS1SIiwiU0QtUC1QRi1SIiwiU0QtUC1TQ1UtUlciLCJTRC1QLU1CUEQtUiIsIlNELVAtUEctUiIsIlNELUFQSS1QUi1SIiwiU1QtQVBJLUJSRC1SVyIsIlNELVAtTEJDLVJXIiwiU0QtQVBJLVRNLVJXIiwiU1QtQVBJLUFNQy1SVyIsIlNELVAtU1ZELVJXIiwiRkUtUi1GQSIsIlNELVAtUEItUiIsIkZFLVAtRkctUlciLCJGRS1QLUZTLVJXIiwiU1QtUC1UREwtUiIsIlNELVAtQkJBLVJXIiwiU1QtQVBJLUNSRC1SVyIsIlNELUFQSS1SQi1SVyIsIlNELVAtTFBJLVIiLCJGRS1QLUZSLVJXIiwiU0QtUC1VUEItUiIsIlNELVAtQkctUiIsIkZFLVAtRkYtUlciLCJTRC1QLU1JUy1SIiwiU1QtUi1IT0QiLCJTRC1BUEktVE0tUiIsIlNELUFQSS1HT1ItUlciLCJTRC1QLVJELVJXIiwiU0QtQVBJLUdELVIiLCJTRC1BUEktVkMtUlciLCJGRS1QLUZBTC1SIiwiU0QtUC1QRC1SIiwiU0QtUC1TU1UtUlciLCJTRC1QLUJURC1SVyIsIlNELVAtTEdELVJXIiwiU1QtUC1OVEYtUlciLCJTRC1QLVNWRi1SIiwiU1QtUC1OVEYtUiIsIlNELUFQSS1HT0MtUlciLCJTRC1QLVNTVS1SIiwiU0QtUC1MQk4tUiIsIlNELVAtU0hGLVJXIiwiU0QtUC1QT1YtUlciLCJTRC1QLUNMLVJXIiwiU1QtUC1DTVQtUiIsIkdQLVAtR0NOLVIiLCJTRC1QLVNTLVIiLCJTRC1BUEktTUlTLVJXIiwiU0QtUC1MVE0tUlciLCJGRS1QLUZVUy1SVyIsIlNELVItR00iLCJTRC1BUEktTUJURC1SVyIsIlNELVAtVFMtUlciLCJTRC1BUEktR0MtUlciLCJTRC1QLVNHQUMtUiIsIlNULUFQSS1FTVAtUiIsIlNELVAtUEYtUlciLCJTRC1QLUxUUi1SVyIsIlNELUFQSS1JVk0tUiIsIlNELVAtR1BELVJXIiwiU0QtUC1HUEItUlciLCJTRC1QLUdTUC1SIiwiU0QtUC1PRC1SIiwiU0QtUC1NQlRWLVIiLCJTRC1QLUxTUi1SVyIsIkZFLVAtRkdGLVIiLCJTRC1QLUdQVC1SVyIsIlNELVAtU0dFLVIiLCJTRC1BUEktVEQtUiIsIlNELUFQSS1UVi1SIiwiU0QtUC1URC1SVyIsIlNELVAtU1MtUlciLCJTVC1QLVNOTy1SVyIsIlNELVAtU09SLVJXIiwiU0QtUC1NQkRGLVJXIiwiU0QtQVBJLUlWTS1SVyIsIlNULVAtREVTLVJXIiwiU0QtUC1MRC1SVyIsIlNELVAtUEwtUiIsIlNELVAtU0MtUiIsIlNELVAtREYtUlciLCJTRC1QLVNJUi1SVyIsIlNELVAtQkEtUlciLCJTRC1QLUxTTC1SVyIsIlNELVAtVEUtUlciLCJTRC1QLVBHLVJXIiwiU1QtUC1ERVMtUiIsIlNELVAtTFJDLVIiLCJTRC1QLVNQLVIiLCJTRC1QLUdQRC1SIiwiU0QtUC1URC1SIiwiRkUtUC1GR0wtUiIsIlNELUFQSS1SQ0wtUlciLCJTRC1QLUJURC1SIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaG9zcGl0YWxfY29kZSI6IlNIMDAxIiwiaG1zX3BhZ2VzIjpbXSwiYWxsb3dlZC1vdXRsZXRzIjpbXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3ODM5MTU3NDEsImV4cCI6MTc4NDAwMjc0MX0.JikDTrXn4YdNPC5V85Tioto7ThnMx0PH0S9cLCRchSL-JE2h-5edkupG5X5XVayzIhCVYaDNtw5Gp4n1lXtdt4GkonR28MKozWjTktb28bTHYUDlS8JulctLb52AdxHfUQROuHzp0vqzOHP_BZOqHbDCfu8oCaE1ZTS1kF-eyhTE4Sd_hYDMla_ii8MEJU27pnz2BSjyPhIiZzMWUUqGgkU_pcPNW6tPym3tNBP9kQWK69SqLA9_ZMgJgcbF-lmmJ6rHclc6a1C1AlIPjtSZdmx-8rgwrtg6srS8nUDWR4bTrr0XzB3EqXlq7ZY5H2fuUhQsaWIfThurSQrlip7aAA";
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
