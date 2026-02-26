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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDM4MCIsImVtYWlsIjoibWFuaWJhbGFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik1hbmliYWxhbiIsImFsbG93ZWQtYWN0aW9ucyI6WyJNREMtUC1PU0ItUlciLCJTRC1BUEktVEQtUiIsIlNELVAtU0hGLVIiLCJTRC1QLURGLVJXIiwiU0QtUC1QQi1SIiwiU0QtQVBJLVRWLVIiLCJNREMtUi1SRUMiLCJNREMtUC1SRUctUiIsIlNELVAtVEQtUlciLCJTRC1BUEktUkNMLVJXIiwiU0QtQVBJLUdPUi1SVyIsIlNULUFQSS1BTUMtUlciLCJTRC1QLUdQQi1SVyIsIlNELVAtUEQtUiIsIlNELVAtVVBCLVIiLCJTRC1QLUxHU0MtUiIsIlNELVAtU1NVLVJXIiwiU0QtUC1ITVNVQy1SVyIsIlNELVAtREYtUiIsIk1EQy1BUEktUlRTLVIiLCJNREMtUC1BU00tUlciLCJTRC1QLVBHLVIiLCJTRC1QLUhNU1BCLVJXIiwiU0QtUC1QT1YtUiIsIlNELVAtU0lSLVIiLCJTRC1QLVBMLVIiLCJTSEktUC1UUkFJTi1SVyIsIlNELVAtTFNELVJXIiwiU0QtUC1ITVNTUy1SVyIsIlNELUFQSS1WQy1SVyIsIk1EQy1QLVBOUC1SVyIsIlNELUFQSS1JVk0tUiIsIlNULUFQSS1FTVAtUiIsIlNULUFQSS1CUkQtUlciLCJNREMtUC1TT1ItUiIsIlNELUFQSS1QUi1SIiwiTURDLUFQSS1USFItUiIsIlNELVAtTFNDTC1SIiwiU0QtUC1ITVNMRC1SIiwiU0QtUC1ITVNDUy1SIiwiU0QtUC1MR0QtUlciLCJTVC1QLURFUy1SVyIsIlNELVAtTUJERi1SVyIsIlNELVAtR1BELVIiLCJHTC1QLVJTRS1SVyIsIlNISS1QLUlOQyIsIlNELVAtSE1TR0MtUiIsIlNELVAtU1ZGLVIiLCJTRC1BUEktVE0tUiIsIlNELVAtUEYtUiIsIlNELVAtTFJDLVIiLCJHTC1QLUVCVC1SVyIsIkdMLVAtRVAtUlciLCJTRC1QLVNHQUMtUiIsIlNELVAtUE9WLVJXIiwiU0QtQVBJLU1CVEQtUlciLCJTRC1BUEktR09DLVJXIiwiU0QtUC1QRi1SVyIsIlNELVAtSE1TU1AtUlciLCJTVC1QLVRETC1SVyIsIlNELVItQSIsIk1EQy1BUEktQ0RSLVIiLCJTRC1QLUxCTi1SIiwiR1AtUC1HQ04tUiIsIk1EQy1BUEktQVQtUiIsIkdMLVAtTkRDLVJXIiwiU0QtQVBJLUdDLVJXIiwiU0QtQVBJLUdSLVJXIiwiU0QtUC1ITVNQUy1SVyIsIk1EQy1QLUNERS1SVyIsIlNELVAtSE1TU1AtUiIsIkdMLVAtRUQtUlciLCJNREMtQVBJLUxCTi1SIiwiU0QtUC1TQy1SIiwiTURDLVAtVFJCLVJXIiwiU0QtUC1TU1UtUiIsIlNULVAtTlRGLVJXIiwiU1QtUC1TTk8tUlciLCJTSEktUC1FWFAtUlciLCJTRC1QLVBCLVJXIiwiU0QtUC1ITVNURC1SIiwiU0QtUC1MU0MtUlciLCJTRC1QLVRFLVJXIiwiTURDLVAtUE5QUi1SIiwiTURDLVAtUkRFLVJXIiwiTURDLUFQSS1HQVMtUiIsIlNELVAtTFBJLVIiLCJTVC1QLUNNVC1SVyIsIlNULUFQSS1DUkQtUlciLCJTRC1QLUJURC1SIiwiTURDLVAtUFRFLVJXIiwiU0QtUC1CVEQtUlciLCJTRC1QLUJBLVIiLCJTRC1BUEktVE0tUlciLCJNREMtQVBJLVBBVC1SIiwiU1QtUi1IT0QiLCJTRC1QLUJHLVIiLCJTRC1QLVVQQi1SVyIsIlNELUFQSS1SQi1SIiwiR0wtUC1QLVJXIiwiU0QtUC1TQ1UtUlciLCJTVC1QLU5URi1SIiwiU0QtUC1URC1SIiwiTURDLUFQSS1SREwtUlciLCJTRC1QLUNIQy1SVyIsIlNULVAtREVTLVIiLCJHTC1QLUVBRC1SVyIsIkdMLVAtQU5ELVJXIiwiU0QtUC1TSVItUlciLCJTRC1QLVNQLVIiLCJTRC1QLVBHLVJXIiwiU0QtUC1URS1SIiwiU1QtUC1UREwtUiIsIlNELVAtU1MtUiIsIlNULVAtQ01ULVIiLCJTRC1QLVNHQUMtUlciLCJTRC1QLU1CUEQtUiIsIlNELVAtTUlTLVIiLCJNREMtQVBJLUFULVJXIiwiU0QtUC1MR0xELVIiLCJTRC1QLUdTUC1SIiwiU0QtUC1TUy1SVyIsIlNELVAtQ0hDLVIiLCJTRC1QLU1CVFYtUiIsIlNELVAtTFVTQ0QtUlciLCJTVC1QLUJSRC1SIiwiU0QtQVBJLU1JUy1SVyIsIlNELVAtSE1TU0QtUlciLCJTRC1QLUJBLVJXIiwiU0QtUC1MR0xULVIiLCJTRC1BUEktSVZNLVJXIiwiU0QtUC1ITVNURC1SVyIsIlNELUFQSS1HRC1SIiwiTURDLVAtUE5QLVIiLCJTRC1QLVNWRi1SVyIsIk1EQy1QLVJFRy1SVyIsIlNELVAtSE1TU1MtUiIsIk1EQy1BUEktUEFUIiwiU0QtQVBJLUNOLVIiLCJTRC1BUEktVlAtUlciLCJTRC1QLVNIRi1SVyIsIlNELVAtSE1TUEItUiIsIkdMLVAtRUwtUlciXSwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwNSJdLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc3MTk5MzI3MCwiZXhwIjoxNzcyMDgwMjcwLCJqdGkiOiIxM2ZjODFlZS00MTNmLTQyNWItYWY0ZC01YjExYWI3MjgyMTUifQ.NH0TDNxpzEuiQUsCsdocPKmOl992jLv3kHXkcYkkVA0842a3tMJdERINLJZ7Mg6OtjgcVK9idsIDvREf_j-6cUUQJCWtf3tSDrMW1tdVhM-n4F4-M0pCUKXuT9cMgWt8X64voM92FkE1g36CFYF4Vmaeh196ihEh_rTm48k5T9wkz60cuQNDz5VnED-kUZUvshws7bv0BwiVWwzG9kA8wT9XuGV-xNb1OTt7vh3Jook9Ba9Puy_TQDRBs3PoalrmcLr4NJVgefq2dQWzpKUW7AF0uhNTbfqTaZTKxMXOiqyAXWFS7xjp727wb-yceVESKFEh_n_3fKdMfmSspgg8tg";
  console.log("🔧 Development token is empty - will redirect to login");
  const selectedBranch = "SHB005";
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
  } else if (allowedActions.includes("SD-R-SP")) {
    return "Sales Person";
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

