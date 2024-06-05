import datasource from '#config/ormconfig';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Logger } from '@nestjs/common';
import { academicPrograms as academicProgramsRaw } from '#commands/academic-program/academic-programs';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';

export async function seedAcademicPrograms(logger: Logger) {
  const titleRepository = datasource.getRepository(Title);
  const academicProgramRepository = datasource.getRepository(AcademicProgram);
  const businessUnitRepository = datasource.getRepository(BusinessUnit);
  const adminUserRepository = datasource.getRepository(AdminUser);

  const adminSga = await adminUserRepository.findOne({
    where: { email: 'sga@universae.com' },
  });

  const businessUnit = await businessUnitRepository.findOne({
    where: { id: '68fc5295-d99d-432d-a989-433361974791' },
  });

  const title = await titleRepository.findOne({
    where: { id: '68fc5295-d99d-432d-a989-433361974792' },
  });

  const academicPrograms: AcademicProgram[] = [];

  academicProgramsRaw.forEach((academicProgramRaw) => {
    const academicProgram = AcademicProgram.create(
      academicProgramRaw.id,
      academicProgramRaw.name,
      academicProgramRaw.code,
      title!,
      businessUnit!,
      adminSga!,
      ProgramBlockStructureType.SEMESTER,
    );
    academicProgram.addProgramBlock(
      ProgramBlock.create(
        academicProgramRaw.programBlocks[0],
        'Bloque 1',
        academicProgram,
        adminSga!,
      ),
    );
    academicProgram.addProgramBlock(
      ProgramBlock.create(
        academicProgramRaw.programBlocks[1],
        'Bloque 2',
        academicProgram,
        adminSga!,
      ),
    );
    academicPrograms.push(academicProgram);
  });

  await academicProgramRepository.save(academicPrograms);
  logger.log('Academic Programs created');
}
