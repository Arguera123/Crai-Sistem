import { SelectQueryBuilder } from "typeorm";
import { Device, OSEnum } from "../../models/device.entity";

export const DeviceSpecs = {
  byId: (id?: number) => (query: SelectQueryBuilder<Device>) => {
    if (!id) return ;
    query.andWhere("device.id = :id", { id: id })
  },

  byBrand: (brand?: string) => (query: SelectQueryBuilder<Device>) => {
    if (!brand) return 
    query.andWhere("device.brand = :brand", { brand: brand })
  },

  byState: (state?: string) => (query: SelectQueryBuilder<Device>) => {
    if (!state) return 
    query.andWhere("device.state = :state", { state: state })
  },

  bySection: (section: string) => (query: SelectQueryBuilder<Device>) => {
    if (!section) return 
    query.andWhere("device.section = :section", { section: section })
  },

  byModel: (model: string) => (query: SelectQueryBuilder<Device>) => {
    if (!model) return
    query.andWhere("device.model = :model", { model: model })
  },

  byInventory: (inventory: string) => (query: SelectQueryBuilder<Device>) => {
    if (!inventory) return 
    query.andWhere("device.inventory = :inventory", { inventory: inventory })
  },

  byOperatingSystem: (operatingSystem: OSEnum) => (query: SelectQueryBuilder<Device>) => {
    if (!operatingSystem) return 
    query.andWhere("device.operatingSystem = :operatingSystem", { operatingSystem: operatingSystem })
  },

  byOrder: 
    (order?: string) => (query: SelectQueryBuilder<Device>) => {
      if (!order) return

      const direction = order.startsWith("-") ? "DESC" : "ASC"
      const field = order.replace("-", "");

      const orderMap: Record<string, string> = {
        id: "device.id",
        brand: "device.brand",
        state: "device.state",
        section: "device.section",
        model: "device.model",
        inventory: "device.inventory",
        operatingSystem: "device.operatingSystem"
      }

      const column = orderMap[field]
      if (!column) return 

      query.orderBy(column, direction)
    }
}