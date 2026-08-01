import { Repository } from "typeorm";
import PostgresDataSource from "../config/db.config";
import { WifiAssignment } from "../models/wifi-assignment.entity";
import { UserData } from "../models/user.entity";
import { WifiUser } from "../models/wifi-user.entity";

export class WifiAssignmentRepository {
  private repo: Repository<WifiAssignment>

  constructor() {
    this.repo = PostgresDataSource.getRepository(WifiAssignment)
  }

  public save = async (wifiAssignment: WifiAssignment) => {
    await this.repo.save(wifiAssignment)
  }

  public findByWifiUserId = async (wifiUser: WifiUser): Promise<WifiAssignment[]> => {
    return await this.repo.find({
      where: { wifiUser },
      relations: ['user', 'wifiUser']
    })
  }

  public findByUserId = async (user: UserData): Promise<WifiAssignment[]> => {
    return await this.repo.find({
      where: { user },
      relations: ['user', 'wifiUser']
    })
  }

  public findByUserAndWifiUser = async (user: UserData, wifiUser: WifiUser): Promise<WifiAssignment> => {
    return await this.repo.findOne({
      where: { user, wifiUser }
    })
  }

  public delete = async (user: UserData, wifiUser: WifiUser): Promise<void> => {
    await this.repo.delete({ wifiUser, user })
  }

  public findAll = async (
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: WifiAssignment[], total: number }> => {
    const [data, total] = await this.repo.findAndCount({
      relations: ['user', 'wifiUser'],
      order: {
        timestamp: 'DESC'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    return { data, total }
  }
}