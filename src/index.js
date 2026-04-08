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
  const dev_token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDAwMiIsImVtYWlsIjoibmFqbWFzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiTmFqbWEiLCJhbGxvd2VkLWFjdGlvbnMiOlsiSE1TLVAtT1BQU0QtUlciLCJITVMtUC1JVVNHLVJXIiwiU1QtUC1TTk8tUlciLCJTRC1QLVNHQUMtUiIsIlNELVAtUE9WLVJXIiwiSE1TLVAtUkNBVC1SVyIsIlNELVAtU0MtUiIsIlNELVAtSE1TVEQtUiIsIlNELVAtQkEtUiIsIlNELVAtVEUtUlciLCJTVC1SLUEiLCJTRC1QLVBGLVJXIiwiU0QtUC1HUEQtUiIsIkhNUy1QLUlYUkFZLVJXIiwiSE1TLVAtRFJNLVJXIiwiU1RSLUFQSS1JTC1SIiwiU0QtUC1ITVNQQi1SIiwiSE1TLVAtVk5ERC1SVyIsIlNUUi1BUEktVFJMLVIiLCJTRC1QLUxTRC1SVyIsIlNELVAtVEQtUlciLCJTRC1BUEktVE0tUiIsIlNELVAtSE1TU1MtUlciLCJTRC1BUEktR09SLVJXIiwiU0QtUC1MU0MtUlciLCJTRC1BUEktUkItUiIsIlNELVAtVEUtUiIsIkhNUy1QLUJMSy1SVyIsIlNELVAtSE1TU1AtUiIsIlNULVAtREVTLVIiLCJITVMtUC1PUFAtUlciLCJTRC1QLVBELVIiLCJTRC1QLVNJUi1SIiwiU0QtQVBJLUNOLVIiLCJTRC1QLUhNU0dDLVIiLCJITVMtUC1JUEdSTkQtUlciLCJITVMtUC1PUEdSTi1SVyIsIlNELVAtUEctUiIsIlNELVAtSE1TU1MtUiIsIlNELVAtTUJQRC1SIiwiU0QtUC1ERi1SIiwiU0QtQVBJLVBSLVIiLCJTRC1BUEktUkNMLVJXIiwiU1QtQVBJLUVNUC1SIiwiU1QtUC1UREwtUlciLCJTVC1BUEktQlJELVJXIiwiSE1TLVAtUlNIRlQtUlciLCJTRC1QLVVQQi1SVyIsIlNUUi1BUEktVFJMLVJXIiwiSE1TLVAtSVBHUk4tUlciLCJITVMtUC1JUEtHLVJXIiwiU0QtUC1TUy1SIiwiSE1TLVAtQVVISUQtUlciLCJITVMtUC1TVU0tUlciLCJTRC1QLVNHQUMtUlciLCJTRC1QLVRELVIiLCJTRC1BUEktVE0tUlciLCJTRC1QLUxSQy1SIiwiU0QtUC1MR0xELVIiLCJTRC1BUEktTUlTLVJXIiwiU0QtUC1MR1NDLVIiLCJTRC1BUEktSVZNLVIiLCJITVMtUC1SQ0FURC1SVyIsIlNELUFQSS1NQlRELVJXIiwiU0QtUC1ERi1SVyIsIlNELVAtTFBJLVIiLCJITVMtUC1WSU4tUlciLCJTRC1QLUxVU0NELVJXIiwiU1QtUC1CUkQtUiIsIkhNUy1QLUFJUC1SVyIsIlNULVAtTlRGLVJXIiwiU1RSLUFQSS1UUkxSLVIiLCJITVMtUi1TQSIsIlNUUi1BUEktVkwtUiIsIlNELVAtVVBCLVIiLCJTVFItUC1USU5SLVJXIiwiSE1TLVAtVk5ELVJXIiwiSE1TLVAtVkktUlciLCJITVMtUC1TQURNLVJXIiwiU0QtQVBJLVRELVIiLCJITVMtUC1TUlZELVJXIiwiSE1TLVAtQU0tUlciLCJTRC1QLVNTLVJXIiwiU0QtUC1NSVMtUiIsIkhNUy1QLURJUy1SVyIsIlNELVAtTFNDTC1SIiwiU0QtQVBJLUdDLVJXIiwiU0QtUC1DSEMtUlciLCJTRC1QLUxHTFQtUiIsIlNUUi1BUEktSUwtUlciLCJTRC1QLUxCTi1SIiwiU1RSLUFQSS1USU4tUlciLCJTVFItQVBJLVRJTi1SIiwiU1QtQVBJLUNSRC1SVyIsIkhNUy1QLUlNUkktUlciLCJITVMtUC1CVC1SVyIsIlNELUFQSS1HUi1SVyIsIlNELVAtU1NVLVJXIiwiU1RSLUFQSS1JTCIsIlNELVAtUEctUlciLCJTRC1BUEktR09DLVJXIiwiU0QtUC1CVEQtUiIsIlNELVAtUEYtUiIsIlNELVAtSE1TUFMtUlciLCJTVFItQVBJLVZMLVJXIiwiU0QtUC1HUEItUlciLCJTVFItUC1JQ1MtUiIsIlNELUFQSS1UVi1SIiwiU0QtUC1ITVNTRC1SVyIsIlNELUFQSS1HRC1SIiwiSE1TLVAtVklOUi1SIiwiU0QtUC1TSEYtUlciLCJITVMtUC1STUQtUlciLCJTVC1QLUNNVC1SVyIsIkhNUy1QLURCVURSLVIiLCJTVC1QLVRETC1SIiwiU1QtQVBJLVRSTFItUlciLCJTRC1QLUhNU1VDLVJXIiwiSE1TLVAtU1JWLVJXIiwiU0QtUC1TQ1UtUlciLCJITVMtUC1BREQtUlciLCJTVC1QLUNNVC1SIiwiU0QtUC1HU1AtUiIsIlNELVAtU1NVLVIiLCJITVMtUC1WSU5SLVJXIiwiU0QtUC1TVkYtUlciLCJTRC1QLVNIRi1SIiwiU0QtUC1MR0QtUlciLCJITVMtUC1STS1SVyIsIkhNUy1QLUFETS1SVyIsIkhNUy1QLUJMS0QtUlciLCJITVMtUC1CRURELVJXIiwiU0QtUC1NQkRGLVJXIiwiSE1TLVAtSVAtUlciLCJITVMtUC1PUEdSTkQtUlciLCJTRC1QLUhNU0xELVIiLCJTRC1QLVNQLVIiLCJTVFItUi1BIiwiU0QtUC1TVkYtUiIsIlNELVAtU0lSLVJXIiwiU0QtQVBJLUlWTS1SVyIsIkhNUy1QLUJFRC1SVyIsIlNELVAtSE1TUEItUlciLCJTRC1QLUJURC1SVyIsIkhNUy1QLVZWLVJXIiwiU0QtUC1QQi1SIiwiU0QtUC1CRy1SIiwiU0QtUC1ITVNDUy1SIiwiSE1TLVAtT1RNLVJXIiwiSE1TLVAtSUItUlciLCJTVC1BUEktQU1DLVJXIiwiSE1TLVAtSUNULVJXIiwiSE1TLVAtSVBQU0QtUlciLCJTRC1QLVBCLVJXIiwiU0QtUC1NQlRWLVIiLCJTVC1QLU5URi1SIiwiU1RSLVAtVElOUi1SIiwiSE1TLVAtT1BQUy1SVyIsIkhNUy1QLUlQUFMtUlciLCJTRC1BUEktVlAtUlciLCJTRC1QLUNIQy1SIiwiU0QtUi1BIiwiU0QtUC1CQS1SVyIsIkhNUy1QLURMRC1SVyIsIkhNUy1QLU9UU1MtUlciLCJTRC1BUEktVkMtUlciLCJTRC1QLVBPVi1SIiwiSE1TLVAtU1JNLVJXIiwiU0QtUC1QTC1SIiwiU1QtUC1ERVMtUlciLCJITVMtUC1BSU4tUlciLCJTRC1QLUhNU1NQLVJXIiwiSE1TLVAtUkVOUS1SVyIsIlNELVAtSE1TVEQtUlciXSwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwMSIsIlNIQjAwMiJdLCJob3NwaXRhbF9jb2RlIjoiU0gwMDEiLCJobXNfcGFnZXMiOm51bGwsImFsbG93ZWQtb3V0bGV0cyI6WyJPTEVUMDA1Il0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzc1NjIxNTc5LCJleHAiOjE3NzU3MDg1Nzl9.Dtf-CvimG5iCwpP0a1DTwOesL_AVjGAROuSsg0AuvAJSfjZomKJfb8HJyuTmgvdKEC7UnkP3NPNFlV4-zS8wM6AVfJmX_8UJgFZaCbFmu_QicbPJRtcR4kTQHjch1rnpUq1B_7XMFCfB35wajOoLRCjGquaBeRPhHNmBp1Z1jSstB7Mj9AE7OYv8srZAoRtPqqj_9vGI_fMMyikEg4IGxReVZUQBbU_1N9b5-ZgrzKy7eg7PSg5EaMidu0UZUmO4qNMoWid8Wj-0f0M7Bbx9BItw13kTPcafBhmEovR6mkcgREoQGEPRh9mHMppd5tKeijmkngDgA1sPbp_sZeAxmA";
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
  } catch (error) {
    console.error("❌ Token validation failed:", error.message);

    // Clean up invalid token
    localStorage.removeItem("access_token");

    // If validation fails, redirect to login instead of showing debug page
    console.log("❌ Redirecting to login due to validation failure");
    redirectToLogin();
  }
})();
