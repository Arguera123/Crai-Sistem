import "reflect-metadata"
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
  entities: [
  process.env.NODE_ENV === 'prod' 
    ? 'dist/models/**/*.js' 
    : 'src/models/**/*.ts'
  ],
  synchronize: true,
  logging: false,
})

export default PostgresDataSource;