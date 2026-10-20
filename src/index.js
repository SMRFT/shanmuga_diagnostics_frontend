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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDE1NyIsImVtYWlsIjoiZ20ubGFic2FsZXNAc21yZnQub3JnIiwibmFtZSI6IlN1bmRhciBNIiwiYWxsb3dlZC1hY3Rpb25zIjpbIkdMLVAtTVNULUNGRy1SIiwiU0QtUC1TUy1SIiwiU1QtUC1CUkQtUiIsIlNELUFQSS1WUC1SVyIsIlNULVAtTlRGLVIiLCJTRC1QLUdTUC1SIiwiU0QtUC1TSEYtUiIsIkNOLUFQSS1DVC1SVyIsIlNELUFQSS1URC1SIiwiU0QtUC1CVEQtUlciLCJIUi1QLVBBWS1FWFAtUiIsIlNELVAtTFRBLVJXIiwiU0QtUC1MRC1SVyIsIlNELVAtQkctUiIsIkZSLUFQSS1GUi1SIiwiU0QtUC1MR0QtUlciLCJIUi1QLVBSTS1BUFItUiIsIlNELVAtQkJBLVJXIiwiU0QtUC1CVEQtUiIsIkdMLVAtRUFELVIiLCJTRC1QLVNIRi1SVyIsIlNULVAtQ01ULVJXIiwiU0QtQVBJLUdELVIiLCJTRC1QLVBHLVIiLCJTRC1QLVNTVS1SIiwiU1QtUC1TTk8tUlciLCJTVC1BUEktRU1QLVIiLCJTRC1BUEktR09SLVJXIiwiR0wtUC1QLVJXIiwiR0wtUC1FQUQtUlciLCJTVC1SLUhPRCIsIlNELVAtTUJQRC1SIiwiSFItUC1MRVYtRU1QLVIiLCJDTi1BUEktQ1QtUiIsIlNELVItSFIiLCJIUi1QLVRLLU1HVC1SIiwiU0QtUC1TUy1SVyIsIlNELVAtUEQtUiIsIkhSLVAtUFJNLUVNUC1SVyIsIkhSLVAtUEFZLUVYUC1SVyIsIlNELVAtU1ZELVJXIiwiU0QtUC1TQy1SIiwiU0QtUC1ERi1SIiwiR0wtUC1FUC1SIiwiU0QtUC1TUC1SIiwiU0QtUC1MVFItUlciLCJIUi1QLVBBWS1NR1QtUlciLCJTRC1QLVBGLVJXIiwiU0QtQVBJLUdSLVJXIiwiU0QtUC1VUEItUlciLCJTRC1BUEktTUlTLVJXIiwiU0QtQVBJLVRWLVIiLCJGRS1BUEktRlJNLVJXIiwiU0QtQVBJLVZDLVJXIiwiU0QtUC1SRC1SVyIsIkhSLVAtQVRULVNFQy1SVyIsIkhSLVAtVEstTUdULVJXIiwiU1QtUC1UREwtUiIsIkhSLVAtUk9TLU1HVC1SIiwiU0QtUC1QRi1SIiwiU0QtQVBJLVRNLVJXIiwiU0QtQVBJLUlWTS1SIiwiU1QtUC1DTVQtUiIsIlNELVAtTFNQLVJXIiwiR1AtUC1HQ04tUiIsIlNELVAtR1BELVIiLCJTRC1BUEktQ04tUlciLCJTVC1BUEktQU1DLVJXIiwiU1QtQVBJLUNSRC1SVyIsIlNELVAtUEctUlciLCJIUi1QLUFUVC1SRVAtUiIsIkhSLVAtQVRULVJFUC1SVyIsIlNELVAtUE9WLVJXIiwiU0QtUC1TQ1UtUlciLCJTRC1QLVNPUi1SVyIsIkdMLVAtTVNULUNGRy1SVyIsIlNELVAtTUlTLVIiLCJIUi1QLVJPUy1NR1QtUlciLCJTRC1QLUxDQy1SVyIsIkdMLVAtQkQtUlciLCJTRC1QLVRELVJXIiwiR0wtUC1FUC1SVyIsIlNELVAtU0dBQy1SIiwiSFItUC1MRVYtQ0ZHLVJXIiwiU0QtUC1PRC1SIiwiU0QtQVBJLU1CVEQtUlciLCJTRC1QLU1CVFYtUiIsIkhSLVAtQVRULUFQUi1SVyIsIlNELVAtTFJDLVIiLCJTRC1QLURGLVJXIiwiSFItUC1MRVYtQ0ZHLVIiLCJTRC1QLUJBLVJXIiwiU0QtUC1QTC1SIiwiU0QtUC1HUFQtUlciLCJTVC1BUEktQlJELVJXIiwiU0QtUC1TR0UtUiIsIlNELVAtTEJDLVJXIiwiSFItUC1QQVktTUdULVIiLCJIUi1QLUFUVC1BUFItUiIsIlNELVAtTEJOLVIiLCJGUi1BUEktRlItUlciLCJTRC1BUEktR0MtUlciLCJIUi1QLUxFVi1BUFItUlciLCJTRC1QLVNWRi1SVyIsIlNULVAtVERMLVJXIiwiU0QtUi1HTSIsIlNELVAtTFNMLVJXIiwiU0QtUC1DTC1SVyIsIlNULVAtREVTLVJXIiwiU0QtUC1URC1SIiwiU0QtQVBJLVRNLVIiLCJTRC1QLVNTVS1SVyIsIlNELVAtTFRNLVJXIiwiU0QtUC1QQi1SVyIsIkhSLVAtUFJNLUVNUC1SIiwiU0QtUC1MR0UtUlciLCJTRC1QLVNJUi1SVyIsIkhSLVAtQVRULVNFQy1SIiwiR0wtUC1CRC1SIiwiU0QtQVBJLVJCLVJXIiwiU0QtUC1NQkRGLVJXIiwiSFItUC1MRVYtRU1QLVJXIiwiU0QtQVBJLUlWTS1SVyIsIlNELVAtUEItUiIsIlNELVAtTFNSLVJXIiwiU0QtUC1HUEQtUlciLCJTRC1QLVRTLVJXIiwiU0QtUC1MUEktUiIsIlNELVAtR1BCLVJXIiwiU0QtQVBJLVBSLVIiLCJTRC1QLVVQQi1SIiwiSFItUC1MRVYtQVBSLVIiLCJTRC1QLVRFLVIiLCJTRC1BUEktR09DLVJXIiwiU0QtUC1TVkYtUiIsIlNELVAtQ0hDLVJXIiwiU0QtUC1MQkYtUlciLCJTVC1QLU5URi1SVyIsIlNULVAtREVTLVIiLCJTRC1QLVRFLVJXIiwiU0QtUC1MQkwtUlciLCJTRC1BUEktUkNMLVJXIiwiU0QtUC1DSEMtUiIsIkhSLVAtUEFZLVNMSVAtUiIsIlNELVAtU0dBQy1SVyIsIkhSLVAtUFJNLUFQUi1SVyJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImhvc3BpdGFsX2NvZGUiOiJTSDAwMSIsImhtc19wYWdlcyI6W10sImFsbG93ZWQtb3V0bGV0cyI6W10sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzkyNDY3MjcxLCJleHAiOjE3OTI1NTQyNzF9.OwV5ExToOkCIBZSP9uBnKYw7SrN6yn-UBih-6SxtI11D1EGHVMDEG8BAsCtQFW10rMDgVhZF7m4ns9lREZmIwdk5eZhb81VKFU1ScTqaYqThZFXQhE3CV_5h3pfEU97R-4lHPZt6upP2t8IZkcfjE61PmqXAe9x4SGyVQjCyxcl8gHOkYX9nnHC4wEp7tOnvh7CVz2T6U2ERu-nLpKeCq_Nb_f773GMBKybZfhZvZ1lzDfnDv-qI_Fuhj9y3mcMIo2tQNrQWVMlRrPvXbYe3CcSJA0g-sEcRL9HEyqYJ8dCSKlRo7JSaZ8k9KjPavM0gSTecUuzCqiXHzVH0iVmflg";
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
