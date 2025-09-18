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
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg2NyIsImVtYWlsIjoicGFydGhpYmFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik0uUGFydGhpYmFuIiwiYWxsb3dlZC1hY3Rpb25zIjpbIlNULVAtQ01ULVJXIiwiU0QtUC1VUEItUlciLCJTRC1BUEktVEQtUlciLCJTVC1QLURFUy1SIiwiU0QtUC1HUEQtUiIsIlNULVAtREVTLVJXIiwiR0wtUC1FRC1SVyIsIlNELVAtSE1TLVBCLVJXIiwiU0QtUC1QRi1SVyIsIlNELVAtU1MtUlciLCJTRC1QLUNIQ1ItUlciLCJTVC1QLVRETC1SIiwiU0QtUC1TUy1SIiwiU1QtUC1TTk8tUlciLCJTRC1QLVNDLVIiLCJTSEktUC1FWFAtUlciLCJTVC1QLUJSRC1SIiwiR0wtUC1FTC1SVyIsIkdMLVAtUlNFLVJXIiwiU1QtUC1DTVQtUiIsIkdMLVAtQU5ELVJXIiwiU0QtUC1TQS1SVyIsIlNELVAtVERFLVJXIiwiU0QtUC1SRUctUlciLCJTRC1SLVNNQyIsIlNELVAtTEJOLVIiLCJTRC1QLUxQSS1SIiwiR0wtUC1FQUQtUlciLCJHTC1QLU5EQy1SVyIsIlNELUFQSS1ETC1SVyIsIlNELVAtU1AtUiIsIlNELUFQSS1VRFMtUlciLCJHTC1QLUVQLVJXIiwiU0QtQVBJLUNOLVIiLCJTRC1BUEktU1MtUlciLCJTVC1BUEktQlJELVJXIiwiR0wtUC1QLVJXIiwiU0QtQVBJLVJCLVIiLCJTSEktUC1JTkMiLCJTVC1QLVRETC1SVyIsIlNULUFQSS1DUkQtUlciLCJTRC1QLVJCLVJXIiwiU0QtUC1QQi1SVyIsIlNISS1QLVRSQUlOLVJXIiwiU1QtUC1OVEYtUlciLCJTVC1BUEktRU1QLVIiLCJTVC1SLUEiLCJTRC1QLVNWRi1SVyIsIlNELVAtQkctUlciLCJTRC1QLVJELVJXIiwiU1QtUC1OVEYtUiIsIlNELUFQSS1TQkQtUlciLCJTRC1QLVBPLVIiLCJTRC1QLVNWUkktUiIsIlNELVAtR0NOLVIiLCJTRC1QLVBHLVJXIiwiR0wtUC1FQlQtUlciLCJTVC1BUEktQU1DLVJXIiwiU0QtUC1UTS1SIiwiU0QtUC1SRy1SVyIsIlNELVAtR1BCLVIiXSwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwMSJdLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc1ODAxNDQ5NywiZXhwIjoxNzU4MTAxNDk3LCJqdGkiOiJjMjA1OTc0Ny1mMTNmLTQwNDItYTFlMS0xODFkNGI0OTk1M2MifQ.GDS21BN4ZqQb4UyY8oV5R5-9ZJeb_RwYKjsWvpVSgVhIeeynHSN8O9iGzJ0bzFXSVXNxO1X6k4mIoDkS2gDub5pIXChrS9q9gbZLUM-fqhmV7mzY5ikmTLddMFhu7Gb7qJdjU0XOKQEE-5acUubtADEYC0-ruvYZ3xVLa-nfwdYgF5Hv4btz2O3YGep5wdfRdGd4KcibjniX-PqW5xvWzh1xn6FsJDHNEDPvYLlpVqMnGfMRpcrA7xBjqApoMS3l4IL8OtB81N-CmuRE_XoAT1h_hkOzRUWRAM4hXjEWBzMM_5XFkIqx0LPWCcrpOK5j2jPdC1_8sJppos90gE-ibA"; 
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
