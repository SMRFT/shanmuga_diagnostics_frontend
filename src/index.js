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
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg2NyIsImVtYWlsIjoicGFydGhpYmFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik0uUGFydGhpYmFuIiwiYWxsb3dlZC1hY3Rpb25zIjpbIlNULVAtQ01ULVJXIiwiU0QtUC1DSEMtUlciLCJTVC1QLURFUy1SIiwiU0QtUC1QTC1SIiwiU0QtUC1HUEQtUiIsIlNELVAtREYtUiIsIlNELVAtQlRELVIiLCJTVC1QLURFUy1SVyIsIkdQLVAtR0NOLVIiLCJTRC1QLVNTLVJXIiwiU1QtUC1UREwtUiIsIlNELVAtU1MtUiIsIlNULVAtU05PLVJXIiwiU0QtUC1QT1YtUlciLCJTVC1QLUJSRC1SIiwiU1QtUC1DTVQtUiIsIlNELVAtQ0hDLVIiLCJTRC1QLVBPVi1SIiwiU0QtUC1NSVMtUiIsIlNELVAtREYtUlciLCJTRC1BUEktVEQtUiIsIlNELUFQSS1DTi1SIiwiU0QtQVBJLVRWLVIiLCJTVC1BUEktQlJELVJXIiwiU0QtQVBJLVJCLVIiLCJTVC1QLVRETC1SVyIsIlNULUFQSS1DUkQtUlciLCJTVC1SLUNEUiIsIlNELVAtUEQtUiIsIlNELVAtVEQtUiIsIlNELVAtVEQtUlciLCJTVC1QLU5URi1SVyIsIlNELVAtU1NVLVIiLCJTRC1QLUJHLVIiLCJTRC1QLUJURC1SVyIsIlNULUFQSS1FTVAtUiIsIlNULVItQSIsIlNELVAtU1NVLVJXIiwiU1QtUC1OVEYtUiIsIlNELVItQ0VPIiwiU1QtQVBJLUFNQy1SVyJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzYwNTEzMjEzLCJleHAiOjE3NjA2MDAyMTMsImp0aSI6IjAwMGNkMDkyLTAyMTMtNGIzNy1iNjNkLTdiNTEyNzRhZWQ4YyJ9.ZYgVXBqZct53OBw0RDc6cSaYRUzVwU2piQoGGhn1yJO8hZekl4FW3Uk8_ydTEIZP5uQb0TnUZ0oF82AdfvYkrXShUKVbXLz_OnYV9EX6thZ4LNmp6sgWS0lbqApFw7Kr65NErTU5D5MMfEcrSyhZOmcd0Mj-IOHgDJmBFRw9Ge47DbuwhwNajsw95zdccJofdebazQgdo9YB3FIpvpX6nk4zJqm_o8YHyVkvNPb23YYtgZhy-t9HyCE3sWlVt69oOi81n9LO1_NOuR9daEl3SYPWS1luXOIj7jtfbkfaqChbn6bALhfSRGR8Co0i7EgzfJSgFxG-AvS6xo1W9cx56Q"; 
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
