import { Complement } from "../../models/complement.entity";

export interface IComplementRepository {
  save(complement: Complement): Promise<void>;
}