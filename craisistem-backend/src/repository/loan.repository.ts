import { IsNull, Not, Repository } from "typeorm";
import PostgresDataSource from "../config/db.config";
import { Loan } from "../models/loan.entity";
import { ILoanRepository } from "./interfaces/loan-repository.interface";
import { TLoanFilters } from "../models/types/ISearchFilters";
import { SpecificationBuilder } from "./specifications/SpecificationBuilder";
import { LoanSpecs } from "./specifications/LoanSpecs";

export class LoanRepository implements ILoanRepository {
  private repo: Repository<Loan>;

  constructor() {
    this.repo = PostgresDataSource.getRepository(Loan);
  }

  public save = async (loan: Loan): Promise<Loan> => {
    return await this.repo.save(loan);
  };

  public findDeviceLoans = async (
    filters: TLoanFilters,
    page?: number,
    limit?: number,
  ): Promise<{ data: Loan[]; total: number }> => {
    const { query, builder } = this.buildBaseLoanQuery(filters);

    query
      .leftJoinAndSelect("loan.loanDevice", "loanDevice")
      .leftJoinAndSelect("loanDevice.device", "device");

    builder
      .add(LoanSpecs.byHasDevice(true))
      .add(LoanSpecs.byDeviceId(filters.deviceId));

    builder.build(query);

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total };
  };

  public findLockerLoans = async (
    filters: TLoanFilters,
    page?: number,
    limit?: number,
  ): Promise<{ data: Loan[]; total: number }> => {
    const { query, builder } = this.buildBaseLoanQuery(filters);

    query
      .leftJoinAndSelect("loan.loanLocker", "loanLocker")
      .leftJoinAndSelect("loanLocker.locker", "locker");

    builder
      .add(LoanSpecs.byHasLocker(true))
      .add(LoanSpecs.byLockerId(filters.lockerId));

    builder.build(query);

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total };
  };

  public findById = async (id: string): Promise<Loan> => {
    return await this.repo.findOne({
      where: { id },
      relations: [
        "user",
        "loanLocker",
        "loanLocker.locker",
        "loanDevice",
        "loanDevice.device",
        "charge",
        "charge.librarian",
        "release",
        "release.librarian",
      ],
    });
  };

  public findActiveLoans = async () => {
    const today = new Date().toISOString().split("T")[0];
    return await this.repo.find({
      where: {
        release: false,
        date: today as unknown as Date,
      },
      relations: ["user"],
    });
  };

  private buildBaseLoanQuery(filters: TLoanFilters) {
    const query = this.repo
      .createQueryBuilder("loan")
      .leftJoinAndSelect("loan.user", "user")
      .leftJoinAndSelect("loan.charge", "charge")
      .leftJoinAndSelect("charge.librarian", "chargeLibrarian")
      .leftJoinAndSelect("loan.release", "release")
      .leftJoinAndSelect("release.librarian", "releaseLibrarian");

    const builder = new SpecificationBuilder<Loan>();

    builder
      .add(LoanSpecs.byDate(filters.date))
      .add(LoanSpecs.byDateFrom(filters.dateFrom))
      .add(LoanSpecs.byDateTo(filters.dateTo))
      .add(LoanSpecs.byUserId(filters.userId))
      .add(LoanSpecs.byHasCharge(filters.hasCharge))
      .add(LoanSpecs.byHasRelease(filters.hasRelease))
      .add(LoanSpecs.byChargeLibrarian(filters.chargeLibrarianId))
      .add(LoanSpecs.byReleaseLibrarian(filters.releaseLibrarianId))
      .add(LoanSpecs.byChargeTimeFrom(filters.chargeTimeFrom))
      .add(LoanSpecs.byChargeTimeTo(filters.chargeTimeTo))
      .add(LoanSpecs.byReleaseTimeFrom(filters.releaseTimeFrom))
      .add(LoanSpecs.byReleaseTimeTo(filters.releaseTimeTo))
      .add(LoanSpecs.byOrder(filters.order));

    return { query, builder };
  }

  public findActiveDeviceLoansByUser = async (
    userId: string,
  ): Promise<Loan[]> => {
    const loans = await this.repo.find({
      where: {
        user: { id: userId },
        loanDevice: { loanId: Not(IsNull()) },
      },
      relations: ["user", "loanDevice", "loanDevice.device", "release"],
    });
    return loans.filter((loan) => !loan.release);
  };

  public findActiveLockerLoansByUser = async (
    userId: string,
  ): Promise<Loan[]> => {
    const loans = await this.repo.find({
      where: {
        user: { id: userId },
        loanLocker: { loanId: Not(IsNull()) },
      },
      relations: ["user", "loanLocker", "loanLocker.locker", "release"],
    });
    return loans.filter((loan) => !loan.release);
  };
}
