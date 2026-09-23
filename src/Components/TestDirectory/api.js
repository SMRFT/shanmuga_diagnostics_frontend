import axios from "axios";

// Base URL resolution from environment variable or standard backend path
const getBaseUrl = () => {
  const envUrl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  if (envUrl) {
    return envUrl.endsWith("/") ? envUrl : `${envUrl}/`;
  }
  return "http://127.0.0.1:2106/_b_a_c_k_e_n_d/LIS/";
};

export const BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

/**
 * Fetch list of diagnostic tests with optional search and filter parameters
 */
export const getTestDirectoryList = async (params = {}) => {
  try {
    const response = await api.get("test-directory/", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching test directory:", error);
    throw error;
  }
};

/**
 * Get summary statistics for test directory
 */
export const getTestDirectoryStats = async () => {
  try {
    const response = await api.get("test-directory/stats/");
    return response.data;
  } catch (error) {
    console.error("Error fetching test directory stats:", error);
    throw error;
  }
};

/**
 * Fetch all master tests from core_testdetails for dropdown selection
 */
export const getCoreTestOptions = async () => {
  try {
    const response = await api.get("test-directory/core-test-options/");
    return response.data;
  } catch (error) {
    console.error("Error fetching core test options:", error);
    throw error;
  }
};

/**
 * Get details for a specific test by ID
 */
export const getTestDirectoryDetail = async (testId) => {
  try {
    const response = await api.get(`test-directory/${testId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching test ${testId}:`, error);
    throw error;
  }
};

/**
 * Create a new test entry (supports multipart/form-data for file upload)
 */
export const createTestDirectoryEntry = async (formData) => {
  try {
    const response = await api.post("test-directory/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating test entry:", error);
    throw error;
  }
};

/**
 * Update an existing test entry
 */
export const updateTestDirectoryEntry = async (testId, formData) => {
  try {
    const response = await api.put(`test-directory/${testId}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating test ${testId}:`, error);
    throw error;
  }
};

/**
 * Delete a test entry
 */
export const deleteTestDirectoryEntry = async (testId) => {
  try {
    const response = await api.delete(`test-directory/${testId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting test ${testId}:`, error);
    throw error;
  }
};

/**
 * Get the full URL to view / stream or download a sample report file
 */
export const getSampleReportUrl = (fileId, download = false) => {
  if (!fileId) return null;
  return `${BASE_URL}test-directory/sample-report/${fileId}/${download ? "?download=1" : ""}`;
};

export default api;
