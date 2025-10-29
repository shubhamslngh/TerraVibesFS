import axios from "axios";

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/`,
});

export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Token ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
}

export const getBlogs = () => api.get("content/?content_type=blog");

export const getBlogBySlug = (slug) =>
    api.get(`content/?content_type=blog&slug=${slug}`);

export const getPackages = () => api.get("packages/");
export const submitInquiry = (data) => api.post("inquiries/", data);
export const submitBooking = (data) => api.post("bookings/", data);
export const getBookings = () => api.get("bookings/");
export const getGuides = () => api.get("guides/");

// Auth endpoints
export const registerUser = (data) => api.post("auth/register/", data);

export const loginUser = (data) =>
    api.post("auth/login/", data).then((res) => {
        const { token } = res.data;
        setAuthToken(token); // Automatically send token on future calls
        return res;
    });

export default api;
