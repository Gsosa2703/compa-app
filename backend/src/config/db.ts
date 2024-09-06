import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'mydb',
  synchronize: true,
  logging: true,
  entities: [__dirname + '/../entity/**/*.ts'],
  migrations: [__dirname + '/../migration/**/*.ts'],
});

export const initializeDatabase = async (retries = 5, delay = 5000) => {
  while (retries) {
    try {
      await AppDataSource.initialize();
      console.log("Database connected successfully!");
      return;
    } catch (err) {
      console.error("Database connection failed, retrying...", err);
      retries--;
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error("Database connection failed after multiple retries.");
};
