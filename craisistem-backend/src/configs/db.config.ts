import "reflect-metadata"
import path from "path"
import { DataSource } from "typeorm"
import dotenv from "dotenv"
dotenv.config();

const type = "postgres"
const host = process.env.DB_HOST 
const port = Number(process.env.DB_PORT) 
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME 

const PostgresDataSource = new DataSource({
  type: type,
  host: host,
  port: port,
  username: username,
  password: password,
  database: database,
  // Se resuelve relativo a este archivo para que funcione tanto con ts-node
  // (src/models/*.ts) como con el build compilado (dist/models/*.js),
  // sin depender del valor de NODE_ENV.
  entities: [path.join(__dirname, "..", "models", "**", "*.entity.{ts,js}"),
             path.join(__dirname, "..", "models", "loan-device.{ts,js}"),
             path.join(__dirname, "..", "models", "loan-locker.{ts,js}")],
  synchronize: true,
  logging: false,
})

export default PostgresDataSource;