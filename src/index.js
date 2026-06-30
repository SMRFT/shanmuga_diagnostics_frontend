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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDE1NyIsImVtYWlsIjoiZ20ubGFic2FsZXNAc21yZnQub3JnIiwibmFtZSI6IlN1bmRhciBNIiwiYWxsb3dlZC1hY3Rpb25zIjpbIlNELUFQSS1DTi1SVyIsIlNELVAtTFRBLVJXIiwiU0QtUC1DSEMtUlciLCJTVC1QLVRETC1SVyIsIlNELVAtVVBCLVJXIiwiU1QtUC1DTVQtUlciLCJTRC1QLURGLVIiLCJTVC1QLUJSRC1SIiwiU0QtUC1TR0FDLVJXIiwiU0QtQVBJLVZQLVJXIiwiU0QtUC1DSEMtUiIsIlNELVAtUEItUlciLCJTRC1QLVNIRi1SIiwiU0QtQVBJLUdSLVJXIiwiU0QtUC1TVkYtUlciLCJTRC1QLVRFLVIiLCJTRC1QLVBGLVIiLCJTRC1QLVNDVS1SVyIsIlNELVAtTUJQRC1SIiwiU0QtUC1QRy1SIiwiU0QtQVBJLVBSLVIiLCJTVC1BUEktQlJELVJXIiwiU0QtUC1MQkMtUlciLCJTRC1BUEktVE0tUlciLCJTVC1BUEktQU1DLVJXIiwiU0QtUC1TVkQtUlciLCJGRS1SLUZBIiwiU0QtUC1QQi1SIiwiRkUtUC1GRy1SVyIsIkZFLVAtRlMtUlciLCJTVC1QLVRETC1SIiwiU0QtUC1CQkEtUlciLCJTVC1BUEktQ1JELVJXIiwiU0QtUC1MUEktUiIsIkZFLVAtRlItUlciLCJTRC1QLVVQQi1SIiwiU0QtUC1CRy1SIiwiRkUtUC1GRi1SVyIsIlNELVAtTUlTLVIiLCJTVC1SLUhPRCIsIlNELUFQSS1UTS1SIiwiU0QtQVBJLUdPUi1SVyIsIlNELVAtUkQtUlciLCJTRC1BUEktR0QtUiIsIlNELUFQSS1WQy1SVyIsIkZFLVAtRkFMLVIiLCJTRC1QLVBELVIiLCJTRC1QLVNTVS1SVyIsIlNELVAtQlRELVJXIiwiU0QtUC1MR0QtUlciLCJTVC1QLU5URi1SVyIsIlNELVAtU1ZGLVIiLCJTRC1BUEktUkItUiIsIlNULVAtTlRGLVIiLCJTRC1BUEktR09DLVJXIiwiU0QtUC1TU1UtUiIsIlNELVAtTEJOLVIiLCJTRC1QLVNIRi1SVyIsIlNELVAtUE9WLVJXIiwiU0QtUC1DTC1SVyIsIlNULVAtQ01ULVIiLCJHUC1QLUdDTi1SIiwiU0QtUC1TUy1SIiwiU0QtQVBJLU1JUy1SVyIsIlNELVAtTFRNLVJXIiwiRkUtUC1GVVMtUlciLCJTRC1SLUdNIiwiU0QtQVBJLU1CVEQtUlciLCJTRC1QLVRTLVJXIiwiU0QtQVBJLUdDLVJXIiwiU0QtUC1TR0FDLVIiLCJTVC1BUEktRU1QLVIiLCJTRC1QLVBGLVJXIiwiU0QtUC1MVFItUlciLCJTRC1BUEktSVZNLVIiLCJTRC1QLUdQRC1SVyIsIlNELVAtR1BCLVJXIiwiU0QtUC1CQS1SIiwiU0QtUC1HU1AtUiIsIlNELVAtT0QtUiIsIlNELVAtTUJUVi1SIiwiU0QtUC1MU1ItUlciLCJGRS1QLUZHRi1SIiwiU0QtUC1HUFQtUlciLCJTRC1QLVNHRS1SIiwiU0QtQVBJLVRELVIiLCJTRC1BUEktVFYtUiIsIlNELVAtVEQtUlciLCJTRC1QLVNTLVJXIiwiU1QtUC1TTk8tUlciLCJTRC1QLVNPUi1SVyIsIlNELVAtTUJERi1SVyIsIlNELUFQSS1JVk0tUlciLCJTVC1QLURFUy1SVyIsIlNELVAtTEQtUlciLCJTRC1QLVBMLVIiLCJTRC1QLVNDLVIiLCJTRC1QLURGLVJXIiwiU0QtUC1TSVItUlciLCJTRC1QLUJBLVJXIiwiU0QtUC1MU0wtUlciLCJTRC1QLVRFLVJXIiwiU0QtUC1QRy1SVyIsIlNULVAtREVTLVIiLCJTRC1QLUxSQy1SIiwiU0QtUC1TUC1SIiwiU0QtUC1HUEQtUiIsIlNELVAtVEQtUiIsIkZFLVAtRkdMLVIiLCJTRC1BUEktUkNMLVJXIiwiU0QtUC1CVEQtUiJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImhvc3BpdGFsX2NvZGUiOiJTSDAwMSIsImhtc19wYWdlcyI6W10sImFsbG93ZWQtb3V0bGV0cyI6W10sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzgyNzkxOTQyLCJleHAiOjE3ODI4Nzg5NDJ9.CrwWIWmhRgpt5Bqbwhazr9TSmqkSEu_YnsyIpcUWYONiI7gsTa8EeSItGha1bwkEvZVSh3XTl-8kqduilBmqu2oMUDlGfm0OCqLpSPO0omHZVjzuZvYNlGKpTLL9tDDsuExf8lLh_wTMXGvNbAm6p-PY4o71-SFigxx_rm83GN-UtdsfetFcUTTKhjv5i8v75_BS0IiY1wy2z1L3j91aznmYJ2N4V76A4A-QmAKTNe0B78E7CTa29pcsVMFnl2k0k1MxCjku-MnR0Ogl9Y03Fov5Ve5X2z64wjNVl7r6PNoBShZCGPn8_yt4Uqy1Md_cnEOI8P271rDLVHjfJDIPDA";
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
