import axios from "axios";

import { getCookie } from "cookies-next";

const axiosServices = axios.create();

// interceptor for http
axiosServices.interceptors.request.use(
  (response) => {
    const token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY);
    if (token) {
      response.headers.Authorization = `Bearer ${token}`;
    }

    return response;
  },
  (error) =>
    Promise.reject((error.response && error.response.data) || "Wrong Services")
);

export default axiosServices;
