import { CommandHandler } from '#shared/domain/bus/command.handler';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { Communication } from '#shared/domain/entity/communication.entity';
import { CommunicationRepository } from '#shared/domain/repository/communication.repository';
import { CommunicationDuplicatedException } from '#shared/domain/exception/academic-offering/communication-duplicated.exception';
import { CreateCommunicationCommand } from '#shared/application/communication/create-communication/create-communication.command';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { TitleGetter } from '#academic-offering/domain/service/title/title-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';
import { CommunicationStatus } from '#shared/domain/enum/communication-status.enum';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';
import { Student } from '#shared/domain/entity/student.entity';
import { CommunicationStudent } from '#shared/domain/entity/communicarion-student.entity';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';

export class CreateCommunicationHandler implements CommandHandler {
  constructor(
    private readonly repository: CommunicationRepository,
    private readonly communicationStudentRepository: CommunicationStudentRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
    private readonly academicPeriodGetter: AcademicPeriodGetter,
    private readonly titleGetter: TitleGetter,
    private readonly academicProgramGetter: AcademicProgramGetter,
    private readonly internalGroupGetter: InternalGroupGetter,
    private readonly studentGetter: StudentGetter,
    private readonly uuidService: UUIDGeneratorService,
  ) {}

  async handle(command: CreateCommunicationCommand): Promise<number> {
    if (await this.repository.exists(command.id)) {
      throw new CommunicationDuplicatedException();
    }

    const adminUserBusinessUnitsId = command.adminUser.businessUnits.map(
      (bu: BusinessUnit) => bu.id,
    );

    const businessUnits = await Promise.all(
      command.businessUnitIds.map(async (id: string) => {
        return await this.businessUnitGetter.getByAdminUser(
          id,
          adminUserBusinessUnitsId,
        );
      }),
    );

    const academicPeriods = await Promise.all(
      command.academicPeriodIds.map((id) => this.academicPeriodGetter.get(id)),
    );

    const titles = await Promise.all(
      command.titleIds.map((id) => this.titleGetter.get(id)),
    );

    const academicPrograms = await Promise.all(
      command.academicProgramIds.map((id) =>
        this.academicProgramGetter.get(id),
      ),
    );

    const internalGroups = await Promise.all(
      command.internalGroupIds.map((id) =>
        this.internalGroupGetter.getWithStudents(id),
      ),
    );

    const students = await Promise.all(
      command.studentIds.map((id) => this.studentGetter.get(id)),
    );

    const communication = Communication.create(
      command.id,
      command.adminUser,
      businessUnits,
      academicPeriods,
      titles,
      academicPrograms,
      internalGroups,
      null,
      null,
      CommunicationStatus.DRAFT,
      null,
    );
    await this.repository.save(communication);

    const allStudents = this.getAllStudents(students, internalGroups);
    for (const student of allStudents) {
      await this.communicationStudentRepository.save(
        CommunicationStudent.create(
          this.uuidService.generate(),
          communication,
          student,
          false,
          false,
        ),
      );
    }

    return allStudents.length;
  }

  private getAllStudents(students: Student[], internalGroups: InternalGroup[]) {
    const allStudents: Student[] = [];

    if (students && students.length > 0) {
      allStudents.push(...students);
    }

    if (internalGroups && internalGroups.length > 0) {
      for (const internalGroup of internalGroups) {
        if (internalGroup.students && internalGroup.students.length > 0) {
          allStudents.push(...internalGroup.students);
        }
      }
    }

    return allStudents.reduce((accumulator: Student[], current: Student) => {
      if (!accumulator.find((student) => student.id === student.id)) {
        accumulator.push(current);
      }

      return accumulator;
    }, []);
  }
}
