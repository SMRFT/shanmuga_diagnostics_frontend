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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDAwMiIsImVtYWlsIjoibmFqbWEuYkBzaGlub3ZhLmluIiwibmFtZSI6Ik5ham1hIEIiLCJhbGxvd2VkLWFjdGlvbnMiOlsiU0QtUC1ITVNTUC1SIiwiU1RSLUFQSS1USU4tUiIsIlNELVAtTEdTQy1SIiwiU1QtUC1DTVQtUiIsIlNELUFQSS1HUi1SVyIsIkhNUy1QLVZTLVIiLCJITVMtUC1WSU5FLVJXIiwiU0QtUC1URC1SIiwiU0QtUC1MU0QtUlciLCJITVMtUC1WSUUtUlciLCJTRC1QLVVQQi1SIiwiU0QtUC1ITVNMRC1SIiwiSE1TLVAtVkktUiIsIlNELVAtU1ZGLVJXIiwiU0QtUC1QQi1SIiwiU1QtUC1OVEYtUiIsIlNELVAtQkEtUlciLCJTVC1BUEktRU1QLVIiLCJTRC1QLVRFLVJXIiwiU1RSLUFQSS1JTC1SIiwiSE1TLVAtSFJJTlAtUlciLCJTRC1QLVRFLVIiLCJITVMtUC1WUFAiLCJTRC1BUEktVE0tUiIsIlNELVAtVEQtUlciLCJITVMtUC1WSU5SLVIiLCJTRC1QLVNDLVIiLCJITVMtQVBJLUVNTC1SVyIsIlNELVItQSIsIlNELUFQSS1JVk0tUlciLCJTRC1QLVVQQi1SVyIsIlNELVAtU0NVLVJXIiwiU0QtUC1MU0NMLVIiLCJTRC1QLUhNU1RELVIiLCJTVC1QLURFUy1SVyIsIlNUUi1BUEktVkwtUlciLCJTRC1BUEktUFItUiIsIlNUUi1BUEktVFJMUi1SIiwiU0QtUC1MUkMtUiIsIlNELVAtUEYtUlciLCJTRC1QLVBELVIiLCJTVC1QLVNOTy1SVyIsIkdQLVAtR0NOLVIiLCJTRC1QLU1PTFBELVJXIiwiU1QtUC1UREwtUiIsIlNELVAtU1NVLVJXIiwiU0QtUC1ITVNHQy1SIiwiU0QtUC1TSEYtUlciLCJTRC1QLUhNU1NTLVIiLCJTRC1QLUxTQy1SVyIsIlNELVAtTEdMRC1SIiwiSE1TLVAtVkNELVJXIiwiSE1TLVAtVkNFLVJXIiwiU0QtUC1CVEQtUlciLCJTVC1SLUEiLCJTRC1QLVNTLVIiLCJTRC1QLUxVU0NELVJXIiwiU0QtQVBJLVJCLVIiLCJITVMtUC1WSU5BLVJXIiwiU0QtUC1MR0xULVIiLCJTRC1QLVNTVS1SIiwiSE1TLVAtVkNDLVIiLCJTRC1BUEktVEQtUiIsIkhNUy1QLVZJRC1SVyIsIlNELUFQSS1UVi1SIiwiU1RSLUFQSS1UUkwtUiIsIkhNUy1BUEktUkRELVJXIiwiU0QtUC1QRi1SIiwiU0QtUC1ITVNVQy1SVyIsIlNUUi1QLVRJTlItUiIsIlNELVAtQ0hDLVJXIiwiSE1TLVAtSE1TIiwiSE1TLVAtVlZFLVJXIiwiU1RSLUFQSS1JTCIsIkhNUy1QLVZFViIsIlNELVAtUEItUlciLCJTVFItUC1USU5SLVJXIiwiU0QtUC1QRy1SIiwiSE1TLVAtQ1RJQS1SVyIsIlNELVAtSE1TQ1MtUiIsIlNELVAtU0lSLVJXIiwiU1QtUC1ERVMtUiIsIlNELVAtSE1TUEItUlciLCJITVMtQVBJLVJEQS1SVyIsIlNELVAtQ0hDLVIiLCJITVMtUC1WVi1SIiwiU1RSLUFQSS1USU4tUlciLCJTVC1BUEktQlJELVJXIiwiU0QtQVBJLVZQLVJXIiwiU0QtQVBJLUdPQy1SVyIsIlNELVAtU0lSLVIiLCJTRC1BUEktVE0tUlciLCJTRC1QLVBMLVIiLCJTRC1QLUhNU1NQLVJXIiwiU0QtUC1MR0QtUlciLCJTRC1QLUdTUC1SIiwiU0QtUC1ERi1SVyIsIlNUUi1QLUlDUy1SIiwiU0QtUC1NQlBELVIiLCJITVMtQVBJLVJELVIiLCJITVMtUC1IUklOLVIiLCJTRC1QLVNHQUMtUiIsIlNELVAtU1ZGLVIiLCJTRC1QLVNQLVIiLCJTRC1BUEktQ04tUiIsIlNULVAtTlRGLVJXIiwiU0QtUC1ITVNTUy1SVyIsIlNELVAtU0dBQy1SVyIsIlNELVAtSE1TUFMtUlciLCJITVMtUC1WVi1SVyIsIlNELVAtUE9WLVJXIiwiU0QtUC1NQkRGLVJXIiwiU0QtUC1NT0xERi1SVyIsIlNELUFQSS1WQy1SVyIsIlNELUFQSS1JVk0tUiIsIlNELUFQSS1NQlRELVJXIiwiSE1TLVAtVkktUlciLCJTRC1QLVBHLVJXIiwiSE1TLVAtVlZELVJXIiwiSE1TLVAtSFJJTkEtUlciLCJTRC1BUEktR0QtUiIsIkhNUy1QLUhSSU4tUlciLCJITVMtQVBJLVJERS1SVyIsIlNULVAtQlJELVIiLCJTRC1QLUxCTi1SIiwiU0QtQVBJLU1JUy1SVyIsIlNUUi1BUEktVkwtUiIsIkhNUy1QLVZTLVJXIiwiU0QtUC1CQS1SIiwiU0QtUC1HUEQtUiIsIlNELVAtUE9WLVIiLCJITVMtQVBJLVJELVJXIiwiSE1TLVAtVlNSUCIsIlNULVAtVERMLVJXIiwiSE1TLVAtVklOLVJXIiwiU0QtUC1NQlRWLVIiLCJTRC1BUEktR0MtUlciLCJTRC1QLVNTLVJXIiwiU0QtUC1ITVNURC1SVyIsIlNELVAtQkctUiIsIkhNUy1QLU9USVItUiIsIlNULUFQSS1DUkQtUlciLCJTRC1QLUJURC1SIiwiU0QtQVBJLUdPUi1SVyIsIlNELUFQSS1SQ0wtUlciLCJTRC1QLVNIRi1SIiwiU0QtUC1NSVMtUiIsIlNELVAtSE1TU0QtUlciLCJTVC1QLUNNVC1SVyIsIlNELVAtSE1TUEItUiIsIlNUUi1SLUEiLCJITVMtUC1WQ0MtUlciLCJTVC1BUEktVFJMUi1SVyIsIlNUUi1BUEktSUwtUlciLCJTVC1BUEktQU1DLVJXIiwiSE1TLVAtU0lERUJBUiIsIlNELVAtREYtUiIsIlNELVAtR1BCLVJXIiwiU1RSLUFQSS1UUkwtUlciLCJTRC1QLUxQSS1SIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiLCJTSEIwMDIiXSwiaG9zcGl0YWxfY29kZSI6IlNIMDAxIiwiaG1zX3BhZ2VzIjpbNSwxMCwyMiwxMzksNDIsMTQwLDE0MSw0NiwxMjgsMTQzLDE0NCw0MCw0MSwxNDJdLCJhbGxvd2VkLW91dGxldHMiOlsiT0xFVDAwMyIsIk9MRVQwMDUiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3OTAyMjMwNTcsImV4cCI6MTc5MDMxMDA1N30.FunhwzdZSNQA0yv2osaG-OwCl1VKFJ7l2kwTHSYndqfwChtNzucQ6MzqdvbkOc3nAg9WdkVMtt0r3DhttHcW9QsT3icheFPue9fnC8WTJATjU1Te9DBQpUq1gRGOfDjpZrfuBtqxyOatatxnEMUih4X4tKBSxqfK9Zxj3_LHWCJP3SlSkqvjlVP-_YBb4KGduWoh_ziW4ChQp03FisV8iGZH8m8zwSF5voh5FlgSwW8imZOceiiXjmGqPsBLqo3MxtCGAH9hMX7D7QXzXy2X272Nfl3Iel2n-zJQwjfpM2VNcvA9j6edK_BolhuwJ0qTcIG2idumNz8ALtIzPfMVng";
  console.log("🔧 Development token is empty - will redirect to login");
  const selectedBranch = "SHB001";
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
  } else if (allowedActions.includes("SD-R-CL")) {
    return "Clinical Reports";
  } else if (allowedActions.includes("SD-R-MAVP")) {
    return "Marketting AVP";

  } else if (allowedActions.includes("SD-R-HR")) {
    return "HR";
  } else if (allowedActions.includes("SD-R-TC")) {
    return "TeleCalling"; // Default role if none of the specific roles are found
  }
  else {
    return "Accounts"; // Default role if none of the specific roles are found
  }
}

// --- Main execution ---
(function main() {
  const path = window.location.pathname.toLowerCase();
  const isPublicRoute =
    path.includes("customercomplaintsqrscan") ||
    path.includes("feedbackgrievance") ||
    path.includes("estimate");

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

    // If still no token (development token is empty), redirect to login unless on public route
    if (!accessToken || accessToken.trim() === "") {
      console.log("❌ No valid token available");
      if (isPublicRoute) {
        console.log("Public route detected, rendering App without token...");
        const root = ReactDOM.createRoot(document.getElementById("root"));
        root.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>,
        );
        return;
      }

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

    // Store additional user data for the app
    localStorage.setItem("employeeId", employeeId);
    localStorage.setItem("name", name);
    localStorage.setItem("role", userRole);
    localStorage.setItem("email", userEmail);
    localStorage.setItem("user_payload", JSON.stringify(userPayload));

    // Render the React application
    console.log("✅ Rendering lab app...");
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );

    reportWebVitals();

    // Register Service Worker for Logistics Tracking Notifications
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('✅ ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(err => {
            console.log('❌ ServiceWorker registration failed: ', err);
          });
      });
    }
  } catch (error) {
    console.error("❌ Token validation failed:", error.message);

    // Clean up invalid token
    localStorage.removeItem("access_token");

    if (isPublicRoute) {
      console.log("Public route detected, rendering App despite token validation failure...");
      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      );
      return;
    }

    // If validation fails, redirect to login instead of showing debug page
    console.log("❌ Redirecting to login due to validation failure");
    redirectToLogin();
  }
})();
