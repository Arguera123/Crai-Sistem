import api from "../config/axios";
import type { TWifiUserPayload } from "../types/wifiUser";

export const uploadWifiUsersCSV = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/wifi-user/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const assignWifiUser = async (wifiUserPayload: TWifiUserPayload) => {
  try {

    const { data } = await api.post("/wifi-user/assign", wifiUserPayload)

    return data;
  } catch (err) {
    console.error("Error charge", err)
  }
}