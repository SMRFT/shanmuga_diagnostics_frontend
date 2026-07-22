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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiU0QtUC1ITVNQQi1SVyIsIlNULVAtQ01ULVJXIiwiU0QtUC1TQS1SVyIsIlNELVAtSE1TVEQtUiIsIkhNUy1QLVZORC1SVyIsIlNELVAtTUJQRC1SIiwiSE1TLVAtSFJJTi1SVyIsIlNELVAtSE1TU1AtUiIsIlNELUFQSS1HRC1SIiwiSE1TLVAtUElELVJXIiwiU1QtUC1OVEYtUiIsIlNULVAtU05PLVJXIiwiU0QtQVBJLVRNLVJXIiwiSE1TLVAtT1MtUlciLCJITVMtUC1QT0wtUiIsIlNELVAtSE1TVUMtUlciLCJTRC1BUEktQ04tUiIsIkhNUy1QLVBPLVJXIiwiSE1TLVAtR1JOLVJXIiwiU0QtQVBJLVRNLVIiLCJITVMtUC1DVElBLVJXIiwiU0QtUC1ITVNCRC1SVyIsIlNELVAtUkQtUlciLCJTVC1SLUVNUCIsIlNELVAtSE1TQ1MtUiIsIkhNUy1QLVBDRC1SVyIsIkhNUy1QLVZOREQtUlciLCJITVMtUC1QU0ctUlciLCJTRC1QLUhNU0dQLVIiLCJTRC1BUEktTUJURC1SVyIsIkhNUy1QLVNJREVCQVIiLCJITVMtUC1NUi1SVyIsIkhNUy1QLUdQUkEtUlciLCJTRC1QLUhNU1NTLVJXIiwiU0QtUC1ITVNQUy1SVyIsIlNELVAtU1NVLVJXIiwiU0QtUC1ITVNHQy1SIiwiSE1TLVAtREIiLCJITVMtUC1PQ1ItUlciLCJTRC1QLU1JUy1SIiwiU0QtUC1ITVNTRC1SIiwiSE1TLVAtR1BSLVJXIiwiSE1TLVAtUEktUlciLCJTRC1QLVNTVS1SIiwiSE1TLVAtQ1RJLVJXIiwiSE1TLVAtU1RBLVJXIiwiU0QtUC1URC1SVyIsIlNULVAtQ01ULVIiLCJTVC1BUEktQ1JELVIiLCJTVC1QLURFUy1SIiwiR1AtUC1HQ04tUiIsIlNELVAtUkctUlciLCJTRC1QLVBPVi1SIiwiU0QtQVBJLU1JUy1SVyIsIlNELVAtU1MtUlciLCJTRC1QLU1CREYtUlciLCJITVMtUC1DQ0QtUlciLCJTRC1QLVRFLVJXIiwiSE1TLVAtUFJBLVJXIiwiSE1TLVAtSE1TUFMiLCJITVMtUC1IUklOLVIiLCJTRC1BUEktUkItUiIsIkhNUy1QLUhNU1BTLVJXIiwiSE1TLVAtTVJBLVJXIiwiU0QtUC1ITVNMRC1SIiwiU0QtUC1UREUtUlciLCJITVMtQVBJLVZNIiwiSE1TLVAtSFJJTkEtUlciLCJTRC1QLVBELVJXIiwiSE1TLVAtSE1TIiwiSE1TLVAtUFJMLVJXIiwiU0QtUC1QT1YtUlciLCJITVMtUC1DQy1SVyIsIkhNUy1BUEktUkQtUiIsIkhNUy1QLU1ULVJXIiwiU0QtQVBJLVRWLVIiLCJTVC1SLUNEUiIsIlNULUFQSS1CUkQtUlciLCJTRC1QLVNTLVIiLCJITVMtUC1QU0gtUlciLCJTVC1BUEktQU1DLVIiLCJITVMtUC1HUk5SLVJXIiwiU0QtUC1NQlRWLVIiLCJTRC1QLURGLVJXIiwiSE1TLVAtU1QtUlciLCJITVMtUC1QQy1SVyIsIlNULVAtQlJELVIiLCJTVC1QLVRETC1SIiwiU1QtUC1OVEYtUlciLCJITVMtUC1NUkwtUlciLCJTRC1SLUxUIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaG9zcGl0YWxfY29kZSI6IlNIMDAxIiwiaG1zX3BhZ2VzIjpbMTI4LDUsMTM0LDEzNSwxMzYsMTIyLDEwLDE0LDE1LDE2LDExNCwxMjEsNTgsNTksMTI3LDE0NCwxNDNdLCJhbGxvd2VkLW91dGxldHMiOlsiT0xFVDAwMyJdLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc4NDcwNDIwMywiZXhwIjoxNzg0NzkxMjAzfQ.bFiw8_EJOiFRpcAw2bIa43Cn6g2ZkvxV6tdM4_9XHBFxVpYzowp83VENSm-8bcCJeuYdC3veqaWTbwLQkAuBravNuXaI0JrzEyTRRo81ogsBMXnqDwBDGmjtdfH3s64M5Y7KmYY4CXktYEngyEug_Dbngir0pn1DEWZRIrwliDA6SpzFMTnR6IjzHMuQKDU7lcIJ3yaV5QgpkbQ9RwpXtqYXKB8cOqm077x8gO6xRSd2rU9mTuQwILVtIWZ9UOlXCyOqynvRyVDxhdHJICv5RMJ3hlZSUWjvJ7Gk0d78rvkp6c_xW98eS0a95j0Xjl7djwesYcbMLOL8yle3DyoTEg";
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
