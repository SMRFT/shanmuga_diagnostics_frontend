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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDE1NyIsImVtYWlsIjoiZ20ubGFic2FsZXNAc21yZnQub3JnIiwibmFtZSI6IlN1bmRhciBNIiwiYWxsb3dlZC1hY3Rpb25zIjpbIiIsIlNULVAtQ01ULVJXIiwiU1QtUi1IT0QiLCJTRC1QLUxSQy1SIiwiU0QtUC1HU1AtUiIsIkZFLVItRkEiLCJGRS1QLUZHLVJXIiwiU0QtQVBJLUlWTS1SVyIsIlNELVAtTFNDLVJXIiwiRkUtUC1GR0wtUiIsIlNULVAtQ01ULVIiLCJGRS1QLUZTLVJXIiwiU0QtUi1HTSIsIlNELVAtQkJBLVJXIiwiU0QtUC1QT1YtUlciLCJGRS1QLUZSLVJXIiwiRkUtUC1GR0YtUiIsIlNELVAtT0QtUiIsIlNELUFQSS1UTS1SIiwiU0QtUC1TUy1SIiwiU0QtUC1QT1YtUiIsIlNELUFQSS1NSVMtUlciLCJTRC1QLVNHRS1SIiwiU1QtUC1CUkQtUiIsIlNELVAtTEdMVC1SIiwiU1QtUC1UREwtUlciLCJTRC1QLUNMLVJXIiwiU0QtQVBJLVJCLVIiLCJTRC1BUEktR0QtUiIsIlNULVAtREVTLVJXIiwiU0QtUC1MUEktUiIsIlNELVAtTEQtUiIsIlNELVAtTFNELVJXIiwiR1AtUC1HQ04tUiIsIlNELVAtTEdELVJXIiwiRkUtUC1GRi1SVyIsIlNELVAtTFVTQ0QtUlciLCJTVC1QLURFUy1SIiwiU1QtQVBJLUVNUC1SIiwiRkUtUC1GQUwtUiIsIlNULVAtTlRGLVJXIiwiU0QtUC1NSVMtUiIsIlNELVAtR1BELVIiLCJTRC1QLVJELVJXIiwiU0QtQVBJLUNOLVIiLCJTVC1QLVRETC1SIiwiU0QtUC1DSEMtUlciLCJTRC1QLVNDLVIiLCJTRC1QLVRTLVJXIiwiU0QtUC1MR1NDLVIiLCJTRC1QLUxUQS1SVyIsIlNULUFQSS1DUkQtUlciLCJTVC1QLU5URi1SIiwiRkUtUC1GVVMtUlciLCJTRC1QLUxHTEQtUiIsIlNELVAtQkctUiIsIlNELVAtQ0hDLVIiLCJTRC1QLVNWRC1SIiwiU1QtQVBJLUJSRC1SVyIsIlNELUFQSS1QUi1SIiwiU1QtQVBJLUFNQy1SVyIsIlNELVAtU1MtUlciLCJTVC1QLVNOTy1SVyIsIlNELVAtU0NVLVIiLCJTRC1QLUxTQ0wtUiJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzY5NDk2Mzk4LCJleHAiOjE3Njk1ODMzOTgsImp0aSI6ImI1ODQxZDkzLTQ0YmMtNDQxZS1hZmE0LTMzZmFlM2IxMmJkZSJ9.X4QRVbPJzjIb-43zS6Y9NWj0nmBrpNB-x_xuSaGHolldgF4F_os3hRr5uvvbfsAxhLFnzGCRKORm5ZNwQ5li2BTPY_vFnDquS0QVIrXrUDl9Wj5a0qPjVotaxZM-2OiZQY9UOsamnn9QRcYnn7hLbLf3ipPgo2iaH1Nbt12bL3sKpPdKgbYpjnacF_LcZna0Tt3WySvZJ4YF6bL3tWm0Md3VHlSUUX6G2TzMtUadM-VIJpUqXq6g727x1O-2z_Ky-Sv5Skk-jPhG3tVsoj8dzyvLY9tIYSGAKQf_mwQuZhiCt-GTzIXpwJFGMNwcvuMsdYBI4KYlDYv1--btNX7Vyw";
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

