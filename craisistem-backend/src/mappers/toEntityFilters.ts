import { TDeviceFilters } from "../models/types/IDevice";
import { TLoanFilters, TCheckinFilters, TDeviceLoanFilters, TLockerLoanFilters, TUserFilters, TWifiUserFilters } from "../models/types/ISearchFilters";

export const mapLoanFilters = (query: any): TLoanFilters => ({
  date: query.date ? new Date(query.date) : undefined,
  dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
  dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
  userId: query.userId || undefined,
  hasCharge: query.hasCharge !== undefined ? query.hasCharge === "true" : undefined,
  hasRelease: query.hasRelease !== undefined ? query.hasRelease === "true" : undefined,
  chargeLibrarianId: query.chargeLibrarianId || undefined,
  chargeTimeFrom: query.chargeTimeFrom || undefined,
  chargeTimeTo: query.chargeTimeTo || undefined,
  releaseLibrarianId: query.releaseLibrarianId || undefined,
  releaseTimeFrom: query.releaseTimeFrom || undefined,
  releaseTimeTo: query.releaseTimeTo || undefined,
  order: query.order || "-date",
  deviceId: query.deviceId || undefined,
  lockerId: query.lockerId || undefined
});

export const mapCheckinFilters = (query: any): TCheckinFilters => ({
  date: query.date ? new Date(query.date) : undefined,
  dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
  dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
  timeFrom: query.timeFrom || undefined,
  timeTo: query.timeTo || undefined,
  userId: query.userId || undefined
})

export const mapUserFilters = (query: any): TUserFilters => ({
  id: query.id || undefined,
  firstName: query.firstName || undefined,
  lastName: query.lastName || undefined,
  email: query.email || undefined,
  type: query.type || undefined,
  faculty: query.faculty || undefined,
  state: query.state || undefined,
  order: query.order || undefined
})

export const mapDeviceFilters = (query: any): TDeviceFilters => ({
  id: query.id || undefined,
  brand: query.brand || undefined,
  state: query.state || undefined,
  inventory: query.inventory || undefined,
  model: query.model || undefined,
  operatingSystem: query.operatingSystem || undefined,
  section: query.section || undefined,
  order: query.order || "id",
})

export const mapWifiUserFilters = (query: any): TWifiUserFilters => ({
  userId: query.userId || undefined,
  librarianId: query.librarianId || undefined,
  wifiUserId: query.wifiUserId || undefined,
  creationDate: query.creationDate || undefined,
  expirationDate: query.expirationDate || undefined
})