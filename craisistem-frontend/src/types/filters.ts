export type TLoanFilters = {
  date?: Date;
  dateFrom?: Date;
  dateTo?: Date;
  userId?: string;
  hasCharge?: boolean;
  hasRelease?: boolean;
  chargeLibrarianId?: string;
  chargeTimeFrom?: string;
  chargeTimeTo?: string;
  releaseLibrarianId?: string;
  releaseTimeFrom?: string;
  releaseTimeTo?: string;
  order?: string;
  deviceId?: string;
  lockerId?: string;
  page?: number;
  limit?: number;
};

export type TDeviceLoanFilters = Omit<TLoanFilters, "lockerId">
export type TLockerLoanFilters = Omit<TLoanFilters, "deviceId">

export type TCheckinFilters = Partial<{
  date: Date,
  dateFrom: Date,
  dateTo: Date,
  userId: string,
  timeFrom: string,
  timeTo: string
}>

export type TUserFilters = Partial<{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  faculty: string;
  state: string;
  order: string;
}>;

export type TDeviceFilters = Partial<{
  id: number,
  brand: string,
  state: string,
  section: string,
  model: string,
  inventory: string,
  operatingSystem: "windows" | "linux" | "mac";
  page: number,
  limit: number
}>

export type TWifiUserFilters = Partial<{
  userId: string;
  librarianId: string;
  wifiUserId: string;
  creationDate: string;
  expirationDate: string;
}>

export interface FilterConfigItem {
  label: string;
  type: "text" | "number" | "date" | "boolean" | "time" | "select"; 
  options?: { label: string; value: string | number }[];
}

export type TFilterConfig<T> = Partial<Record<keyof T, FilterConfigItem>>;