import api from "../config/axios";
import type { IChargeLoanPayload, TDeviceLoanResponse } from "../types/loan";
import type { TPaginatedResponse } from "../types/pagination";
import type { TLoanFilters } from "../types/filters";

const deviceLoan = "/loan-device"

export const chargeDeviceLoanService = async (
  chargeLoanPayload: IChargeLoanPayload
) => {
  const { data } = await api.post(`${deviceLoan}/charge`, chargeLoanPayload);
  return data;
}

export const releaseDeviceLoanService = async (id: string) => {
  const { data } = await api.post(`${deviceLoan}/release/${id}`)
  return data
}

export const getActiveDeviceLoansService = async () => {
  const { data } = await api.get<TPaginatedResponse<TDeviceLoanResponse>>(deviceLoan, {
    params: {
      hasDevice: true,
      hasCharge: true,
      hasRelease: false
    }
  })

  return data;
}

export const getDeviceLoanService = async (
  params: TLoanFilters
): Promise<TPaginatedResponse<TDeviceLoanResponse>> => {
  const { data } = await api.get<TPaginatedResponse<TDeviceLoanResponse>>(deviceLoan, {
    params
  })

  return data;
}