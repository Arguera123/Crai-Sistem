import api from "../config/axios"
import type { TCheckinResponse, TPostCheckinResponse } from "../types/checkin"
import type { TCheckinFilters } from "../types/filters"
import type { TPaginatedResponse } from "../types/pagination"

export const postCheckinService = async (
  userId: string
): Promise<TPostCheckinResponse> => {
  try {
    const { data } = await api.post<TPostCheckinResponse>(`/checkin/${userId}`)    
    
    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const getCheckinService = async (
  filters: TCheckinFilters
): Promise<TPaginatedResponse<TCheckinResponse>> => {
  try {
    const { data } = await api.get<TPaginatedResponse<TCheckinResponse>>("/checkin", { 
      params: filters  
    })    
    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}