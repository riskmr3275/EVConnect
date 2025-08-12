import axios from "axios";

export const axiosInstance = axios.create({
  timeout: 10000,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Remove quotes if token is stored as JSON string
      const cleanToken = token.replace(/"/g, '');
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiConnector = async (
  method,
  url,
  bodyData = null,
  headers = {},
  params = {}
) => {
  try {
    // Debug logging
    console.log('🔍 API Call Debug:', {
      method,
      url,
      bodyData,
      headers,
      params,
      urlType: typeof url,
      urlValue: url
    });

    // Validate URL
    if (!url || typeof url !== 'string') {
      throw new Error(`Invalid URL provided: ${url} (type: ${typeof url})`);
    }

    const response = await axiosInstance({
      method: method,
      url: url,
      data: bodyData,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      params: params,
    });
    console.log('✅ API Response:', response);
    return response;
  } catch (error) {
    console.error("❌ API call error:", error);
    console.error("❌ Error details:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: url
    });
    throw error; // Re-throw the error to handle it in the calling function
  }
};