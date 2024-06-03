import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

declare global {
  // eslint-disable-next-line no-var
  var app: INestApplication;
  // eslint-disable-next-line no-var
  var datasource: DataSource;
}
