import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '#/app.module';
import datasource from '#config/ormconfig';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { UpdateAdministrativeGroupHandler } from '#student/application/administrative-group/update-administrative-group/update-administrative-group.handler';
import { UpdateAdministrativeGroupCommand } from '#student/application/administrative-group/update-administrative-group/update-administrative-group.command';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const handler = app.get(UpdateAdministrativeGroupHandler);
  const administrativeGroupRepository =
    datasource.getRepository(AdministrativeGroup);
  const logger = new Logger('Update Administrative Groups');
  app.useLogger(logger);

  const groups: AdministrativeGroup[] =
    await administrativeGroupRepository.find({
      relations: { academicPeriod: { periodBlocks: true }, periodBlock: true },
      order: { periodBlock: { startDate: 'ASC' } },
    });

  logger.verbose(`${groups.length} grupos por actualizar...`);

  for (const group of groups) {
    if (!group.academicPeriod.isLastBlock(group.periodBlock)) {
      logger.verbose(`Actualizando alumnos del grupo ${group.code}`);
      await handler.handle(new UpdateAdministrativeGroupCommand(group.id));
    }
  }
  logger.verbose(`Todos los grupos actualizados.`);

  await app.close();
}

bootstrap();
