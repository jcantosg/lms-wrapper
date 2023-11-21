import { DataSourceOptions } from 'typeorm';

const commonDbConfig = (
  host: string,
  port: number,
  username: string,
  password: string,
  database: string,
): DataSourceOptions => {
  return {
    type: 'postgres',
    synchronize: false,
    host: host,
    port: port,
    username: username,
    password: password,
    database: database,
    entities: [__dirname + './../**/*.schema{.ts,.js}'],
  };
};

export const migrationDbConfig = (
  host: string,
  port: number,
  username: string,
  password: string,
  database: string,
): DataSourceOptions => {
  return {
    ...commonDbConfig(host, port, username, password, database),
    migrations: [__dirname + './../migrations/*{.ts,.js}'],
  };
};

export const apiDbConfig = (
  host: string,
  port: number,
  username: string,
  password: string,
  database: string,
  verboseMode: boolean,
): DataSourceOptions => {
  return {
    ...commonDbConfig(host, port, username, password, database),
    logging: verboseMode,
  };
};
