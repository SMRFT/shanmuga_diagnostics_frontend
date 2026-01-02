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
  const dev_token ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDAwMiIsImVtYWlsIjoibmFqbWFzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiTmFqbWEiLCJhbGxvd2VkLWFjdGlvbnMiOlsiIiwiU0QtUC1ITVNQQi1SIiwiU0QtQVBJLVZDLVJXIiwiU0QtUC1HU1AtUiIsIlNUUi1BUEktVFJMUi1SIiwiU0QtUC1CVEQtUiIsIlNELVAtSE1TQ1MtUiIsIk1EQy1QLVJFRy1SVyIsIlNELVAtU1NVLVJXIiwiU0QtUC1TSVItUiIsIlNELVAtSE1TU1MtUiIsIlNELVItQSIsIlNELVAtTFNELVJXIiwiU0QtUC1TR0FDLVJXIiwiU0QtUC1MVVNDRC1SVyIsIlNELUFQSS1HT1ItUlciLCJTVFItUi1BIiwiTURDLUFQSS1BVC1SIiwiU0QtUC1HUEQtUiIsIk1EQy1QLVNPUi1SIiwiSE1TLUFQSS1JWFJBWS1SVyIsIlNULVAtTlRGLVIiLCJITVMtQVBJLURSTS1SIiwiSE1TLUFQSS1EUk0tUlciLCJTVFItQVBJLUlMLVIiLCJTRC1QLUhNU1BCLVJXIiwiU0QtUC1TUy1SVyIsIkhNUy1BUEktSU1SSS1SIiwiU0QtUC1VUEItUiIsIlNULVAtU05PLVJXIiwiU1RSLUFQSS1USU4tUiIsIlNELVAtUEctUiIsIlNELVAtREYtUiIsIlNUUi1BUEktVkwtUiIsIlNELVAtU0NVLVJXIiwiU0QtUC1QRC1SIiwiSE1TLUFQSS1JQi1SIiwiU0QtUC1ITVNURC1SVyIsIlNELUFQSS1JVk0tUlciLCJTVFItUC1USU5SLVJXIiwiSE1TLUFQSS1JVVNHLVJXIiwiU1QtUC1DTVQtUiIsIlNELVAtU1ZGLVJXIiwiTURDLVAtUE5QLVJXIiwiU0QtUC1QT1YtUlciLCJTRC1QLUxHTEQtUiIsIlNELVAtUE9WLVIiLCJTRC1BUEktUkItUiIsIkhNUy1BUEktU1VNLVIiLCJTRC1QLVNIRi1SIiwiU1QtUC1ERVMtUlciLCJTRC1QLUhNU1NQLVIiLCJTVFItQVBJLVZMLVJXIiwiU0QtQVBJLUlWTS1SIiwiTURDLVAtQ0RFLVJXIiwiU1QtUC1OVEYtUlciLCJTRC1QLUdQQi1SVyIsIlNELVAtQkEtUiIsIkhNUy1BUEktSUNULVJXIiwiU0QtUC1TQy1SIiwiU0QtUC1ITVNTUy1SVyIsIlNULVAtVERMLVIiLCJTRC1QLVRFLVIiLCJNREMtUC1SRUctUiIsIlNUUi1BUEktVFJMLVIiLCJITVMtQVBJLVNVTS1SVyIsIk1EQy1QLU9TQi1SVyIsIlNELVAtQlRELVJXIiwiU0QtQVBJLUdSLVJXIiwiU0QtUC1ITVNURC1SIiwiU0QtUC1QTC1SIiwiU0QtUC1CRy1SIiwiU0QtUC1TUC1SIiwiU0QtUC1MQk4tUiIsIlNELVAtSE1TVUMtUlciLCJTRC1BUEktR0MtUlciLCJTRC1QLUxTQ0wtUiIsIk1EQy1BUEktTEJOLVIiLCJTRC1QLUxSQy1SIiwiTURDLVAtUkRFLVJXIiwiTURDLVAtQVNNLVJXIiwiU0QtUC1TSVItUlciLCJTRC1QLVBGLVIiLCJTRC1BUEktVE0tUlciLCJTRC1BUEktVE0tUiIsIkhNUy1BUEktSUNULVIiLCJTRC1BUEktR0QtUiIsIlNELVAtTEdMVC1SIiwiU0QtUC1QQi1SVyIsIlNELUFQSS1UVi1SIiwiU0QtUC1QRy1SVyIsIlNULVItQSIsIkhNUy1BUEktSUItUlciLCJHUC1QLUdDTi1SIiwiU0QtUC1QQi1SIiwiU0QtUC1ITVNMRC1SIiwiTURDLVAtUE5QLVIiLCJTRC1BUEktUkNMLVJXIiwiU1QtUC1ERVMtUiIsIkhNUy1BUEktSU1SSS1SVyIsIlNELVAtTUlTLVIiLCJNREMtUC1QVEUtUlciLCJNREMtUC1QTlBSLVIiLCJTVC1BUEktVFJMUi1SVyIsIk1EQy1QLVRSQi1SVyIsIlNELUFQSS1DTi1SIiwiU0QtUC1TR0FDLVIiLCJTRC1QLUhNU1NQLVJXIiwiU0QtUC1ERi1SVyIsIlNELVAtSE1TUFMtUlciLCJTRC1BUEktUFItUiIsIk1EQy1BUEktQ0RSLVIiLCJTRC1QLUhNU0dDLVIiLCJTVFItQVBJLVRSTC1SVyIsIlNELUFQSS1HT0MtUlciLCJTVC1QLUNNVC1SVyIsIlNELVAtVVBCLVJXIiwiU0QtUC1TSEYtUlciLCJTRC1QLUxTQy1SVyIsIk1EQy1BUEktUEFULVIiLCJTRC1QLVNWRi1SIiwiU1RSLVAtSUNTLVIiLCJTRC1QLUJBLVJXIiwiU0QtQVBJLVZQLVJXIiwiU0QtUC1URS1SVyIsIlNELVAtU1MtUiIsIlNULVAtQlJELVIiLCJTVC1QLVRETC1SVyIsIlNELVAtVEQtUlciLCJTRC1QLUxQSS1SIiwiU0QtUC1QRi1SVyIsIlNELVAtTEdELVJXIiwiTURDLUFQSS1USFItUiIsIlNULUFQSS1FTVAtUiIsIk1EQy1BUEktUkRMLVIiLCJTRC1QLVRELVIiLCJNREMtQVBJLVJUUy1SIiwiU0QtUC1DSEMtUlciLCJTRC1QLUxHU0MtUiIsIlNELVAtU1NVLVIiLCJTVC1BUEktQ1JELVJXIiwiTURDLUFQSS1HQVMtUiIsIk1EQy1BUEktQVQtUlciLCJITVMtQVBJLUlVU0ctUiIsIlNUUi1QLVRJTlItUiIsIkhNUy1BUEktSVhSQVktUiIsIlNELVAtQ0hDLVIiLCJTVC1BUEktQlJELVJXIiwiU0QtUC1ITVNTRC1SVyIsIlNULUFQSS1BTUMtUlciLCJTVFItQVBJLVRJTi1SVyIsIlNUUi1BUEktSUwtUlciLCJTRC1BUEktVEQtUiJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIiwiU0hCMDAyIl0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzY3MzIzOTM1LCJleHAiOjE3Njc0MTA5MzUsImp0aSI6IjAwNWI1NWIzLTI5MzAtNGVjNy05MTQxLThjNGNlMGI2ZWFlMCJ9.aCH3kRf5CfqFEMmCI3usF3mH3XOkH8mlLncyrBa6MO7L78-nv5dO4KTR8zEn_o8P42Z-iJejR6QfZEeyc22q-OumuOAOWiKKY_x2YR59b8LKU0CyUc5uTE7eyfmQrS9uOwTVgE8CCNAyw-MQMmabmcqwVbyV6NjoQPMl8hsuEuqphN3_ElyOQlXirk1mAR-6nMEiFt8aZRXLXJCnNd5qun12OqetB7O5BIaOEzEs0wNcgZh4Tt1CFq_faqymWfDb5UN9rcsvNeOUm8sUkzNGXELNqAxEbMNnU0NVchCb8gtExTeSi5JNyvNwnPJW3e95WNY42a4_2iraNV5sYFlqAQ"; 
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

