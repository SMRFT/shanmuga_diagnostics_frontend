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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDAwMiIsImVtYWlsIjoibmFqbWFzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiTmFqbWEgQiIsImFsbG93ZWQtYWN0aW9ucyI6WyJTRC1SLUEiLCJTRC1QLVBPVi1SIiwiU0QtUC1ITVNTUy1SIiwiU0QtUC1DSEMtUiIsIlNELVAtTEJOLVIiLCJTRC1QLUJBLVIiLCJTRC1QLURGLVIiLCJTRC1QLVNTVS1SVyIsIlNELVAtSE1TUEItUiIsIlNUUi1BUEktVFJMLVJXIiwiU0QtUC1ITVNHQy1SIiwiU0QtUC1MU0NMLVIiLCJTRC1QLVVQQi1SIiwiU0QtUC1QQi1SIiwiU1RSLUFQSS1USU4tUlciLCJTRC1QLUxVU0NELVJXIiwiU0QtUC1TQ1UtUlciLCJTVFItQVBJLVZMLVIiLCJTRC1QLUxHTEQtUiIsIlNELVAtU1ZGLVJXIiwiU0QtUC1HUEItUlciLCJTRC1QLUxQSS1SIiwiU0QtUC1CRy1SIiwiU1QtQVBJLVRSTFItUlciLCJTRC1QLUNIQy1SVyIsIlNULVAtVERMLVIiLCJTRC1QLUxHRC1SVyIsIlNELVAtTUJUVi1SIiwiU1QtUC1ERVMtUiIsIlNELVAtU1AtUiIsIlNELVAtU0hGLVJXIiwiU0QtUC1TSVItUlciLCJTRC1QLU1JUy1SIiwiU0QtUC1TSVItUiIsIlNULVItQSIsIlNULVAtQlJELVIiLCJTRC1BUEktR09SLVJXIiwiU0QtQVBJLUdPQy1SVyIsIlNELVAtUEctUlciLCJTRC1BUEktR1ItUlciLCJTRC1QLUhNU1VDLVJXIiwiU0QtUC1VUEItUlciLCJTVFItQVBJLUlMIiwiU0QtUC1MUkMtUiIsIlNUUi1BUEktVFJMLVIiLCJTVC1QLUNNVC1SVyIsIlNUUi1QLUlDUy1SIiwiU0QtQVBJLVBSLVIiLCJTRC1BUEktUkNMLVJXIiwiU0QtUC1ERi1SVyIsIlNELUFQSS1JVk0tUiIsIlNELVAtSE1TU0QtUlciLCJTRC1QLU1CUEQtUiIsIlNELVAtSE1TU1AtUiIsIlNUUi1QLVRJTlItUlciLCJTRC1QLUhNU1BTLVJXIiwiU0QtUC1ITVNMRC1SIiwiU1QtUC1OVEYtUiIsIlNELVAtU1MtUlciLCJTVFItUC1USU5SLVIiLCJTRC1QLUhNU0NTLVIiLCJTRC1QLVRELVIiLCJTRC1QLVNHQUMtUlciLCJTVC1QLVRETC1SVyIsIlNULVAtREVTLVJXIiwiU1RSLUFQSS1WTC1SVyIsIlNELVAtTU9MREYtUlciLCJTVFItQVBJLVRJTi1SIiwiU1QtQVBJLUFNQy1SVyIsIlNELVAtSE1TUEItUlciLCJTRC1QLVNTLVIiLCJTRC1BUEktVkMtUlciLCJTRC1BUEktTUlTLVJXIiwiU0QtUC1HUEQtUiIsIlNELVAtTEdMVC1SIiwiU1RSLUFQSS1UUkxSLVIiLCJTRC1QLUJBLVJXIiwiU1QtUC1TTk8tUlciLCJTVC1BUEktQ1JELVJXIiwiU0QtQVBJLUlWTS1SVyIsIlNELVAtR1NQLVIiLCJTRC1BUEktVlAtUlciLCJTRC1QLVNIRi1SIiwiU0QtQVBJLVJCLVIiLCJTRC1BUEktR0MtUlciLCJTRC1QLVRFLVIiLCJTRC1BUEktVFYtUiIsIlNELVAtU0dBQy1SIiwiU0QtUC1QT1YtUlciLCJTRC1QLVRFLVJXIiwiU1QtQVBJLUJSRC1SVyIsIlNUUi1SLUEiLCJTRC1QLUxHU0MtUiIsIlNELVAtVEQtUlciLCJTRC1BUEktTUJURC1SVyIsIlNELVAtSE1TVEQtUlciLCJTVC1BUEktRU1QLVIiLCJTRC1QLVNDLVIiLCJTRC1QLUxTQy1SVyIsIlNELVAtTU9MUEQtUlciLCJTVC1QLU5URi1SVyIsIlNELUFQSS1DTi1SIiwiU0QtQVBJLVRNLVJXIiwiU0QtUC1QRy1SIiwiU0QtUC1ITVNTUy1SVyIsIlNELVAtQlRELVIiLCJTRC1BUEktVEQtUiIsIlNELVAtUEQtUiIsIlNELUFQSS1HRC1SIiwiU0QtUC1TU1UtUiIsIlNELVAtUEItUlciLCJTRC1QLU1CREYtUlciLCJTRC1QLUJURC1SVyIsIlNELVAtSE1TVEQtUiIsIlNELVAtUEwtUiIsIlNELUFQSS1UTS1SIiwiU0QtUC1MU0QtUlciLCJTRC1QLVNWRi1SIiwiU1RSLUFQSS1JTC1SIiwiU1RSLUFQSS1JTC1SVyIsIlNELVAtUEYtUlciLCJTRC1QLUhNU1NQLVJXIiwiU1QtUC1DTVQtUiIsIlNELVAtUEYtUiJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIiwiU0hCMDAyIl0sImhvc3BpdGFsX2NvZGUiOiJTSDAwMSIsImhtc19wYWdlcyI6W10sImFsbG93ZWQtb3V0bGV0cyI6W10sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzgwNjM2NDc2LCJleHAiOjE3ODA3MjM0NzZ9.RGvFIvHXdmRtzMYk7IoYQBBpln7WMDJVlr7PicA2qhHwOXfWuDb9xBM8AAz47P6mQL-sYm_MSgSKDNcZyEfBSuSLuyS7X4ume34zoGZO_TY51IyswqkGvNjBNtV4AVw6ESJQHHLG7yswB1M21l73nM8njKchk-TxGkBjI_lunjjUmRvwxvU_2YWqeB4QjDQ7AnXllj9-pVNu_FedJ4l3W_8z2TSgbOKnwn9XMEmg_ubE1WysJP8Q6JNNE_C7_fgO9wHpQlmaC3JO_ftjigGbgiVI5QaZP4UNZOrP5dB81Ldf0HHcQetsV8bPDqSsoFeEuz1HSZ0bYg8mJVtG3nOVQA";
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

    // If validation fails, redirect to login instead of showing debug page
    console.log("❌ Redirecting to login due to validation failure");
    redirectToLogin();
  }
})();
