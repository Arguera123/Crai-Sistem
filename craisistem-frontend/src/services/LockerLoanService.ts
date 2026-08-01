import api from "../config/axios"
import type { TLoanFilters } from "../types/filters"
import type { IChargeLoanPayload, TLockerLoanResponse } from "../types/loan"
import type { TPaginatedResponse } from "../types/pagination";

const loanLocker = "/loan-locker";

export const getLockerLoanService = async (
  params: TLoanFilters
): Promise<TPaginatedResponse<TLockerLoanResponse>> => {
  const { data } = await api.get<TPaginatedResponse<TLockerLoanResponse>>(loanLocker, {
    params
  })

  return data
}

export const chargeLockerLoanService = async (
  chargeLoanPayload: IChargeLoanPayload
) => {
  const { data } = await api.post(`${loanLocker}/charge`, chargeLoanPayload);
  return data;
}

export const releaseLockerLoanService = async (id: string) => {
  const { data } = await api.post(`${loanLocker}/release/${id}`)
  return data
}

export const getActiveLockerLoansService = async () => {
  const { data } = await api.get<TPaginatedResponse<TLockerLoanResponse>>(loanLocker, {
    params: {
      hasLocker: true,
      hasCharge: true,
      hasRelease: false
    }
  })

  return data;
}