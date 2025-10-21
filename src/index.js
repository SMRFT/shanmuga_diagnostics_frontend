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
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg2NyIsImVtYWlsIjoiUGFydGhpcGFuMzEyMTQ2MUBnbWFpbC5jb20iLCJuYW1lIjoiTS5QYXJ0aGliYW4iLCJhbGxvd2VkLWFjdGlvbnMiOlsiRVItUC1FUkRTSC1SIiwiU0QtUC1UTS1SIiwiU0QtUC1CRy1SVyIsIlNULVAtQ01ULVJXIiwiU0QtQVBJLUJURC1SVyIsIlNELVAtVVBCLVJXIiwiR0wtUC1QLVJXIiwiR0wtUC1FQlQtUlciLCJTVC1QLUNNVC1SIiwiU0QtUC1TUy1SIiwiU1QtUC1CUkQtUiIsIlNELUFQSS1SQi1SIiwiU0QtUC1MUEktUiIsIlNELVAtUEItUlciLCJTVC1QLVRETC1SVyIsIlNELVAtUEctUlciLCJFUi1SLUVSQSIsIlNULVAtREVTLVJXIiwiU1QtUi1BIiwiU0hJLVAtVFJBSU4tUlciLCJTRC1QLVBGLVJXIiwiR0wtUC1FQUQtUlciLCJHTC1QLUFORC1SVyIsIkVSLVAtRVJSLVJXIiwiR0wtUC1FUC1SVyIsIlNULVAtREVTLVIiLCJHTC1QLUVMLVJXIiwiU1QtQVBJLUVNUC1SIiwiU1QtUC1OVEYtUlciLCJTRC1SLVNNQyIsIlNISS1QLUlOQyIsIkdMLVAtTkRDLVJXIiwiU0QtUC1HUEItUiIsIlNELVAtU0MtUiIsIlNELUFQSS1DTi1SIiwiU0QtUC1HUEQtUiIsIlNULVAtVERMLVIiLCJHTC1QLUVELVJXIiwiU0QtUC1SQi1SVyIsIlNULUFQSS1DUkQtUlciLCJTVC1QLU5URi1SIiwiU0QtQVBJLVNTLVJXIiwiU0hJLVAtRVhQLVJXIiwiU1QtQVBJLUJSRC1SVyIsIlNELVAtTEJOLVIiLCJTRC1QLVNQLVIiLCJTRC1QLVNTLVJXIiwiU1QtQVBJLUFNQy1SVyIsIlNULVAtU05PLVJXIiwiR0wtUC1SU0UtUlciLCJTRC1BUEktVEQtUiJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzYxMDE4NjEzLCJleHAiOjE3NjExMDU2MTMsImp0aSI6IjNkNWRkMWM3LTAwMDktNGJiNi1hNDc3LTBhZWExNTRmNmYzMyJ9.HrhrHqVXWegTfVPoOvdc7eXcLu_rtXIIsRrFum3VxWcqvQutwh0-IH1txVc6UPNJXlfshL49PiVgpk9i2uWBRuoHABIsEDBrc_fS8OaTItVSIY_xlX4tnJpJakoKzmD-5uZuCZ0AUtNolhVwij9AU1Ce6LEXlSpEdLM4ZnuIjoQjRAOS9Mc-Nob8c0tFO1sZHaSjAhgVecCfJorXuCGJqmF67o4Xr8Ej9Ld2nvGdICvjVLoRHWabToeqzFy9JTwoI6Dgb4PjvM0XuSvEqJ5936ef33jRqnq8hyUB0nYsjJwaHLz2bBcaXNVIop37clRFSE8ZqHFrJC_j33c9BKJbmQ"; 
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
