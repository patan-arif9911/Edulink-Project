import httpClient from "./httpClient";
import Endpoints from "../config/endpoints";

const notificationApi = {
  sendNotification: (payload) =>
    httpClient.post(Endpoints.notification.send, payload),

  scheduleNotification: (payload) =>
    httpClient.post(Endpoints.notification.schedule, payload),

  fetchInbox: () =>
    httpClient.get(Endpoints.notification.inbox),

  markAsRead: (notifId) =>
    httpClient.put(Endpoints.notification.markRead(notifId)),
};

export default notificationApi;
