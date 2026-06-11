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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDAwMiIsImVtYWlsIjoibmFqbWFzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiTmFqbWEgQiIsImFsbG93ZWQtYWN0aW9ucyI6WyJTRC1QLVBMLVIiLCJTRC1QLUJBLVIiLCJTRC1QLURGLVJXIiwiU0QtQVBJLVJCLVIiLCJTVFItQVBJLVRSTC1SIiwiU0QtUC1QQi1SVyIsIlNUUi1SLUEiLCJTVC1QLU5URi1SVyIsIlNELVAtU0hGLVIiLCJTVC1QLVRETC1SIiwiU0QtQVBJLVBSLVIiLCJTRC1QLVRFLVJXIiwiU0QtUC1ITVNDUy1SIiwiU0QtUC1TR0FDLVIiLCJTRC1QLUhNU1BCLVIiLCJTVC1QLURFUy1SVyIsIlNULVAtQ01ULVIiLCJTVFItQVBJLUlMIiwiU0QtQVBJLUdPUi1SVyIsIlNELVAtU1MtUlciLCJTRC1QLVNQLVIiLCJTRC1QLUJURC1SIiwiU0QtUC1QQi1SIiwiU1QtQVBJLUNSRC1SVyIsIlNELUFQSS1JVk0tUlciLCJTRC1QLVNJUi1SVyIsIlNELVAtTEdELVJXIiwiU1RSLVAtSUNTLVIiLCJTRC1QLVBPVi1SVyIsIlNELVAtTFNDTC1SIiwiU0QtUC1ITVNURC1SVyIsIlNELVAtSE1TUFMtUlciLCJTVC1BUEktVFJMUi1SVyIsIlNELVAtSE1TR0MtUiIsIlNUUi1QLVRJTlItUlciLCJTRC1QLVBGLVIiLCJTRC1QLUxSQy1SIiwiU0QtUC1TQy1SIiwiU0QtUC1NSVMtUiIsIlNELUFQSS1WQy1SVyIsIlNULVAtQ01ULVJXIiwiU0QtUC1URS1SIiwiU0QtQVBJLU1JUy1SVyIsIlNELVAtSE1TVUMtUlciLCJTRC1QLUxHU0MtUiIsIlNELVAtSE1TVEQtUiIsIlNULUFQSS1BTUMtUlciLCJTRC1QLUhNU1NQLVJXIiwiU1RSLUFQSS1USU4tUiIsIlNUUi1QLVRJTlItUiIsIlNELVItQSIsIlNELUFQSS1DTi1SIiwiU0QtUC1VUEItUlciLCJTRC1QLU1CVFYtUiIsIlNULUFQSS1FTVAtUiIsIlNELUFQSS1HT0MtUlciLCJTRC1QLUhNU1BCLVJXIiwiU1QtUC1CUkQtUiIsIlNULVAtREVTLVIiLCJTRC1QLUhNU1NTLVJXIiwiU0QtUC1URC1SIiwiU1RSLUFQSS1WTC1SIiwiU0QtQVBJLVZQLVJXIiwiU0QtUC1CQS1SVyIsIlNELUFQSS1SQ0wtUlciLCJTRC1QLVBHLVJXIiwiU0QtUC1ERi1SIiwiU0QtUC1MU0MtUlciLCJTRC1QLUdQQi1SVyIsIlNULVAtVERMLVJXIiwiU0QtUC1TVkYtUlciLCJTRC1QLUxCTi1SIiwiU1QtUC1TTk8tUlciLCJTRC1QLVNDVS1SVyIsIlNELVAtU1MtUiIsIlNUUi1BUEktVkwtUlciLCJTRC1QLVBPVi1SIiwiU1RSLUFQSS1JTC1SVyIsIlNELVAtQ0hDLVIiLCJTRC1QLVRELVJXIiwiU0QtUC1TVkYtUiIsIlNELVAtTU9MUEQtUlciLCJTVFItQVBJLVRJTi1SVyIsIlNELUFQSS1HUi1SVyIsIlNELUFQSS1HQy1SVyIsIlNELVAtQ0hDLVJXIiwiU0QtUC1QRC1SIiwiU0QtUC1HUEQtUiIsIlNELVAtTUJQRC1SIiwiU0QtUC1ITVNTUC1SIiwiU1RSLUFQSS1UUkxSLVIiLCJTRC1BUEktVE0tUlciLCJTRC1QLU1CREYtUlciLCJTRC1QLUhNU1NELVJXIiwiU0QtUC1MR0xULVIiLCJTRC1QLVNHQUMtUlciLCJTRC1QLVBHLVIiLCJTVC1BUEktQlJELVJXIiwiU0QtUC1HU1AtUiIsIlNELVAtU1NVLVJXIiwiU0QtUC1NT0xERi1SVyIsIlNELVAtU1NVLVIiLCJTVFItQVBJLVRSTC1SVyIsIlNELVAtU0lSLVIiLCJTVC1SLUEiLCJTVFItQVBJLUlMLVIiLCJTVC1QLU5URi1SIiwiU0QtUC1QRi1SVyIsIlNELVAtQkctUiIsIlNELVAtTFVTQ0QtUlciLCJTRC1BUEktVEQtUiIsIlNELUFQSS1JVk0tUiIsIlNELVAtU0hGLVJXIiwiU0QtUC1ITVNMRC1SIiwiU0QtUC1VUEItUiIsIlNELUFQSS1UVi1SIiwiU0QtQVBJLU1CVEQtUlciLCJTRC1QLUxHTEQtUiIsIlNELVAtQlRELVJXIiwiU0QtQVBJLUdELVIiLCJTRC1QLUhNU1NTLVIiLCJTRC1QLUxTRC1SVyIsIlNELUFQSS1UTS1SIiwiU0QtUC1MUEktUiJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIiwiU0hCMDAyIl0sImhvc3BpdGFsX2NvZGUiOiJTSDAwMSIsImhtc19wYWdlcyI6W10sImFsbG93ZWQtb3V0bGV0cyI6W10sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzgxMTQ4ODg5LCJleHAiOjE3ODEyMzU4ODl9.MTCREqVxQjaU9lc9NLSE38RvPM4JSHwyhLb3gc_JG6sAEmp4rhv5GnGpSSMZjZ3JfhXgex5bBGiLpJ04kjaXYtHXD7ZJC_P3PUE4c1T05NL5dyZdlCr8LW6vw_z3wHZ7cDFqmifYfbfRAB1O6kPvUIzAoHl8jlhCOyAivTJrig7dNMeVk8RCL4n9J3gmuHxQ8_hPfKwPtqIM4UcN9P7Vua9AzY6j4BH6D_e9F2MTGKZ2w8Tx8tFWZbxN_0PnOQnhz323YUG01Vo9l2XwKSWqKfrHsZ-SGzCnaNaLZAKWi4oV9aSsNpiLUx8tey9JeSQXnxfIU8nJlV1T2wIr45wuhg";
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
