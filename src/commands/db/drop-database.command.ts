import * as readline from 'readline';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '#/app.module';
import datasource from '#config/ormconfig';

async function dropDatabase(logger: Logger) {
  await datasource.createQueryRunner().clearDatabase('universae');

  logger.log('Database droped');
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const logger = new Logger('Drop database command');
  app.useLogger(logger);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Are you sure? (Y/n) ', async function (answer) {
    if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
      logger.log('Aborting...', 'drop-database command');
      rl.close();
      await app.close();

      return;
    }

    await dropDatabase(logger);

    rl.close();
    datasource.destroy();
    await app.close();
  });
}

bootstrap();
