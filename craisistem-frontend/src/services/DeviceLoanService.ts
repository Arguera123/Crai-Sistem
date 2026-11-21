import api from "../config/axios";
import type { IChargeLoanPayload, TDeviceLoanResponse } from "../types/loan";
import type { TPaginatedResponse } from "../types/pagination";
import type { TLoanFilters } from "../types/filters";

export const chargeDeviceLoanService = async (
  chargeLoanPayload: IChargeLoanPayload
) => {
  try {
    const { data } = await api.post("/device-loan/charge", chargeLoanPayload);
    return data;
  } catch (err) {
    console.error("Error charge", err)
    throw err
  }
}

export const releaseDeviceLoanService = async (id: string) => {
  try {
    const { data } = await api.post(`/device-loan/release/${id}`)
    return data    
  } catch (err) {
    console.error("Error release", err)
    throw err
  }
}

export const getActiveDeviceLoansService = async () => {
  try {
    const { data } = await api.get<TPaginatedResponse<TDeviceLoanResponse>>("/device-loan", {
      params: {
        hasCharge: true,
        hasRelease: false,
        limit: 200
      }
    })

    return data;
  } catch (err) {
    console.error("Error", err)
    throw err
  }
}

export const getDeviceLoanService = async (
  params: TLoanFilters
): Promise<TPaginatedResponse<TDeviceLoanResponse>> => {
  try {
    const { data } = await api.get<TPaginatedResponse<TDeviceLoanResponse>>("/device-loan", {
      params
    })

    return data;
  } catch (err) {
    console.error("Error obteniendo prestamos de dispositivos", err)
    throw err
  }
}