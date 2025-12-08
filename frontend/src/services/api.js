import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
  updateProfile: (data) => api.put("/auth/updateprofile", data),
  changePassword: (data) => api.put("/auth/changepassword", data),
  forgotPassword: (email) => api.post("/auth/forgotpassword", { email }),
  resetPassword: (data) => api.post("/auth/resetpassword", data),
};

// Quote APIs
export const quoteAPI = {
  create: (data) => api.post("/quotes", data),
  track: (quoteId) => api.get(`/quotes/track/${quoteId}`),
  getMyQuotes: () => api.get("/users/quotes"),
  getQuoteDetail: (id) => api.get(`/users/quotes/${id}`),
  cancelQuote: (id) => api.put(`/users/quotes/${id}/cancel`),
  acceptQuote: (id) => api.put(`/users/quotes/${id}/accept`),
};

// Enquiry APIs
export const enquiryAPI = {
  create: (data) => api.post("/enquiries", data),
  getMyEnquiries: () => api.get("/users/enquiries"),
};

// Contact APIs
export const contactAPI = {
  create: (data) => api.post("/contacts", data),
};

// User Dashboard APIs
export const userAPI = {
  getDashboard: () => api.get("/users/dashboard"),
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getUsers: (params) => api.get("/admin/users", { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  createAdmin: (data) => api.post("/admin/create-admin", data),
  getAllQuotes: (params) => api.get("/quotes", { params }),
  updateQuote: (id, data) => api.put(`/quotes/${id}`, data),
  deleteQuote: (id) => api.delete(`/quotes/${id}`),
  getAllEnquiries: (params) => api.get("/enquiries", { params }),
  updateEnquiry: (id, data) => api.put(`/enquiries/${id}`, data),
  deleteEnquiry: (id) => api.delete(`/enquiries/${id}`),
  getAllContacts: (params) => api.get("/contacts", { params }),
  replyContact: (id, reply) => api.put(`/contacts/${id}/reply`, { reply }),
  deleteContact: (id) => api.delete(`/contacts/${id}`),
};

export default api;
