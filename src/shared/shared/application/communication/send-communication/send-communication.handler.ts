import { CommandHandler } from '#shared/domain/bus/command.handler';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { CommunicationRepository } from '#shared/domain/repository/communication.repository';
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
import { CommunicationNotFoundException } from '#shared/domain/exception/communication/communication.not-found.exception';
import { Message } from '#shared/domain/value-object/message.value-object';
import { SendCommunicationCommand } from '#shared/application/communication/send-communication/send-communication.command';
import { CommunicationAlreadySentException } from '#shared/domain/exception/communication/communication.already-sent.exception';
import { MailerService } from '@nestjs-modules/mailer';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import * as showdown from 'showdown';

export class SendCommunicationHandler implements CommandHandler {
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
    private readonly mailerService: MailerService,
    private readonly communicationsMailAddress: string,
  ) {}

  async handle(command: SendCommunicationCommand): Promise<void> {
    const communication = await this.repository.get(command.id);
    if (!communication) {
      throw new CommunicationNotFoundException();
    }
    if (communication.status === CommunicationStatus.SENT) {
      throw new CommunicationAlreadySentException();
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

    communication.updateRecipients(
      businessUnits,
      academicPeriods,
      titles,
      academicPrograms,
      internalGroups,
      students,
      command.adminUser,
    );
    communication.updateMessage(
      new Message({
        subject: command.subject,
        shortDescription: command.shortDescription,
        body: command.body,
      }),
      command.sendByEmail,
      command.publishOnBoard,
      command.adminUser,
    );

    const allStudents = await this.getAllStudents(
      command.studentIds,
      internalGroups,
      academicPrograms,
    );

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

    if (communication.sendByEmail) {
      for (const student of allStudents) {
        await this.mailerService.sendMail({
          to: [student.email, student.universaeEmail],
          template: './communication',
          subject: communication.message?.value.subject,
          context: {
            subject: communication.message?.value.subject,
            shortDescription: communication.message?.value.shortDescription,
            body: new showdown.Converter().makeHtml(
              communication.message?.value.body ?? '',
            ),
          },
          from: `Universae ${this.communicationsMailAddress}`,
        });
      }
    }

    communication.updateStatus(CommunicationStatus.SENT, command.adminUser);
    await this.repository.save(communication);
  }

  private async getAllStudents(
    studentIds: string[],
    internalGroups: InternalGroup[],
    academicPrograms: AcademicProgram[],
  ) {
    if (studentIds.length > 0) {
      return await Promise.all(
        studentIds.map((id) => this.studentGetter.get(id)),
      );
    }

    if (internalGroups && internalGroups.length > 0) {
      const internalGroupsStudents: Student[] = [];
      for (const internalGroup of internalGroups) {
        if (internalGroup.students && internalGroup.students.length > 0) {
          internalGroupsStudents.push(...internalGroup.students);
        }
      }

      return this.uniqueStudents(internalGroupsStudents);
    }

    if (academicPrograms && academicPrograms.length > 0) {
      return this.uniqueStudents(
        await this.studentGetter.getByAcademicProgramsAndGroups(
          academicPrograms.map((ap) => ap.id),
          [],
        ),
      );
    }

    return [];
  }

  private uniqueStudents(students: Student[]): Student[] {
    return students.reduce((accumulator: Student[], current: Student) => {
      if (!accumulator.find((student) => student.id === current.id)) {
        accumulator.push(current);
      }

      return accumulator;
    }, []);
  }
}
