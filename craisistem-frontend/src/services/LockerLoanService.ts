import api from "../config/axios"
import type { TLoanFilters } from "../types/filters"
import type { IChargeLoanPayload, TLockerLoanResponse } from "../types/loan"
import type { TPaginatedResponse } from "../types/pagination"

export const getLockerLoanService = async (
  params: TLoanFilters
): Promise<TPaginatedResponse<TLockerLoanResponse>> => {
  try {
    const { data } = await api.get<TPaginatedResponse<TLockerLoanResponse>>("/locker-loan", {
      params
    })    
    console.log(data)
    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const chargeLockerLoanService = async (
  chargeLoanPayload: IChargeLoanPayload
) => {
  try {
    const { data } = await api.post("/locker-loan/charge", chargeLoanPayload);
    return data;
  } catch (err) {
    console.error("Error charge", err)
    throw err
  }
}

export const releaseLockerLoanService = async (id: string) => {
  try {
    const { data } = await api.post(`/locker-loan/release/${id}`)
    return data    
  } catch (err) {
    console.error("Error release", err)
    throw err
  }
}

export const getActiveLockerLoansService = async () => {
  try {
    const { data } = await api.get<TPaginatedResponse<TLockerLoanResponse>>("/locker-loan", {
      params: {
        hasLocker: true,
        hasCharge: true,
        hasRelease: false
      }
    })

    return data;
  } catch (err) {
    console.error("Error", err)
    throw err
  }
}