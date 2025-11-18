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
  const dev_token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg2NyIsImVtYWlsIjoicGFydGhpYmFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik0uUGFydGhpYmFuIiwiYWxsb3dlZC1hY3Rpb25zIjpbIlNISS1QLURFTFJBVy1SVyIsIlNISS1QLVJFQy1SVyIsIlNISS1QLUVYUC1SVyIsIlNULVItQ0RSIiwiU1QtQVBJLUVNUC1SIiwiU0hJLVAtRjJTUi1SVyIsIlNISS1QLVNJQ1UtUlciLCJTSEktUC1GMVNSLVJXIiwiU0QtUC1QT1YtUiIsIlNISS1QLVVQRFJBVy1SVyIsIlNISS1QLU1PQ0stUlciLCJTSEktUC1NSUNVLVJXIiwiU1QtUC1CUkQtUiIsIkdMLVAtQU5ELVJXIiwiU1QtUC1DTVQtUlciLCJTSEktUC1YUkFZLVJXIiwiU0hJLVAtRk9STS1SVyIsIlNISS1QLUFWQUlMLVJXIiwiU0hJLVAtVFJBSU4tUlciLCJTVC1QLU5URi1SIiwiU0hJLVAtTEFCLVJXIiwiU0QtUC1TUy1SVyIsIlNISS1QLUYzLVJXIiwiU0hJLVAtQ1QtUlciLCJTSEktUC1GMi1SVyIsIlNELVAtREYtUlciLCJTSEktUC1GMVMtUlciLCJTVC1QLURFUy1SVyIsIkdMLVAtRVAtUlciLCJTSEktUC1UUkFJTlItUlciLCJTSEktUC1VUEQtUlciLCJHTC1QLVAtUlciLCJTSEktUC1GMlMtUlciLCJTSEktUC1GM1ItUlciLCJTSEktUC1QSFktUlciLCJTSEktUC1IQU5EUi1SVyIsIlNISS1QLUYxUi1SVyIsIlNELVAtU1NVLVJXIiwiU0hJLVAtQ0hFTU9SLVJXIiwiU0hJLVAtTklDVS1SVyIsIlNELVAtUEwtUiIsIlNISS1QLUlOQyIsIkdMLVAtRUJULVJXIiwiU1QtQVBJLUFNQy1SVyIsIlNELVAtVEQtUiIsIlNULUFQSS1CUkQtUlciLCJHTC1QLUVBRC1SVyIsIlNISS1QLURFTC1SVyIsIlNISS1QLU9ULVJXIiwiU0QtUi1DRU8iLCJTRC1QLUJURC1SIiwiR0wtUC1FTC1SVyIsIlNELVAtU1MtUiIsIlNELVAtUE9WLVJXIiwiU0hJLVAtRU1SLVJXIiwiU0hJLVAtT1BELVJXIiwiR0wtUC1OREMtUlciLCJTSEktUC1NSUNVUi1SVyIsIlNELVAtQlRELVJXIiwiU0hJLVAtRjEtUlciLCJTSEktUC1IQU5ELVJXIiwiU0hJLVAtRjJSLVJXIiwiU0hJLVAtR0VUUkFXLVJXIiwiU0QtQVBJLVRWLVIiLCJTVC1QLVRETC1SVyIsIlNULVAtTlRGLVJXIiwiU0QtUC1CRy1SIiwiU0hJLVAtRlJOVC1SVyIsIlNISS1QLU5JQ1VSLVJXIiwiR0wtUC1SU0UtUlciLCJTSEktUC1ESUEtUlciLCJTRC1QLUNIQy1SIiwiU0QtUC1QRC1SIiwiU0QtUC1URC1SVyIsIlNULVAtU05PLVJXIiwiU0QtUC1ERi1SIiwiU1QtUC1ERVMtUiIsIlNISS1QLU1SRC1SVyIsIlNELVAtQ0hDLVJXIiwiU0QtUC1NSVMtUiIsIlNISS1QLVBIQVJNLVJXIiwiU0hJLVAtRU1SUi1SVyIsIlNULVItQSIsIlNULVAtQ01ULVIiLCJTVC1BUEktQ1JELVJXIiwiU0QtQVBJLUNOLVIiLCJHTC1QLUVELVJXIiwiU0QtUC1TU1UtUiIsIlNISS1QLU1SSS1SVyIsIlNISS1QLVJFQ1ItUlciLCJTRC1BUEktUkItUiIsIlNELUFQSS1URC1SIiwiU0hJLVAtQ0hFTU8tUlciLCJTVC1QLVRETC1SIiwiU0QtUC1HUEQtUiIsIlNISS1QLVNJQ1VSLVJXIiwiU0hJLVAtSFItUlciXSwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwMSJdLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc2MzQ0MTczMywiZXhwIjoxNzYzNTI4NzMzLCJqdGkiOiIwNDU0MmMwNS1mYjViLTRhZWItYmU4Yi01MDNkZDkxNzgzZTUifQ.cBjomWk_ZiadfFP1rimxjJSC-Bw3J0Bz1LfNkTLeijsxEQ_YMeag-W37WTjsNmxZsICAhLeuBpYTSOVIDXZrg0WQDtyM-ZWP7C6nexv3wBZ4dZRSHPwkHOqc2mjL7WC1mN4ndWgxyJUbDsde0fYYZR6IMh7NYP-AtMmLh37J-euMI2dKas5Wsoli-2i0qEe1qCJP3gVRg_k9H3_4-XNmP7vU_JRzfPvL4jRpE_CYcH7_vyQADrKsWdyO4UQKGnwLHw6PLONxvlX_5LJGqfL7afRSV2w-sBqt2vowowFNMZpfcx4PH8lScFNZUq-E0Xyqz8GEPUY2_L2tKVqa9qy09A"; 
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
  } else if (allowedActions.includes("SD-R-LR")) {
    return "Receptionist";
  } else if (allowedActions.includes("SD-R-GM")) {
    return "General Manager";
  } else if (allowedActions.includes("SD-R-LT")) {
    return "Technician";
  } else if (allowedActions.includes("SD-R-DOC")) {
    return "Doctor";
  } else if (allowedActions.includes("SD-R-FOF")) {
    return "Front Office";
  } else if (allowedActions.includes("SD-R-SLP")) {
    return "Sales Person";
  } else if (allowedActions.includes("SD-R-SMC")) {
    return "Sample Collector";
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
