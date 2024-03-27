import datasource from '#config/ormconfig';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '#/app.module';

async function createEvaluationTypes(logger: Logger) {
  const businessUnitRepository = datasource.getRepository(BusinessUnit);
  const evaluationTypeRepository = datasource.getRepository(EvaluationType);
  if (!(await datasource.createQueryRunner().hasTable('evaluation_types'))) {
    logger.error('Table evaluation_types does not exist');

    return;
  }
  const evaluationTypes = await evaluationTypeRepository.find();
  if (evaluationTypes.length > 0) {
    logger.error('Evaluation Types already exist');

    return;
  }
  const spanishBusinessUnits = await businessUnitRepository.find({
    where: { country: { name: 'España' } },
  });

  const allBusinessUnits = await businessUnitRepository.find();

  await evaluationTypeRepository.save(
    EvaluationType.create(
      '8adeb962-3669-4c37-ada0-01328ef74c00',
      'Distancia FP',
      60,
      40,
      0,
      false,
      spanishBusinessUnits,
    ),
  );
  await evaluationTypeRepository.save(
    EvaluationType.create(
      'e1b36ea6-a130-4d9a-b9b5-e84cff27ed48',
      'Semipresencial FP',
      60,
      30,
      10,
      false,
      spanishBusinessUnits,
    ),
  );
  await evaluationTypeRepository.save(
    EvaluationType.create(
      'dd716f57-0609-4f53-96a7-e6231bc889af',
      'Apto/No Apto',
      0,
      0,
      0,
      true,
      spanishBusinessUnits,
    ),
  );
  await evaluationTypeRepository.save(
    EvaluationType.create(
      '3f61b94e-dcef-4f78-a96f-128a6aaf71fd',
      'Proyecto',
      0,
      0,
      100,
      false,
      spanishBusinessUnits,
    ),
  );
  await evaluationTypeRepository.save(
    EvaluationType.create(
      '7a84a7a1-772f-46a8-8d7b-7a167298a854',
      'No Evaluable',
      0,
      0,
      0,
      false,
      allBusinessUnits,
    ),
  );
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const logger = new Logger('Create Evaluation Types');
  app.useLogger(logger);

  await createEvaluationTypes(logger);
  await datasource.destroy();
  await app.close();
}

bootstrap();
