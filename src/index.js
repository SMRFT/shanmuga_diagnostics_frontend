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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDAwMiIsImVtYWlsIjoibmFqbWEuYkBzaGlub3ZhLmluIiwibmFtZSI6Ik5ham1hIEIiLCJhbGxvd2VkLWFjdGlvbnMiOlsiU0QtUC1TQy1SIiwiU0QtQVBJLVRELVIiLCJTRC1BUEktR0MtUlciLCJTVC1BUEktQ1JELVJXIiwiU0QtQVBJLUdPUi1SVyIsIlNUUi1QLUlDUy1SIiwiU0QtQVBJLVRNLVIiLCJITVMtUC1PVE0tUiIsIkhNUy1QLUNUSS1SVyIsIlNELVAtQkEtUlciLCJTRC1QLUhNU1RELVJXIiwiU1QtQVBJLUFNQy1SVyIsIlNELUFQSS1WUC1SVyIsIlNELVAtSE1TVUMtUlciLCJTVFItQVBJLUlMLVJXIiwiU0QtUC1TSVItUiIsIlNUUi1BUEktVFJMLVJXIiwiSE1TLVAtT1RNQi1SVyIsIkhNUy1QLUhNUyIsIlNELVAtU1AtUiIsIlNELVAtSE1TU0QtUlciLCJTRC1QLUxQSS1SIiwiSE1TLVAtT1RJUkQtUlciLCJHUC1QLUdDTi1SIiwiU1RSLUFQSS1USU4tUiIsIlNELVAtTEJOLVIiLCJTRC1QLUxTQ0wtUiIsIlNELVAtVEQtUlciLCJTRC1QLVBCLVJXIiwiU0QtUC1HUEItUlciLCJTRC1QLVBGLVIiLCJITVMtUC1PVE1CRS1SVyIsIlNELVAtUE9WLVJXIiwiU0QtUC1TUy1SIiwiU1RSLUFQSS1JTCIsIlNELUFQSS1JVk0tUlciLCJITVMtUC1JQi1SIiwiVElOLUFQSS1RUi1SVyIsIlNELVAtTUJUVi1SIiwiSE1TLVAtU1VNQS1SVyIsIlNELVAtTEdTQy1SIiwiU0QtQVBJLVJDTC1SVyIsIlNULUFQSS1UUkxSLVJXIiwiU0QtUC1TSVItUlciLCJTVC1QLU5URi1SIiwiVElOLUFQSS1STS1SVyIsIlNELVAtTFVTQ0QtUlciLCJTRC1QLU1CREYtUlciLCJUSU4tUC1EQVNILVJXIiwiU1QtUC1UREwtUlciLCJTRC1QLVRFLVJXIiwiU0QtUC1MUkMtUiIsIkhNUy1QLVNVTUQtUlciLCJTVFItQVBJLUlMLVIiLCJTRC1BUEktVFYtUiIsIlNULVAtTlRGLVJXIiwiU0QtUC1TVkYtUiIsIlNUUi1BUEktVkwtUiIsIlNELVAtU0dBQy1SIiwiSE1TLVAtU0lERUJBUiIsIkhNUy1QLU9UU1NFLVJXIiwiU0QtUC1QRy1SIiwiU0QtQVBJLUdELVIiLCJITVMtUC1PVFNTLVIiLCJITVMtUC1PVFNTVS1SVyIsIlRJTi1BUEktQURNLVJXIiwiU1RSLUFQSS1USU4tUlciLCJTVC1BUEktQlJELVJXIiwiU0QtQVBJLVBSLVIiLCJITVMtUC1TVU1FLVJXIiwiU0QtUC1CRy1SIiwiU0QtUC1NT0xERi1SVyIsIlNELVAtTEdMVC1SIiwiU0QtUC1QT1YtUiIsIlNUUi1BUEktVFJMLVIiLCJTRC1QLUhNU1NTLVIiLCJITVMtQVBJLUVNTC1SVyIsIkhNUy1QLUlQS0ctUiIsIlRJTi1QLUFDQy1SVyIsIlNELVAtU0hGLVIiLCJITVMtQVBJLURMRC1SIiwiSE1TLVAtT1RTU0EtUlciLCJTRC1QLVBCLVIiLCJTRC1QLVNTVS1SIiwiU0QtUC1CVEQtUiIsIkhNUy1QLU9USVJFLVJXIiwiU0QtUC1MU0QtUlciLCJUSU4tUi1BIiwiU1RSLVAtVElOUi1SIiwiU0QtQVBJLVRNLVJXIiwiU1RSLUFQSS1WTC1SVyIsIlNELVAtSE1TVEQtUiIsIlNELVAtSE1TQ1MtUiIsIlNULUFQSS1FTVAtUiIsIlRJTi1BUEktQkstUlciLCJTRC1BUEktR1ItUlciLCJTRC1BUEktSVZNLVIiLCJTRC1QLURGLVIiLCJTRC1QLVVQQi1SVyIsIkhNUy1QLVBHUy1SVyIsIkhNUy1QLU9UTUJELVJXIiwiU1QtUC1DTVQtUiIsIlNELVAtUEwtUiIsIkhNUy1BUEktVUhJRC1SIiwiU0QtUC1NT0xQRC1SVyIsIlNULVAtREVTLVIiLCJTVFItUi1BIiwiU0QtUC1QRy1SVyIsIlNELVAtTEdMRC1SIiwiU0QtUC1TQ1UtUlciLCJTRC1QLUhNU1BCLVIiLCJTRC1QLUhNU1BTLVJXIiwiU0QtUC1ITVNMRC1SIiwiU1QtUC1UREwtUiIsIlNUUi1BUEktVFJMUi1SIiwiU0QtUC1MU0MtUlciLCJTRC1QLUJBLVIiLCJUSU4tQVBJLUdBLVJXIiwiU0QtUC1URS1SIiwiU0QtQVBJLU1JUy1SVyIsIlNELVItQSIsIkhNUy1QLUFNLVIiLCJTRC1QLUNIQy1SVyIsIlNELVAtSE1TU1AtUlciLCJTRC1QLUdQRC1SIiwiSE1TLVAtSUJELVJXIiwiU0QtUC1ITVNTUC1SIiwiSE1TLVAtT1RTUy1SVyIsIkhNUy1QLUNUSUEtUlciLCJITVMtUC1PVElSLVJXIiwiU1QtUi1BIiwiU0QtQVBJLUdPQy1SVyIsIkhNUy1QLVdSLVJXIiwiU0QtUC1TUy1SVyIsIlRJTi1BUEktRVYtUlciLCJITVMtUC1JQkUtUlciLCJTRC1BUEktVkMtUlciLCJTVFItUC1USU5SLVJXIiwiU0QtUC1ERi1SVyIsIkhNUy1QLUlCLVJXIiwiU0QtUC1CVEQtUlciLCJTRC1QLUNIQy1SIiwiU0QtUC1VUEItUiIsIlNELVAtU1ZGLVJXIiwiU0QtUC1ITVNHQy1SIiwiU0QtUC1HU1AtUiIsIlNULVAtQlJELVIiLCJITVMtUC1TVU0tUiIsIlNULVAtREVTLVJXIiwiU0QtUC1NQlBELVIiLCJTRC1QLVNHQUMtUlciLCJTVC1QLUNNVC1SVyIsIlNELVAtUEQtUiIsIlNELVAtUEYtUlciLCJTRC1QLUhNU1BCLVJXIiwiU0QtUC1ITVNTUy1SVyIsIlNELUFQSS1DTi1SIiwiU0QtUC1MR0QtUlciLCJTRC1QLVNTVS1SVyIsIlNELVAtVEQtUiIsIlNULVAtU05PLVJXIiwiVElOLVAtUkEtUlciLCJTRC1QLVNIRi1SVyIsIlNELUFQSS1NQlRELVJXIiwiU0QtQVBJLVJCLVIiLCJITVMtUC1PVFNTRC1SVyIsIlNELVAtTUlTLVIiLCJITVMtUC1TVU0tUlciXSwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwMSIsIlNIQjAwMiJdLCJob3NwaXRhbF9jb2RlIjoiU0gwMDEiLCJobXNfcGFnZXMiOlsyLDMsNSwxMCwxMSwyMCwyMSw0NCw0Nyw0OCw0OSwxMjcsMTI4LDE0NCwzMV0sImFsbG93ZWQtb3V0bGV0cyI6WyJPTEVUMDAzIiwiT0xFVDAwMSJdLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc5MzA5ODQzNywiZXhwIjoxNzkzMTg1NDM3fQ.V8ezHxMZfKABZuGDjT9IeqTLhTSp2gUphsaAt8ffnvmIs3Q1XMMBdayxThxYKPA4vf3V0_V6h4_LZBIMkp-QCWsz-mL-BcBV1meEiCPKgelMcO2RXSCg_LGHn6DHwc1NnparcmAwdaEjal5kK69Vnclaur4I4XRkg9a1s3fv_P30EOK_fhAHy88np6fqfj1RW90OGNFtdP41a5GQ_65Gs31uMWKTAt1nuHRu_mNoHRri_2-o3hERnA0J3IwmXsqRVssmew9r3nJ-JJYnUu3wq427hN7Gr-piaX1S1aHv0ybJIEYvhLiv-LMInEotbaivGKcTi6SGJERgAK-5wbiFmg";
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
        const swUrl = `${process.env.PUBLIC_URL || ''}/sw.js`;
        navigator.serviceWorker.register(swUrl)
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
