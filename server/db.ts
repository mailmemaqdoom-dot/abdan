import mysql, { type Pool, type PoolConnection, type ResultSetHeader, type RowDataPacket, type QueryOptions } from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL || process.env.DRIZZLE_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured for the ABDAN backend.");
}

export const pool: Pool = mysql.createPool({
  uri: databaseUrl,
  connectionLimit: 10,
  enableKeepAlive: true,
  waitForConnections: true,
  decimalNumbers: true,
  namedPlaceholders: false,
});

export type DbRow = RowDataPacket & Record<string, unknown>;

export async function queryRows<T extends DbRow>(sql: string, params: unknown[] = []) {
  const [rows] = await pool.query<T[]>(sql, params);
  return rows;
}

export async function queryOne<T extends DbRow>(sql: string, params: unknown[] = []) {
  const rows = await queryRows<T>(sql, params);
  return rows[0] ?? null;
}

export async function execute(sql: string, params: unknown[] = []) {
  const [result] = await pool.execute<ResultSetHeader>(sql as unknown as QueryOptions, params as never[]);
  return result;
}

export async function withTransaction<T>(callback: (connection: PoolConnection) => Promise<T>) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export function parseJsonColumn<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  if (typeof value === "object") {
    return value as T;
  }

  return fallback;
}

export function stringifyJson(value: unknown) {
  return JSON.stringify(value ?? null);
}
