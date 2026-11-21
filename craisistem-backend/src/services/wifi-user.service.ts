import createHttpError from 'http-errors';
import { CsvReader } from '../utils/csv.reader'; // ajusta según tu estructura
import { WifiUser } from '../models/wifi-user.entity'; // ajusta la ruta
import { WifiUserRepository } from '../repository/wifi-user.repository'; // ajusta la ruta
import { UserData } from '../models/user.entity';
import { WifiAssignmentRepository } from '../repository/wifi-assignment.repository';
import { UserRepository } from '../repository/user.repository';
import { WifiAssignment } from '../models/wifi-assignment.entity';
import { TWifiUserResponse } from '../models/types/IWifiUser';
import { TWifiUserFilters } from '../models/types/ISearchFilters';
import { toWifiResponse } from '../mappers/toWifiResponse';

export class WifiUserService {
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

    if (!file) {
      throw createHttpError(400, "No se subio el archivo!");
    }

    const rows = await CsvReader.readAndDelete(file.path);

    const now = new Date();
    const currentYear = now.getFullYear();
    const expirationDate = new Date(currentYear, 11, 31);

    const validRows = rows.filter((row) => row?.id && row?.password && String(row.id).trim().length <= 8);
    if (validRows.length === 0) {
      throw createHttpError(400, "El CSV debe tener las columnas 'id' y 'password' con al menos una fila valida");
    }

    const users: WifiUser[] = validRows.map((row) => {
      const user = new WifiUser();
      user.id = String(row.id).trim();
      user.password = String(row.password).trim();
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
      skipped: skipped + (rows.length - validRows.length),
      total: rows.length,
      users,
    };
  };

  public assignToUser = async (
    librarian: UserData,
    userId: string,
    wifiUserId: string
  ) => {
    const user: UserData = await this.userRepository.findById(userId)
    if(!user) throw createHttpError(404, "Usuario no encontrado!")

    const wifiUser: WifiUser = await this.wifiUserRepository.findById(wifiUserId)
    if(!wifiUser) throw createHttpError(404, "Usuario wifi no encontrado!")

    const existingWifiUsersAssignments: WifiAssignment[] = await this.wifiAssignmentRepository.findByWifiUserId(wifiUser)

    if(existingWifiUsersAssignments.length >= 3) throw createHttpError(409, 'Demasiados usuarios asignados a este usuario wifi!')

    const existingUserAssignments: WifiAssignment[] = (await this.wifiAssignmentRepository.findByUserId(user))
      .filter(_a => new Date(_a.wifiUser.expirationDate).getTime() > Date.now())

    if(existingUserAssignments.length > 0) throw createHttpError(409, 'Este usuario ya tiene un usuario wifi asignado!')
    
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
      pagination: {
        total,
        limit,
        page,
        totalPages: Math.ceil(total/limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1
      }
    }
  }

  public delete = async (userId: string, wifiUserId: string) => {
    const user: UserData = await this.userRepository.findById(userId)
    if (!user) throw createHttpError(404, 'User not found')
    const wifiUser: WifiUser = await this.wifiUserRepository.findById(wifiUserId)
    if (!wifiUser) throw createHttpError(404, 'Wifi user not found')

    const assigment = await this.wifiAssignmentRepository.findByWifiUserId(wifiUser)
    if (!assigment) throw createHttpError(404,)

  }
}
