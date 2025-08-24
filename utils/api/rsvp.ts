import { apiRequest } from "./base/api";

const BASE_URL = "/api/rsvp";

export const rsvpApi = {
  create: (data: {
    name: string;
    email: string;
    eventId: string;
    status: string;
  }) => apiRequest(BASE_URL, "POST", data),
};
