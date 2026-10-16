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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOiJBQUFBQUFJQUJCaUFFQUFmeUdBQUFBQUFBZnQxKzV1TjhBQUFXTU42N1pKRisvYzI0SUFBQUFBQUFBQmRIQnQvd0FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUE9IiwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwMSJdLCJob3NwaXRhbF9jb2RlIjoiU0gwMDEiLCJobXNfcGFnZXMiOlsyLDU1LDYsNSwxMCwxNSw1OCw1OSwxNCwxMjIsMTIzLDE2LDE3LDEyMCwxMjEsMTMzLDEzNCwxMzUsMTAyLDExMywxMTQsMTM2LDExNSwxMTYsMTE3LDExOCwyNiw1MCwyNyw1Miw1MSwyOCwyOSwzMSwxMzAsMzAsNDQsNDMsMTAxLDEyNywxMjgsMTM3LDEzOCw3LDE0NSw0LDE3Ml0sImFsbG93ZWQtb3V0bGV0cyI6WyJPTEVUMDAzIiwiT0xFVDAwMSIsIk9MRVQwMDIiXSwiY3J5cHQiOiJwcm9kOmJpdF9tYXA6OjVhMDlhOWZiNDIzMTE2MmU4NmFlNGQ5M2Y3ZTc4MGIyYWQzN2EzNGRiMDU2NDMyYTkyYzE1NWZkMDZjZTcyMzUiLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc5MjEzMTYzNCwiZXhwIjoxNzkyMjE4NjM0fQ.SuLg5vB7O9fybgysyGrkAuT80eWPLc8OgROlwPvIpEpaVkC9ijdXOYRLHv26Nqhbf-Cmh4-rymoIPfG0VstUu4vDbEXkTk6lxHEG5TnnBP_JMNG1ecfQzkOcrwan8fiyyiHXwv_JOFmfFpir9ougUo5sCpIiRED-UMWHK9zxZCoOyGruAe18RZagSV6mkgyiOWPOXqHLZ2yfsUpyCD36kRLtCV2Mykn5ZNdSEhEGkRgq_j3bOvNa2Aeq5yqwC2wBnSaV1olAD1poW4c9RY2NrnhQL5ZaQtjROp1TdFTlzNhUuHQQjq1Cd-4dSfDJ68dVn2033n0AwBz49Gl3lMFxpQ";
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
