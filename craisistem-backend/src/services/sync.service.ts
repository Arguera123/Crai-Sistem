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

    // Si la API externa fallo o no devolvio datos NO se desactiva a nadie:
    // de lo contrario una caida de la API dejaria inactivos a todos los usuarios.
    if (externalData.length === 0) {
      console.warn(`Fuente ${type}: la API no devolvio registros, se omite la sincronizacion.`)
      return
    }

    const externalIds = externalData
      .map((item: any) => String(item.CARNET || item.idusr || item.ID_EST || "").trim())
      .filter(Boolean);

    await this.userRepo.createQueryBuilder()
      .update(UserData)
      .set({ state: UserStates.INACTIVE })
      .where("type = :type", { type })
      .andWhere("id NOT IN (:...ids)", { ids: externalIds.length > 0 ? externalIds : ['']})
      .execute();

    for (const item of externalData) {
      let mapped: Partial<UserData>
      try {
        mapped = mapperFn(item);
      } catch (err) {
        console.error(`Registro invalido en fuente ${type}, se omite:`, err);
        continue
      }

      // Se conservan los roles que el usuario ya tenia (admin, librarian, etc.).
      // Antes se reemplazaban por [user] en cada sincronizacion.
      const existing = await this.userRepo.findOne({ where: { id: mapped.id }, relations: ["roles"] })
      const currentRoles = existing?.roles ?? []
      const hasUserRole = currentRoles.some(r => r.name === Roles.USER)
      mapped.roles = hasUserRole ? currentRoles : [...currentRoles, userRole]

      await this.userRepo.save(mapped)
    }
    console.log(`Fuente ${type} sinconizada.`)
  }
}
