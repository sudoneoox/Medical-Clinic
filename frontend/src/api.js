import axios from "axios";

const INPRODUCTION = false;

let URL;
if (!INPRODUCTION) {
  URL = "http://localhost:5000";
} else {
  URL = "http://4.156.152.174:5000";
}

export const API = {
  URL,
};

const api = axios.create({
  baseURL: API.URL + "/api",
});

export default api;
