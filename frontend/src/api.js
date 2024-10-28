import axios from "axios";

let URL;
if (process.env.NODE_ENV !== "production") {
  URL = "http://localhost:5000";
} else {
  URL = "https://medical-clinic-uma-api.onrender.com";
}

export const API = {
  URL,
};

const api = axios.create({
  baseURL: API.URL + "/api",
});

export default api;
