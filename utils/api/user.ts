import { apiRequest } from "./base/api";

const BASE_URL = "/api/user";

export const userApi = {
  getAllUsers: () => apiRequest(BASE_URL, "GET"),
};
