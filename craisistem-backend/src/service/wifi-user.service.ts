import { CsvReader } from '../utils/csv.reader';
import { WifiUser } from '../models/wifi-user.entity'; 
import { WifiUserRepository } from '../repository/wifi-user.repository';
import { UserData } from '../models/user.entity';
import { WifiAssignmentRepository } from '../repository/wifi-assignment.repository';
import { UserRepository } from '../repository/user.repository';
import { WifiAssignment } from '../models/wifi-assignment.entity';
import { TWifiUserFilters } from '../models/types/ISearchFilters';
import { toWifiResponse } from '../helper/toWifiResponse';
import { BadRequestError } from '../error/bad-request.error';
import { ErrorCodes } from '../error/errorCodes';
import { NotFoundError } from '../error/not-found.error';
import { ConflictError } from '../error/conflict.error';
import { IWifiUserService } from './interfaces/wifi-user-service.interface';
import { toPagination } from '../helper/toPagination';

export class WifiUserService implements IWifiUserService{
  constructor(
    private wifiUserRepository: WifiUserRepository,
    private wifiAssignmentRepository: WifiAssignmentRepository,
    private userRepository: UserRepository,
  ) {}

  public import = async (file: Express.Multer.File): Promise<{
    inserted: number;
    skipped: number;
    total: number;
    users: WifiUser[];
  }> => {
    if (!file) throw new BadRequestError(ErrorCodes.FILE.MISSING)
    const rows = await CsvReader.readAndDelete(file.path);
    const now = new Date();
    const currentYear = now.getFullYear();
    const expirationDate = new Date(currentYear, 11, 31);

    const users: WifiUser[] = rows.map((row) => {
      const user = new WifiUser();
      user.id = row.id;
      user.password = row.password;
      user.expirationDate = expirationDate;
      return user;
    });

    let inserted = 0;
    let skipped = 0;

    for (const user of users) {
      const exists = await this.wifiUserRepository.findById(user.id);
      if (!exists) {
        await this.wifiUserRepository.save(user);
        inserted++;
      } else {
        skipped++;
      }
    }

    return {
      inserted,
      skipped,
      total: users.length,
      users,
    };
  };

  public assignToUser = async (
    librarian: UserData,
    userId: string,
    wifiUserId: string
  ) => {
    const user: UserData = await this.userRepository.findById(userId)
    if(!user) throw new NotFoundError(ErrorCodes.USER.NOT_FOUND)

    const wifiUser: WifiUser = await this.wifiUserRepository.findById(wifiUserId)
    if(!wifiUser) throw new NotFoundError(ErrorCodes.WIFI_USER.NOT_FOUND)

    const existingWifiUsersAssignments: WifiAssignment[] = await this.wifiAssignmentRepository.findByWifiUserId(wifiUser)

    if(existingWifiUsersAssignments.length >= 3) throw new ConflictError(ErrorCodes.WIFI_USER.LIMIT_REACHED)

    const existingUserAssignments: WifiAssignment[] = (await this.wifiAssignmentRepository.findByUserId(user))
      .filter(_a => new Date(_a.wifiUser.expirationDate).getTime() > Date.now())

    if(existingUserAssignments.length > 0) throw new ConflictError(ErrorCodes.WIFI_USER.ALREADY_ASSIGNED)
    const wifiAssignment = new WifiAssignment
    wifiAssignment.librarian = librarian
    wifiAssignment.user = user
    wifiAssignment.wifiUser = wifiUser

    await this.wifiAssignmentRepository.save(wifiAssignment)
  }

  public find = async (
    filters: TWifiUserFilters,
    page: number = 1,
    limit: number =10
  ) => {
    const { data: wifiUsers, total } = await this.wifiUserRepository.find(filters, page, limit)

    const data = wifiUsers.map(toWifiResponse)

    return {
      data,
      pagination: toPagination(total, page, limit)
    }
  }

  public delete = async (userId: string, wifiUserId: string) => {
    const user: UserData = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundError(ErrorCodes.USER.NOT_FOUND);
    const wifiUser: WifiUser = await this.wifiUserRepository.findById(wifiUserId)
    if (!wifiUser) throw new NotFoundError(ErrorCodes.WIFI_USER.NOT_FOUND)

    const assigment = await this.wifiAssignmentRepository.findByWifiUserId(wifiUser)
    if (!assigment) throw new NotFoundError(ErrorCodes.WIFI_USER.ASSIGNMENT_NOT_FOUND)

  }
}
