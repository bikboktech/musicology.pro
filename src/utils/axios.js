import axios from "axios";

import { getCookie } from "cookies-next";

const axiosServices = axios.create();

// interceptor for http
axiosServices.interceptors.request.use(
  (request) => {
    const token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY);

    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  (error) =>
    Promise.reject((error.request && error.request.data) || "Wrong Services")
);

export default axiosServices;
