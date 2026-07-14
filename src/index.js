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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiU0QtQVBJLVRELVIiLCJTRC1BUEktQ04tUlciLCJITVMtUC1ITVNQUyIsIkhNUy1QLU1SQS1SVyIsIlNELUFQSS1UTS1SVyIsIlNULVAtTlRGLVIiLCJITVMtUC1XUi1SVyIsIlNULVAtREVTLVIiLCJTRC1QLVJCLVJXIiwiTURDLUFQSS1DRFItUiIsIk1EQy1QLVNPUi1SIiwiTURDLVAtR1NQLVIiLCJITVMtUC1SQ0FULVJXIiwiSE1TLVAtUlNERC1SVyIsIlNELVAtTFJDLVIiLCJTRC1QLUxCRi1SVyIsIk1EQy1QLVRSQi1SVyIsIlNELVAtTEJDLVJXIiwiTURDLVAtR0NQLVIiLCJTRC1QLVNTLVJXIiwiSE1TLVAtTVQtUlciLCJNREMtQVBJLVBHUC1SVyIsIk1EQy1SLUFETSIsIkhNUy1QLUdSTiIsIlNELVAtU1AtUiIsIkhNUy1QLVBDRC1SVyIsIk1EQy1BUEktVEhSLVIiLCJNREMtUC1SRUctUlciLCJNREMtUC1QTlAtUiIsIkhNUy1QLVBJRC1SVyIsIlNELUFQSS1SQi1SVyIsIk1EQy1BUEktTC1SVyIsIk1EQy1BUEktUkRMLVJXIiwiSE1TLVAtQ0NELVJXIiwiTURDLVAtQUQtUlciLCJTRC1QLUJURC1SVyIsIkhNUy1QLVBPTC1SVyIsIkhNUy1QLUhNUyIsIkhNUy1QLUlCLVJXIiwiTURDLVAtUE5QLVJXIiwiTURDLVAtQUFVLVJXIiwiTURDLVAtR09BLVJXIiwiSE1TLVAtR1JOLVJXIiwiSE1TLVAtUk0tUlciLCJITVMtUC1NUkwtUlciLCJITVMtQVBJLVBBQ0stUiIsIkhNUy1QLUREQVNIIiwiSE1TLVAtU1JNLVJXIiwiSE1TLVAtTlMtUlciLCJTVC1BUEktQ1JELVJXIiwiTURDLUFQSS1TR1AtUlciLCJNREMtQVBJLUFETS1SVyIsIkdQLVAtR0NOLVIiLCJTRC1QLVNTVS1SVyIsIlNELVAtUEItUlciLCJTRC1QLVBHLVJXIiwiSE1TLVAtU0lERUJBUiIsIk1EQy1BUEktT0dQLVJXIiwiSE1TLVAtU1RBLVJXIiwiU0QtUC1HUEQtUiIsIkhNUy1QLURSTS1SVyIsIkhNUy1QLVJDTE4tUlciLCJITVMtQVBJLURMRC1SIiwiSE1TLVAtUktJVEQtUlciLCJITVMtUC1STUQtUlciLCJITVMtUC1QU0ctUlciLCJITVMtUC1TVC1SVyIsIk1EQy1BUEktQUdQLVJXIiwiSE1TLVAtUlNIRlQtUlciLCJTRC1QLUxCTi1SIiwiSE1TLVAtUlNIRlRELVJXIiwiSE1TLVAtQkxLRC1SVyIsIkhNUy1QLUhNU1BTLVJXIiwiU1QtUC1UREwtUiIsIkhNUy1QLUFETUQtUlciLCJTVC1BUEktQU1DLVJXIiwiTURDLVAtR0FQLVIiLCJTRC1QLUxHRS1SVyIsIlNELVItU01DIiwiSE1TLVAtQ0MtUlciLCJITVMtUC1SU0QtUlciLCJTVC1QLURFUy1SVyIsIlNELVAtR1BCLVIiLCJNREMtQVBJLVJUUy1SIiwiU1QtUi1IT0QiLCJITVMtUC1HUk5BLVJXIiwiU1QtQVBJLUJSRC1SVyIsIk1EQy1QLVJFRy1SIiwiSE1TLVAtQUlOLVJXIiwiTURDLUFQSS1QREMtUlciLCJITVMtUC1QRVItUlciLCJNREMtQVBJLUFULVIiLCJTRC1QLVNDLVIiLCJNREMtQVBJLUFULVJXIiwiSE1TLVAtUFJBLVJXIiwiTURDLVAtT1NCLVJXIiwiSE1TLVAtVk5ERC1SVyIsIkhNUy1QLUdSTkEiLCJTRC1QLVNTLVIiLCJITVMtUC1QSS1SVyIsIkhNUy1QLUJST09NLVJXIiwiSE1TLVAtUE9MLVIiLCJTVC1BUEktRU1QLVIiLCJTRC1QLVVQQi1SVyIsIlNULVAtQ01ULVIiLCJTVC1QLVRETC1SVyIsIkhNUy1QLU9TLVJXIiwiU1QtUC1CUkQtUiIsIk1EQy1QLUdQUC1SIiwiSE1TLVAtR0FETS1SVyIsIkhNUy1QLUFETUwtUlciLCJNREMtQVBJLUxCTi1SIiwiSE1TLUFQSS1EQVNIIiwiU0QtUC1QRi1SVyIsIlNELVAtR1NQLVIiLCJNREMtUC1BU00tUlciLCJITVMtUC1SQ0FURC1SVyIsIlNELVAtTFBJLVIiLCJTVC1QLUNNVC1SVyIsIkhNUy1QLUNUSUEtUlciLCJTRC1QLUxDQy1SVyIsIkhNUy1QLURCIiwiU0QtUC1MQkwtUlciLCJITVMtUC1BQS1SVyIsIkhNUy1QLVJFTlEtUlciLCJTRC1QLUJHLVJXIiwiSE1TLVAtQ1RJLVJXIiwiTURDLVAtR0FULVJXIiwiSE1TLVAtUFJMLVJXIiwiTURDLUFQSS1QQVQiLCJITVMtQVBJLVVISUQtUiIsIlNULVAtU05PLVJXIiwiU0QtQVBJLVNTLVJXIiwiU0QtUC1QT1YtUlciLCJTRC1QLUxUTS1SVyIsIlNELVAtQkEtUlciLCJITVMtUC1QUi1SVyIsIkhNUy1QLUJMSy1SVyIsIk1EQy1QLVBOUFItUiIsIk1EQy1BUEktUEFULVIiLCJITVMtUC1QQy1SVyIsIk1EQy1QLUdPUC1SIiwiTURDLUFQSS1HQVMtUiIsIkhNUy1QLU5TRC1SVyIsIkhNUy1QLU1SLVJXIiwiTURDLUFQSS1DR1AtUlciLCJITVMtUC1WTkQtUlciLCJTVC1QLU5URi1SVyIsIkhNUy1QLVJLSVQtUlciLCJITVMtQVBJLVZNIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaG9zcGl0YWxfY29kZSI6IlNIMDAxIiwiaG1zX3BhZ2VzIjpbMTI4LDEsMiw1LDYsMTMzLDEzNCw5LDEwLDEzNSwxMzcsMTM2LDE0LDE1LDE2LDE3LDEzOCwyNiwyNywyOCwyOSwzMCwzMSw0NCw1MCw1MSw1Miw1NSw1OCw1OSwxMDIsMTE1LDExNiwxMTcsMTE4LDEyMCwxMjEsMTIyLDEyMywxMjddLCJhbGxvd2VkLW91dGxldHMiOlsiT0xFVDAwMyIsIk9MRVQwMDEiLCJPTEVUMDAyIl0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzg0MDAwMzk0LCJleHAiOjE3ODQwODczOTR9.cyi_IkiPUfwfKfpB9_p3Q4JSN9tqyCdyGXxzIJOvQIIV38W_WNKlGR6tJaPfQWPWgF18OBUwqLgM3Jcb5ITZJ8fbnsscgE1Rs1wF3k1WQADWgDJ-y5r-XJGlY4lJbkh7rfWtOqrvK9556gl8mrcvbkEzhpdbdLVq5uBjOQzdMTwLpqYsBmXEEe3QyhC6kIgM4zECLtCMghRupuOQnf3wepfKWoJJGC_8SQQblfP4oYDd3X3Zw8Z56LN__ymyrii4JBpoI0HE4XvB_YCNU9I09__hPUq1MVxE1U3pRnteK2r1D9_T53D2fDS1buh-OnVcjTxK0R_TSHiZD42yj2mjZA";
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
