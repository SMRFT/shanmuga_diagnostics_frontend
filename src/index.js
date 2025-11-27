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
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDAwMiIsImVtYWlsIjoibmFqbWFzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiTmFqbWEiLCJhbGxvd2VkLWFjdGlvbnMiOlsiU0QtUC1ERi1SIiwiU1QtUC1DTVQtUlciLCJTVFItQVBJLVZMLVIiLCJTRC1QLVBELVIiLCJTVFItQVBJLVRSTFItUiIsIlNUUi1QLVRJTlItUlciLCJTVC1QLUNNVC1SIiwiTURDLUFQSS1QQVQtUiIsIk1EQy1QLVJERS1SVyIsIlNELVAtQlRELVIiLCJNREMtUC1BU00tUlciLCJTVFItUC1JQ1MtUiIsIk1EQy1QLVBOUC1SVyIsIlNELVAtUE9WLVJXIiwiTURDLVAtUkVHLVJXIiwiU0QtUC1TU1UtUlciLCJTRC1QLVNTLVIiLCJTRC1QLVBPVi1SIiwiU1QtUC1CUkQtUiIsIlNELUFQSS1SQi1SIiwiU0QtUC1URC1SVyIsIlNELUFQSS1UVi1SIiwiU1QtUC1UREwtUlciLCJTVC1QLURFUy1SVyIsIlNULVItQSIsIlNELVItQSIsIlNUUi1BUEktVkwtUlciLCJNREMtUC1QTlAtUiIsIk1EQy1QLUNERS1SVyIsIk1EQy1BUEktVEhSLVIiLCJTVC1QLURFUy1SIiwiU1QtQVBJLUVNUC1SIiwiTURDLUFQSS1SREwtUiIsIlNELVAtVEQtUiIsIlNULVAtTlRGLVJXIiwiTURDLUFQSS1BVC1SIiwiU0QtUC1NSVMtUiIsIlNUUi1SLUEiLCJNREMtUC1QVEUtUlciLCJNREMtUC1QTlBSLVIiLCJNREMtQVBJLVJUUy1SIiwiU0QtUC1HUEQtUiIsIk1EQy1QLVRSQi1SVyIsIlNELUFQSS1DTi1SIiwiU0QtUC1DSEMtUlciLCJTVC1QLVRETC1SIiwiU1QtQVBJLVRSTFItUlciLCJNREMtUC1TT1ItUiIsIk1EQy1QLVJFRy1SIiwiU1RSLUFQSS1UUkwtUiIsIk1EQy1QLU9TQi1SVyIsIlNUUi1BUEktVFJMLVJXIiwiU0QtUC1CVEQtUlciLCJTRC1QLVNTVS1SIiwiU0QtUC1ERi1SVyIsIlNULUFQSS1DUkQtUlciLCJTVC1QLU5URi1SIiwiTURDLUFQSS1HQVMtUiIsIk1EQy1BUEktQVQtUlciLCJTRC1SLUNFTyIsIlNELVAtUEwtUiIsIlNELVAtQkctUiIsIlNUUi1BUEktSUwtUiIsIlNUUi1QLVRJTlItUiIsIlNELVAtQ0hDLVIiLCJTVC1BUEktQlJELVJXIiwiTURDLUFQSS1DRFItUiIsIlNELVAtU1MtUlciLCJTVC1BUEktQU1DLVJXIiwiU1RSLUFQSS1USU4tUlciLCJTVFItQVBJLUlMLVJXIiwiU1QtUC1TTk8tUlciLCJTVFItQVBJLVRJTi1SIiwiU0QtQVBJLVRELVIiLCJNREMtQVBJLUxCTi1SIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiLCJTSEIwMDIiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3NjM1MjUwNjksImV4cCI6MTc2MzYxMjA2OSwianRpIjoiOWViNmJlODYtMjNkYS00OGExLThhNGMtZjdmYTRjZTQ4ZjMzIn0.Hys-aeZOTjGUuGMnlrhIof2dwgD8Fp9j0YKypex-ehbsViyKp-d6kQNARhcEGZG5ER8fChLI6F1nG8wZS_TRQTw2EavMZ6CTGbD6N2C14Y7OLcWPBMu9sGHIo4RTwrSDF4L5vL4I1RhSAqVV5fVdQaezeS9PZ_oK7a4uaGt1j8jYHajU4jEBUbAizEfI5v5ALdQFNFjU0br45yxZQoEOJBmvdGK6sQINBTo--YiuA77arDFyZNh9N7EsmeptYO1mk04IB4f1fqjpIztNvhkmgOIkk8ET_hrw5ZEVamCXt6KhXIanW64CvYikwy0tXVGnw1aQYiUbWOlC2kqg2cqhJg"; 
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
