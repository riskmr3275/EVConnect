import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = async (
  method,
  url,
  bodyData = null,
  headers = {},
  params = {}
) => {
  try {
    const response = await axiosInstance({
      method: method,
      url: url,
      data: bodyData,
      headers: headers,
      params: params,
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error("API call error:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};