// api.js
import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:9800", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// GET request
export const get = async (path, params = {}) => {
  try {
    const response = await api.get(path, params);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// POST request
export const post = async (path, payload = {}) => {
  try {
    const response = await api.post(path, payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// PUT request
export const put = async (path, payload = {}) => {
  try {
    const response = await api.put(path, payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// DELETE request
export const del = async (path, payload = {}) => {
  try {
    const response = await api.delete(path, { data: payload });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Centralized error handler
const handleError = (error) => {
  if (error.response) {
    console.error("API Error:", error.response.data);
    throw error.response.data;
  } else if (error.request) {
    console.error("No response from server:", error.request);
    throw new Error("No response from server");
  } else {
    console.error("Error:", error.message);
    throw new Error(error.message);
  }
};
