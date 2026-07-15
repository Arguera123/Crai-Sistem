import { UserData } from "../models/user.entity";
import PostgresDataSource from "../configs/db.config";
import { UserStates } from "../utils/states.constant";
import { fetchAlumnos, fetchEmpleados, fetchXpec } from "./fetch.external.api.service";
import { UserMapper } from "../mappers/toUserDataFromApi";
import { Roles } from "../utils/roles.constant";
import { Role } from "../models/role.entity";
import { UserType } from "../utils/user-type.constants";

export class SyncService {
  private userRepo = PostgresDataSource.getRepository(UserData);

  async syncAllSources () {
    console.log("Iniciando sincronización global...")

    try {
      await this.syncSource(UserType.STUDENT, fetchAlumnos, UserMapper.fromAlumno)
      await this.syncSource(UserType.EMPLOYEE, fetchEmpleados, UserMapper.fromEmpleado)
      await this.syncSource(UserType.XPEC, fetchXpec, UserMapper.fromXpec)
    } catch (err) {
      console.error("Error en la sincronización: ", err);
    }
  }

  private async syncSource<T>(
    type: UserType,
    fetchFn: () => Promise<T[]>,
    mapperFn: (item: T) => Partial<UserData>
  ) {
    console.log(`Sincronizando fuente: ${type}...`)
    const roleRepo = PostgresDataSource.getRepository(Role);

    const userRole = await roleRepo.findOneBy({ name: Roles.USER });
    if (!userRole) {
      throw new Error('El rol user no existe. Por favor seedéalo primero.');
    }
    
    const externalData = await fetchFn();
    const externalIds = externalData.map((item: any) => 
      item.CARNET || item.iduser || item.ID_EST
    );

    await this.userRepo.createQueryBuilder()
      .update(UserData)
      .set({ state: UserStates.INACTIVE })
      .where("type = :type", { type })
      .andWhere("id NOT IN (:...ids)", { ids: externalIds.length > 0 ? externalIds : ['']})
      .execute();

    for (const item of externalData) {
      const mapped = mapperFn(item);

      mapped.state = UserStates.ACTIVE;
      mapped.roles = [userRole]

      await this.userRepo.save(mapped)
    }
    console.log(`Fuente ${type} sinconizada.`)
  }
}
