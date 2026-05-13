import axios from "axios";

const API_URL = "http://localhost:5000/cars"; // apne backend ke route ke hisab se set karo

// Get all cars
export const getCars = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Add new car
export const addCar = async (carData) => {
  const res = await axios.post(API_URL, carData);
  return res.data;
};

// Update car
export const updateCar = async (id, carData) => {
  const res = await axios.put(`${API_URL}/${id}`, carData);
  return res.data;
};

// Delete car
export const deleteCar = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
