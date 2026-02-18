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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiSE1TLVItUEgiLCJNREMtUC1SRUctUlciLCJTVC1QLUJSRC1SIiwiU0QtUC1NSVMtUiIsIlNELVAtTEdMVC1SIiwiU0lOLVAtRkEtUlciLCJTRC1QLVNTLVJXIiwiU1QtUC1ERVMtUiIsIlNJTi1BUEktU0YtUiIsIlNELVAtR1BELVJXIiwiU1QtUC1OVEYtUiIsIlNJTi1QLUdETC1SIiwiTURDLVAtU09SLVIiLCJNREMtUC1HT1AtUiIsIk1EQy1BUEktQUdQLVJXIiwiU0QtQVBJLUNOLVJXIiwiU0QtUC1MU0NMLVIiLCJTRC1QLUJCQS1SVyIsIk1EQy1BUEktU0dQLVJXIiwiU0QtQVBJLUdELVIiLCJTSU4tQVBJLUlGLVJXIiwiU0lOLVItU0EiLCJTVC1QLVNOTy1SVyIsIlNELVAtQ0wtUlciLCJTRC1QLUNIQy1SVyIsIk1EQy1BUEktUEdQLVJXIiwiTURDLUFQSS1BVC1SIiwiU0QtUC1PRC1SIiwiTURDLUFQSS1USFItUiIsIlNELVAtTEdMRC1SIiwiTURDLVAtR1BQLVIiLCJTVC1QLUNNVC1SVyIsIlNELUFQSS1NSVMtUlciLCJNREMtQVBJLUdBUy1SIiwiU0lOLUFQSS1PUlItUiIsIk1EQy1QLUFBVS1SVyIsIkVSLVAtRVJHTkJOLVIiLCJTRC1QLUxUTS1SVyIsIkVSLVAtRVJQTC1SIiwiU0lOLUFQSS1PUi1SVyIsIlNELVAtU0dFLVIiLCJTRC1BUEktSVZNLVJXIiwiU1QtUC1UREwtUiIsIk1EQy1QLVBOUC1SIiwiTURDLUFQSS1QQVQiLCJTRC1QLUxHRC1SVyIsIlNULUFQSS1DUkQtUlciLCJTVC1SLUhPRCIsIlNELUFQSS1QUi1SIiwiRVItUi1FUk4iLCJTRC1QLVBGLVJXIiwiU0QtUC1MVVNDRC1SVyIsIk1EQy1BUEktUkRMLVJXIiwiU0QtUC1QT1YtUlciLCJTSU4tQVBJLUZVLVJXIiwiU0QtUC1UUy1SVyIsIlNELUFQSS1SQi1SIiwiRVItUC1FUkRMLVIiLCJNREMtQVBJLU9HUC1SVyIsIlNELVAtTEQtUiIsIk1EQy1QLVBOUFItUiIsIk1EQy1BUEktQ0dQLVJXIiwiTURDLVAtR1NQLVIiLCJTSU4tUC1HSUMtUiIsIk1EQy1QLUdBUC1SIiwiU0QtUC1TQy1SIiwiTURDLVAtUkVHLVIiLCJNREMtQVBJLUFETS1SVyIsIkhNUy1QLUhTTi1SVyIsIlNJTi1QLVJBLVJXIiwiTURDLVAtT1NCLVJXIiwiU1QtQVBJLUFNQy1SVyIsIk1EQy1SLUFETSIsIlNELUFQSS1UTS1SIiwiU1QtUC1UREwtUlciLCJTRC1SLUdNIiwiTURDLUFQSS1QQVQtUiIsIkVSLVAtRVJQQi1SVyIsIk1EQy1BUEktTEJOLVIiLCJNREMtUC1UUkItUlciLCJTVC1QLU5URi1SVyIsIlNELVAtR1BULVJXIiwiU0QtUC1MU0MtUlciLCJTRC1QLUxHU0MtUiIsIkhNUy1QLVZMLVJXIiwiRVItUC1FUlJFUC1SVyIsIk1EQy1BUEktUERDLVJXIiwiU1QtQVBJLUVNUC1SIiwiU1QtQVBJLUJSRC1SVyIsIlNELVAtTFNELVJXIiwiR1AtUC1HQ04tUiIsIlNULVAtREVTLVJXIiwiU0QtUC1TVkQtUiIsIk1EQy1QLUdDUC1SIiwiU1QtUC1DTVQtUiIsIlNELVAtTFJDLVIiLCJTRC1QLUJHLVIiLCJNREMtUC1BU00tUlciLCJTRC1QLUdTUC1SIiwiTURDLVAtUE5QLVJXIiwiTURDLUFQSS1BVC1SVyIsIlNELVAtU0NVLVJXIiwiU0QtUC1QRy1SVyIsIlNJTi1QLVJBVS1SVyIsIlNJTi1QLU9QLVJXIiwiU0QtUC1SRC1SVyIsIkVSLVAtRVJCLVJXIiwiTURDLUFQSS1DRFItUiIsIk1EQy1BUEktUlRTLVIiLCJTRC1QLUxQSS1SIiwiSE1TLVAtQ1MtUlciXSwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwMSJdLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc3MTM1MDA0NiwiZXhwIjoxNzcxNDM3MDQ2LCJqdGkiOiI3MjU2MmZlNC0xYjYwLTQxNjEtYjAwZC0xZDY0NTEyZmExYzAifQ.MhL9NaDDWejZNNox9MCVCUN4_Y2I3F_1QTKEJ5KW4_Ty6KuyPcDbcUGHwRLeg1igxtJo_Of8GyPFfH9tGCoa3livsqjHqyCnQ5jpVqigZhA0Z7lzlgf7Qz0mAqEUPuT_FJh1aLSqH3hbcz1PqwJkjv3vsExXDOlHkoR-W4AFVSrvBqtL9a7JOKYd9IZ4D2rqgMJASNGk5JrZLo8fnjpAzdYjxSp99WBbOfDjmaeK4IoRo7pjPmRxHoZ0gedriaBQ3A4w3o8pufWVqKZyTPe8zIPPdZoH6p7cpA7txtJZn6l4Uwb2eJPVmbUU0rtxtoC66cOPaEemby7dyhjnVhdYxw";
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

