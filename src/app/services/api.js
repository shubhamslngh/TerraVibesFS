import axios from "axios";

// Create the axios instance
const api = axios.create({
    baseURL: "${process.env.NEXT_PUBLIC_API_URL}/api/",
});

// Helper to set the auth token on all requests
export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Token ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
}

// Existing endpoints
export const getPackages = () => api.get("packages/");
export const submitInquiry = (data) => api.post("inquiries/", data);
export const submitBooking = (data) => api.post("bookings/", data);
export const getBookings = () => api.get("bookings/");
// New auth endpoints
export const registerUser = (data) =>
    api.post("auth/register/", data);

export const loginUser = (data) =>
    api.post("auth/login/", data).then((res) => {
        const { token } = res.data;
        setAuthToken(token);     // Automatically send token on future calls
        return res;
    });

export default api;
