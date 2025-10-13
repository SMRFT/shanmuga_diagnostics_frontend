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
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg2NyIsImVtYWlsIjoicGFydGhpYmFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik0uUGFydGhpYmFuIiwiYWxsb3dlZC1hY3Rpb25zIjpbIkVSLVAtRVJSLVJXIiwiU1QtUC1DTVQtUlciLCJNREMtQVBJLVBBVC1SIiwiU1QtUC1ERVMtUiIsIk1EQy1QLU9TQi1SVyIsIlNULVAtREVTLVJXIiwiR1AtUC1HQ04tUiIsIlNULVAtVERMLVIiLCJTRC1SLUxSIiwiTURDLVAtUE5QLVJXIiwiU1QtUC1TTk8tUlciLCJNREMtUC1QTlAtUiIsIlNULVAtQlJELVIiLCJNREMtQVBJLVRIUi1SIiwiTURDLVAtUkVHLVJXIiwiU1QtUC1DTVQtUiIsIkVSLVAtRVJOQk4tUiIsIk1EQy1QLUFTTS1SVyIsIlNELVAtUkVHLVJXIiwiRVItUC1FUlBCLVJXIiwiRVItUC1FUlNFUiIsIlNELVAtQklMTC1SVyIsIkVSLVAtRVJSRS1SVyIsIk1EQy1BUEktQ0RSLVIiLCJFUi1QLUVSU1JCLVJXIiwiU1QtQVBJLUJSRC1SVyIsIlNULVAtVERMLVJXIiwiU1QtQVBJLUNSRC1SVyIsIkVSLVAtRVJCLVJXIiwiU1QtUi1DRFIiLCJNREMtQVBJLVJUUy1SIiwiRVItUC1FUlBELVJXIiwiU1QtUC1OVEYtUlciLCJNREMtUC1SRUctUiIsIlNULUFQSS1FTVAtUiIsIlNULVItQSIsIk1EQy1BUEktR0FTLVIiLCJTRC1QLUJHLVJXIiwiU0QtUC1QTy1SVyIsIlNULVAtTlRGLVIiLCJTRC1QLVJELVJXIiwiRVItUC1FUlAtUiIsIkVSLVAtRVJELVIiLCJTRC1QLUNOLVJXIiwiRVItUi1FUk4iLCJNREMtQVBJLUxCTi1SIiwiU1QtQVBJLUFNQy1SVyIsIkVSLVAtRVJSRUctUlciLCJTRC1QLVNDLVJXIiwiTURDLVAtU09SLVIiLCJNREMtUC1UUkItUlciXSwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwMSJdLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc2MDMyNjQ4NiwiZXhwIjoxNzYwNDEzNDg2LCJqdGkiOiI0ODlhOTlmNS02NzQ2LTQxZWYtOWMwNy01MmYzMzhlNTlkNzQifQ.Mi_Q-RxyWE1G2WfN5rEHqpjckliscVP_cHg7oSael_rHHEj5w77Of1xYptkfhI7UliIE0UuCl9GiorVTk6LlfcFR9GT5TQDvZSCJ-ggH5LC2u2tN0QAGbv2BVDEUSuTqMjLT5rkmb3coFbisyPnHdL1k6stS98nXq59VGDTUyVEyjHJ0B3IWE6IL2x_1lrr2P0AvhTTxqnG4uyAHJT2BbgRj1B1fk3HgyUFCxP94OeslZv__GlqtBLHOx4CvpUIQXe94U1BQmN75I2xQj9jOf-fWgxDpv7GKpc8lOJ_7ovxi-PK7IBDAbw3Q_iVJOWUyKGgoaRdet4nhlhxFVlLIRg"; 
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
