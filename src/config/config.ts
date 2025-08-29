import { Client } from "pg";

export const client = new Client({
  host: "localhost",
  port: 5432,
  database: "auth-demo",
  user: "postgres",
  password: "Asmasiddiqui@1234",
});
