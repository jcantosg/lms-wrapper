import { v4 as uuid } from 'uuid';
import datasource from '#config/ormconfig';
import { Logger } from '@nestjs/common';
import { academicPrograms as academicProgramsRaw } from '#commands/academic-program/academic-programs';
import { academicPeriods as academicPeriodsRaw } from '#commands/academic-period/academic-periods';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { BlockRelation } from '#academic-offering/domain/entity/block-relation.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export async function createAcademicRelations(logger: Logger) {
  const academicProgramRepository = datasource.getRepository(AcademicProgram);
  const academicPeriodRepository = datasource.getRepository(AcademicPeriod);
  const blockRelationRepository = datasource.getRepository(BlockRelation);
  const adminUserRepository = datasource.getRepository(AdminUser);

  const adminSga = await adminUserRepository.findOne({
    where: { email: 'sga@universae.com' },
  });

  const academicProgram = await academicProgramRepository.findOne({
    where: { id: academicProgramsRaw[0].id },
    relations: { programBlocks: true, academicPeriods: true },
  });

  const academicPeriod = await academicPeriodRepository.findOne({
    where: { id: academicPeriodsRaw[0].id },
    relations: { periodBlocks: true, academicPrograms: true },
  });

  const blockRelations: BlockRelation[] = [];

  academicPeriod!.addAcademicProgram(academicProgram!);

  academicPeriod!.periodBlocks.forEach((periodBlock, index) => {
    blockRelations.push(
      BlockRelation.create(
        uuid(),
        periodBlock,
        academicProgram!.programBlocks[index],
        adminSga!,
      ),
    );
  });

  await academicPeriodRepository.save({
    id: academicPeriod!.id,
    name: academicPeriod!.name,
    code: academicPeriod!.code,
    startDate: academicPeriod!.startDate,
    endDate: academicPeriod!.endDate,
    businessUnit: academicPeriod!.businessUnit,
    blocksNumber: academicPeriod!.blocksNumber,
    createdAt: academicPeriod!.createdAt,
    createdBy: academicPeriod!.createdBy,
    updatedAt: academicPeriod!.updatedAt,
    updatedBy: academicPeriod!.updatedBy,
    academicPrograms: academicPeriod!.academicPrograms,
    periodBlocks: academicPeriod!.periodBlocks,
  });
  await blockRelationRepository.save(blockRelations);
  logger.log('Academic Relations created');
}
