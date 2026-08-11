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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDE1NyIsImVtYWlsIjoiZ20ubGFic2FsZXNAc21yZnQub3JnIiwibmFtZSI6IlN1bmRhciBNIiwiYWxsb3dlZC1hY3Rpb25zIjpbIlNELVAtTEQtUlciLCJTVC1QLUNNVC1SIiwiU0QtQVBJLUdSLVJXIiwiU0QtUC1URC1SIiwiU0QtUC1VUEItUiIsIlNELUFQSS1SQi1SVyIsIlNELVAtU1ZGLVJXIiwiU0QtUC1QQi1SIiwiU0QtUC1HUEQtUlciLCJGRS1QLUZTLVJXIiwiU0QtUC1CQS1SVyIsIlNULUFQSS1FTVAtUiIsIlNELVAtVEUtUlciLCJTRC1QLUxCTC1SVyIsIlNELVAtVEUtUiIsIkZFLVAtRkFMLVIiLCJTRC1QLVNWRC1SVyIsIlNELUFQSS1UTS1SIiwiU0QtUC1URC1SVyIsIkZFLVAtRkdGLVIiLCJTRC1QLVNDLVIiLCJTRC1QLUxUQS1SVyIsIlNELUFQSS1JVk0tUlciLCJTRC1QLVVQQi1SVyIsIlNELVAtU0NVLVJXIiwiU1QtUC1ERVMtUlciLCJTRC1QLVNPUi1SVyIsIlNELUFQSS1QUi1SIiwiRkUtUC1GR0wtUiIsIlNELVAtTFJDLVIiLCJGRS1QLUZVUy1SVyIsIlNELVAtTFNSLVJXIiwiU0QtUC1QRi1SVyIsIlNELVAtUEQtUiIsIlNULVAtU05PLVJXIiwiR1AtUC1HQ04tUiIsIlNULVAtVERMLVIiLCJTRC1QLUxUUi1SVyIsIlNELVAtU1NVLVJXIiwiU0QtUC1TSEYtUlciLCJTRC1QLUJURC1SVyIsIlNELVAtU1MtUiIsIlNELVAtU1NVLVIiLCJTRC1BUEktVEQtUiIsIlNELUFQSS1UVi1SIiwiRkUtUC1GRi1SVyIsIlNELVAtUEYtUiIsIkZFLVAtRkctUlciLCJTRC1QLUNIQy1SVyIsIlNELVAtUEItUlciLCJTRC1QLVBHLVIiLCJTRC1QLVRTLVJXIiwiU0QtUC1TSVItUlciLCJTVC1QLURFUy1SIiwiU0QtUC1CQkEtUlciLCJTRC1QLUNIQy1SIiwiU0QtUC1DTC1SVyIsIlNULUFQSS1CUkQtUlciLCJTRC1BUEktVlAtUlciLCJTRC1BUEktR09DLVJXIiwiU0QtQVBJLVRNLVJXIiwiU0QtUC1QTC1SIiwiU0QtUC1MR0QtUlciLCJTRC1QLUxTUC1SVyIsIlNELVAtR1NQLVIiLCJTRC1QLURGLVJXIiwiU0QtUC1NQlBELVIiLCJTRC1QLUxCRi1SVyIsIlNELVAtU0dBQy1SIiwiU0QtUC1TVkYtUiIsIlNELVAtU1AtUiIsIlNELVAtTFNMLVJXIiwiU1QtUC1OVEYtUlciLCJTRC1QLVNHQUMtUlciLCJGRS1QLUZSLVJXIiwiU0QtUC1QT1YtUlciLCJTRC1QLU1CREYtUlciLCJTRC1BUEktVkMtUlciLCJTRC1BUEktSVZNLVIiLCJTRC1BUEktTUJURC1SVyIsIlNELVAtUEctUlciLCJGRS1SLUZBIiwiU0QtQVBJLUdELVIiLCJTVC1QLUJSRC1SIiwiU0QtUC1ERi1SIiwiU0QtQVBJLU1JUy1SVyIsIlNELVAtTEJOLVIiLCJTRC1QLUxDQy1SVyIsIlNELVAtT0QtUiIsIlNELVAtUkQtUlciLCJTRC1QLVNHRS1SIiwiU0QtUC1HUEQtUiIsIlNELVAtTEJDLVJXIiwiU1QtUC1UREwtUlciLCJTRC1QLU1CVFYtUiIsIlNELUFQSS1HQy1SVyIsIlNELVAtR1BULVJXIiwiU0QtUC1TUy1SVyIsIlNELVAtTFRNLVJXIiwiU0QtUC1CRy1SIiwiU0QtUi1HTSIsIlNULUFQSS1DUkQtUlciLCJTRC1QLUJURC1SIiwiU0QtQVBJLUdPUi1SVyIsIlNELVAtTUlTLVIiLCJTRC1BUEktUkNMLVJXIiwiU0QtUC1TSEYtUiIsIlNELUFQSS1DTi1SVyIsIlNULVAtQ01ULVJXIiwiU1QtUi1IT0QiLCJTRC1QLUxHRS1SVyIsIlNULUFQSS1BTUMtUlciLCJTVC1QLU5URi1SIiwiU0QtUC1HUEItUlciLCJTRC1QLUxQSS1SIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaG9zcGl0YWxfY29kZSI6IlNIMDAxIiwiaG1zX3BhZ2VzIjpbXSwiYWxsb3dlZC1vdXRsZXRzIjpbXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3ODYzMzE4ODAsImV4cCI6MTc4NjQxODg4MH0.RIFjfD35Q-0L3ArCR1__8J7bSrI0V4sePiqZVvzlcNhloCFW_PwfYdAihU-x7W4J21ylMxvDmEmIJ971tQmu1gXhW-J5xhUx2nWtkdCk6jPOtEFN8nrecr9ZPCpEzXLnuA9K5uu2cryoU7lgvix-tf4KncxVysLOh__LInfeFRW8PTxoFUaK1gZSK7mRsmDTLrqbT4ecisUOf0HS9HBfueCJvM24izL4E34Ms6VohoAR8tzdYc_QmfTOh1GGiHkBWvxv70-q1g24Dp1YhEZCrYE5228V08hrEBt4zks86nuxBqTi6U6eZkajvMpKM15jDnlveuGSHNUDr6RtCj7rag";
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
  } else if (allowedActions.includes("SD-R-MAVP")) {
    return "Marketting AVP";

  } else if (allowedActions.includes("SD-R-HR")) {
    return "HR";
  } else {
    return "Accounts"; // Default role if none of the specific roles are found
  }
}

// --- Main execution ---
(function main() {
  const isEstimatePath = window.location.pathname.toLowerCase().includes("estimate");

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

    // If still no token (development token is empty), redirect to login unless on public route
    if (!accessToken || accessToken.trim() === "") {
      console.log("❌ No valid token available");
      if (isEstimatePath) {
        console.log("Public estimate route detected, rendering App without token...");
        const root = ReactDOM.createRoot(document.getElementById("root"));
        root.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>,
        );
        return;
      }
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

    if (isEstimatePath) {
      console.log("Public estimate route detected, rendering App despite token validation failure...");
      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      );
      return;
    }

    // If validation fails, redirect to login instead of showing debug page
    console.log("❌ Redirecting to login due to validation failure");
    redirectToLogin();
  }
})();
