import { CommandHandler } from '#shared/domain/bus/command.handler';
import { StudentRepository } from '#/student/student/domain/repository/student.repository';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { EditStudentCommand } from '#student/application/edit-student/edit-student.command';
import { StudentDuplicatedEmailException } from '#student/shared/exception/student-duplicated-email.exception';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { CountryGetter } from '#shared/domain/service/country-getter.service';

export class EditStudentHandler implements CommandHandler {
  constructor(
    private readonly repository: StudentRepository,
    private readonly studentGetter: StudentGetter,
    private readonly countryGetter: CountryGetter,
    private readonly imageUploader: ImageUploader,
  ) {}

  async handle(command: EditStudentCommand): Promise<void> {
    if (await this.repository.existsByEmail(command.id, command.email)) {
      throw new StudentDuplicatedEmailException();
    }
    const student = await this.studentGetter.get(command.id);
    const newAvatar = command.avatar
      ? await this.imageUploader.uploadImage(
          command.avatar,
          command.name,
          'student-avatar',
        )
      : student.avatar;
    const newCountry = command.country
      ? await this.countryGetter.get(command.country)
      : student.country;
    const newCitizenship = command.citizenship
      ? await this.countryGetter.get(command.citizenship)
      : student.citizenship;
    const newContactCountry = command.contactCountry
      ? await this.countryGetter.get(command.contactCountry)
      : null;
    student.update(
      command.name,
      command.surname,
      command.surname2,
      command.email,
      command.universaeEmail,
      command.isActive,
      command.adminUser,
      newAvatar,
      command.birthDate,
      command.gender,
      newCountry,
      newCitizenship,
      command.identityDocument,
      command.socialSecurityNumber,
      command.accessQualification,
      command.niaIdalu,
      command.phone,
      newContactCountry,
      command.state,
      command.city,
      command.address,
      command.guardianName,
      command.guardianSurname,
      command.guardianEmail,
      command.guardianPhone,
      null,
      student.leadId,
    );
    student.updated();

    await this.repository.save(student);
  }
}
