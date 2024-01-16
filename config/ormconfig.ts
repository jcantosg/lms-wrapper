import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { migrationDbConfig } from '#config/database.config';
import fs from 'fs';

const env = process.env.NODE_ENV;
const envFile = fs.existsSync(`.env.${env}`) ? `.env.${env}` : '.env';
config({ path: envFile });

const configService = new ConfigService();

const datasource = new DataSource(
  migrationDbConfig(
    configService.getOrThrow<string>('DATABASE_HOST'),
    configService.getOrThrow<number>('DATABASE_PORT'),
    configService.getOrThrow<string>('DATABASE_USER'),
    configService.getOrThrow<string>('DATABASE_PASSWORD'),
    configService.getOrThrow<string>('DATABASE_NAME'),
  ),
);
datasource.initialize();
export default datasource;
