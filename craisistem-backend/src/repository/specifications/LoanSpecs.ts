import { SelectQueryBuilder } from "typeorm";
import { Loan } from "../../models/loan.entity";

export const LoanSpecs = {
  byDate: (date?: string | Date) => (query: SelectQueryBuilder<Loan>) => {
    if (!date) return;
    query.andWhere("loan.date = DATE(:date)", { date });
  },

  byDateFrom:
    (dateFrom?: string | Date) => (query: SelectQueryBuilder<Loan>) => {
      if (!dateFrom) return;
      query.andWhere("loan.date >= DATE(:dateFrom)", { dateFrom });
    },

  byDateTo:
    (dateTo?: string | Date) => (query: SelectQueryBuilder<Loan>) => {
      if (!dateTo) return;
      query.andWhere("loan.date <= DATE(:dateTo)", { dateTo });
    },

  byUserId: (userId?: string) => (query: SelectQueryBuilder<Loan>) => {
    if (userId) query.andWhere("user.id = :userId", { userId });
  },

  byDeviceId:
    (deviceId?: string) => (query: SelectQueryBuilder<Loan>) => {
      if (deviceId) query.andWhere("device.id = :deviceId", { deviceId });
    },

  byLockerId:
    (lockerId?: string) => (query: SelectQueryBuilder<Loan>) => {
      if (lockerId) query.andWhere("locker.id = :lockerId", { lockerId });
    },

  byHasDevice:
    (hasDevice?: boolean) => (query: SelectQueryBuilder<Loan>) => {
      if (hasDevice === undefined) return;
      query.andWhere(
        hasDevice
          ? "loanDevice.deviceId IS NOT NULL"
          : "loanDevice.deviceId IS NULL"
      )
    },

  byHasLocker:
    (hasLocker?: boolean) => (query: SelectQueryBuilder<Loan>) => {
      if (hasLocker === undefined) return;
      query.andWhere(
        hasLocker
          ? "loanLocker.lockerId IS NOT NULL"
          : "loanLocker.lockerId IS NULL"
      )
    },

  byHasCharge:
    (hasCharge?: boolean) => (query: SelectQueryBuilder<Loan>) => {
      if (hasCharge === undefined) return;
      query.andWhere(
        hasCharge
          ? "charge.loanId IS NOT NULL"
          : "charge.loanId IS NULL"
      );
    },

  byHasRelease:
    (hasRelease?: boolean) => (query: SelectQueryBuilder<Loan>) => {
      if (hasRelease === undefined) return;
      query.andWhere(
        hasRelease
          ? "release.loanId IS NOT NULL"
          : "release.loanId IS NULL"
      );
    },

  byChargeLibrarian:
    (chargeLibrarianId?: string) => (query: SelectQueryBuilder<Loan>) => {
      if (chargeLibrarianId)
        query.andWhere("charge.librarianId = :chargeLibrarianId", {
          chargeLibrarianId,
        });
    },

  byChargeTimeFrom:
    (chargeTimeFrom?: string) => (query: SelectQueryBuilder<Loan>) => {
      if (chargeTimeFrom)
        query.andWhere("charge.startTime >= :chargeTimeFrom", {
          chargeTimeFrom,
        });
    },

  byChargeTimeTo:
    (chargeTimeTo?: string) => (query: SelectQueryBuilder<Loan>) => {
      if (chargeTimeTo)
        query.andWhere("charge.startTime <= :chargeTimeTo", {
          chargeTimeTo,
        });
    },

  byReleaseLibrarian:
    (releaseLibrarianId?: string) =>
    (query: SelectQueryBuilder<Loan>) => {
      if (releaseLibrarianId)
        query.andWhere("release.librarianId = :releaseLibrarianId", {
          releaseLibrarianId,
        });
    },

  byReleaseTimeFrom:
    (releaseTimeFrom?: string) => (query: SelectQueryBuilder<Loan>) => {
      if (releaseTimeFrom)
        query.andWhere("release.endTime >= :releaseTimeFrom", {
          releaseTimeFrom,
        });
    },

  byReleaseTimeTo:
    (releaseTimeTo?: string) => (query: SelectQueryBuilder<Loan>) => {
      if (releaseTimeTo)
        query.andWhere("release.endTime <= :releaseTimeTo", {
          releaseTimeTo,
        });
    },

  byOrder: 
    (order?: string) => (query: SelectQueryBuilder<Loan>) => {
      if (!order) return;

      const direction = order.startsWith("-") ? "DESC" : "ASC";
      const field = order.replace("-", "");

      const orderMap: Record<string, string> = {
        date: "loan.date",
        user: "user.lastName",
        device: "device.id",
        locker: "locker.id",
        chargeTime: "charge.startTime",
        releaseTime: "release.endTime"
      };

      const column = orderMap[field];
      if (!column) return;

      query.orderBy(column, direction);
    }
};