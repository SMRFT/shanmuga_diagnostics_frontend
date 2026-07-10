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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDE1NyIsImVtYWlsIjoiZ20ubGFic2FsZXNAc21yZnQub3JnIiwibmFtZSI6IlN1bmRhciBNIiwiYWxsb3dlZC1hY3Rpb25zIjpbIlNELUFQSS1DTi1SVyIsIlNELVAtTFRBLVJXIiwiU0QtUC1DSEMtUlciLCJTVC1QLVRETC1SVyIsIlNELVAtVVBCLVJXIiwiU1QtUC1DTVQtUlciLCJTRC1QLURGLVIiLCJTVC1QLUJSRC1SIiwiU0QtUC1TR0FDLVJXIiwiU0QtQVBJLVZQLVJXIiwiU0QtUC1DSEMtUiIsIlNELVAtUEItUlciLCJTRC1QLVNIRi1SIiwiU0QtQVBJLUdSLVJXIiwiU0QtUC1TVkYtUlciLCJTRC1QLVRFLVIiLCJTRC1QLVBGLVIiLCJTRC1QLVNDVS1SVyIsIlNELVAtTUJQRC1SIiwiU0QtUC1QRy1SIiwiU0QtQVBJLVBSLVIiLCJTVC1BUEktQlJELVJXIiwiU0QtUC1MQkMtUlciLCJTRC1BUEktVE0tUlciLCJTVC1BUEktQU1DLVJXIiwiU0QtUC1TVkQtUlciLCJGRS1SLUZBIiwiU0QtUC1QQi1SIiwiRkUtUC1GRy1SVyIsIkZFLVAtRlMtUlciLCJTVC1QLVRETC1SIiwiU0QtUC1CQkEtUlciLCJTVC1BUEktQ1JELVJXIiwiU0QtQVBJLVJCLVJXIiwiU0QtUC1MUEktUiIsIkZFLVAtRlItUlciLCJTRC1QLVVQQi1SIiwiU0QtUC1CRy1SIiwiRkUtUC1GRi1SVyIsIlNELVAtTUlTLVIiLCJTVC1SLUhPRCIsIlNELUFQSS1UTS1SIiwiU0QtQVBJLUdPUi1SVyIsIlNELVAtUkQtUlciLCJTRC1BUEktR0QtUiIsIlNELUFQSS1WQy1SVyIsIkZFLVAtRkFMLVIiLCJTRC1QLVBELVIiLCJTRC1QLVNTVS1SVyIsIlNELVAtQlRELVJXIiwiU0QtUC1MR0QtUlciLCJTVC1QLU5URi1SVyIsIlNELVAtU1ZGLVIiLCJTVC1QLU5URi1SIiwiU0QtQVBJLUdPQy1SVyIsIlNELVAtU1NVLVIiLCJTRC1QLUxCTi1SIiwiU0QtUC1TSEYtUlciLCJTRC1QLVBPVi1SVyIsIlNELVAtQ0wtUlciLCJTVC1QLUNNVC1SIiwiR1AtUC1HQ04tUiIsIlNELVAtU1MtUiIsIlNELUFQSS1NSVMtUlciLCJTRC1QLUxUTS1SVyIsIkZFLVAtRlVTLVJXIiwiU0QtUi1HTSIsIlNELUFQSS1NQlRELVJXIiwiU0QtUC1UUy1SVyIsIlNELUFQSS1HQy1SVyIsIlNELVAtU0dBQy1SIiwiU1QtQVBJLUVNUC1SIiwiU0QtUC1QRi1SVyIsIlNELVAtTFRSLVJXIiwiU0QtQVBJLUlWTS1SIiwiU0QtUC1HUEQtUlciLCJTRC1QLUdQQi1SVyIsIlNELVAtR1NQLVIiLCJTRC1QLU9ELVIiLCJTRC1QLU1CVFYtUiIsIlNELVAtTFNSLVJXIiwiRkUtUC1GR0YtUiIsIlNELVAtR1BULVJXIiwiU0QtUC1TR0UtUiIsIlNELUFQSS1URC1SIiwiU0QtQVBJLVRWLVIiLCJTRC1QLVRELVJXIiwiU0QtUC1TUy1SVyIsIlNULVAtU05PLVJXIiwiU0QtUC1TT1ItUlciLCJTRC1QLU1CREYtUlciLCJTRC1BUEktSVZNLVJXIiwiU1QtUC1ERVMtUlciLCJTRC1QLUxELVJXIiwiU0QtUC1QTC1SIiwiU0QtUC1TQy1SIiwiU0QtUC1ERi1SVyIsIlNELVAtU0lSLVJXIiwiU0QtUC1CQS1SVyIsIlNELVAtTFNMLVJXIiwiU0QtUC1URS1SVyIsIlNELVAtUEctUlciLCJTVC1QLURFUy1SIiwiU0QtUC1MUkMtUiIsIlNELVAtU1AtUiIsIlNELVAtR1BELVIiLCJTRC1QLVRELVIiLCJGRS1QLUZHTC1SIiwiU0QtQVBJLVJDTC1SVyIsIlNELVAtQlRELVIiXSwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwMSJdLCJob3NwaXRhbF9jb2RlIjoiU0gwMDEiLCJobXNfcGFnZXMiOltdLCJhbGxvd2VkLW91dGxldHMiOltdLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc4MzY3ODU5NywiZXhwIjoxNzgzNzY1NTk3fQ.K7SKml4_zNqq4jc-2g0ZbU0c22jRBkktz52wr705AfAZo7U1kdHX7QpXOQNmm4u30CglpSY2hXdM9sWrbmJBQyGL3_QyA_bOWwGkrfmP4vB_hFdShoSQr-7jZAM3knNa5RCmFqqfeMhG6XYsLvgGe2EZTjnDny1V6aW_StRFsXnzxfu6iYKn00CysraYjDBqMDSrGgMeSqLZO7Ebi-wwDLQf8QTAhg3O-2MK2jBmLNCKUz_Z9rh1TqY4l-_xBNbtgnLPA9loi_447CG_gZZT95_Hmo1dLGO7Xy8wieHA5RbsGzhrjSEZyJjRdnyuYmGBQcIkTNCKn82sXuAv9L27oA";
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
