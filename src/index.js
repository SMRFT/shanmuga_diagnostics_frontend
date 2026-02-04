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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDAwMiIsImVtYWlsIjoibmFqbWFzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiTmFqbWEiLCJhbGxvd2VkLWFjdGlvbnMiOlsiU0QtUC1CVEQtUlciLCJTRC1BUEktVE0tUiIsIlNELVAtR1BELVIiLCJTRC1BUEktUkNMLVJXIiwiU0QtUC1CVEQtUiIsIlNISS1QLVRSQUlOLVJXIiwiU0QtUC1TQy1SIiwiU0QtUC1NQlBELVIiLCJNREMtQVBJLUxCTi1SIiwiU0QtUC1ITVNTUy1SIiwiU1QtUC1ERVMtUiIsIk1EQy1BUEktUkRMLVIiLCJTRC1QLUNIQy1SVyIsIlNELUFQSS1NSVMtUlciLCJTRC1QLUxHTFQtUiIsIlNELVAtU1NVLVIiLCJNREMtUC1SRUctUiIsIlNELVAtUE9WLVIiLCJTRC1BUEktUkItUiIsIlNELVAtU0dBQy1SIiwiU1QtUi1BIiwiTURDLVAtQVNNLVJXIiwiTURDLVAtT1NCLVJXIiwiU0QtUC1QQi1SVyIsIkhNUy1BUEktRFJNLVJXIiwiU1RSLVAtSUNTLVIiLCJNREMtQVBJLVRIUi1SIiwiU0QtQVBJLUNOLVIiLCJTRC1BUEktR0QtUiIsIlNELVAtTUlTLVIiLCJITVMtQVBJLUlVU0ctUiIsIlNULVAtTlRGLVJXIiwiTURDLVAtUFRFLVJXIiwiU0QtQVBJLUdSLVJXIiwiTURDLVAtUE5QLVJXIiwiU0QtQVBJLUdPUi1SVyIsIlNELVAtUEctUiIsIlNELVItQSIsIlNELUFQSS1JVk0tUiIsIlNELVAtU1ZGLVJXIiwiR0wtUC1SU0UtUlciLCJTRC1QLVRELVIiLCJITVMtQVBJLUlVU0ctUlciLCJNREMtUC1DREUtUlciLCJTRC1QLVVQQi1SIiwiU0QtUC1CQS1SVyIsIkhNUy1BUEktSU1SSS1SVyIsIlNELVAtSE1TU1AtUlciLCJNREMtQVBJLUdBUy1SIiwiU1RSLUFQSS1JTC1SVyIsIlNELVAtTFNELVJXIiwiU0QtUC1TUy1SIiwiU0QtUC1TSEYtUiIsIkdMLVAtRVAtUlciLCJTRC1QLUxHU0MtUiIsIlNELVAtTFNDTC1SIiwiU0QtUC1ITVNDUy1SIiwiU0QtUC1VUEItUlciLCJTRC1QLVRFLVIiLCJTRC1QLVNHQUMtUlciLCJTSEktUC1FWFAtUlciLCJTVFItQVBJLVRSTC1SIiwiU1RSLUFQSS1USU4tUlciLCJTRC1BUEktVlAtUlciLCJTRC1QLVBMLVIiLCJITVMtQVBJLUlCLVJXIiwiTURDLVAtU09SLVIiLCJTRC1BUEktVkMtUlciLCJTVC1BUEktQU1DLVJXIiwiU1RSLUFQSS1UUkxSLVIiLCJITVMtQVBJLUlNUkktUiIsIlNELUFQSS1HQy1SVyIsIkhNUy1BUEktSUNULVIiLCJTRC1QLVBGLVIiLCJTRC1QLUxTQy1SVyIsIlNUUi1BUEktSUwiLCJTRC1QLUhNU1NQLVIiLCJNREMtQVBJLUNEUi1SIiwiSE1TLUFQSS1JQ1QtUlciLCJTRC1QLURGLVJXIiwiU0QtUC1CRy1SIiwiU0QtUC1MR0xELVIiLCJTVC1QLVRETC1SIiwiU0QtUC1NQlRWLVIiLCJTRC1QLVRELVJXIiwiR0wtUC1OREMtUlciLCJTVC1QLUJSRC1SIiwiU0QtUC1MUEktUiIsIkhNUy1BUEktRFJNLVIiLCJTRC1QLVNTVS1SVyIsIlNUUi1BUEktVElOLVIiLCJTRC1QLUxSQy1SIiwiU0QtQVBJLVBSLVIiLCJTRC1QLVNDVS1SVyIsIlNUUi1BUEktVkwtUlciLCJTVC1BUEktQ1JELVJXIiwiU1RSLUFQSS1UUkwtUlciLCJTRC1QLUdTUC1SIiwiU0QtUC1TSVItUiIsIlNELVAtUEQtUiIsIlNELVAtSE1TTEQtUiIsIlNULVAtU05PLVJXIiwiU0QtUC1ITVNURC1SVyIsIkhNUy1BUEktU1VNLVIiLCJTRC1QLUhNU1BCLVIiLCJHTC1QLUVBRC1SVyIsIkhNUy1BUEktSUItUiIsIlNELVAtQ0hDLVIiLCJTRC1QLUhNU0dDLVIiLCJTRC1QLVBHLVJXIiwiU0QtUC1ITVNQUy1SVyIsIlNUUi1QLVRJTlItUlciLCJTVC1BUEktQlJELVJXIiwiU1QtUC1ERVMtUlciLCJTRC1QLURGLVIiLCJTVFItQVBJLVZMLVIiLCJITVMtQVBJLVNVTS1SVyIsIk1EQy1QLVBOUFItUiIsIk1EQy1QLVJFRy1SVyIsIlNELVAtSE1TVEQtUiIsIlNELUFQSS1NQlRELVJXIiwiU0QtUC1ITVNQQi1SVyIsIlNELVAtUE9WLVJXIiwiTURDLUFQSS1SVFMtUiIsIlNUUi1QLVRJTlItUiIsIlNELVAtR1BCLVJXIiwiU0QtUC1CQS1SIiwiU0QtUC1MQk4tUiIsIlNULVAtQ01ULVJXIiwiU0QtUC1URS1SVyIsIlNELUFQSS1JVk0tUlciLCJTRC1QLUhNU1NELVJXIiwiU0QtUC1TVkYtUiIsIlNULUFQSS1FTVAtUiIsIlNULVAtVERMLVJXIiwiU1QtQVBJLVRSTFItUlciLCJTRC1QLUxHRC1SVyIsIkdQLVAtR0NOLVIiLCJTRC1QLUhNU1NTLVJXIiwiU0QtUC1TUC1SIiwiU1RSLVItQSIsIkdMLVAtUC1SVyIsIkdMLVAtQU5ELVJXIiwiTURDLVAtVFJCLVJXIiwiU0QtUC1TUy1SVyIsIk1EQy1QLVBOUC1SIiwiTURDLVAtUkRFLVJXIiwiU0hJLVAtSU5DIiwiTURDLUFQSS1QQVQtUiIsIlNELVAtTUJERi1SVyIsIkdMLVAtRUQtUlciLCJTRC1QLVNJUi1SVyIsIlNELUFQSS1HT0MtUlciLCJTRC1QLVNIRi1SVyIsIlNUUi1BUEktSUwtUiIsIkhNUy1BUEktSVhSQVktUlciLCJTVC1QLU5URi1SIiwiU0QtUC1QQi1SIiwiSE1TLUFQSS1JWFJBWS1SIiwiTURDLUFQSS1BVC1SIiwiU1QtUC1DTVQtUiIsIlNELUFQSS1UVi1SIiwiTURDLUFQSS1BVC1SVyIsIkdMLVAtRUJULVJXIiwiU0QtQVBJLVRELVIiLCJTRC1QLUxVU0NELVJXIiwiU0QtQVBJLVRNLVJXIiwiU0QtUC1QRi1SVyIsIlNELVAtSE1TVUMtUlciLCJHTC1QLUVMLVJXIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiLCJTSEIwMDIiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3NzAxNzUwNjYsImV4cCI6MTc3MDI2MjA2NiwianRpIjoiMzFjYTRiYzEtMjIxYS00ZjIxLTllNGUtMWUyMmFlNDIxZTllIn0.fWvEaFOFXSwW-RWYwjbRWuwlPdSHPD-HYjM9w-ruZUlD1_WsuATRSJxpa2C-_hlrbhon2CiQuST-LZ2VD1Qcq7ml3VUAQGqq1jG-GVAu-xYeU-FLo9yCBO41qpp3Cd605h40v7aJWLFCFQTomT2lc9g2BUQBT901njLs841K9wTERCpAAtBgt__RC-iAojYIJDn8LFm_LxPOeJDUTSAqWNX-tZL7PSOAcUqlgMzz_Nhzx2vmfyKMZuh8HuCVVQWY4rnEWe_Oye0xX5iPbiupNlWl5n6yTMUUBPyxFUltNI2iZM1HzSTPTVsaqBzkecX0quC0O_JdHPTh81VCX3LGhg";
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

